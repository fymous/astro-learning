# ShopEye — Build Document

> **Single source of truth.** Architecture + pre-configured alert catalog + build TODO.
> **Version**: 4.0 (Jun 2026) · **Status**: Greenfield · **Owner**: Solo founder
> `[ ]` = todo · `[~]` = in progress · `[x]` = done · Strike through completed items as you go.

---

## 1. Architecture

### 1.1 Video Ingestion — Phased

| Phase | Method | On-prem install? | Customer requirement |
|---|---|---|---|
| **1–3 (early)** | Cloud pulls RTSP directly via customer's **static public IP + port-forward + non-default port + strong NVR creds** | **None** | Static IP from ISP; port-forward on router |
| **3+ (if needed)** | **WireGuard tunnel** per site (outbound, works through NAT/CGNAT; encrypted) | Lightweight WireGuard client on any PC | Any PC on LAN |
| **5+ (scale)** | **Thin connector** (relay software on-prem, RTSP pull → HTTPS push; auto-discovery) | Connector app on PC or thin client | Any always-on PC |
| **6+ (edge)** | **Edge gateway** (YOLO/pose runs locally, uploads flagged events only) | N100 mini PC (~₹13K) or Jetson | Dedicated device |

Early phases: **zero on-prem software.** Cloud Run worker pulls RTSP from `rtsp://user:pass@<public-ip>:<random-port>/Streaming/Channels/X01`. Minimum security: strong NVR password + non-default port (blocks >90% of automated scanners).

### 1.2 Components

| # | Component | Tech | Role |
|---|---|---|---|
| 1 | **API** | FastAPI, Cloud Run | Multi-tenant REST, auth, ingest, RTSP pull orchestration |
| 2 | **Worker** | Cloud Run + Pub/Sub | YOLO inference (CPU), pose, rule engine, alerts |
| 3 | **Web** | Next.js, Firebase Hosting | Dashboard, onboarding, zone config, alert management |

Added later:

| Phase | Component | Role |
|---|---|---|
| 5+ | **Connector** | On-prem RTSP relay (replaces direct pull) |
| 6+ | **Edge Gateway** | Local AI inference |

### 1.3 Tech Stack (Google-native)

| Concern | Choice |
|---|---|
| Auth | Firebase Auth |
| Hosting | Firebase Hosting + Cloud Run |
| Compute | Cloud Run (CPU VMs for inference) |
| DB | Cloud SQL Postgres 16 + pgvector |
| Storage | GCS |
| VLM/LLM | Gemini 2.0 Flash (Vertex AI) — VLM-tier alerts only |
| Detection | YOLOv8n (Ultralytics, ONNX, INT8 on CPU) |
| Pose | MediaPipe BlazePose |
| Alerts | FCM push + in-app + email (WhatsApp via Wati: Phase 5) |
| Payments | Manual billing early; Razorpay: Phase 5 |
| Monitoring | Cloud Logging / Monitoring / Error Reporting |
| CI/CD | GitHub Actions → Cloud Run |

### 1.4 Data Flow (Phase 1–3)

```
NVR (customer premises, static IP, port-forwarded)
  ← Cloud Run worker pulls RTSP directly
  → decode frames (CPU) → YOLO + pose per frame
  → rule engine → action_events table
  → threshold crossed? → alert pipeline (FCM/email/dashboard)
  → clip extraction (30-sec stream-copy) → GCS
  → optional VLM verify (Gemini Flash) for judgment-type alerts only
```

### 1.5 Edge Portability (bake in now, ~free)

1. `InferenceBackend.detect(frame)` interface — swappable: CPU / OpenVINO / TensorRT.
2. ONNX as canonical model format.
3. No platform calls in business logic.
4. Multi-arch Docker (`buildx` x86 + ARM64).

### 1.6 Cost Model (per camera, cloud, CPU)

