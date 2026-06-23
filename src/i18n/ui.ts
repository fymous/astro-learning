import type { Locale } from "../config";

type NavItem = { label: string; href: string };
type NavDropdown = { label: string; href: string; children: NavItem[] };
export type NavEntry = NavItem | NavDropdown;

export function isDropdown(entry: NavEntry): entry is NavDropdown {
  return "children" in entry && Array.isArray(entry.children);
}

interface UIStrings {
  nav: NavEntry[];
  signIn: string;
  startTrial: string;
  bookDemo: string;
  watchDemo: string;
  skipToContent: string;
  footer: {
    productHeading: string;
    productLinks: NavItem[];
    companyHeading: string;
    companyLinks: NavItem[];
    resourcesHeading: string;
    resourcesLinks: NavItem[];
    rights: string;
    tagline: string;
  };
}

export const ui: Record<Locale, UIStrings> = {
  en: {
    nav: [
      { label: "Product", href: "/product" },
      {
        label: "Industries",
        href: "/industries",
        children: [
          { label: "Retail Video Analytics", href: "/industries/retail-video-analytics" },
        ],
      },
      { label: "Pricing", href: "/pricing" },
      { label: "Compare", href: "/compare" },
      { label: "Learn", href: "/learn" },
    ],
    signIn: "Sign in",
    startTrial: "Start free trial",
    bookDemo: "Book a demo",
    watchDemo: "Watch overview",
    skipToContent: "Skip to content",
    footer: {
      productHeading: "Product",
      productLinks: [
        { label: "How it works", href: "/product" },
        { label: "Capabilities", href: "/product#capabilities" },
        { label: "Agentic AI", href: "/product#agentic" },
        { label: "Integrations", href: "/product#integrations" },
        { label: "Pricing", href: "/pricing" },
      ],
      companyHeading: "Company",
      companyLinks: [
        { label: "About", href: "/about" },
        { label: "Security & privacy", href: "/security" },
        { label: "Contact", href: "/contact" },
      ],
      resourcesHeading: "Resources",
      resourcesLinks: [
        { label: "Learn hub", href: "/learn" },
        { label: "Glossary", href: "/glossary" },
        { label: "Compare", href: "/compare" },
        { label: "FAQ", href: "/faq" },
      ],
      rights: "All rights reserved.",
      tagline: "Agentic AI video analytics on your existing CCTV. Built for every operation.",
    },
  },
  hi: {
    nav: [
      { label: "उत्पाद", href: "/product" },
      {
        label: "इंडस्ट्री",
        href: "/industries",
        children: [
          { label: "रिटेल वीडियो एनालिटिक्स", href: "/industries/retail-video-analytics" },
        ],
      },
      { label: "मूल्य", href: "/pricing" },
      { label: "तुलना", href: "/compare" },
      { label: "जानें", href: "/learn" },
    ],
    signIn: "साइन इन",
    startTrial: "मुफ़्त ट्रायल शुरू करें",
    bookDemo: "डेमो बुक करें",
    watchDemo: "ओवरव्यू देखें",
    skipToContent: "सामग्री पर जाएँ",
    footer: {
      productHeading: "उत्पाद",
      productLinks: [
        { label: "यह कैसे काम करता है", href: "/product" },
        { label: "क्षमताएँ", href: "/product#capabilities" },
        { label: "एजेंटिक AI", href: "/product#agentic" },
        { label: "इंटीग्रेशन", href: "/product#integrations" },
        { label: "मूल्य", href: "/pricing" },
      ],
      companyHeading: "कंपनी",
      companyLinks: [
        { label: "हमारे बारे में", href: "/about" },
        { label: "सुरक्षा और गोपनीयता", href: "/security" },
        { label: "संपर्क करें", href: "/contact" },
      ],
      resourcesHeading: "संसाधन",
      resourcesLinks: [
        { label: "लर्न हब", href: "/learn" },
        { label: "शब्दावली", href: "/glossary" },
        { label: "तुलना", href: "/compare" },
        { label: "सामान्य प्रश्न", href: "/faq" },
      ],
      rights: "सर्वाधिकार सुरक्षित।",
      tagline: "आपके मौजूदा CCTV पर एजेंटिक AI वीडियो एनालिटिक्स। हर संचालन के लिए।",
    },
  },
};
