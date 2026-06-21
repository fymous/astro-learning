# ShopEye — Master Build Document

> **Single source of truth.** Design + architecture + Jira-style build TODO in one file.
> **Version**: 2.0 (Jun 2026) · **Status**: Greenfield, ready to build · **Owner**: Founder (solo)
> This replaces the earlier 6 docs (design, feasibility, vertical playbook, cashier-audit plan, camera discovery, NL query). It is a **living doc** — check off / strike through items as they ship.

## How to use this doc

- **Status legend** for TODO items: `[ ]` = todo, `[~]` = in progress, `[x]` = done. Strike completed lines with `~~…~~` if you like.
- Work top-down: Phase 0 → 6. Don't skip **SE-0-5 (customer discovery)**.
- Each ticket is intentionally ≤1 week. If bigger, split it.
- Update the **Decision Log** (§9) whenever an architectural choice changes.

---

## 1. Product

### 1.1 Problem & Vision

Indian retail/F&B/pharmacy shops lose **1.5–4% of revenue/month** to cashier fraud (no-sale drawer pops, sweethearting, underringing, void/refund abuse, phantom transactions). Existing CCTV is **passive** — only useful after hours of manual review.

**Vision**: *"An AI watchman that audits your billing counter automatically and alerts you when something looks off — using your existing CCTV, no new hardware for the camera-only tier."*

We layer AI on existing cameras to (1) watch the counter, (2) detect suspicious patterns, (3) optionally reconcile with POS data, (4) alert owners (push/WhatsApp), (5) provide natural-language search over 30 days of events.

**Wedge**: cashier audit (a painkiller). **Platform**: broader retail video intelligence (footfall, conversion, demographics, shelf, journey) sold as expansion. Cashier audit is the underserved, fast-to-close entry; analytics is the upsell.

### 1.2 Target Customers

**Primary (launch)**: mid-size retail shops/chains in Bangalore — 1–5 counters, 4–32 existing cameras (Hikvision/CP Plus/Dahua/ONVIF NVR), wired broadband, owner-operator decision maker, suspects theft, WTP ₹2K–10K/month.

**Sub-segments (priority)**: pharmacy → jewellery → electronics → supermarket → QSR → apparel → kirana (long tail).

**Anti-customers (skip early)**: no POS/billing, paper-only, no broadband, <4 cameras, tier-3/rural.

### 1.3 Pricing (keep simple externally)

| Tier | Price/mo | Cameras | Retention | Notes |
|---|---|---|---|---|
| Free/Trial | ₹0 | 2 | 24 hr | 14-day Pro trial |
| Starter | ₹1,999 | 4 | 7 day | no real-time alerts |
| Pro | ₹4,999 | 12 | 30 day | all features |
| Business/Chain | ₹9,999+ | custom | 60–90 day | multi-store, SSO, API |

Cost rule: a feature's monthly ops cost per store must stay **≤25% of tier ARPU** (Pro cap ≈ ₹1,250/store/mo).

### 1.4 Positioning

| Competitor | Their position | Our differentiator |
|---|---|---|
| Solink (US/CA) | Mature multi-vertical POS+video | India-native, WhatsApp, ₹2K entry vs $50+ |
| DTiQ / Envysion (US) | QSR/c-store LP | India focus, no US cost base |
| Wobot.ai (India) | QSR generalist | Cashier-audit specialist |
| Agrex/VMukti (India) | Enterprise smart-city sales | Self-serve, SMB pricing, conversational UX |
| Verkada/Coram/Spot (US) | Hardware-mandatory enterprise | Cloud-only, bring-your-own-camera, SMB |

Moats: **WhatsApp-native delivery** + **UPI Autopay** + **self-serve onboarding on existing CCTV**.

---

## 2. Architecture

### 2.1 Model: Cloud-first now → Edge later

- **Hard constraint (CGNAT/NAT)**: cameras/NVR sit behind carrier NAT with no public IP, and RTSP is pull-only. The cloud **cannot** reach them directly. So a small on-prem agent that initiates **outbound** connections is mandatory. The only choice is how heavy that agent is.
- **Phase 1 (cloud-first)**: ship a **thin connector** (pure relay, ~50 MB RAM, no AI) that runs on any existing always-on PC. It pulls RTSP on the LAN and pushes frames/clips to cloud over HTTPS. **All AI runs in the cloud.** Zero new hardware if the shop has any PC.
- **Later (edge at scale)**: when per-camera cloud GPU cost (~₹650–950/cam/mo) starts hurting margin (≈100+ stores), the connector **upgrades in place** into a full **edge gateway** that runs YOLO/pose locally and uploads only flagged events. Edge box (Intel N100, ~₹13K) pays back in ~4 months.
- **Cost crossover**: cloud ≈ ₹700/cam/mo; N100 handles ~5 cams for ₹13K one-time → break-even ~4 months.

