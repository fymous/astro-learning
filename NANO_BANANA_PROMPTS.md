# Nano Banana (Gemini) Image Prompt Guide

How we write prompts for **Gemini Nano Banana** (and similar image models) when creating marketing and industry-page visuals for ShopEye.

**Goal:** Generate photorealistic **product screenshots / CCTV-style analytics frames** — not generic stock photos. The image should look like a real moment from our platform: camera angle, UI overlays, alert badges, and readable on-page text.

See also: `SEO_PLAYBOOK.md` for `alt`, `title`, filename, and WebP optimization after the image exists.

---

## 1. Prompt structure (use this order)

Write prompts as **one long paragraph** (models handle dense prose well). Follow this sequence:

| Layer | What to specify |
|---|---|
| **1. Scene type** | Dashboard UI, CCTV interior, CCTV exterior, split-screen, etc. |
| **2. Camera / framing** | Angle (bird's-eye, 50° downward, split 60/40), lens (wide-angle, slight barrel distortion), aspect feel (4:3 monitor crop). |
| **3. Environment** | Store type, lighting (LED, dusk, street lamps), geography cues if relevant (Indian retail storefront). |
| **4. Human subjects** | Who is in frame, posture, clothing, what they are doing — only if the story needs people. |
| **5. The incident** | The single moment the section is about (no-sale open, loitering, customer waiting). |
| **6. AI overlays** | Bounding boxes, zone polygons, badge text **in ALL CAPS with exact copy**, colors (amber = warning, red = critical, green = resolved/available). |
| **7. HUD / chrome** | Camera ID, timestamp, sync bars, bottom alert bars, mini-map, side stats panel. |
| **8. Style close** | `Photorealistic`, `professional SaaS UI`, `CCTV surveillance aesthetic`, `sharp`, `well-lit`. |

**Do not** ask for a desk, monitor bezel, or room around a screen unless the hero explicitly needs a "photo of a laptop on a table." Prefer **the screen content itself** filling the frame.

---

## 2. Rules that make prompts work

### Be literal about UI text
Models render text better when you quote exact strings:

- `"NO-SALE OPEN DETECTED"`
- `"TXN #4821 · VOID AFTER TENDER · ₹2,340 · Counter 2 · 14:37:22 · FLAGGED"`
- `"⏱ UNATTENDED · 1m 35s"`

Use `·` or `—` as separators; keep labels short and badge-like.

### One story per image
Each prompt = **one alert / one insight**. Do not combine footfall + queue + loss prevention in one frame.

### Foreground vs background
Use **FOREGROUND:** and **BACKGROUND:** when two subjects matter (e.g. waiting customer + available staff in another aisle). Say explicitly that both are visible **in the same camera frame**.

### Tie overlays to the page copy
Pull nouns and verbs from the section heading and body: *no-sale register open*, *perimeter loitering*, *95 seconds without staff*. The `alt` text on the `<img>` should describe the same scene.

### Indian retail context (when relevant)
Glass facade, shutters, warm street lighting, ₹ in transaction rows, WhatsApp in alert bars — grounds the image for our market without naming the deployment brand in git.

### End with style anchors
Always close with 2–3 style words: `Photorealistic`, `professional dark-mode analytics UI`, `CCTV surveillance aesthetic with crisp AI annotation overlays`.

### After generation
1. Save to `public/images/...` with a **keyword-rich filename** (e.g. `cash-operations-monitoring-pos-fraud.webp`).
2. Resize to max **1200px** width, **WebP quality 80** (~50–120 KB).
3. Set `alt`, `title`, `width`, `height`, `loading`, `decoding` on the `<img>`.
4. **Remove** the HTML comment placeholder from the `.astro` file once the image is in place.

---

## 3. Prompt template (copy and fill in)

```
[SCENE TYPE] — [one-line summary of what the viewer should understand in 3 seconds].

[CAMERA]: [angle], [lens], [lighting/time of day].

[ENVIRONMENT]: [store/location details].

[SUBJECTS]: [people + actions, or "no customers present"].

[INCIDENT]: [the exact anomaly or insight being shown].

[OVERLAYS]:
- [color] bounding box: "[EXACT BADGE TEXT]"
- [zone polygon / timer / sync bar if needed]
- HUD top-left: "[CAM-ID · ZONE] · [timestamp]"
- Bottom bar: "[ALERT SUMMARY · CHANNEL e.g. WHATSAPP]"

[OPTIONAL SECOND PANEL for split-screen]:
LEFT ([width]%): [dashboard content with one highlighted row].
RIGHT ([width]%): [CCTV frame with matching timestamp].

Overall style: photorealistic, [SaaS dark UI / CCTV / retail interior], sharp, professional.
```

---

## 4. Reference examples (retail industry page)

These three prompts produced strong results for `/industries/retail-video-analytics`. Use them as the quality bar.

### Example A — Cash operations monitoring (split-screen dashboard + CCTV)

**Section:** Every register transaction, verified by video  
**Output file:** `cash-operations-monitoring-pos-fraud.webp`

```
Split-screen analytics dashboard on a dark-themed monitor. LEFT PANEL (60% width): a POS transaction log interface with rows of retail transactions in a table — most rows are white text on dark background showing normal sales. One row is highlighted with a bright red background: "TXN #4821 · VOID AFTER TENDER · ₹2,340 · Counter 2 · 14:37:22 · FLAGGED". A red warning icon pulses next to it. Above the table, a header bar reads "Cash Operations Monitor — Store 7" with a live green dot. BOTTOM of left panel: tags reading "3 No-Sale Opens · 1 Void Pattern · 2 Refund Anomalies — Today". RIGHT PANEL (40% width): grainy CCTV footage of a retail checkout counter from a slightly elevated angle. A cashier in a blue uniform has their hand on the open register drawer. The till is visibly open with no customer in front of the counter. An orange bounding box surrounds the register area with an amber badge: "NO-SALE OPEN DETECTED". Timestamp overlay bottom-left: "CAM-POS-02 · 14:37:22". A thin horizontal sync indicator bar at the top of the CCTV panel glows orange and reads "POS-VIDEO SYNC ACTIVE". Overall aesthetic: professional dark-mode analytics SaaS UI, photorealistic, slightly angled desktop monitor view.
```

**Why it works:** Split layout explains POS↔video correlation; one red row + one amber CCTV badge; sync bar sells "real time"; exact txn string matches fraud narrative.

---

### Example B — Perimeter / suspicious activity (exterior CCTV)

**Section:** Detect threats outside your store  
**Output file:** `suspicious-activity-perimeter-monitoring.webp`

```
Exterior of a modern Indian retail storefront captured at dusk from a high-mounted CCTV camera at approximately 50-degree downward angle, wide-angle lens with slight barrel distortion. The store has a glass facade with illuminated brand signage, metal shutters 30% lowered indicating closing time. Street lighting casts orange pools on the pavement. Three males in casual clothes stand near the entrance — two are huddled, one leans against the wall looking repeatedly over his shoulder. An AI analytics overlay renders on top of the CCTV footage: PERSON 1 and PERSON 2 are enclosed in a thick amber bounding box labeled "⚠ LOITERING — 12 min 34 sec". PERSON 3 has an orange bounding box: "UNUSUAL POSITIONING". A dashed red zone polygon covers the storefront area captioned "PERIMETER ZONE A — ALERT ACTIVE". Top-left corner HUD: camera ID "CAM-EXT-04 · PERIMETER", timestamp "22:41:07", small red flashing dot. Bottom bar across the full image reads "HIGH PRIORITY ALERT · SUSPICIOUS GATHERING · SECURITY NOTIFIED VIA WHATSAPP · 22:41:09". A translucent mini overhead-map in the bottom-right corner shows the store layout with a red dot pulsing at the entrance. Sky is deep blue-grey dusk. Overall style: photorealistic CCTV surveillance aesthetic with crisp AI annotation overlays.
```

**Why it works:** Specific camera geometry + dusk mood; multiple people with distinct poses; zone polygon + mini-map + full-width alert bar; WhatsApp in the alert string matches product positioning.

---

### Example C — Customer unattended (interior CCTV, two subjects)

**Section:** Never let a customer wait unnoticed again  
**Output file:** `customer-unattended-alert-detection.webp`

```
Interior of a premium electronics retail store shot from a bird's-eye overhead CCTV camera at approximately 60-degree angle, wide-angle lens. The store is brightly lit with white LED ceiling lights and warm product display lighting. FOREGROUND: a woman in her mid-30s wearing casual clothes stands alone at a glass display counter lined with laptops and tablets. She is leaning in to look at a laptop, one hand on the counter. An amber rounded-rectangle bounding box highlights her with the annotation badge: "⏱ UNATTENDED · 1m 35s" in bold amber text. Below the box: "ZONE: LAPTOPS & TABLETS · THRESHOLD: 90s". A soft amber glow pulse effect surrounds the box. A red escalating timer "00:01:35" appears in the top corner of the zone. BACKGROUND (visible in the same camera frame): a male staff member in a blue polo retail uniform is restocking items in the adjacent aisle with his back toward the customer. A green bounding box highlights him: "✓ STAFF AVAILABLE · ALERT SENT · 14:22:08". A small WhatsApp icon appears next to this badge with a notification checkmark. BOTTOM INFO BAR across the image: "CAM-INT-07 · ZONE 3 · NEAREST ASSOCIATE NOTIFIED · RESPONSE PENDING". Top-left: camera ID, timestamp "14:22:08". Right side: small panel showing "Zone Response Time · Avg Today: 48s · Now: 1m 35s ↑ ABOVE THRESHOLD". Store shelves, product display stands, and branded signage visible in background. Photorealistic, sharp, professional retail environment.
```

**Why it works:** FOREGROUND/BACKGROUND structure shows the problem and the fix path; timer exceeds threshold; stats panel reinforces operational value; green vs amber color language is consistent.

---

## 5. Anti-patterns (avoid)

| Weak prompt | Better approach |
|---|---|
| "Retail analytics dashboard" | Name panels, row highlights, and exact flagged labels |
| "People outside a store" | Dusk CCTV angle, loitering duration, zone polygon, alert bar |
| "Customer waiting for help" | Seconds on timer, zone name, staff in same frame, alert sent badge |
| "Modern UI screenshot" | Dark SaaS chrome, camera ID, timestamp, sync state |
| Desk + monitor + keyboard | Frame = the UI or CCTV feed only (unless hero needs lifestyle shot) |
| Multiple unrelated alerts | One incident, one primary badge color story |

---

## 6. Workflow checklist

- [ ] Read the target section H2 + first paragraph — extract the **one moment** to illustrate.
- [ ] Draft prompt using §3 template; compare against §4 examples for density.
- [ ] Generate in Gemini Nano Banana; iterate on overlay text if garbled.
- [ ] Export PNG → convert to WebP (1200px max width, q80).
- [ ] Place under `public/images/industries/<vertical>/`.
- [ ] Wire `<img>` with SEO `alt` / `title` matching the scene (not the prompt).
- [ ] Delete temporary source PNGs and any repo-root `images/` drop folder.
- [ ] Remove HTML `<!-- PLACEHOLDER: nano-banana prompt -->` comments from the page.

---

## 7. Where placeholders live (temporary)

While waiting on assets, you may leave a single-line HTML comment **immediately below** the `<img>`:

```html
<!-- PLACEHOLDER: nano-banana prompt — [full prompt text] -->
```

Remove the comment once the WebP is committed. Do not leave placeholders in production deploys.
