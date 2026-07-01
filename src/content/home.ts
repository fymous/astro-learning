import type { Locale } from "../config";
import { BRAND, SITE_URL } from "../config";
import { BRAND_DEFAULTS, SITE_URL_DEFAULT } from "../brand";

export interface HomeContent {
  seo: { title: string; description: string };
  answer: string;
  facts: { title: string; items: { k: string; v: string }[] };
  hero: {
    eyebrow: string;
    titleLead: string;
    titleAccent: string;
    titleTail: string;
    sub: string;
    primaryCta: string;
    secondaryCta: string;
    trust: string;
  };
  trust: {
    eyebrow: string;
    title: string;
    titleAccent: string;
    sub: string;
    readiness: { title: string; body: string }[];
    logos: { name: string; category: string }[];
  };
  pillars: { icon: string; title: string; body: string }[];
  metrics: { value: string; label: string }[];
  scale: { eyebrow: string; title: string; items: { value: string; label: string }[] };
  industries: {
    eyebrow: string;
    title: string;
    sub: string;
    items: { slug: string; name: string; blurb: string; points: string[]; tone: "brand" | "signal" | "violet" }[];
  };
  ask: {
    eyebrow: string;
    title: string;
    titleAccent: string;
    sub: string;
    agentName: string;
    online: string;
    inputHint: string;
    exchanges: { q: string; a: string; kind: "stat" | "alert" | "clip"; value?: string; delta?: string; note?: string }[];
    rail: { tag: string; title: string; body: string }[];
  };
  liveAlerts: {
    eyebrow: string;
    title: string;
    titleAccent: string;
    sub: string;
    rail: { tag: string; title: string; body: string }[];
    panel: {
      title: string;
      sites: string;
      addRule: string;
      scenes: {
        industryIcon: string;
        site: string;
        kind: "rules" | "counters";
        rulesLabel?: string;
        rules?: { tone: string; icon: string; title: string; scope: string }[];
        countersLabel?: string;
        counters?: { label: string; value: string; delta: string }[];
        alert: { tone: string; chip: string; time: string; title: string; body: string };
      }[];
    };
  };
  capabilities: {
    eyebrow: string;
    title: string;
    sub: string;
    items: { tag: string; title: string; body: string }[];
  };
  how: {
    eyebrow: string;
    title: string;
    sub: string;
    steps: { n: string; title: string; body: string }[];
  };
  outcomes: {
    eyebrow: string;
    title: string;
    sub: string;
    items: { metric: string; label: string; icon: string }[];
    source: string;
  };
  integrations: { eyebrow: string; title: string; sub: string; items: string[] };
  privacy: {
    eyebrow: string;
    title: string;
    body: string;
    points: { icon: string; title: string; body: string }[];
  };
  cta: { eyebrow: string; title: string; sub: string; primary: string; secondary: string };
  contact: {
    eyebrow: string;
    title: string;
    sub: string;
    form: {
      name: string;
      email: string;
      phone: string;
      company: string;
      message: string;
      submit: string;
      consent: string;
    };
    demo: {
      title: string;
      sub: string;
      points: string[];
      cta: string;
      or: string;
      emailLabel: string;
      whatsappLabel: string;
    };
  };
  faq: { eyebrow: string; title: string; items: { q: string; a: string }[] };
  finalCta: { title: string; sub: string; primary: string; secondary: string };
}

/** Swap committed ShopEye template tokens for active brand at build time. */
function brandifyText(text: string): string {
  const defaultDomain = new URL(SITE_URL_DEFAULT).hostname;
  const activeDomain = new URL(SITE_URL).hostname;
  return text
    .replaceAll(BRAND_DEFAULTS.name, BRAND.name)
    .replaceAll(defaultDomain, activeDomain)
    .replaceAll(BRAND_DEFAULTS.slug, BRAND.slug);
}

function brandifyDeep<T>(value: T): T {
  if (typeof value === "string") return brandifyText(value) as T;
  if (Array.isArray(value)) return value.map((item) => brandifyDeep(item)) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, brandifyDeep(v)])) as T;
  }
  return value;
}