### 2.2 Components

| # | Component | Repo | Tech | Responsibility |
|---|---|---|---|---|
| 1 | **Thin Connector** (Phase 1) | `connector` | Python, Docker | RTSP pull on LAN → HTTPS push to cloud; auto-discovery; no AI |
| 1b | **Edge Gateway** (Phase 6) | `gateway` | Python, Docker, OpenVINO/TensorRT | Connector + local YOLO/pose/clip; upload flagged events only |
| 2 | **Cloud API** | `api` | FastAPI on Cloud Run | Multi-tenant REST, auth, ingest, billing |
| 3 | **Worker** | `worker` | Cloud Run + Pub/Sub + Cloud Tasks | YOLO inference (Cloud Run GPU), VLM calls, embeddings, alerts |
| 4 | **Web** | `web` | Next.js on Firebase Hosting + Cloud Run | Dashboard, onboarding, billing, search |
| 5 | **Landing** | `landing` | Astro/Next static | Marketing, signup, SEO |
| 6 | **POS capture** | `windows-shim`, `cups-filter`, `tap-firmware`, `android-capture` | C#/.NET, Python, ESP32/Pi, Kotlin | Capture POS transactions (Phase 4+) |

### 2.3 Data Flow

**Event flow**: Camera → NVR (existing) → Connector pulls RTSP → cloud ingest (GCS clip + Pub/Sub) → Worker runs YOLO+pose (Cloud Run GPU) → rule engine emits candidate event → if suspicious, VLM (Gemini Flash) verifies → alert pipeline (push/WhatsApp + dashboard) + write to `events` + `action_events` index.

**Search flow**: NL query → Gemini parses to filters + semantic intent → route by capability tier → vector search (pgvector) + SQL filter on action index → VLM rerank top candidates → ranked clips with explanations.

### 2.4 Tech Stack (Google-native)

| Concern | Choice |
|---|---|
| Auth | **Firebase Auth** |
| Web hosting | **Firebase Hosting + Cloud Run** (Next.js SSR) |
| API / workers | **Cloud Run** + **Pub/Sub** + **Cloud Tasks** + **Cloud Scheduler** |
| DB | **Cloud SQL (Postgres 16)** + **pgvector** |
| Vector search | pgvector (early) → **Vertex AI Vector Search** (scale) |
| Object storage | **Google Cloud Storage (GCS)** |
| GPU inference | **Cloud Run GPU (NVIDIA L4)** running YOLOv8 |
| Detection / pose | **YOLOv8** (Ultralytics) + **MediaPipe** |
| VLM + LLM | **Gemini 2.0 Flash via Vertex AI** (Pro for hard cases) |
| Embeddings | **Vertex AI `text-embedding-004`**; SigLIP for image |
| OCR | **Gemini Flash** / **Cloud Vision** / Document AI |
| Alerts (interim) | **FCM push + in-app + email** (WhatsApp later) |
| Analytics/warehouse | **GA4 + BigQuery** |
| Monitoring | **Cloud Logging/Monitoring/Error Reporting** |
| Secrets | **Secret Manager** |
| CI/CD | **GitHub Actions → Cloud Run** (or Cloud Build) |
| **Deferred** | **Wati** (WhatsApp, Phase 5), **Razorpay** (payments, Phase 5) |

Until Wati/Razorpay land: alerts via FCM push + in-app + email digest; billing handled **manually** for early/design-partner customers.

### 2.5 Edge Portability Requirements (bake in from Phase 1)

To make the future edge port ~8–12 weeks (not a rewrite), follow these now — they're ~free today:

1. **Inference behind an interface** — `InferenceBackend.detect(frame)` with swappable impls: cloud / TensorRT (Jetson) / OpenVINO (N100).
2. **ONNX as canonical model format** — export to TensorRT/OpenVINO at build time; never hardcode one runtime.
3. **Keep business logic pure** — no CUDA/platform calls in rule engine, clip, or upload code.
4. **Abstract the video-decode step** — pluggable (NVDEC vs VAAPI/QuickSync).
5. **Multi-arch Docker** (`buildx` x86 + ARM64) from day 1, even if only x86 ships.

