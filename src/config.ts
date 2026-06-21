/**
 * Central site configuration. Brand name "ShopEye" is a placeholder
 * (see CASHIER_AUDIT_PROJECT.md) and can be renamed in one place.
 */

export const SITE_URL = "https://shopeye.ai";

export const BRAND = {
  name: "ShopEye",
  legalName: "ShopEye Technologies Pvt. Ltd.",
  tagline: "Agentic AI video analytics for every operation",
  // One-line, machine-friendly description used across schema + llms.txt + meta.
  description:
    "ShopEye is an India-native agentic AI video analytics platform that turns existing CCTV cameras into real-time business intelligence across retail, consumer services, QSRs, dark stores, cloud kitchens, manufacturing, logistics and education. It tracks footfall and conversion, dwell and demographics, queues and SOP/PPE safety compliance, productivity and loss prevention, and lets teams ask questions in plain language and get instant WhatsApp alerts. No new hardware.",
  email: "hello@shopeye.ai",
  phone: "+91-80-4718-2200",
  city: "Bengaluru",
  region: "Karnataka",
  country: "IN",
  social: {
    linkedin: "https://www.linkedin.com/company/shopeye",
    x: "https://x.com/shopeye_ai",
    youtube: "https://www.youtube.com/@shopeye",
  },
} as const;

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