const homeContentRaw: Record<Locale, HomeContent> = {
  en: {
    seo: {
      title: "ShopEye — Agentic AI video analytics for retail, QSR, dark stores, manufacturing & more",
      description:
        "ShopEye turns your existing CCTV into real-time business intelligence across retail, consumer services, QSRs, dark stores, cloud kitchens, manufacturing, logistics and education. Footfall, conversion, safety, productivity and loss prevention — with conversational search and WhatsApp alerts. No new hardware.",
    },
    answer:
      "ShopEye is an India-native agentic AI video analytics platform that turns existing CCTV cameras into real-time business intelligence. Across retail, consumer services, QSRs, dark stores, cloud kitchens, manufacturing, logistics and education, it measures footfall, conversion, dwell time, queues and productivity, monitors SOP and PPE safety compliance, and detects theft and intrusion. Teams can ask questions in plain language and receive instant alerts on WhatsApp. It works with any existing IP camera, NVR or DVR — no new hardware.",
    facts: {
      title: "ShopEye at a glance",
      items: [
        { k: "Category", v: "Agentic AI video analytics" },
        { k: "HQ", v: "Bengaluru, India" },
        { k: "Industries", v: "Retail, Consumer Services, QSRs, Dark Stores, Cloud Kitchens, Manufacturing, Logistics, Education" },
        { k: "Works with", v: "Any IP camera, NVR or DVR (RTSP / ONVIF)" },
        { k: "Deployment", v: "Edge, cloud or hybrid" },
        { k: "Languages", v: "English & Hindi" },
        { k: "Alerts", v: "WhatsApp, Slack, Teams, SMS & email" },
        { k: "Privacy", v: "No identity capture · on-premise option" },
      ],
    },
    hero: {
      eyebrow: "Agentic AI video analytics",
      titleLead: "Turn every camera into a",
      titleAccent: "business intelligence",
      titleTail: "powerhouse.",
      sub: "ShopEye turns the cameras you already have into AI agents for your operations — across retail, QSRs, dark stores, cloud kitchens, manufacturing, logistics and more. Ask questions in plain language, monitor 24/7, and get instant WhatsApp alerts. No new hardware.",
      primaryCta: "Book a demo",
      secondaryCta: "Watch overview",
      trust: "Works with any IP camera, NVR or DVR — no rip-and-replace",
    },
    trust: {
      eyebrow: "Enterprise-ready",
      title: "Built to work with",
      titleAccent: "the stack you already run",
      sub: "No rip-and-replace. ShopEye runs on the cameras you already own and plugs into the tools your teams already use — with enterprise-grade security and privacy from day one.",
      readiness: [
        { title: "On-premise option", body: "Keep video and processing inside your own network." },
        { title: "Role-based access", body: "Granular, least-privilege permissions per user." },
        { title: "Full audit logs", body: "Every access and action is tracked and reviewable." },
        { title: "Encrypted end-to-end", body: "All video and data encrypted in transit and at rest." },
        { title: "No new hardware", body: "Works with any existing IP camera, NVR or DVR." },
      ],
      logos: [
        { name: "Hikvision", category: "Cameras" },
        { name: "CP Plus", category: "Cameras" },
        { name: "Dahua", category: "Cameras" },
        { name: "Axis", category: "Cameras" },
        { name: "Bosch", category: "Cameras" },
        { name: "Hanwha", category: "Cameras" },
        { name: "ONVIF", category: "Protocol" },
        { name: "RTSP", category: "Protocol" },
        { name: "NVR / DVR", category: "Recorders" },
        { name: "IP Cameras", category: "Hardware" },
        { name: "WhatsApp", category: "Alerts" },
        { name: "Slack", category: "Alerts" },
        { name: "MS Teams", category: "Alerts" },
        { name: "SMS & Email", category: "Alerts" },
        { name: "Power BI", category: "Analytics" },
        { name: "REST API", category: "Integration" },
        { name: "Webhooks", category: "Events" },
        { name: "POS Systems", category: "Retail" },
        { name: "AWS", category: "Cloud" },
        { name: "Azure", category: "Cloud" },
      ],
    },
    pillars: [
      { icon: "insight", title: "Sharper insights", body: "See everything and ask anything across every site — in real time, in plain language." },
      { icon: "revenue", title: "More revenue", body: "Turn footfall, queues and capacity into measurable conversions and sales." },
      { icon: "compliance", title: "Safer & compliant", body: "Automate SOP, PPE and safety checks on every shift, at every location." },
      { icon: "cost", title: "Lower costs", body: "Cut shrinkage, waste and the hours lost to watching a monitor wall." },
    ],
    metrics: [
      { value: "8", label: "industries served" },
      { value: "200+", label: "pre-built AI detections" },
      { value: "< 30s", label: "from incident to alert" },
      { value: "99.9%", label: "platform uptime" },
    ],
    scale: {
      eyebrow: "Proven in production",
      title: "Working across sites today",
      items: [
        { value: "75,000+", label: "Cameras analysed" },
        { value: "500+", label: "Facilities live" },
        { value: "30+", label: "Brands" },
        { value: "100+", label: "Use cases" },
      ],
    },
    industries: {
      eyebrow: "Industry solutions",
      title: "One platform, purpose-built for your industry",
      sub: "The same agentic engine, packaged with the detections, dashboards and alerts each operation actually needs.",
      items: [
        {
          slug: "retail",
          name: "Retail",
          blurb: "Convert footfall into revenue and stop shrinkage across every store.",
          points: ["Footfall, conversion & heatmaps", "Queue & checkout wait alerts", "Loss prevention & cashier fraud"],
          tone: "brand",
        },
        {
          slug: "consumer-services",
          name: "Consumer Services",
          blurb: "Salons, clinics, gyms and branches — manage walk-ins and service quality.",
          points: ["Walk-in & wait-time tracking", "Staff presence & service SOP", "Occupancy & branch security"],
          tone: "violet",
        },
        {
          slug: "qsr",
          name: "Restaurants & QSRs",
          blurb: "Protect guest experience and margins across premium dining and QSR outlets.",
          points: ["Counter & table wait alerts", "Kitchen hygiene & FSSAI SOP", "POS-linked billing oversight"],
          tone: "signal",
        },
        {
          slug: "dark-stores",
          name: "Dark Stores",
          blurb: "Hit quick-commerce SLAs with productive, safe fulfilment.",
          points: ["Pick & pack productivity", "Dispatch SLA & rider flow", "Shrinkage & safety"],
          tone: "brand",
        },
        {
          slug: "cloud-kitchens",
          name: "Cloud Kitchens",
          blurb: "Keep every kitchen hygienic, compliant and on-throughput.",
          points: ["Hygiene & PPE compliance", "Prep SOP & throughput", "Fire & smoke safety alerts"],
          tone: "signal",
        },
        {
          slug: "manufacturing",
          name: "Manufacturing",
          blurb: "Safer floors and higher output with always-on monitoring.",
          points: ["PPE & safety-zone compliance", "Line productivity & downtime", "Intrusion & hazard detection"],
          tone: "violet",
        },
        {
          slug: "logistics",
          name: "Logistics",
          blurb: "Optimise warehouses and yards with visual intelligence.",
          points: ["Dock & loading-bay utilisation", "Forklift & PPE safety", "Perimeter & intrusion"],
          tone: "brand",
        },
        {
          slug: "education",
          name: "Education",
          blurb: "Safer, smarter campuses from gate to classroom.",
          points: ["Attendance & access", "Restricted-zone & intrusion alerts", "Campus crowd & safety"],
          tone: "violet",
        },
      ],
    },
    ask: {
      eyebrow: "Agentic AI",
      title: "Talk to your cameras.",
      titleAccent: "Get answers.",
      sub: "ShopEye turns your camera feeds into agents you can talk to. Ask a question in plain English or Hindi, set up monitoring, and let the agent close the loop on WhatsApp — automatically.",
      agentName: "ShopEye Agent",
      online: "online",
      inputHint: "Ask about footfall, safety, queues, productivity…",
      exchanges: [
        {
          q: "How many people visited Store 12 today?",
          a: "1,284 visitors today at Store 12 — up 12% versus yesterday, peaking between 6 and 8 PM.",
          kind: "stat",
          value: "1,284",
          delta: "+12% vs yesterday",
        },
        {
          q: "Alert me if anyone enters cold storage after 10 PM.",
          a: "Done. I'll watch the cold-storage cameras and message you on WhatsApp the moment someone enters after 10 PM.",
          kind: "alert",
          note: "Alert created · WhatsApp · 3 cameras monitored",
        },
        {
          q: "Show PPE violations at the loading dock today.",
          a: "Found 5 PPE violations at the loading dock today — here's the most recent clip to review.",
          kind: "clip",
          note: "Dock A · 14:32 · 0:20",
        },
      ],
      rail: [
        { tag: "ASK", title: "Ask in plain language", body: "Question any site in English or Hindi — footfall, safety, queues, productivity or incidents. No dashboards to learn." },
        { tag: "MONITOR", title: "Agents watch 24/7", body: "Set up monitoring once and agents watch every camera around the clock, detecting only the events that matter to you." },
        { tag: "ACT", title: "Close the loop", body: "Verified alerts land on WhatsApp, Slack or Teams and can trigger workflows — no one glued to a monitor wall." },
      ],
    },
    liveAlerts: {
      eyebrow: "Real-time alerts",
      title: "Don't watch screens.",
      titleAccent: "Get pinged when it matters.",
      sub: "Set a rule in plain language. ShopEye agents watch every camera 24/7 and send clip-backed alerts to WhatsApp the moment something needs attention — queues, safety, service SLAs, or anything you care about.",
      rail: [
        { tag: "DEFINE", title: "Define the rule", body: "Pick a template or write it in plain language — 'queue > 5 customers', 'PPE missing', 'service > 60 min', 'after-hours motion'." },
        { tag: "WATCH", title: "Agents watch live", body: "Every camera, every second. Verified events only — agents filter false positives before alerting." },
        { tag: "PING", title: "Get pinged with proof", body: "Clip-backed alerts arrive on WhatsApp, Slack or Teams within 30 seconds. Reply to acknowledge or escalate." },
      ],
      panel: {
        title: "Live Operations",
        sites: "2 sites · live",
        addRule: "Create a new rule",
        scenes: [
          {
            industryIcon: "retail",
            site: "Shoppers Stop · Saket",
            kind: "rules",
            rulesLabel: "Active rules",
            rules: [
              { tone: "warn", icon: "queue", title: "Queue > 5 customers", scope: "Billing counters" },
              { tone: "danger", icon: "shield", title: "PPE missing", scope: "Loading dock" },
              { tone: "brand", icon: "clock", title: "Fitting room > 25 min", scope: "Apparel zones" },
            ],
            alert: { tone: "warn", chip: "QUEUE", time: "now", title: "Queue alert · Counter 2", body: "7 customers waiting · avg wait 3m 12s" },
          },
          {
            industryIcon: "consumer-services",
            site: "Naturals Salon · Bandra",
            kind: "counters",
            countersLabel: "Services today",
            counters: [
              { label: "Haircuts", value: "14", delta: "+3" },
              { label: "Shaves", value: "8", delta: "+1" },
              { label: "Hair colour", value: "5", delta: "" },
              { label: "Facials", value: "3", delta: "" },
            ],
            alert: { tone: "danger", chip: "SLA", time: "2m ago", title: "Service SLA · Chair 4", body: "Hair colour running 18 min over target" },
          },
        ],
      },
    },
    capabilities: {
      eyebrow: "Capabilities",
      title: "Everything your cameras could be telling you",
      sub: "200+ pre-built detections across people, behaviour, safety and operations — running on your existing feeds.",
      items: [
        { tag: "FOOTFALL", title: "Footfall & heatmaps", body: "Count people accurately and reveal hot and cold zones to optimise layout, staffing and flow." },
        { tag: "CONVERSION", title: "Conversion funnel", body: "Track the journey from entry to outcome and pinpoint exactly where you lose people." },
        { tag: "QUEUE", title: "Queue & wait time", body: "Detect long queues in real time and alert staff before customers walk away." },
        { tag: "DWELL", title: "Dwell & engagement", body: "Measure where people pause and engage to judge displays, signage and zones." },
        { tag: "SAFETY", title: "PPE & SOP compliance", body: "Verify helmets, masks, hairnets, uniforms and standard procedures across every shift." },
        { tag: "INTRUSION", title: "Intrusion & after-hours", body: "Motion in restricted zones or outside hours escalates instantly to WhatsApp and a call." },
        { tag: "LOSS_PREVENTION", title: "Loss prevention & theft", body: "Catch shrinkage, cashier fraud and unauthorised access — with the exact clip as proof." },
        { tag: "NL_SEARCH", title: "Natural-language search", body: "Ask “anyone without a helmet near the yard yesterday” and get the exact clips in seconds." },
        { tag: "ALERTS", title: "Multi-channel alerts", body: "Verified, clip-backed alerts on WhatsApp, Slack, Teams, SMS or email — wherever your team works." },
      ],
    },
    how: {
      eyebrow: "How it works",
      title: "Works with your existing infrastructure",
      sub: "No new cameras. Connect what you already have and start getting AI insights in minutes, not months.",
      steps: [
        { n: "1", title: "Cameras", body: "Connect existing IP or analog cameras via RTSP and ONVIF — indoors, outdoors, any brand." },
        { n: "2", title: "NVR / DVR", body: "Secure stream forwarding from your recorder. Nothing to rip out or replace." },
        { n: "3", title: "Edge or cloud", body: "Process on-prem for low latency or in the cloud to scale across thousands of sites." },
        { n: "4", title: "Dashboard", body: "Policies, real-time alerts, heatmaps and KPIs for every location in one place." },
        { n: "5", title: "Insights & actions", body: "Mobile, WhatsApp, Slack, Power BI, API and Excel exports — insight where you work." },
      ],
    },
    outcomes: {
      eyebrow: "The outcome",
      title: "Measurable impact across every operation",
      sub: "Teams using AI video analytics consistently move the metrics that matter — top line, compliance and cost.",
      items: [
        { metric: "45%", label: "higher conversion", icon: "revenue" },
        { metric: "50%", label: "increase in SOP compliance", icon: "compliance" },
        { metric: "60%", label: "faster incident response", icon: "speed" },
        { metric: "30%", label: "lower operational costs", icon: "cost" },
      ],
      source: "Benchmarks across video-analytics deployments (Deloitte, McKinsey, NRF, RetailNext).",
    },
    integrations: {
      eyebrow: "Fits your stack",
      title: "Works with what you already use",
      sub: "Your cameras, your messaging, your ERP and BI tools — connected, not replaced.",
      items: ["WhatsApp", "Slack", "Microsoft Teams", "Email & SMS", "POS systems", "SAP", "Power BI", "ServiceNow", "REST API", "IP Cameras", "NVR / DVR", "Webhooks"],
    },
    privacy: {
      eyebrow: "Privacy & security",
      title: "Behavioural intelligence — not surveillance of identity",
      body: "ShopEye analyses patterns and events, not personal identities. It is built privacy-first so you get the insight without the risk — and pass legal, IT and procurement review with ease.",
      points: [
        { icon: "no-id", title: "No identity capture", body: "We measure behaviour and events, not who people are. No facial recognition or personal profiles." },
        { icon: "onprem", title: "On-premise option", body: "Keep video and processing entirely inside your network to meet data-residency requirements." },
        { icon: "lock", title: "Encrypted end-to-end", body: "All video and data is encrypted in transit and at rest, with secure stream forwarding." },
        { icon: "rbac", title: "Role-based access", body: "Granular permissions ensure each person sees only what their role allows." },
        { icon: "audit", title: "Full audit logs", body: "Every access and action is logged for complete transparency and compliance reporting." },
        { icon: "retention", title: "Configurable retention", body: "You set how long footage and data are kept — aligned to your policy and the DPDP Act." },
      ],
    },
    cta: {
      eyebrow: "Ready to see it in action?",
      title: "See what your cameras have been missing.",
      sub: "Book a 30-minute walkthrough on your own footage. No new hardware, no rip-and-replace, no risk.",
      primary: "Book a demo",
      secondary: "Watch overview",
    },
    contact: {
      eyebrow: "Get started",
      title: "Talk to us — or see it live",
      sub: "Tell us about your sites and goals, and we'll show you exactly what ShopEye surfaces on your existing cameras.",
      form: {
        name: "Name",
        email: "Business email",
        phone: "Phone number",
        company: "Company name",
        message: "How can we help you?",
        submit: "Send message",
        consent: "By submitting, you agree to be contacted about ShopEye. We never share your details.",
      },
      demo: {
        title: "Book a live demo",
        sub: "A focused 30-minute session, tailored to your operation.",
        points: [
          "Live walkthrough on footage like yours",
          "Your top use-cases mapped to detections",
          "Deployment plan for your cameras & sites",
          "Indicative pricing and ROI estimate",
        ],
        cta: "Book a demo",
        or: "Or reach us directly",
        emailLabel: "Email",
        whatsappLabel: "WhatsApp",
      },
    },
    faq: {
      eyebrow: "FAQ",
      title: "What teams ask before they start",
      items: [
        {
          q: "What is AI video analytics?",
          a: "AI video analytics uses computer vision to turn ordinary CCTV footage into business intelligence — counting people, measuring behaviour and productivity, checking safety and SOP compliance, and detecting theft or intrusion. ShopEye does this on your existing cameras and delivers insights plus WhatsApp alerts.",
        },
        {
          q: "What is agentic AI video analytics?",
          a: "Agentic AI video analytics goes beyond dashboards. You ask questions in plain language, set up monitoring once, and AI agents watch your cameras 24/7 and act — sending verified, clip-backed alerts to WhatsApp, Slack or Teams. ShopEye is an agentic platform that turns existing CCTV into an always-on analyst you can simply talk to.",
        },
        {
          q: "What is footfall and conversion analytics?",
          a: "Footfall analytics counts how many people enter a location; conversion analytics tracks how many take a desired action such as a purchase, service or checkout. ShopEye measures both on your existing cameras and links them into a funnel — Visitors → Interested → Interacted → Billed — so you can see exactly where you lose people.",
        },
        {
          q: "Does it work with my existing cameras?",
          a: "Yes. ShopEye works with any existing IP or analog camera and NVR/DVR (Hikvision, CP Plus, Dahua, or any ONVIF device) over RTSP. There is no hardware overhaul — we turn the cameras you already have into intelligent sensors.",
        },
        {
          q: "Which industries do you serve?",
          a: "ShopEye serves retail, consumer services, QSRs, dark stores, cloud kitchens, manufacturing, logistics and education — each with pre-built detections, dashboards and alerts tailored to that operation.",
        },
        {
          q: "Can it run on-premise, in the cloud, or hybrid?",
          a: "Yes. ShopEye supports edge (on-premise) processing for low latency, cloud for scale, and hybrid deployments — so you can meet data-residency and performance needs across many sites.",
        },
        {
          q: "Is it privacy-compliant?",
          a: "ShopEye is privacy-first. It analyses behavioural patterns and events without capturing personal identity data, video can remain on-premise, and all access is encrypted, role-based and audit-logged.",
        },
        {
          q: "How fast are alerts and can it scale?",
          a: "Verified, clip-backed alerts reach you in under 30 seconds on WhatsApp, Slack or Teams. A unified dashboard scales across unlimited locations with SSO, API access and BI exports.",
        },
      ],
    },
    finalCta: {
      title: "See what your cameras have been missing.",
      sub: "Book a 30-minute demo on your own footage. No new hardware, no rip-and-replace, no risk.",
      primary: "Book a demo",
      secondary: "Talk to sales",
    },
  },

  hi: {
    seo: {
      title: "ShopEye — रिटेल, QSR, डार्क स्टोर, मैन्युफैक्चरिंग और बहुत कुछ के लिए एजेंटिक AI वीडियो एनालिटिक्स",
      description:
        "ShopEye आपके मौजूदा CCTV को रिटेल, कंज़्यूमर सर्विसेज़, QSR, डार्क स्टोर, क्लाउड किचन, मैन्युफैक्चरिंग, लॉजिस्टिक्स और शिक्षा में रियल-टाइम बिज़नेस इंटेलिजेंस में बदलता है। फुटफॉल, कन्वर्शन, सुरक्षा, उत्पादकता और लॉस प्रिवेंशन — संवादात्मक खोज और व्हाट्सऐप अलर्ट के साथ। नया हार्डवेयर नहीं।",
    },
    answer:
      "ShopEye एक भारत-केंद्रित एजेंटिक AI वीडियो एनालिटिक्स प्लेटफ़ॉर्म है जो मौजूदा CCTV कैमरों को रियल-टाइम बिज़नेस इंटेलिजेंस में बदलता है। रिटेल, कंज़्यूमर सर्विसेज़, QSR, डार्क स्टोर, क्लाउड किचन, मैन्युफैक्चरिंग, लॉजिस्टिक्स और शिक्षा में यह फुटफॉल, कन्वर्शन, ड्वेल टाइम, कतार और उत्पादकता मापता है, SOP और PPE सुरक्षा अनुपालन की निगरानी करता है, और चोरी तथा घुसपैठ पकड़ता है। टीमें सादी भाषा में सवाल पूछ सकती हैं और व्हाट्सऐप पर तुरंत अलर्ट पा सकती हैं। यह किसी भी मौजूदा IP कैमरे, NVR या DVR के साथ काम करता है — नया हार्डवेयर नहीं।",
    facts: {
      title: "एक नज़र में ShopEye",
      items: [
        { k: "श्रेणी", v: "एजेंटिक AI वीडियो एनालिटिक्स" },
        { k: "मुख्यालय", v: "बेंगलुरु, भारत" },
        { k: "इंडस्ट्री", v: "रिटेल, कंज़्यूमर सर्विसेज़, QSR, डार्क स्टोर, क्लाउड किचन, मैन्युफैक्चरिंग, लॉजिस्टिक्स, शिक्षा" },
        { k: "संगत", v: "कोई भी IP कैमरा, NVR या DVR (RTSP / ONVIF)" },
        { k: "परिनियोजन", v: "एज, क्लाउड या हाइब्रिड" },
        { k: "भाषाएँ", v: "अंग्रेज़ी और हिंदी" },
        { k: "अलर्ट", v: "व्हाट्सऐप, स्लैक, टीम्स, SMS और ईमेल" },
        { k: "गोपनीयता", v: "पहचान कैप्चर नहीं · ऑन-प्रिमाइस विकल्प" },
      ],
    },
    hero: {
      eyebrow: "एजेंटिक AI वीडियो एनालिटिक्स",
      titleLead: "हर कैमरे को बनाएँ एक",
      titleAccent: "बिज़नेस इंटेलिजेंस",
      titleTail: "पावरहाउस।",
      sub: "ShopEye आपके मौजूदा कैमरों को आपके संचालन के लिए AI एजेंट में बदलता है — रिटेल, QSR, डार्क स्टोर, क्लाउड किचन, मैन्युफैक्चरिंग, लॉजिस्टिक्स और अधिक में। सादी भाषा में पूछें, 24/7 निगरानी करें, और तुरंत व्हाट्सऐप अलर्ट पाएँ। नया हार्डवेयर नहीं।",
      primaryCta: "डेमो बुक करें",
      secondaryCta: "ओवरव्यू देखें",
      trust: "किसी भी IP कैमरे, NVR या DVR के साथ — कुछ बदलने की ज़रूरत नहीं",
    },
    trust: {
      eyebrow: "एंटरप्राइज़-रेडी",
      title: "आपके मौजूदा सिस्टम के",
      titleAccent: "साथ काम करने के लिए बना",
      sub: "कोई रिप-एंड-रिप्लेस नहीं। ShopEye आपके मौजूदा कैमरों पर चलता है और उन्हीं टूल्स से जुड़ता है जो आपकी टीमें पहले से इस्तेमाल करती हैं — पहले दिन से एंटरप्राइज-ग्रेड सुरक्षा और गोपनीयता के साथ।",
      readiness: [
        { title: "ऑन-प्रिमाइस विकल्प", body: "वीडियो और प्रोसेसिंग को अपने नेटवर्क के अंदर रखें।" },
        { title: "रोल-आधारित एक्सेस", body: "हर यूज़र के लिए सूक्ष्म, न्यूनतम-विशेषाधिकार अनुमतियाँ।" },
        { title: "पूर्ण ऑडिट लॉग", body: "हर एक्सेस और कार्रवाई ट्रैक व समीक्षा-योग्य।" },
        { title: "एंड-टू-एंड एन्क्रिप्शन", body: "सभी वीडियो व डेटा ट्रांज़िट और रेस्ट दोनों में एन्क्रिप्टेड।" },
        { title: "कोई नया हार्डवेयर नहीं", body: "किसी भी मौजूदा IP कैमरा, NVR या DVR के साथ काम करता है।" },
      ],
      logos: [
        { name: "Hikvision", category: "कैमरे" },
        { name: "CP Plus", category: "कैमरे" },
        { name: "Dahua", category: "कैमरे" },
        { name: "Axis", category: "कैमरे" },
        { name: "Bosch", category: "कैमरे" },
        { name: "Hanwha", category: "कैमरे" },
        { name: "ONVIF", category: "प्रोटोकॉल" },
        { name: "RTSP", category: "प्रोटोकॉल" },
        { name: "NVR / DVR", category: "रिकॉर्डर" },
        { name: "IP Cameras", category: "हार्डवेयर" },
        { name: "WhatsApp", category: "अलर्ट" },
        { name: "Slack", category: "अलर्ट" },
        { name: "MS Teams", category: "अलर्ट" },
        { name: "SMS & Email", category: "अलर्ट" },
        { name: "Power BI", category: "एनालिटिक्स" },
        { name: "REST API", category: "इंटीग्रेशन" },
        { name: "Webhooks", category: "इवेंट्स" },
        { name: "POS Systems", category: "रिटेल" },
        { name: "AWS", category: "क्लाउड" },
        { name: "Azure", category: "क्लाउड" },
      ],
    },
    pillars: [
      { icon: "insight", title: "तेज़ इनसाइट्स", body: "हर साइट पर रियल-टाइम में, सादी भाषा में सब देखें और कुछ भी पूछें।" },
      { icon: "revenue", title: "अधिक राजस्व", body: "फुटफॉल, कतार और क्षमता को मापने योग्य कन्वर्शन व बिक्री में बदलें।" },
      { icon: "compliance", title: "सुरक्षित और अनुपालक", body: "हर शिफ्ट में, हर जगह SOP, PPE और सुरक्षा जाँच स्वचालित करें।" },
      { icon: "cost", title: "कम लागत", body: "चोरी, बर्बादी और मॉनिटर देखने में लगने वाले घंटे घटाएँ।" },
    ],
    metrics: [
      { value: "8", label: "इंडस्ट्री सेवित" },
      { value: "200+", label: "तैयार AI डिटेक्शन" },
      { value: "< 30s", label: "घटना से अलर्ट तक" },
      { value: "99.9%", label: "प्लेटफ़ॉर्म अपटाइम" },
    ],
    scale: {
      eyebrow: "प्रोडक्शन में सिद्ध",
      title: "आज कई साइट्स पर सक्रिय",
      items: [
        { value: "75,000+", label: "कैमरे विश्लेषित" },
        { value: "500+", label: "लाइव सुविधाएँ" },
        { value: "30+", label: "ब्रांड्स" },
        { value: "100+", label: "यूज़ केस" },
      ],
    },
    industries: {
      eyebrow: "इंडस्ट्री समाधान",
      title: "एक प्लेटफ़ॉर्म, आपकी इंडस्ट्री के लिए ख़ास बना",
      sub: "वही एजेंटिक इंजन, उन डिटेक्शन, डैशबोर्ड और अलर्ट के साथ जो हर संचालन को वाकई चाहिए।",
      items: [
        { slug: "retail", name: "रिटेल", blurb: "फुटफॉल को राजस्व में बदलें और हर स्टोर में चोरी रोकें।", points: ["फुटफॉल, कन्वर्शन और हीटमैप", "कतार और चेकआउट प्रतीक्षा अलर्ट", "लॉस प्रिवेंशन और कैशियर धोखाधड़ी"], tone: "brand" },
        { slug: "consumer-services", name: "कंज़्यूमर सर्विसेज़", blurb: "सैलून, क्लीनिक, जिम और ब्रांच — वॉक-इन और सेवा गुणवत्ता संभालें।", points: ["वॉक-इन और प्रतीक्षा-समय ट्रैकिंग", "स्टाफ़ उपस्थिति और सेवा SOP", "ऑक्यूपेंसी और ब्रांच सुरक्षा"], tone: "violet" },
        { slug: "qsr", name: "रेस्टोरेंट और QSR", blurb: "प्रीमियम डाइनिंग और QSR आउटलेट में अनुभव और मार्जिन सुरक्षित रखें।", points: ["काउंटर और टेबल प्रतीक्षा अलर्ट", "किचन स्वच्छता और FSSAI SOP", "POS-लिंक्ड बिलिंग निगरानी"], tone: "signal" },
        { slug: "dark-stores", name: "डार्क स्टोर", blurb: "उत्पादक, सुरक्षित फ़ुलफ़िलमेंट से क्विक-कॉमर्स SLA पूरे करें।", points: ["पिक और पैक उत्पादकता", "डिस्पैच SLA और राइडर फ़्लो", "चोरी और सुरक्षा"], tone: "brand" },
        { slug: "cloud-kitchens", name: "क्लाउड किचन", blurb: "हर किचन को स्वच्छ, अनुपालक और थ्रूपुट पर रखें।", points: ["स्वच्छता और PPE अनुपालन", "प्रेप SOP और थ्रूपुट", "आग और धुआँ सुरक्षा अलर्ट"], tone: "signal" },
        { slug: "manufacturing", name: "मैन्युफैक्चरिंग", blurb: "हमेशा-चालू निगरानी से सुरक्षित फ़्लोर और अधिक उत्पादन।", points: ["PPE और सुरक्षा-ज़ोन अनुपालन", "लाइन उत्पादकता और डाउनटाइम", "घुसपैठ और ख़तरा पहचान"], tone: "violet" },
        { slug: "logistics", name: "लॉजिस्टिक्स", blurb: "विज़ुअल इंटेलिजेंस से वेयरहाउस और यार्ड अनुकूलित करें।", points: ["डॉक और लोडिंग-बे उपयोग", "फोर्कलिफ्ट और PPE सुरक्षा", "परिधि और घुसपैठ"], tone: "brand" },
        { slug: "education", name: "शिक्षा", blurb: "गेट से क्लासरूम तक सुरक्षित, स्मार्ट कैंपस।", points: ["उपस्थिति और एक्सेस", "प्रतिबंधित-ज़ोन और घुसपैठ अलर्ट", "कैंपस भीड़ और सुरक्षा"], tone: "violet" },
      ],
    },
    ask: {
      eyebrow: "एजेंटिक AI",
      title: "अपने कैमरों से बात करें।",
      titleAccent: "जवाब पाएँ।",
      sub: "ShopEye आपके कैमरा फ़ीड को ऐसे एजेंट में बदलता है जिनसे आप बात कर सकते हैं। सादी हिंदी या अंग्रेज़ी में सवाल पूछें, मॉनिटरिंग सेट करें, और एजेंट को व्हाट्सऐप पर लूप बंद करने दें — अपने-आप।",
      agentName: "ShopEye एजेंट",
      online: "ऑनलाइन",
      inputHint: "फुटफॉल, सुरक्षा, कतार, उत्पादकता के बारे में पूछें…",
      exchanges: [
        { q: "स्टोर 12 में आज कितने लोग आए?", a: "स्टोर 12 में आज 1,284 विज़िटर — कल से 12% ज़्यादा, शाम 6 से 8 बजे सबसे ज़्यादा।", kind: "stat", value: "1,284", delta: "+12% कल से" },
        { q: "रात 10 बजे के बाद कोई कोल्ड स्टोरेज में आए तो अलर्ट करें।", a: "हो गया। मैं कोल्ड-स्टोरेज कैमरों पर नज़र रखूँगा और रात 10 बजे के बाद किसी के आते ही व्हाट्सऐप पर संदेश भेजूँगा।", kind: "alert", note: "अलर्ट बनाया गया · व्हाट्सऐप · 3 कैमरे" },
        { q: "आज लोडिंग डॉक पर PPE उल्लंघन दिखाओ।", a: "आज लोडिंग डॉक पर 5 PPE उल्लंघन मिले — समीक्षा के लिए नवीनतम क्लिप यह रही।", kind: "clip", note: "डॉक A · 14:32 · 0:20" },
      ],
      rail: [
        { tag: "ASK", title: "सादी भाषा में पूछें", body: "किसी भी साइट से हिंदी या अंग्रेज़ी में सवाल करें — फुटफॉल, सुरक्षा, कतार, उत्पादकता या घटनाएँ। कोई डैशबोर्ड सीखने की ज़रूरत नहीं।" },
        { tag: "MONITOR", title: "एजेंट 24/7 नज़र रखते हैं", body: "एक बार मॉनिटरिंग सेट करें और एजेंट हर कैमरे पर चौबीसों घंटे नज़र रखते हैं, केवल वही घटनाएँ पकड़ते हैं जो मायने रखती हैं।" },
        { tag: "ACT", title: "लूप बंद करें", body: "पुष्ट अलर्ट व्हाट्सऐप, स्लैक या टीम्स पर आते हैं और वर्कफ़्लो ट्रिगर कर सकते हैं — किसी को मॉनिटर पर नज़र गड़ाए रखने की ज़रूरत नहीं।" },
      ],
    },
    liveAlerts: {
      eyebrow: "रियल-टाइम अलर्ट",
      title: "मॉनिटर मत देखो।",
      titleAccent: "ज़रूरी पल में पिंग पाओ।",
      sub: "सादी भाषा में नियम सेट करें। ShopEye एजेंट हर कैमरे पर 24/7 नज़र रखते हैं और जैसे ही ध्यान चाहिए — कतार, सुरक्षा, सेवा SLA या जो भी आपको मायने रखे — व्हाट्सऐप पर क्लिप-समर्थित अलर्ट भेजते हैं।",
      rail: [
        { tag: "DEFINE", title: "नियम तय करें", body: "टेम्पलेट चुनें या सादी भाषा में लिखें — 'कतार > 5 ग्राहक', 'PPE गायब', 'सेवा > 60 मिनट', 'घंटे के बाद हलचल'।" },
        { tag: "WATCH", title: "एजेंट लाइव देखते हैं", body: "हर कैमरा, हर सेकंड। केवल पुष्ट घटनाएँ — एजेंट अलर्ट से पहले गलत-पॉज़िटिव छानते हैं।" },
        { tag: "PING", title: "सबूत के साथ अलर्ट", body: "क्लिप-समर्थित अलर्ट 30 सेकंड के अंदर व्हाट्सऐप, स्लैक या टीम्स पर पहुँचते हैं।" },
      ],
      panel: {
        title: "लाइव ऑपरेशंस",
        sites: "2 साइट · लाइव",
        addRule: "नया नियम बनाएँ",
        scenes: [
          {
            industryIcon: "retail",
            site: "Shoppers Stop · साकेत",
            kind: "rules",
            rulesLabel: "सक्रिय नियम",
            rules: [
              { tone: "warn", icon: "queue", title: "कतार > 5 ग्राहक", scope: "बिलिंग काउंटर" },
              { tone: "danger", icon: "shield", title: "PPE गायब", scope: "लोडिंग डॉक" },
              { tone: "brand", icon: "clock", title: "फिटिंग रूम > 25 मि", scope: "अपैरल ज़ोन" },
            ],
            alert: { tone: "warn", chip: "QUEUE", time: "अभी", title: "कतार अलर्ट · काउंटर 2", body: "7 ग्राहक प्रतीक्षारत · औसत 3m 12s" },
          },
          {
            industryIcon: "consumer-services",
            site: "Naturals Salon · बांद्रा",
            kind: "counters",
            countersLabel: "आज की सेवाएँ",
            counters: [
              { label: "हेयरकट", value: "14", delta: "+3" },
              { label: "शेव", value: "8", delta: "+1" },
              { label: "हेयर कलर", value: "5", delta: "" },
              { label: "फेशियल", value: "3", delta: "" },
            ],
            alert: { tone: "danger", chip: "SLA", time: "2 मि पहले", title: "सेवा SLA · चेयर 4", body: "हेयर कलर 18 मिनट से अधिक चल रहा" },
          },
        ],
      },
    },
    capabilities: {
      eyebrow: "क्षमताएँ",
      title: "वह सब जो आपके कैमरे आपको बता सकते हैं",
      sub: "लोगों, व्यवहार, सुरक्षा और संचालन में 200+ तैयार डिटेक्शन — आपके मौजूदा फ़ीड पर चलते हुए।",
      items: [
        { tag: "FOOTFALL", title: "फुटफॉल और हीटमैप", body: "लोगों की सटीक गिनती करें और लेआउट, स्टाफ़िंग व फ़्लो के लिए हॉट/कोल्ड ज़ोन दिखाएँ।" },
        { tag: "CONVERSION", title: "कन्वर्शन फ़नल", body: "प्रवेश से परिणाम तक यात्रा ट्रैक करें और जानें आप कहाँ लोग खोते हैं।" },
        { tag: "QUEUE", title: "कतार और प्रतीक्षा समय", body: "रियल-टाइम में लंबी कतारें पहचानें और ग्राहक के जाने से पहले स्टाफ़ को अलर्ट करें।" },
        { tag: "DWELL", title: "ड्वेल और एंगेजमेंट", body: "मापें लोग कहाँ रुकते और जुड़ते हैं ताकि डिस्प्ले, साइनेज और ज़ोन परखें।" },
        { tag: "SAFETY", title: "PPE और SOP अनुपालन", body: "हेलमेट, मास्क, हेयरनेट, यूनिफ़ॉर्म और मानक प्रक्रियाएँ हर शिफ्ट में जाँचें।" },
        { tag: "INTRUSION", title: "घुसपैठ और गैर-समय", body: "प्रतिबंधित ज़ोन या समय के बाहर हलचल तुरंत व्हाट्सऐप और कॉल पर बढ़े।" },
        { tag: "LOSS_PREVENTION", title: "लॉस प्रिवेंशन और चोरी", body: "चोरी, कैशियर धोखाधड़ी और अनधिकृत पहुँच पकड़ें — सबूत के रूप में सही क्लिप के साथ।" },
        { tag: "NL_SEARCH", title: "नैचुरल-लैंग्वेज खोज", body: "“कल यार्ड के पास बिना हेलमेट कोई” पूछें और सेकंडों में सटीक क्लिप पाएँ।" },
        { tag: "ALERTS", title: "मल्टी-चैनल अलर्ट", body: "व्हाट्सऐप, स्लैक, टीम्स, SMS या ईमेल पर पुष्ट, क्लिप-समर्थित अलर्ट — जहाँ आपकी टीम काम करती है।" },
      ],
    },
    how: {
      eyebrow: "यह कैसे काम करता है",
      title: "आपके मौजूदा इंफ्रास्ट्रक्चर के साथ काम करता है",
      sub: "कोई नया कैमरा नहीं। जो आपके पास है उसे जोड़ें और महीनों नहीं, मिनटों में AI इनसाइट पाना शुरू करें।",
      steps: [
        { n: "1", title: "कैमरे", body: "मौजूदा IP या एनालॉग कैमरे RTSP और ONVIF पर जोड़ें — इनडोर, आउटडोर, किसी भी ब्रांड के।" },
        { n: "2", title: "NVR / DVR", body: "आपके रिकॉर्डर से सुरक्षित स्ट्रीम फ़ॉरवर्डिंग। कुछ हटाने या बदलने की ज़रूरत नहीं।" },
        { n: "3", title: "एज या क्लाउड", body: "कम लेटेंसी के लिए ऑन-प्रेम या हज़ारों साइट तक स्केल के लिए क्लाउड पर प्रोसेस करें।" },
        { n: "4", title: "डैशबोर्ड", body: "हर स्थान के लिए पॉलिसी, रियल-टाइम अलर्ट, हीटमैप और KPI एक जगह।" },
        { n: "5", title: "इनसाइट्स और कार्रवाई", body: "मोबाइल, व्हाट्सऐप, स्लैक, Power BI, API और Excel एक्सपोर्ट — जहाँ आप काम करते हैं।" },
      ],
    },
    outcomes: {
      eyebrow: "नतीजा",
      title: "हर संचालन में मापने योग्य असर",
      sub: "AI वीडियो एनालिटिक्स उपयोग करने वाली टीमें वही मेट्रिक्स बेहतर करती हैं जो मायने रखती हैं — राजस्व, अनुपालन और लागत।",
      items: [
        { metric: "45%", label: "रिटेल में अधिक कन्वर्शन", icon: "revenue" },
        { metric: "50%", label: "SOP अनुपालन में वृद्धि", icon: "compliance" },
        { metric: "60%", label: "तेज़ इंसिडेंट रिस्पॉन्स", icon: "speed" },
        { metric: "30%", label: "कम संचालन लागत", icon: "cost" },
      ],
      source: "वीडियो-एनालिटिक्स परिनियोजन से बेंचमार्क (Deloitte, McKinsey, NRF, RetailNext)।",
    },
    integrations: {
      eyebrow: "आपके स्टैक में फ़िट",
      title: "जो आप पहले से उपयोग करते हैं, उसी के साथ काम करता है",
      sub: "आपके कैमरे, आपका मैसेजिंग, आपका ERP और BI टूल — जुड़े हुए, बदले नहीं गए।",
      items: ["WhatsApp", "Slack", "Microsoft Teams", "Email & SMS", "POS सिस्टम", "SAP", "Power BI", "ServiceNow", "REST API", "IP कैमरे", "NVR / DVR", "Webhooks"],
    },
    privacy: {
      eyebrow: "गोपनीयता और सुरक्षा",
      title: "व्यवहारिक इंटेलिजेंस — पहचान की निगरानी नहीं",
      body: "ShopEye पैटर्न और घटनाएँ विश्लेषित करता है, व्यक्तिगत पहचान नहीं। यह गोपनीयता-प्रथम बना है — इसलिए आपको जोखिम के बिना इनसाइट मिलती है और कानूनी, IT व प्रोक्योरमेंट समीक्षा आसानी से पास होती है।",
      points: [
        { icon: "no-id", title: "पहचान कैप्चर नहीं", body: "हम व्यवहार और घटनाएँ मापते हैं, लोग कौन हैं यह नहीं। कोई फेशियल रिकग्निशन या व्यक्तिगत प्रोफ़ाइल नहीं।" },
        { icon: "onprem", title: "ऑन-प्रिमाइस विकल्प", body: "डेटा-रेज़िडेंसी आवश्यकताओं हेतु वीडियो और प्रोसेसिंग पूरी तरह आपके नेटवर्क के भीतर रखें।" },
        { icon: "lock", title: "एंड-टू-एंड एन्क्रिप्टेड", body: "सभी वीडियो और डेटा ट्रांज़िट व रेस्ट में एन्क्रिप्टेड, सुरक्षित स्ट्रीम फ़ॉरवर्डिंग के साथ।" },
        { icon: "rbac", title: "रोल-आधारित एक्सेस", body: "सूक्ष्म अनुमतियाँ सुनिश्चित करती हैं कि हर व्यक्ति केवल अपनी भूमिका अनुसार देखे।" },
        { icon: "audit", title: "पूर्ण ऑडिट लॉग", body: "हर एक्सेस और कार्रवाई लॉग होती है — पूर्ण पारदर्शिता और अनुपालन रिपोर्टिंग के लिए।" },
        { icon: "retention", title: "विन्यास-योग्य रिटेंशन", body: "फुटेज और डेटा कितने समय रखे जाएँ यह आप तय करें — आपकी नीति और DPDP अधिनियम अनुसार।" },
      ],
    },
    cta: {
      eyebrow: "इसे क्रिया में देखने को तैयार?",
      title: "देखें आपके कैमरे अब तक क्या छोड़ रहे थे।",
      sub: "अपने ही फुटेज पर 30-मिनट का वॉकथ्रू बुक करें। कोई नया हार्डवेयर नहीं, कोई बदलाव नहीं, कोई जोखिम नहीं।",
      primary: "डेमो बुक करें",
      secondary: "ओवरव्यू देखें",
    },
    contact: {
      eyebrow: "शुरू करें",
      title: "हमसे बात करें — या लाइव देखें",
      sub: "अपने साइट्स और लक्ष्यों के बारे में बताएँ, और हम दिखाएँगे कि ShopEye आपके मौजूदा कैमरों पर वास्तव में क्या सामने लाता है।",
      form: {
        name: "नाम",
        email: "बिज़नेस ईमेल",
        phone: "फ़ोन नंबर",
        company: "कंपनी का नाम",
        message: "हम आपकी कैसे मदद कर सकते हैं?",
        submit: "संदेश भेजें",
        consent: "सबमिट करके, आप ShopEye के बारे में संपर्क किए जाने हेतु सहमत हैं। हम आपकी जानकारी साझा नहीं करते।",
      },
      demo: {
        title: "लाइव डेमो बुक करें",
        sub: "आपके संचालन अनुसार एक केंद्रित 30-मिनट सत्र।",
        points: [
          "आपके जैसे फुटेज पर लाइव वॉकथ्रू",
          "आपके प्रमुख उपयोग-मामले डिटेक्शन से मैप",
          "आपके कैमरों व साइट्स हेतु डिप्लॉयमेंट योजना",
          "अनुमानित मूल्य और ROI आकलन",
        ],
        cta: "डेमो बुक करें",
        or: "या सीधे संपर्क करें",
        emailLabel: "ईमेल",
        whatsappLabel: "व्हाट्सऐप",
      },
    },
    faq: {
      eyebrow: "सामान्य प्रश्न",
      title: "शुरू करने से पहले टीमें क्या पूछती हैं",
      items: [
        { q: "AI वीडियो एनालिटिक्स क्या है?", a: "AI वीडियो एनालिटिक्स कंप्यूटर विज़न से सामान्य CCTV फुटेज को बिज़नेस इंटेलिजेंस में बदलता है — लोगों की गिनती, व्यवहार और उत्पादकता मापना, सुरक्षा व SOP अनुपालन जाँचना, और चोरी या घुसपैठ पकड़ना। ShopEye यह आपके मौजूदा कैमरों पर करता है और इनसाइट्स तथा व्हाट्सऐप अलर्ट देता है।" },
        { q: "एजेंटिक AI वीडियो एनालिटिक्स क्या है?", a: "एजेंटिक AI वीडियो एनालिटिक्स डैशबोर्ड से आगे जाता है। आप सादी भाषा में सवाल पूछते हैं, एक बार मॉनिटरिंग सेट करते हैं, और AI एजेंट आपके कैमरों पर 24/7 नज़र रखते हैं और कार्रवाई करते हैं — पुष्ट, क्लिप-समर्थित अलर्ट व्हाट्सऐप, स्लैक या टीम्स पर भेजते हैं। ShopEye एक एजेंटिक प्लेटफ़ॉर्म है जो मौजूदा CCTV को एक हमेशा-चालू एनालिस्ट में बदलता है जिससे आप बस बात कर सकते हैं।" },
        { q: "फुटफॉल और कन्वर्शन एनालिटिक्स क्या है?", a: "फुटफॉल एनालिटिक्स गिनता है कि किसी स्थान में कितने लोग आए; कन्वर्शन एनालिटिक्स ट्रैक करता है कि कितनों ने वांछित कार्य किया — जैसे ख़रीद, सेवा या चेकआउट। ShopEye दोनों को आपके मौजूदा कैमरों पर मापता है और उन्हें एक फ़नल में जोड़ता है — विज़िटर → रुचि → संपर्क → बिल — ताकि आप ठीक-ठीक देख सकें कि लोग कहाँ छूटते हैं।" },
        { q: "क्या यह मेरे मौजूदा कैमरों के साथ काम करता है?", a: "हाँ। ShopEye किसी भी मौजूदा IP या एनालॉग कैमरे और NVR/DVR (Hikvision, CP Plus, Dahua या किसी ONVIF डिवाइस) के साथ RTSP पर काम करता है। कोई हार्डवेयर बदलाव नहीं।" },
        { q: "आप कौन-सी इंडस्ट्री सेवा देते हैं?", a: "ShopEye रिटेल, कंज़्यूमर सर्विसेज़, QSR, डार्क स्टोर, क्लाउड किचन, मैन्युफैक्चरिंग, लॉजिस्टिक्स और शिक्षा को सेवा देता है — हर एक के लिए तैयार डिटेक्शन, डैशबोर्ड और अलर्ट के साथ।" },
        { q: "क्या यह ऑन-प्रिमाइस, क्लाउड या हाइब्रिड चल सकता है?", a: "हाँ। ShopEye कम लेटेंसी के लिए एज (ऑन-प्रिमाइस), स्केल के लिए क्लाउड, और हाइब्रिड परिनियोजन का समर्थन करता है।" },
        { q: "क्या यह गोपनीयता-अनुपालक है?", a: "ShopEye गोपनीयता-प्रथम है। यह व्यक्तिगत पहचान डेटा कैप्चर किए बिना व्यवहारिक पैटर्न और घटनाएँ विश्लेषित करता है, वीडियो ऑन-प्रिमाइस रह सकता है, और सभी एक्सेस एन्क्रिप्टेड, रोल-आधारित और ऑडिट-लॉग होता है।" },
        { q: "अलर्ट कितने तेज़ हैं और क्या यह स्केल करता है?", a: "पुष्ट, क्लिप-समर्थित अलर्ट 30 सेकंड से कम में व्हाट्सऐप, स्लैक या टीम्स पर पहुँचते हैं। एकीकृत डैशबोर्ड SSO, API एक्सेस और BI एक्सपोर्ट के साथ असीमित स्थानों तक स्केल करता है।" },
      ],
    },
    finalCta: {
      title: "देखें आपके कैमरे अब तक क्या चूक रहे थे।",
      sub: "अपनी ही फुटेज पर 30-मिनट का डेमो बुक करें। न नया हार्डवेयर, न कुछ बदलना, न जोखिम।",
      primary: "डेमो बुक करें",
      secondary: "सेल्स से बात करें",
    },
  },
};

export const homeContent = brandifyDeep(homeContentRaw);