Edge device tiers (when needed): **Intel N100 16GB/256GB NVMe (~₹13K, 4–6 cams, x86 = zero porting)** is the standard; Jetson Orin Nano 8GB (~₹35–45K, 6–8 cams + heavy models) only for Phase 6 ReID. Buy N100 in India via **Thinvent** (made-in-India, Ubuntu option), IndiaMART (Beelink), or AliExpress (bulk).

### 2.6 Security & DPDP

- **Transit** TLS 1.3 (mTLS connector↔cloud); **at rest** AES-256; RTSP creds encrypted.
- **Raw video stays on-prem** in edge mode; cloud-first uploads only what's needed; faces blurred in long-term stored clips.
- **Retention** per tier (7/30/60/90d), auto-delete jobs.
- **DPDP categories**: A = aggregate/no-identity (footfall, drawer, POS) — signage only; B = demographics/face-detect/persistent-ID — signage + consent + opt-out + no raw-face storage; C = cross-visit ReID/audio/biometric — explicit opt-in + DPA + legal review. **Avoid** emotion/intent/nervousness inference entirely.

---

## 3. Key Subsystems

### 3.1 Camera Auto-Discovery (connector)

Run protocols in parallel, dedupe by MAC→IP, present one list, then RTSP-test each:

| Protocol | Mechanism | India relevance |
|---|---|---|
| ONVIF WS-Discovery | SOAP probe UDP `239.255.255.250:3702` | Primary (~90% pro cameras) |
| Hikvision SADP | UDP broadcast `:37020` | Critical (Hikvision dominant) |
| Dahua DHDiscover | UDP broadcast `:37810` | Critical (CP Plus = Dahua-OEM) |
| mDNS / SSDP | multicast service queries | prosumer/consumer |
| TCP port scan | `80,554,8000,8080,8554,8888` | legacy/budget non-broadcasting cams |
| **NVR enumeration** | discover NVR → enumerate channels via ONVIF/proprietary | **Critical** — most sites aggregate 8–16 cams behind one NVR |
| Manual entry | user types IP+creds | always-available fallback |

Flow: boot → get subnet → parallel discover (5–10s) → merge/dedupe → per device: identify camera vs NVR, try default→master creds, pull RTSP URI → enumerate NVR channels → wizard "Found N cameras" → user confirms/names → RTSP test frame → push to cloud. Implement ONVIF with `wsdiscovery` + `onvif-zeep`.

### 3.2 Detection & Action Event Index

- Per frame: YOLOv8 (person, hand, bag, drawer, cell_phone, cash) + MediaPipe pose.
- **Action Event Index** (Postgres): the alert engine writes its outputs to a queryable table as a side-effect — powers fast search without query-time VLM. Tiers: **A** (alert-required: drawer-open, no-customer, after-hours — day 1), **B** (free derivations: fall, crowd count, loitering, proximity — day 1), **C** (custom-trained: fighting, climbing — Phase 2+), **D** (subjective: "theft", "suspicious" — VLM on-demand only).

### 3.3 NL Search — Capability Ladder (be honest with customers)

| Tier | Query type | Feasible | Notes |
|---|---|---|---|
| 1 | object/scene ("red bag") | ✅ ~90% | SigLIP embedding |
| 2 | simple state ("person sitting") | ✅ ~85% | SigLIP + heuristics |
| 3 | short action ("person falling") | ✅ ~80% (P2) | clip embed + VLM rerank |
| 4 | causal/intent ("someone stealing") | ⚠️ ~65–70% | VLM chain-of-thought; surface candidates |
| 5 | counting/relational | ⚠️ ~60% | scene graph aggregation |
| 6 | identity/ReID (within site) | ⚠️ ~70% | person ReID + tracking graph |
| 7 | long-horizon temporal | ⚠️ ~70% simple | event log + temporal queries |

Customer promise: *"Describe what you want in plain English; we search objects, scenes, actions, and simple behaviors. For counting/identity/sequences we surface candidates for review."* Pipeline: parse (Gemini) → route by tier → coarse retrieve (pgvector + action index, top-500) → group into 50–80 clips → VLM rerank → hydrate signed URLs → render with explanations.

### 3.4 POS Capture (Phase 4+) — coverage strategy

| POS setup | Method | Customer HW cost |
|---|---|---|
| Windows POS (~70%) | Print-spooler shim service (user-mode, polls `EnumJobs`/`ReadPrinter`, parse ESC/POS) | ₹0 |
| Linux POS (~5%) | CUPS filter | ₹0 |
| Android + BT printer (~10%) | BT-printer proxy app (Phase 6) | ₹0 |
| Android + USB/Wi-Fi printer (~5%) | Pi Zero tap device | ~₹6,000 |
| Petpooja/Posist/etc. | Direct POS API | ₹0 |
| Paper/embedded (~5%) | Pi tap or skip | ~₹6,000 / none |

