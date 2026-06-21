# ShopEye — Marketing Site

Marketing site for **ShopEye** (placeholder name), the India-native AI cashier-audit
product. Built with **Astro** + **Tailwind CSS v4**, optimized first for
**AEO/GEO/LLMO** (being cited by AI answer engines), then classic **SEO**, with a
dark, security-grade design language.

## Stack

- **Astro 6** — ships static HTML with near-zero JS (ideal for AEO/SEO/perf)
- **Tailwind CSS v4** (via `@tailwindcss/vite`) — design tokens in `src/styles/global.css`
- **MDX + content collections** — for blog/glossary/case studies (scaffold ready)
- **i18n** — English (root) + Hindi (`/hi`), `hreflang` + localized JSON-LD
- **Hosting** — Firebase Hosting (static), config in `firebase.json`

## Commands

```bash
npm install      # install deps
npm run dev      # local dev at http://localhost:4321
npm run build    # static build -> dist/
npm run preview  # preview the production build
```

> Deploys are intentionally **not** wired to run automatically. Deploy only on
> explicit instruction with `firebase deploy` (Firebase CLI is installed).

## Project structure

```
src/
  config.ts            Brand, locales, AI-crawler allowlist (single source of truth)
  styles/global.css    Design tokens + dark theme + motifs (scanline, detection grid)
  i18n/                Locale helpers (utils.ts) + nav/footer strings (ui.ts)
  content/home.ts      Homepage copy, per locale (en + hi)
  lib/schema.ts        JSON-LD builders (Organization, WebSite, SoftwareApplication, FAQ, Breadcrumb)
  layouts/BaseLayout   <head>, SEO, global JSON-LD graph, nav + footer shell
  components/          Seo, JsonLd, AnswerBlock, DetectionFrame, WhatsAppCard, Nav, Footer, Home, ...
  pages/
    index.astro        EN homepage
    hi/index.astro     HI homepage
    robots.txt.ts      AI-crawler-friendly robots (config-driven)
    llms.txt.ts        Curated LLM brief (llmstxt.org convention)
```

## AEO / GEO / LLMO features (priority #1)

- **Answer-first blocks** (`AnswerBlock.astro`) — concise, citable summaries on every page
- **Rich JSON-LD** — Organization, WebSite, SoftwareApplication+Offers, FAQPage, BreadcrumbList in a single `@graph`
- **`llms.txt`** — curated plain-text product brief for LLM ingestion
- **`robots.txt`** — explicitly allows GPTBot, ClaudeBot, PerplexityBot, Google-Extended, etc.
- **Semantic HTML + clean heading hierarchy** — extractable by retrievers
- Comparison pages, glossary, and stats-with-sources are the next content to add

## SEO features (priority #2)

- Per-page `<title>`, meta description, canonical, OpenGraph + Twitter cards (`Seo.astro`)
- `hreflang` alternates + `x-default`, localized `og:locale`
- Auto `sitemap-index.xml` with locale annotations (`@astrojs/sitemap`)
- Static HTML + optimized assets for strong Core Web Vitals

## Design language

Dark-only, blue (`#3B82F6`) primary + detection-green (`#22D3A6`) secondary.
Signature motif: animated detection bounding boxes, monospace system tags
(`DRAWER_OPEN`), timestamp HUDs, and WhatsApp alert cards — all reusable components.

## Status / next up

- [x] Foundation, design system, homepage (EN + HI), SEO/AEO primitives, Firebase config
- [ ] Inner pages: Product, Pricing, Industries, Compare, Security, About, Contact
- [ ] Learn hub + glossary (MDX content collections) — GEO/SEO engine
- [ ] Lead-capture API (Cloud Function) + Firestore, wired via Hosting rewrite
- [ ] OG image generation, real footage stills, Lighthouse pass, CI/CD
