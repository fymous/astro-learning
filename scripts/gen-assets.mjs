// Generates branded logo.png + OG image from crisp SVG using Astro's bundled sharp.
// Run: node scripts/gen-assets.mjs
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const pub = join(root, "public");

const aperture = (scale, cx, cy) => `
<g transform="translate(${cx},${cy}) scale(${scale})">
  <circle cx="16" cy="16" r="14.5" stroke="url(#g)" stroke-width="2" fill="none"/>
  <path d="M16 7.5a8.5 8.5 0 0 1 7.36 4.25l-7.36.02 3.7-4.27ZM7.5 16a8.5 8.5 0 0 1 4.25-7.36l3.66 6.39-7.91.97ZM16 24.5a8.5 8.5 0 0 1-7.36-4.25l7.36-.02-3.7 4.27ZM24.5 16a8.5 8.5 0 0 1-4.25 7.36l-3.66-6.39 7.91-.97Z" fill="url(#g)" opacity="0.92"/>
  <circle cx="16" cy="16" r="3" fill="#0b1220"/>
</g>`;

const gradDef = `
<defs>
  <linearGradient id="g" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
    <stop stop-color="#2563EB"/><stop offset="1" stop-color="#10B981"/>
  </linearGradient>
  <linearGradient id="glow" x1="0" y1="0" x2="1" y2="1">
    <stop stop-color="#2563EB" stop-opacity="0.16"/><stop offset="1" stop-color="#10B981" stop-opacity="0.10"/>
  </linearGradient>
</defs>`;

// ---- logo.png (transparent, horizontal lockup) ----
const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="260" viewBox="0 0 960 260">
${gradDef}
${aperture(4.6, 40, 56)}
<text x="240" y="166" font-family="Arial, Helvetica, sans-serif" font-size="118" font-weight="700" fill="#0b1220" letter-spacing="-3">ShopEye</text>
</svg>`;

// ---- og/default.png (1200x630, light brand card) ----
const gridLines = Array.from({ length: 22 }, (_, i) => {
  const x = i * 56;
  const y = i * 56;
  return `<line x1="${x}" y1="0" x2="${x}" y2="630" stroke="#2563EB" stroke-opacity="0.05"/><line x1="0" y1="${y}" x2="1200" y2="${y}" stroke="#2563EB" stroke-opacity="0.05"/>`;
}).join("");

const chip = (x, y, w, label, value, vColor) => `
<g transform="translate(${x},${y})">
  <rect width="${w}" height="78" rx="16" fill="#ffffff" stroke="#e7ecf3"/>
  <text x="20" y="32" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="600" fill="#8492ab" letter-spacing="1">${label}</text>
  <text x="20" y="62" font-family="Arial, Helvetica, sans-serif" font-size="26" font-weight="700" fill="${vColor}">${value}</text>
</g>`;

const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
${gradDef}
<rect width="1200" height="630" fill="#ffffff"/>
${gridLines}
<circle cx="1120" cy="40" r="320" fill="url(#glow)"/>
${aperture(2.3, 72, 64)}
<text x="138" y="118" font-family="Arial, Helvetica, sans-serif" font-size="40" font-weight="700" fill="#0b1220" letter-spacing="-1">ShopEye</text>

<text x="72" y="270" font-family="Arial, Helvetica, sans-serif" font-size="62" font-weight="700" fill="#0b1220" letter-spacing="-1.5">Turn every camera into a</text>
<text x="72" y="344" font-family="Arial, Helvetica, sans-serif" font-size="62" font-weight="700" fill="#2563EB" letter-spacing="-1.5">business intelligence</text>
<text x="72" y="418" font-family="Arial, Helvetica, sans-serif" font-size="62" font-weight="700" fill="#0b1220" letter-spacing="-1.5">powerhouse.</text>

<text x="74" y="480" font-family="Arial, Helvetica, sans-serif" font-size="25" font-weight="400" fill="#4f5d76">Agentic AI video analytics for every operation.</text>

<text x="74" y="560" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="700" fill="#2563EB">shopeye.ai</text>
<text x="190" y="560" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="400" fill="#8492ab">· Works with your existing CCTV · No new hardware</text>

${chip(852, 250, 276, "VISITORS TODAY", "1,284  \u25B2 +12%", "#0b1220")}
${chip(852, 348, 276, "CONVERSION", "38%  \u00B7  Avg dwell 4m", "#2563EB")}
${chip(852, 446, 276, "SAFETY ALERT", "PPE missing \u00B7 Dock A", "#ef4444")}
</svg>`;

// ---- og/retail-video-analytics.png (1200x630, retail-specific card) ----
const retailOgSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
${gradDef}
<rect width="1200" height="630" fill="#ffffff"/>
${gridLines}
<circle cx="1120" cy="40" r="320" fill="url(#glow)"/>
${aperture(2.3, 72, 64)}
<text x="138" y="118" font-family="Arial, Helvetica, sans-serif" font-size="40" font-weight="700" fill="#0b1220" letter-spacing="-1">ShopEye</text>

<rect x="72" y="166" width="300" height="40" rx="20" fill="#eff5ff"/>
<text x="92" y="192" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="700" fill="#1d4ed8" letter-spacing="0.5">RETAIL VIDEO ANALYTICS</text>

<text x="72" y="290" font-family="Arial, Helvetica, sans-serif" font-size="58" font-weight="700" fill="#0b1220" letter-spacing="-1.5">Turn every retail camera</text>
<text x="72" y="360" font-family="Arial, Helvetica, sans-serif" font-size="58" font-weight="700" fill="#1d4ed8" letter-spacing="-1.5">into a conversion engine.</text>

<text x="74" y="424" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="400" fill="#4f5d76">Footfall · conversion · queues · loss prevention — on existing CCTV.</text>

<text x="74" y="560" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="700" fill="#1d4ed8">shopeye.ai</text>
<text x="190" y="560" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="400" fill="#8492ab">· No new hardware · WhatsApp alerts · DPDP-aligned</text>

${chip(852, 250, 276, "VISITORS TODAY", "1,284  \u25B2 +12%", "#0b1220")}
${chip(852, 348, 276, "CONVERSION", "38%  \u00B7  Funnel mapped", "#1d4ed8")}
${chip(852, 446, 276, "QUEUE ALERT", "Counter 3 \u00B7 6 waiting", "#ef4444")}
</svg>`;

await mkdir(join(pub, "og"), { recursive: true });
await sharp(Buffer.from(logoSvg)).png().toFile(join(pub, "logo.png"));
await sharp(Buffer.from(ogSvg)).png().toFile(join(pub, "og", "default.png"));
await sharp(Buffer.from(retailOgSvg)).png().toFile(join(pub, "og", "retail-video-analytics.png"));
console.log("Generated public/logo.png, public/og/default.png, public/og/retail-video-analytics.png");
