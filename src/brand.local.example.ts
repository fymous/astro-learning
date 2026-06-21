/**
 * LOCAL DEPLOYMENT BRAND — copy to `brand.local.ts` (gitignored) and customize.
 *
 * Git must only ever contain ShopEye defaults in `brand.ts`. Never commit your
 * production brand name, domain, or email here or in any tracked file.
 *
 *   cp src/brand.local.example.ts src/brand.local.ts
 */

import type { BrandOverrides } from "./brand";

export const BRAND_OVERRIDES: BrandOverrides = {
  // name: "YourBrand",
  // legalName: "YourBrand Technologies Pvt. Ltd.",
  // domain: "yourbrand.com",
  // appHost: "app.yourbrand.com",
  // slug: "yourbrand",
  // email: "hello@yourbrand.com",
  // description: "…",
  // social: { linkedin: "…", x: "…", youtube: "…" },
};

export const SITE_URL_OVERRIDE: string | undefined = undefined;
// export const SITE_URL_OVERRIDE = "https://yourbrand.com";