| Component | ₹/cam/month |
|---|---|
| VM (e2-small, shared across cams) | 250–625 |
| Storage (GCS, clips) | 50–100 |
| Alerts (FCM) | ~0 |
| VLM (only for judgment alerts, ~20/day) | 100–150 |
| **Total** | **~400–900** |

Scaling: e2-medium handles 3–5 cams (~₹500/cam); e2-standard-4 handles 8–12 cams (~₹400/cam).

---

## 2. Pre-Configured Alert Catalog

Alerts are toggle-on/off with configurable thresholds. Customer picks from a menu, assigns cameras/zones. No custom logic.

### 2.1 Alert Categories

**Category A — YOLO detection + zone rules (₹0 marginal cost, reuse same inference)**

| ID | Alert | Detection | Default threshold |
|---|---|---|---|
| A1 | Employee on phone (not on call) | YOLO `cell_phone` + pose hand-near-ear check | >3 min continuous |
| A2 | No staff at counter while customer waiting | YOLO `person` in customer zone + empty staff zone | >2 min |
| A3 | Unauthorized area access | YOLO `person` in restricted zone | Any during configured hours |
| A4 | After-hours intrusion | YOLO `person` outside operating hours | Any detection |
| A5 | Crowd threshold exceeded | YOLO `person` count in zone | >N people (configurable) |
| A6 | Queue too long | YOLO `person` count in queue zone | >N people for >M min |
| A7 | Cash drawer open (no customer) | YOLO `drawer` class + empty customer zone | Any |
| A8 | Employee absent from station | YOLO no `person` in staff zone during hours | >N min |
| A9 | Loitering | YOLO `person` same bbox location | >N min in zone |
| A10 | Uniform non-compliance | YOLO custom class (helmet/vest/apron) absent on person in zone | Any |

**Category B — Pose-derived (₹0 marginal, runs on same frames)**

| ID | Alert | Detection | Default threshold |
|---|---|---|---|
| B1 | Fall detection | Pose keypoint vertical drop >50% in <0.5s, stays horizontal >2s | Immediate |
| B2 | Physical altercation | Rapid pose movement + person proximity <0.5m | >3s |
| B3 | Person sitting on duty | Pose hip-knee angle indicates seated in standing-required zone | >N min |

**Category C — VLM judgment (₹0.25–0.50 per check, triggered on specific events)**

| ID | Alert | Trigger | VLM prompt |
|---|---|---|---|
| C1 | Item not scanned at billing | Transaction event from POS | "Count items handled vs items scanned in this clip" |
| C2 | Shelf empty/low | Scheduled (2×/day per shelf zone) | "Compare shelf to reference: list empty sections" |
| C3 | Cleanliness check | Scheduled (configurable) | "Are there visible spills, debris, or mess on the floor?" |
| C4 | Display arrangement audit | Scheduled | "Does this display match the reference image?" |

### 2.2 Alert Architecture

- All Category A+B alerts share **one YOLO+pose inference pass** per frame. Adding alerts = adding rules, not compute.
- Category C alerts invoke Gemini Flash **only when triggered** (by schedule or by a Category A event).
- Rules defined in **YAML per site**, hot-reloadable from cloud config.
- Each alert writes to `action_events` table (powers dashboards + future search).

### 2.3 Zone Model

- Customer draws **named polygons** per camera during onboarding (Konva.js).
- Zone types: `counter`, `customer_area`, `staff_area`, `entrance`, `restricted`, `shelf`, `queue`, custom.
- One camera can have N zones. Alerts reference zone IDs.
- Optional: VLM-suggested zone labels from first frame (Gemini describes sections, customer confirms).

---

## 3. Database Schema

