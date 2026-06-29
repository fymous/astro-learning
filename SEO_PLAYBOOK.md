# ShopEye — SEO / GEO / AEO / LLMO Playbook

Single source of truth for how we make pages rank and get **cited** by both search
engines and AI answer engines (Google AI Overviews, ChatGPT, Gemini, Perplexity, Claude).
Apply the **Page Recipe** to every new page so the whole site speaks one language.

---

## 1. North Star (motto)

> **Write once for humans, structure it so machines can quote us verbatim.**

Every page must:
- **Answer first** — lead with a concise, self-contained answer a model can lift as-is.
- **Be machine-readable** — real HTML (no JS needed to read) + rich JSON-LD.
- **State facts, honestly** — concrete claims, sources where possible, **never fabricated** stats/ratings.
- **Be bilingual** — full English + Hindi parity with hreflang.
- **Reinforce the entity** — consistent name, category, topics ("ShopEye = agentic AI video analytics").

---

## 2. Core principles (the "SEO language")

| Principle | Rule |
|---|---|
| Answer-first (AEO) | A `<AnswerBlock>` near the top: 40–70 words, present tense, no "we/this", self-contained. Start with the definition: *"X is …"*. |
| Quotable facts (GEO) | Use specific numbers + a source line. Short declarative sentences models can quote. Add a **Key Facts** table where useful. |
| Entity clarity (LLMO) | Always: brand name + category (*agentic AI video analytics*) + what it does + key differentiator (*existing cameras, no new hardware*). |
| One H1 | Exactly one `<h1>`; logical `h2/h3` nesting; keywords in headings. |
| Self-contained sections | Each section readable out of context (engines lift fragments). |
| Static HTML | Content server-rendered (Astro SSG). Animations/JS are enhancement only. |
| Bilingual | Mirror every page in `hi`. hreflang `en-IN`, `hi-IN`, `x-default`. |
| Internal links | Link to related pages with descriptive anchor text. |

**Title:** Home is brand-led. Subpages: `<Primary keyword / topic> — ShopEye` (≤ ~60 chars).
**Meta description:** 140–160 chars, primary keyword + value + "no new hardware".

---

## 3. Page Recipe (checklist for EVERY new page)

1. Render inside `BaseLayout` with `title`, `description`, `path`, and a `schema` array.
2. Add localized copy to a content module for **both** `en` and `hi`.
3. Include, in order:
   - One **H1** (primary keyword).
   - One **`<AnswerBlock>`** (`data-answer`) high on the page.
   - Main content in self-contained `h2` sections.
   - A **Key Facts** table when the page describes an entity (product/industry/company).
   - A page-specific **FAQ** (3–6 Q&As) → wired to `faqSchema`.
   - A clear CTA.
4. Build the `schema` array (see §4): always `webPageSchema` + `breadcrumbSchema`, plus type-specific nodes.
5. Confirm hreflang/canonical auto-generate (handled by `Seo.astro` via `path`).
6. Add descriptive `alt` text on all images. For **new AI-generated visuals**, follow `NANO_BANANA_PROMPTS.md` (prompt density, overlay copy, then WebP + filename).
7. Build, then validate JSON-LD parses and content appears in `dist/*.html` for **both** locales.

---

## 4. Schema cheat-sheet

Helpers live in `site/src/lib/schema.ts`; nodes are merged into one `@graph` by `BaseLayout`
(which always injects `organizationSchema` + `websiteSchema`).

| Page type | Add these nodes |
|---|---|
| Any page | `webPageSchema({url,name,description,image})` + `breadcrumbSchema(crumbs)` |
| Home / Product | `softwareApplicationSchema()`, `howToSchema()`, `itemListSchema()`, `faqSchema()` |
| Industry page | `webPageSchema` + `itemListSchema` (use-cases) + `faqSchema` (+ `Service` when added) |
| Pricing | `softwareApplicationSchema()` offers (real prices) + `faqSchema` |
| How-to / setup | `howToSchema(name, desc, steps)` |
| Blog / guide | `Article`/`BlogPosting` (author, datePublished, dateModified) — **to add** |
| Comparison | `webPageSchema` + `faqSchema` + tables |

