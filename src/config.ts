/**
 * Central site configuration. Committed defaults use ShopEye (placeholder).
 * Production overrides: gitignored `src/brand.local.ts` only.
 */

import { BRAND_DEFAULTS, SITE_URL_DEFAULT, type BrandConfig } from "./brand";
import { BRAND_OVERRIDES, SITE_URL_OVERRIDE } from "./brand.local";

function mergeBrand(defaults: BrandConfig, overrides: typeof BRAND_OVERRIDES): BrandConfig {
  return {
    ...defaults,
    ...overrides,
    social: { ...defaults.social, ...overrides.social },
  };
}

export const SITE_URL = SITE_URL_OVERRIDE ?? SITE_URL_DEFAULT;
export const BRAND = mergeBrand(BRAND_DEFAULTS, BRAND_OVERRIDES);

export const LOCALES = ["en", "hi"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_META: Record<Locale, { label: string; short: string; htmlLang: string; ogLocale: string }> = {
  en: { label: "English", short: "EN", htmlLang: "en-IN", ogLocale: "en_IN" },
  hi: { label: "हिन्दी", short: "हिं", htmlLang: "hi-IN", ogLocale: "hi_IN" },
};

/** AI crawlers we explicitly welcome (AEO/GEO/LLMO strategy). */
export const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-Web",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Googlebot",
  "Bingbot",
  "Applebot",
  "Applebot-Extended",
  "CCBot",
  "cohere-ai",
  "Meta-ExternalAgent",
  "Bytespider",
  "Amazonbot",
  "DuckAssistBot",
];