```sql
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL, plan TEXT NOT NULL DEFAULT 'free',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firebase_uid TEXT UNIQUE NOT NULL, email TEXT NOT NULL,
  organization_id UUID NOT NULL REFERENCES organizations(id),
  role TEXT NOT NULL DEFAULT 'owner',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE sites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  name TEXT NOT NULL, timezone TEXT DEFAULT 'Asia/Kolkata',
  rtsp_host TEXT,                    -- public IP or WireGuard IP
  rtsp_port INT DEFAULT 554,
  rtsp_username TEXT,
  rtsp_password TEXT,                -- encrypted
  ingestion_method TEXT DEFAULT 'direct_pull', -- direct_pull / wireguard / connector
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE cameras (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID NOT NULL REFERENCES sites(id),
  name TEXT NOT NULL,
  channel_number INT NOT NULL,       -- NVR channel (101, 201, 301...)
  is_active BOOLEAN DEFAULT TRUE, created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  camera_id UUID NOT NULL REFERENCES cameras(id),
  name TEXT NOT NULL, zone_type TEXT NOT NULL,
  polygon JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE alert_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID NOT NULL REFERENCES sites(id),
  alert_id TEXT NOT NULL,           -- A1, A2, B1, C1, etc.
  camera_id UUID REFERENCES cameras(id),
  zone_id UUID REFERENCES zones(id),
  enabled BOOLEAN DEFAULT TRUE,
  threshold JSONB,                  -- {duration_sec: 180, count: 5, ...}
  schedule JSONB,                   -- for C-type: {cron: "0 10,18 * * *"}
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE action_events (
  id BIGSERIAL PRIMARY KEY,
  organization_id UUID NOT NULL,
  site_id UUID NOT NULL, camera_id UUID NOT NULL, zone_id UUID,
  alert_id TEXT NOT NULL,
  occurred_at TIMESTAMPTZ NOT NULL,
  confidence FLOAT NOT NULL,
  clip_url TEXT, thumbnail_url TEXT,
  metadata JSONB,
  user_verdict TEXT,                -- confirmed/false_positive/ignored
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_action_org_site_time ON action_events(organization_id, site_id, occurred_at DESC);
CREATE INDEX idx_action_alert ON action_events(alert_id);
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  plan TEXT NOT NULL, status TEXT NOT NULL,
  started_at TIMESTAMPTZ NOT NULL, next_billing_at TIMESTAMPTZ
);
```

---

## 4. Roadmap

| Phase | Weeks | Goal |
|---|---|---|
| 0 | 1–2 | Foundation: repo, GCP, schema, auth |
| 1 | 3–10 | MVP: direct RTSP pull + cloud inference + 10 alerts + dashboard |
| 2 | 11–18 | Self-serve: onboarding wizard, alert config UI, FCM alerts |
| 3 | 19–26 | Polish: severity scoring, dedup, baselines, daily digest, WireGuard option |
| 4 | 27–38 | POS: Windows shim, transaction matching, VLM-based alerts (C1–C4) |
| 5 | 39–52 | Monetize + scale: Razorpay, Wati, thin connector, chain dashboard |
| 6 | Yr 2+ | Edge migration, NL search, ReID, Android POS capture |

---

## 5. Build TODO

> `[ ] **ID** Title — acceptance. (deps; effort)` · XS≤2h, S=½d, M=1–2d, L=3–5d, XL=1–2wk.

### Phase 0 — Foundation (W1–2)

- [ ] **SE-0-1** Monorepo: `web`, `api`, `worker`, `packages/shared`; Turborepo; hooks. (—; S)
- [ ] **SE-0-2** GCP project + APIs + Secret Manager + `.env.example`. (—; M)
- [ ] **SE-0-3** CI/CD: GitHub Actions → Cloud Run + Firebase Hosting. (SE-0-1; M)
- [ ] **SE-0-4** Local dev: docker-compose (Postgres+pgvector, MinIO). (SE-0-1; M)
- [ ] **SE-0-5** Postgres schema (§3) + Alembic migrations + RLS. (SE-0-2; M)
- [ ] **SE-0-6** Firebase Auth + multi-tenant middleware (JWT verify, org scoping). (SE-0-5; M)

### Phase 1 — MVP: direct RTSP pull + pre-configured alerts (W3–10)

