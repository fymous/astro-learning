/**
 * Committed brand defaults (ShopEye placeholder). Production overrides live in
 * gitignored `brand.local.ts` — see `brand.local.example.ts`.
 */

export interface BrandConfig {
  name: string;
  legalName: string;
  tagline: string;
  description: string;
  email: string;
  phone: string;
  city: string;
  region: string;
  country: string;
  /** Bare hostname, e.g. shopeye.ai */
  domain: string;
  /** App/dashboard hostname, e.g. app.shopeye.ai */
  appHost: string;
  /** Lowercase slug for URLs and handles in copy templates */
  slug: string;
  social: {
    linkedin: string;
    x: string;
    youtube: string;
  };
}

export type BrandOverrides = Partial<BrandConfig> & {
  social?: Partial<BrandConfig["social"]>;
};

export const SITE_URL_DEFAULT = "https://shopeye.ai";

export const BRAND_DEFAULTS: BrandConfig = {
  name: "ShopEye",
  legalName: "ShopEye Technologies Pvt. Ltd.",
  tagline: "Agentic AI video analytics for every operation",
  description:
    "ShopEye is an India-native agentic AI video analytics platform that turns existing CCTV cameras into real-time business intelligence across retail, consumer services, QSRs, dark stores, cloud kitchens, manufacturing, logistics and education. It tracks footfall and conversion, dwell and demographics, queues and SOP/PPE safety compliance, productivity and loss prevention, and lets teams ask questions in plain language and get instant WhatsApp alerts. No new hardware.",
  email: "hello@shopeye.ai",
  phone: "+91-80-4718-2200",
  city: "Bengaluru",
  region: "Karnataka",
  country: "IN",
  domain: "shopeye.ai",
  appHost: "app.shopeye.ai",
  slug: "shopeye",
  social: {
    linkedin: "https://www.linkedin.com/company/shopeye",
    x: "https://x.com/shopeye_ai",
    youtube: "https://www.youtube.com/@shopeye",
  },
};
