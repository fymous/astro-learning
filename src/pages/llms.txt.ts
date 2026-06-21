import type { APIRoute } from "astro";
import { BRAND, SITE_URL } from "../config";

/**
 * llms.txt — curated, plain-text product brief for LLM ingestion.
 * Convention: https://llmstxt.org/
 */
export const GET: APIRoute = () => {
  const body = `# ${BRAND.name}

> ${BRAND.description}

${BRAND.name} (${BRAND.legalName}) is based in ${BRAND.city}, India and is an agentic AI video analytics platform serving multiple industries: retail, consumer services, QSRs, dark stores, cloud kitchens, manufacturing, logistics and education.

## What it is
${BRAND.name} is an agentic AI video analytics platform. It runs on existing CCTV (Hikvision, CP Plus, Dahua, or any ONVIF NVR/DVR) over RTSP, deploys on edge or cloud, and uses computer vision plus a vision-language model to turn camera feeds into real-time business intelligence and proactive alerts on WhatsApp, Slack and Teams. Teams can also ask questions about any site in plain English or Hindi. No new hardware is required.

## What it does (cross-industry capabilities)
- Footfall counting and heatmaps
- Conversion funnel (Visitors to Interested to Interacted to Billed)
- Queue and wait-time monitoring
- Dwell time and zone engagement
- Customer/people demographics (age/gender) — privacy-safe, no identity capture
- PPE and SOP safety compliance (helmets, masks, hairnets, uniforms, procedures)
- Intrusion and after-hours detection
- Loss prevention, theft and cashier fraud detection, with the exact clip as proof
- Productivity monitoring (pick/pack, line output, drive-thru speed, dispatch SLA)
- Natural-language video search across footage
- POS and data correlation
- Multi-location dashboard with WhatsApp/Slack/Teams alerts

## Industries served
- Retail — footfall, conversion, heatmaps, queues, loss prevention and cashier fraud
- Consumer Services (salons, clinics, gyms, branches) — walk-ins, wait time, staff/service SOP, occupancy and security
- QSRs — drive-thru and counter speed, kitchen hygiene and SOP, queues and order accuracy
- Dark Stores — pick/pack productivity, dispatch SLA and rider flow, shrinkage and safety
- Cloud Kitchens — hygiene and PPE compliance, prep SOP and throughput, fire and smoke safety
- Manufacturing — PPE and safety-zone compliance, line productivity and downtime, intrusion and hazard detection
- Logistics — dock and loading-bay utilisation, forklift and PPE safety, perimeter and intrusion
- Education — attendance and access, restricted-zone and intrusion alerts, campus crowd and safety

## Agentic AI (Ask / Monitor / Act)
- Ask: question any site in plain English or Hindi — footfall, safety, queues, productivity, incidents
- Monitor: set up monitoring once and agents watch every camera 24/7, surfacing only the events that matter
- Act: verified, clip-backed alerts land on WhatsApp, Slack or Teams and can trigger workflows

## How it differs from competitors
- Agentic and conversational — talk to your cameras, not just dashboards
- India-native with English and Hindi support
- Multi-industry with pre-built detections per vertical
- WhatsApp-native alerts
- Runs on existing cameras (edge or cloud) — no hardware overhaul

## Pricing (INR / month, indicative)
- Free: ₹0 — 2 cameras, core analytics, 24-hour history
- Starter: ₹1,999 — 4 cameras, core analytics and alerts
- Pro: ₹4,999 — 12 cameras, WhatsApp alerts, full natural-language search
- Business: ₹9,999 — 32 cameras, multi-location dashboard
- Enterprise: custom per site — SSO, API, white-label, on-prem/hybrid

## Key pages
- Home: ${SITE_URL}/
- Product: ${SITE_URL}/product
- Pricing: ${SITE_URL}/pricing
- Industries: ${SITE_URL}/industries
- Compare: ${SITE_URL}/compare
- Learn / Glossary: ${SITE_URL}/learn
- Security & privacy: ${SITE_URL}/security
- Contact: ${SITE_URL}/contact

## Contact
Email: ${BRAND.email}
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