All paths post to one `/api/v1/transactions` endpoint → same matching pipeline. **~90% of customers reach ₹0-hardware; ~98% covered overall.** No kernel drivers (user-mode spooler API only).

---

## 4. Roadmap Overview

| Phase | Weeks | Goal | Exit criteria |
|---|---|---|---|
| 0 | 1–2 | Foundation | Repo+GCP+schema+auth working; ≥1 design partner signed |
| 1 | 3–10 | Cloud-first MVP | 1 design-partner shop live, 5 fraud detections shown |
| 2 | 11–18 | Self-serve onboarding (no payments) | 10 active shops, self-serve install works |
| 3 | 19–26 | Search + AI spot checks | NL search GA, daily digest live |
| 4 | 27–38 | POS reconciliation | Windows shim live (~70% free), matching works |
| 5 | 39–52 | Monetize + chain + intelligence | Razorpay+Wati live, 1 chain logo, analytics suite |
| 6 | Yr 2+ | Edge migration + advanced | Edge gateway GA; ReID/Android capture; ~98% POS coverage |

**Milestones**: W6 first end-to-end detection · W10 first design partner live · W18 self-serve onboarding · W26 NL search GA · W38 Windows shim live · W52 first chain + monetization live.

---

## 5. Build TODO (Jira-style)

> Format: `[ ] **ID** Title — key acceptance. (deps; effort)` · Effort: XS≤2h, S=½d, M=1–2d, L=3–5d, XL=1–2wk.

### Phase 0 — Foundation (W1–2)

- [ ] **SE-0-1** Init monorepo — `web`, `landing`, `api`, `worker`, `connector`, `packages/shared`, `packages/ui`; Turborepo; pre-commit hooks. (—; S)
- [ ] **SE-0-2** GCP project + IAM + Secret Manager + billing; `.env.example`. (—; M)
- [ ] **SE-0-3** CI/CD: GitHub Actions → Cloud Run; Firebase Hosting deploy on `main`; branch protection. (SE-0-1; M)
- [ ] **SE-0-4** Local dev: docker-compose (Postgres+pgvector, Redis-emu, GCS-emu/MinIO); `make dev`. (SE-0-1; M)
- [ ] **SE-0-5** ⭐ Validate problem with 20 shop owners — document CCTV setup, suspected losses, WTP; ≥5 verbal pilots; ≥1 signed design partner (free 6 mo). (—; L, mostly non-code)
- [ ] **SE-0-6** Catalog top 10 NVR/camera models + RTSP URL formats + quirks. (—; S)
- [ ] **SE-0-7** Define Postgres schema (orgs, users, sites, counters, cameras, events, action_events, transactions, subscriptions, audit_log) + pgvector + RLS + migrations. (SE-0-2; M)
- [ ] **SE-0-8** Firebase Auth + multi-tenant skeleton (org/user, RLS by `organization_id`). (SE-0-7; M)
- [ ] **SE-0-9** Incorporate entity, bank, GST, domain. (—; L, mostly waiting)
- [ ] **SE-0-10** Draft ToS + DPDP-compliant privacy policy + CCTV consent/signage templates. (SE-0-9; M)

### Phase 1 — Cloud-first MVP (W3–10)