- [ ] **SE-1-1** RTSP pull service: connect to NVR via public IP, decode frames, handle reconnect. (SE-0-4; L)
- [ ] **SE-1-2** `InferenceBackend` interface + ONNX export pipeline. (SE-0-1; M)
- [ ] **SE-1-3** YOLO inference on Cloud Run **CPU** (e2 VM, YOLOv8n INT8, 2 fps). (SE-1-2, SE-1-1; L)
- [ ] **SE-1-4** MediaPipe pose (same VM, triggered per flagged person). (SE-1-3; M)
- [ ] **SE-1-5** Rule engine: implement alerts A1–A9, B1–B3 (YAML config, in-memory state, zone-aware). (SE-1-3, SE-1-4; L)
- [ ] **SE-1-6** Clip extraction: 30-sec clips (stream-copy) → GCS. (SE-1-5; M)
- [ ] **SE-1-7** Alert pipeline: write `action_events` + send FCM push + in-app notification. (SE-1-5; M)
- [ ] **SE-1-8** Web: login + org setup (Firebase Auth). (SE-0-6; M)
- [ ] **SE-1-9** Web: site setup (public IP, port, NVR creds, test RTSP connection from cloud). (SE-1-8; L)
- [ ] **SE-1-10** Web: camera list (enumerate NVR channels, name each). (SE-1-9; M)
- [ ] **SE-1-11** Web: zone drawing tool (Konva.js, named polygons, zone types). (SE-1-10; L)
- [ ] **SE-1-12** Web: alert config UI (toggle alerts per camera/zone, set thresholds). (SE-1-11; L)
- [ ] **SE-1-13** Web: event feed (timeline, filters, thumbnails, clip player, mark verdict). (SE-1-6; L)
- [ ] **SE-1-14** Deploy to design-partner shop; 7 days live; iterate top-10 issues. (all P1; L)

### Phase 2 — Self-serve onboarding (W11–18)

- [ ] **SE-2-1** Onboarding wizard (enter IP/port/creds → test → enumerate cams → zones → alerts → done). (SE-1-14; L)
- [ ] **SE-2-2** Alert A10 (uniform/PPE): custom YOLO class training pipeline. (SE-1-3; L)
- [ ] **SE-2-3** FCM push + email alerts with clip thumbnail + deep link. (SE-1-7; M)
- [ ] **SE-2-4** GA4 funnel tracking. (—; S)

### Phase 3 — Polish + retention (W19–26)

- [ ] **SE-3-1** Event severity scoring (1–5; high→push, low→digest). (SE-1-13; M)
- [ ] **SE-3-2** Smart dedup (5-min window, collapse repeats). (SE-3-1; S)
- [ ] **SE-3-3** Per-shop 14-day auto-calibration baselines (flag >2σ anomalies). (SE-3-1; M)
- [ ] **SE-3-4** Daily digest (Gemini-composed summary via email; stats page). (SE-3-1; M)
- [ ] **SE-3-5** PWA mobile (responsive, install prompt, web push, swipe events). (SE-1-13; L)
- [ ] **SE-3-6** Alert preferences UI (per-user channels, quiet hours, severity threshold). (SE-2-3; M)
- [ ] **SE-3-7** WireGuard tunnel option: setup guide + per-site WireGuard config generation for CGNAT customers. (SE-1-1; M)

### Phase 4 — POS + VLM alerts (W27–38)

