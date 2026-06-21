import { BRAND, SITE_URL } from "../config";

const ORG_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

export function organizationSchema() {
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: BRAND.name,
    legalName: BRAND.legalName,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description: BRAND.description,
    email: BRAND.email,
    telephone: BRAND.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: BRAND.city,
      addressRegion: BRAND.region,
      addressCountry: BRAND.country,
    },
    areaServed: { "@type": "Country", name: "India" },
    knowsAbout: [
      "AI video analytics",
      "CCTV video analytics",
      "Footfall analytics",
      "Conversion rate analytics",
      "People counting",
      "Queue and wait-time monitoring",
      "Dwell time analysis",
      "PPE and SOP safety compliance",
      "Intrusion detection",
      "Loss prevention",
      "Cashier fraud detection",
      "Retail analytics",
      "Agentic AI",
    ],
    sameAs: [BRAND.social.linkedin, BRAND.social.x, BRAND.social.youtube],
  };
}

export function websiteSchema() {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: BRAND.name,
    publisher: { "@id": ORG_ID },
    inLanguage: ["en-IN", "hi-IN"],
  };
}

export function softwareApplicationSchema() {
  return {
    "@type": "SoftwareApplication",
    name: BRAND.name,
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "Video Analytics",
    operatingSystem: "Web, Android, iOS",
    description: BRAND.description,
    url: SITE_URL,
    publisher: { "@id": ORG_ID },
    featureList: [
      "Footfall counting and heatmaps",
      "Conversion funnel analytics",
      "Queue and wait-time monitoring",
      "Dwell time and zone engagement",
      "Customer demographics (privacy-safe, no identity capture)",
      "SOP and PPE safety compliance monitoring",
      "Intrusion and after-hours detection",
      "Loss prevention and cashier fraud detection",
      "POS and data correlation",
      "Natural-language video search",
      "WhatsApp, Slack and Teams alerts",
      "Multi-location dashboard for retail, QSR, dark stores, cloud kitchens, manufacturing, logistics and education",
    ],
    offers: [
      { "@type": "Offer", name: "Starter", price: "1999", priceCurrency: "INR", description: "4 cameras, core analytics and alerts" },
      { "@type": "Offer", name: "Pro", price: "4999", priceCurrency: "INR", description: "12 cameras, WhatsApp alerts, full natural-language search" },
      { "@type": "Offer", name: "Business", price: "9999", priceCurrency: "INR", description: "32 cameras, multi-location dashboard" },
    ],
  };
}

/** Marks the page's answer-first block as speakable + adds freshness. */
export function webPageSchema(opts: {
  url: string;
  name: string;
  description: string;
  image?: string;
}) {
  return {
    "@type": "WebPage",
    "@id": `${opts.url}#webpage`,
    url: opts.url,
    name: opts.name,
    description: opts.description,
    isPartOf: { "@id": WEBSITE_ID },
    inLanguage: ["en-IN", "hi-IN"],
    dateModified: new Date().toISOString(),
    ...(opts.image ? { primaryImageOfPage: new URL(opts.image, SITE_URL).href } : {}),
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["[data-answer]", "h1"],
    },
  };
}

/** HowTo node — maps directly to the "Works with your infrastructure" steps. */
export function howToSchema(name: string, description: string, steps: { title: string; body: string }[]) {
  return {
    "@type": "HowTo",
    name,
    description,
    step: steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.title,
      text: s.body,
    })),
  };
}

/** Generic ItemList — used for industries served and capabilities. */
export function itemListSchema(name: string, items: { name: string; description: string }[]) {
  return {
    "@type": "ItemList",
    name,
    numberOfItems: items.length,
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      description: it.description,
    })),
  };
}

export function faqSchema(items: { q: string; a: string }[]) {
  return {
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

export function breadcrumbSchema(crumbs: { name: string; url: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: new URL(c.url, SITE_URL).href,
    })),
  };
}

/** Wrap one or more schema nodes in a single @graph document. */
export function graph(...nodes: Record<string, unknown>[]) {
  return {
    "@context": "https://schema.org",
    "@graph": nodes,
  };
}