- [ ] **SE-1-1** Thin connector: RTSP ingest (multi-camera, auto-reconnect, health log); runs on Windows/Linux; <500MB/cam. (SE-0-4; L)
- [ ] **SE-1-2** Connector: pull frames/clips and push to cloud over HTTPS (signed URLs); local SQLite buffer + retry. (SE-1-1, SE-1-7; M)
- [ ] **SE-1-3** Connector: pairing via site token (copy-paste from web); appears online in dashboard. (SE-1-2; M)
- [ ] **SE-1-4** Build `InferenceBackend` interface + ONNX export pipeline (portability requirement §2.5). (SE-0-1; M)
- [ ] **SE-1-5** Cloud ingest API: accept frames/clips → GCS, enqueue Pub/Sub. (SE-0-7; M)
- [ ] **SE-1-6** YOLOv8 inference worker on Cloud Run GPU (L4), 2–5 fps, via `InferenceBackend`. (SE-1-4, SE-1-5; L)
- [ ] **SE-1-7** Worker: event rule engine (YAML, hot-reload) — customer-present, drawer-open, no-customer, after-hours; write `events` + `action_events`. (SE-1-6; M)
- [ ] **SE-1-8** Clip extraction: 30-sec clips (15 before/after) via stream-copy to GCS. (SE-1-7; M)
- [ ] **SE-1-9** Worker: VLM verification (Gemini Flash, 3 keyframes, structured JSON verdict+confidence; alert if >0.7). (SE-1-6; L)
- [ ] **SE-1-10** Prompt library + versioning (`prompts/`, per-event version record, compare harness). (SE-1-9; M)
- [ ] **SE-1-11** Web: login + org setup (Firebase Auth). (SE-0-8; M)
- [ ] **SE-1-12** Web: site + camera setup wizard (RTSP URL/creds, test-connection frame). (SE-1-11; L)
- [ ] **SE-1-13** Web: counter/customer/cashier zone drawing tool (Konva/Fabric polygons → camera config). (SE-1-12; L)
- [ ] **SE-1-14** Web: event timeline (filters, thumbnails) + detail/clip player + mark real/false/ignored. (SE-1-8; L)
- [ ] **SE-1-15** Deploy to first design-partner shop; write deployment runbook; 7 days of live events. (all P1; L)
- [ ] **SE-1-16** Iterate top-10 issues from feedback; get testimonial. (SE-1-15; L)

### Phase 2 — Self-serve onboarding, no payments (W11–18)

- [ ] **SE-2-1** Marketing landing page (hero, how-it-works, pricing, FAQ, 60s demo, signup; SEO). (SE-1-11; L)
- [ ] **SE-2-2** Connector download + install flow (Windows .exe / Linux .sh; token entry; online check; error help). (SE-1-15; XL)
- [ ] **SE-2-3** Camera auto-discovery (§3.1: ONVIF+SADP+Dahua+NVR enum; one-click add). (SE-2-2; L)
- [ ] **SE-2-4** First-run wizard (connector online → cameras → pick counters → zones → test event → done). (SE-2-3, SE-1-13; L)
- [ ] **SE-2-5** Event severity scoring (1–5; alert ≥3, digest rest) + dashboard useful/not-useful feedback. (SE-1-14; M)
- [ ] **SE-2-6** Smart dedup (5-min sliding window; collapse repeats; optional CLIP similarity). (SE-2-5; S)
- [ ] **SE-2-7** Per-shop 14-day auto-calibration baselines (mean/IQR; flag >2σ anomalies). (SE-2-5; M)
- [ ] **SE-2-8** Interim alerts: FCM push + in-app + email digest (no WhatsApp yet). (SE-2-5; M)
- [ ] **SE-2-9** PWA mobile experience (responsive, install prompt, web push, swipe events). (SE-1-14; L)
- [ ] **SE-2-10** GA4 + funnel tracking (visit→signup→install→first event). (SE-2-1; S)
- [ ] **SE-2-11** Soft launch to 50 prospects; ≥10 active; document failure patterns. (all P2; L)

### Phase 3 — Search + AI spot checks (W19–26)

- [ ] **SE-3-1** Event embeddings: text description (Gemini) + `text-embedding-004` → pgvector; SigLIP image embedding. (SE-1-9; M)
- [ ] **SE-3-2** Search API: Gemini query-parse → filters + semantic; pgvector + SQL on action index; top-20. (SE-3-1; L)
- [ ] **SE-3-3** Search UI (bar, example queries, result cards w/ relevance, filter pills). (SE-3-2; M)
- [ ] **SE-3-4** VLM rerank of top candidates (clip-level relevance + explanation). (SE-3-2; M)
- [ ] **SE-3-5** Saved-views → recurring alerts (hourly cron re-run, alert on new matches). (SE-3-3; L)
- [ ] **SE-3-6** AI Spot Checks: scheduled VLM questions on frames (template library + custom; 3-frame majority vote). (SE-1-9; L)
- [ ] **SE-3-7** Daily digest (Gemini-composed summary via push/email; charts page). (SE-2-8; M)

### Phase 4 — POS reconciliation (W27–38)