- [ ] **SE-4-1** Transaction ingestion API `/api/v1/transactions`. (SE-0-5; M)
- [ ] **SE-4-2** Windows print-spooler shim (ESC/POS parse, post txns, SQLite buffer). (SE-4-1; L)
- [ ] **SE-4-3** Windows shim MSI installer. (SE-4-2; M)
- [ ] **SE-4-4** POS↔video matching (±30s window; flag no-sale/phantom). (SE-4-1; L)
- [ ] **SE-4-5** VLM alert C1: item-not-scanned (Gemini on transaction clips). (SE-4-4; L)
- [ ] **SE-4-6** VLM alert C2: shelf-empty (scheduled VLM check + reference comparison). (SE-1-3; M)
- [ ] **SE-4-7** VLM alert C3–C4: cleanliness + display audit (scheduled). (SE-4-6; M)
- [ ] **SE-4-8** Prompt library + versioning + A/B compare harness. (SE-4-5; M)
- [ ] **SE-4-9** Daily reconciliation report (PDF + email). (SE-4-4; L)

### Phase 5 — Monetize + scale (W39–52)

- [ ] **SE-5-1** Razorpay subscriptions + UPI Autopay + plan enforcement. (SE-0-6; XL)
- [ ] **SE-5-2** Wati WhatsApp integration + approved templates. (SE-2-3; M)
- [ ] **SE-5-3** Thin connector: on-prem RTSP relay (replaces direct pull for scale/CGNAT). (SE-1-1; L)
- [ ] **SE-5-4** Connector installer (Windows .exe / Linux .sh; token pairing). (SE-5-3; L)
- [ ] **SE-5-5** Camera auto-discovery via connector (ONVIF + SADP + Dahua + NVR enum). (SE-5-3; L)
- [ ] **SE-5-6** Chain data model (Brand→Store, RBAC). (SE-0-5; L)
- [ ] **SE-5-7** Brand dashboard + benchmarking. (SE-5-6; L)
- [ ] **SE-5-8** Analytics alerts: footfall (line-crossing), zone dwell, heatmaps, conversion. (SE-1-5; L)
- [ ] **SE-5-9** POS API integrations (Petpooja, Posist, Marg, GoFrugal). (SE-4-1; XL)

### Phase 6 — Edge + advanced (Yr 2+)

- [ ] **SE-6-1** Edge gateway: runs YOLO/pose locally (OpenVINO N100 / TensorRT Jetson). (SE-1-2; XL)
- [ ] **SE-6-2** Fleet management + OTA + edge↔cloud routing. (SE-6-1; L)
- [ ] **SE-6-3** NL search: event embeddings → pgvector; Gemini query-parse; VLM rerank. (SE-1-7; XL)
- [ ] **SE-6-4** Customer ReID (single-camera, OSNet). (SE-6-1; XL)
- [ ] **SE-6-5** Android POS capture (BT proxy app / screen-OCR / BT tap). (SE-4-1; XL)

---

## 6. Operations

- **Deploy**: web → Firebase Hosting; api/worker → Cloud Run.
- **Envs**: local (docker-compose) · staging (separate GCP project) · prod.
- **Backups**: Cloud SQL daily 30d; GCS versioning.
- **Onboarding (Phase 1)**: signup → enter NVR public IP + port + creds → test connection → name cameras → draw zones → toggle alerts → done. **Zero install on customer side.**

---

## 7. Decision Log

| Date | Decision | Rationale |
|---|---|---|
| Jun 2026 | Google-native stack | Single ecosystem, founder preference |
| Jun 2026 | Direct RTSP pull (Phase 1–3); connector deferred to Phase 5 | Zero on-prem install for early customers; requires static IP + port-forward |
| Jun 2026 | WireGuard tunnel as Phase 3 fallback for CGNAT | Encrypted, outbound-only, lightweight; covers shops without static IP |
| Jun 2026 | CPU inference (no GPU) for pre-configured alerts | YOLOv8n INT8 @ 2fps runs fine on CPU; 5–20× cheaper than GPU at <30 cams |
| Jun 2026 | Pre-configured alert catalog (not custom rules) | Ship fast, predictable accuracy, simple UX; NL search deferred to Phase 6 |
| Jun 2026 | Defer Wati + Razorpay to Phase 5 | Focus on detection value first; manual billing early |
| Jun 2026 | Edge portability from Phase 1 (ONNX, swappable backend) | Future edge port ~8–12 wk |