- `webPageSchema` adds **`SpeakableSpecification`** (targets `[data-answer]`, `h1`) + **`dateModified`** (freshness).
- **Never** add `aggregateRating`/`Review` until we have real reviews.

---

## 5. Implemented so far

**Site-wide infrastructure**
- Astro static-site (fast Core Web Vitals); Tailwind v4.
- `Seo.astro`: `<title>`, meta description, canonical, hreflang (`en-IN`/`hi-IN`/`x-default`), OpenGraph, Twitter `summary_large_image`, theme-color.
- `BaseLayout.astro`: injects `@graph` JSON-LD (Organization + WebSite + per-page nodes).
- `lib/schema.ts`: `organizationSchema` (with `knowsAbout`, `sameAs`, `areaServed`), `websiteSchema`, `softwareApplicationSchema` (featureList + offers, **no fake rating**), `faqSchema`, `breadcrumbSchema`, `webPageSchema` (speakable + dateModified), `howToSchema`, `itemListSchema`, `graph()`.
- `robots.txt` (route) — explicitly allows AI crawlers (`config.ts` → `AI_CRAWLERS`: GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended, etc.) + sitemap link.
- `llms.txt` (route) — curated plain-text product brief (what it is, capabilities, industries, agentic Ask/Monitor/Act, differentiators, pricing, key pages).
- `@astrojs/sitemap` → `sitemap-index.xml`.
- i18n: English default (no prefix), Hindi at `/hi`; `localizePath` + `alternateLinks`.
- Brand assets: `public/logo.png` (Organization logo), `public/og/default.png` (1200×630 social card). Generated crisply from SVG via `scripts/gen-assets.mjs` (uses bundled `sharp`).

**Homepage**
- Answer-first `<AnswerBlock>` (speakable target).
- "ShopEye at a glance" **Key Facts** table.
- FAQ with **8** Q&As (incl. definitional: "What is AI video analytics?", "What is agentic AI video analytics?", "What is footfall & conversion analytics?") → `FAQPage`.
- `HowTo` (5-step "works with existing infrastructure").
- `ItemList` ×2 (8 industries, 9 capabilities).
- Outcome stats with a source line.
- Graph shipped: `Organization, WebSite, WebPage, SoftwareApplication, HowTo, ItemList×2, FAQPage, BreadcrumbList`.
- Full EN + HI parity.

---

## 6. Pending / backlog

**On-page / content**
- Build subpages with this recipe: `/product`, `/pricing`, `/industries` + `/industries/<slug>` (×8), `/compare`, `/learn` + `/glossary`, `/about`, `/security`, `/contact`.
- Blog/guide system with `Article`/`BlogPosting` schema + author/E-E-A-T signals.
- Real product screenshots + disciplined `alt` text.
- Glossary entries with `DefinedTerm` schema.

**Discoverability assets**
- Hindi OG image (`/og/default-hi.png`) + per-page OG images.
- `llms-full.txt` (full-content dump) once more pages exist.
- `sitemap` `lastmod`; RSS feed for blog.

**Trust / off-page (where AI citations originate)**
- Wikidata/Wikipedia entity; G2 / Capterra listings; third-party comparison articles & backlinks.
- Add genuine `Review` / `aggregateRating` when real customers exist.

**Ops**
- Google Search Console + Bing Webmaster verification; monitor AI-crawler hits.
- Breadcrumb UI to match `BreadcrumbList`.

---

## 7. Hard rules (don't break)

- ❌ No fabricated ratings, review counts, customer numbers, or logos.
- ❌ No content hidden behind JS / requiring interaction to read.
- ❌ No English-only pages — Hindi parity is mandatory.
- ✅ One H1, answer-first, key facts, FAQ, and `webPageSchema` on every page.
- ✅ Keep brand + category wording consistent everywhere.