- [ ] **SE-4-1** Transaction ingestion API `/api/v1/transactions` (schema, idempotency, token auth). (SE-0-7; M)
- [ ] **SE-4-2** Windows print-spooler shim service (poll `EnumJobs`/`ReadPrinter`, parse ESC/POS, post txns, SQLite buffer; user-mode, no kernel driver). (SE-4-1; L)
- [ ] **SE-4-3** Windows shim MSI installer (≤5MB, single UAC, printer multi-select, tray status, signed). (SE-4-2; M)
- [ ] **SE-4-4** Linux CUPS filter (.deb/.rpm, same endpoint). (SE-4-2; M)
- [ ] **SE-4-5** Onboarding: recommend shim vs CUPS vs tap by POS type. (SE-4-3; M)
- [ ] **SE-4-6** POS↔video matching (±30s window; confidence; flag no-sale / phantom). (SE-4-1; L)
- [ ] **SE-4-7** Underringing/sweethearting (VLM item-count vs receipt; departure-without-bill). (SE-4-6; XL)
- [ ] **SE-4-8** Cash-fraud + void/refund abuse detection (VLM cash exchange; baseline deviation). (SE-4-6; L)
- [ ] **SE-4-9** Cashier behavior baselining (per-cashier 30-day stats + scorecards; needs POS user-ID). (SE-4-6; M)
- [ ] **SE-4-10** Daily reconciliation report (PDF + push/email; drill-down to clips). (SE-4-7; L)
- [ ] **SE-4-11** Tap device (Pi Zero 2W): hardware spec + firmware (ESC/POS capture, buffer, OTA) + first batch (non-Windows shops). (SE-4-1; XL)

### Phase 5 — Monetize + chain + intelligence (W39–52)

- [ ] **SE-5-1** Razorpay subscriptions + UPI Autopay mandates + webhooks + dunning. (SE-0-8; XL)
- [ ] **SE-5-2** Billing portal + plan enforcement + 14-day trial. (SE-5-1; L)
- [ ] **SE-5-3** Wati/Gupshup WhatsApp integration + approved templates; replace interim alert channels. (SE-2-8; M)
- [ ] **SE-5-4** Chain data model (Brand→Store→Counter, RBAC via RLS). (SE-0-7; L)
- [ ] **SE-5-5** Brand dashboard + benchmarking (leaderboard, region heatmap, drill-down, export) on BigQuery. (SE-5-4; L)
- [ ] **SE-5-6** Investigation case management (cases, evidence clips, PDF export). (SE-5-5; L)
- [ ] **SE-5-7** Footfall (line-crossing) + zone dwell + heatmaps. (SE-1-7; L)
- [ ] **SE-5-8** Conversion rate + queue wait analytics. (SE-5-7; M)
- [ ] **SE-5-9** Demographics (age/gender, aggregate only; DPDP-B consent/signage/opt-out). (SE-5-7; L)
- [ ] **SE-5-10** Shelf-empty (VLM) + SKU planogram (custom YOLO top-50). (SE-1-6; XL)
- [ ] **SE-5-11** POS API integrations: Petpooja, Posist, Marg, GoFrugal, Vyapar. (SE-4-1; XL)
- [ ] **SE-5-12** Enterprise: SSO (SAML/OIDC), public API + webhooks, white-label. (SE-5-4; L)
- [ ] **SE-5-13** Sign first chain logo (pilot 2 stores → 5+ paid; case study). (all P5; XL)

### Phase 6 — Edge migration + advanced (Yr 2+)

- [ ] **SE-6-1** Edge gateway: connector upgrades in-place to run YOLO+MediaPipe locally (OpenVINO on N100; TensorRT on Jetson via `InferenceBackend`). (SE-1-4; XL)
- [ ] **SE-6-2** Edge↔cloud routing + fleet management + OTA + staged rollout. (SE-6-1; L)
- [ ] **SE-6-3** Migrate vector search to Vertex AI Vector Search (scale). (SE-3-1; L)
- [ ] **SE-6-4** Single-camera customer ReID (OSNet; session journeys; 24h embedding TTL; DPDP-B). (SE-6-1; XL)
- [ ] **SE-6-5** Cross-visit ReID (loyalty opt-in, DPDP-C) + aisle path tracking. (SE-6-4; XL)
- [ ] **SE-6-6** Abandoned-customer → stockout linkage (ReID + shelf state correlation; insight-quality). (SE-6-4; L)
- [ ] **SE-6-7** Android POS field survey → BT-printer proxy app → MediaProjection screen-OCR app → ESP32 BT tap (last resort). (SE-4-1; XL)
- [ ] **SE-6-8** Android onboarding flow (route to app vs tap vs API by setup). (SE-6-7; M)

### Cross-cutting (continuous)

- [ ] **SE-X-1** Cloud Operations monitoring (logs/metrics/error reporting) + uptime + on-call. (—; M)
- [ ] **SE-X-2** Quarterly per-feature accuracy audits (sample 20 events/feature; publish per-customer accuracy). (—; M)

---

## 6. Feature Feasibility Tiers (reference when saying "yes")

