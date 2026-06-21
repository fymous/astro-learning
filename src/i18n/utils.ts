import { DEFAULT_LOCALE, LOCALES, type Locale } from "../config";

/** Resolve the active locale from Astro.currentLocale, with a safe fallback. */
export function resolveLocale(current: string | undefined): Locale {
  if (current && (LOCALES as readonly string[]).includes(current)) {
    return current as Locale;
  }
  return DEFAULT_LOCALE;
}

/**
 * Build a locale-aware path. Default locale lives at the root (no prefix);
 * other locales are prefixed (e.g. /hi/pricing).
 */
export function localizePath(path: string, locale: Locale): string {
  const clean = "/" + path.replace(/^\/+/, "").replace(/\/+$/, "");
  const base = clean === "/" ? "" : clean;
  if (locale === DEFAULT_LOCALE) {
    return base === "" ? "/" : base;
  }
  return `/${locale}${base === "" ? "" : base}` || `/${locale}`;
}

/** Alternate-language URLs for hreflang tags. */
export function alternateLinks(path: string, siteUrl: string) {
  return LOCALES.map((loc) => ({
    locale: loc,
    href: new URL(localizePath(path, loc), siteUrl).href,
  }));
}