| Tier | Meaning | Accuracy | Customer claim | Examples |
|---|---|---|---|---|
| 1 Easy | off-the-shelf, 1–4 wk | 95%+ | "Production-grade" | footfall, dwell, drawer-open, POS match, after-hours |
| 2 Medium | needs engineering, 3–8 wk | 85–95% | "Production w/ caveats" | cashier-on-phone, underringing, demographics, cashier baselining, SKU |
| 3 Hard | quality-sensitive, 8–16 wk | 70–85% | "Beta/Insight" | multi-cam ReID, abandoned→stockout, voice-of-customer, aisle paths |
| 4 Experimental | don't build | 50–70% | (don't claim) | emotion, intent, gaze, nervousness |

Rule: alerts need Tier-A/quality-A (95%+); dashboards tolerate B; analytics tolerate C. **Never** ship Tier 4. Surface confidence scores for Tier 2–3.

---

## 7. Operations

- **Deploy**: web→Firebase Hosting/Cloud Run; api/worker→Cloud Run (push to `main`); connector→Artifact Registry (tag release); tap firmware→OTA staged.
- **Envs**: local (docker-compose) · staging (separate GCP project) · prod.
- **Backups**: Cloud SQL daily auto-backup 30d; GCS versioning; vector snapshots weekly.
- **Support**: T1 WhatsApp 10–8 IST; T2 email 24h SLA; T3 phone (Pro+); `help.shopeye.ai`.
- **Onboarding runbook**: signup → install connector → connect cameras (auto/manual) → draw zones → 24h review → confirm alerts → activate.

---

## 8. Appendices

### A. Database Schema (core)

```sql
-- Multi-tenant root
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  business_type TEXT NOT NULL,
  plan TEXT NOT NULL DEFAULT 'free',
  plan_started_at TIMESTAMPTZ, trial_ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firebase_uid TEXT UNIQUE NOT NULL, email TEXT NOT NULL,
  organization_id UUID NOT NULL REFERENCES organizations(id),
  role TEXT NOT NULL DEFAULT 'owner', -- owner/admin/manager/viewer
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE sites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  name TEXT NOT NULL, address TEXT, timezone TEXT DEFAULT 'Asia/Kolkata',
  connector_token TEXT UNIQUE NOT NULL DEFAULT gen_random_uuid()::text,
  connector_last_seen TIMESTAMPTZ, created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE counters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID NOT NULL REFERENCES sites(id), name TEXT NOT NULL,
  customer_zone JSONB, cashier_zone JSONB, drawer_zone JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE cameras (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID NOT NULL REFERENCES sites(id), counter_id UUID REFERENCES counters(id),
  name TEXT NOT NULL, rtsp_url TEXT NOT NULL, rtsp_credentials JSONB, -- encrypted
  model TEXT, is_active BOOLEAN DEFAULT TRUE, created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  site_id UUID NOT NULL REFERENCES sites(id),
  counter_id UUID REFERENCES counters(id), camera_id UUID REFERENCES cameras(id),
  event_type TEXT NOT NULL, occurred_at TIMESTAMPTZ NOT NULL, duration_sec INT,
  confidence FLOAT, clip_url TEXT, vlm_verdict TEXT, user_verdict TEXT,
  matched_transaction_id UUID, metadata JSONB, embedding VECTOR(768),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_events_org_site_time ON events(organization_id, site_id, occurred_at DESC);
-- Action event index (powers fast search; written by alert engine)
CREATE TABLE action_events (
  id BIGSERIAL PRIMARY KEY, site_id UUID NOT NULL, camera_id UUID NOT NULL,
  occurred_at TIMESTAMPTZ NOT NULL, action_class TEXT NOT NULL, confidence FLOAT NOT NULL,
  bbox JSONB, track_id BIGINT, clip_url TEXT, metadata JSONB
);
CREATE INDEX idx_action_site_time ON action_events(site_id, occurred_at DESC);
CREATE INDEX idx_action_class ON action_events(action_class);
-- Transactions (Phase 4+)
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  site_id UUID NOT NULL REFERENCES sites(id), counter_id UUID REFERENCES counters(id),
  occurred_at TIMESTAMPTZ NOT NULL, total_amount NUMERIC(10,2), item_count INT,
  payment_type TEXT, is_void BOOLEAN DEFAULT FALSE, is_refund BOOLEAN DEFAULT FALSE,
  items JSONB, source TEXT, raw_data JSONB, created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id), plan TEXT NOT NULL,
  razorpay_subscription_id TEXT, status TEXT NOT NULL,
  started_at TIMESTAMPTZ NOT NULL, canceled_at TIMESTAMPTZ, next_billing_at TIMESTAMPTZ
);
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id), user_id UUID REFERENCES users(id),
  action TEXT NOT NULL, resource_type TEXT, resource_id UUID, metadata JSONB,
  ip_address INET, created_at TIMESTAMPTZ DEFAULT NOW()
);
-- Enable RLS on all tenant-scoped tables.
```

### B. Event Types

`customer_arrived/left`, `drawer_open`, `drawer_open_no_customer`, `drawer_open_no_transaction`, `item_handled_no_scan`, `item_count_mismatch`, `phantom_transaction`, `void_abuse`, `discount_anomaly`, `unauthorized_access` (after-hours), `cashier_on_phone`, `cashier_absent`, `long_idle_period`, `aggressive_behavior`.

### C. Cost Model

| | Cloud-first (per cam/mo) | Pro tier (per store/mo) |
|---|---|---|
| GPU inference | ₹400–600 | — |
| Storage (GCS) | ₹100–150 | ₹30 |
| VLM/LLM (Gemini) | ₹100–150 | ₹350 |
| Alerts (push/email; WhatsApp later) | ~₹0 | ₹60 |
| DB/queue/infra | ₹30–50 | ₹30 |
| **Per-camera total** | **₹650–950** | — |
| **Per-store variable (Pro, 4 cam, edge or low-fps)** | — | **~₹750** |

Pro ARPU ₹4,999 → ~85% gross margin once on edge / low-fps. Cloud-first at 5fps eats 50–75% of ARPU → temporary "buy speed with cash"; migrate to edge ~100+ stores.

### D. Risk Register (top)

| Risk | L | I | Mitigation |
|---|---|---|---|
| Connector/gateway install fails on customer PCs | H | H | Polish installer; ship N100 option; remote support |
| NVR/RTSP compatibility | H | M | Device catalog; manual fallback; auto-discovery |
| VLM false positives erode trust | M | H | Iterate prompts; confidence scores; user feedback loop |
| Cloud GPU cost > margin at scale | M | H | Edge migration trigger at ~100 stores |
| Razorpay UPI Autopay failures | M | M | Dunning + manual collection fallback |
| Churn after design-partner phase | M | H | Daily-digest value; right pricing |
| DPDP/privacy concerns | L | H | Consent flows, retention, signage templates |
| Competition (Wobot/Solink enter niche) | M | H | Move fast; WhatsApp+UPI distribution moat |
| Solo founder burnout | H | H | Capital-efficient scope; cut P5/P6 aggressively |

### E. Glossary

**Connector** thin on-prem relay (RTSP→cloud) · **Gateway** edge box running local AI · **Tap device** HW intercepting printer stream · **VLM** vision-language model (Gemini Flash) · **NVR** network video recorder · **RTSP** camera stream protocol (pull-only) · **ONVIF/SADP/DHDiscover** camera discovery protocols · **ESC/POS** thermal-printer command protocol · **CGNAT** carrier NAT (why on-prem agent is mandatory) · **Action Event Index** Postgres table of pre-computed actions for fast search · **Sweethearting** not scanning items for friends · **No-sale** drawer opens without a transaction.

### F. Day-1 Setup (new machine)

1. `git clone <repo>` and install Node 20+/pnpm, Python 3.12/uv, Docker, `gcloud`, `gh`.
2. Copy `.env.example` → `.env.local`; fill keys (SE-0-2) from Secret Manager.
3. `make setup` then `make dev`; web at `:3000`, API docs at `:8000/docs`.
4. Work `SE-0-1` onward; track in GitHub Projects/Linear. **Don't skip SE-0-5.**

---

## 9. Decision Log

| Date | Decision | Rationale |
|---|---|---|
| Jun 2026 | Google-native stack (Firebase/Cloud Run/Cloud SQL/Vertex/GCS/Gemini) | Founder preference; single ecosystem |
| Jun 2026 | Cloud-first + thin connector day 1; edge later | Avoid install friction early; NAT still needs a thin on-prem relay |
| Jun 2026 | Defer Wati + Razorpay to Phase 5 | Interim FCM/in-app/email + manual billing; focus early on detection value |
| Jun 2026 | Edge portability habits from Phase 1 (ONNX, swappable backend) | Keep future edge port at ~8–12 wk |
| Jun 2026 | Cashier audit = wedge; retail analytics = expansion | Painkiller first, self-serve, fast close; analytics is enterprise upsell |

> Living document. Update §9 on every architectural change; check off tickets as they ship.
