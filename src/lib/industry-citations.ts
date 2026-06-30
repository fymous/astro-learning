/**
 * Curated outbound citations for industry pages — contextual, high-trust sources
 * that support E-E-A-T and give answer engines verifiable anchors. Each citation
 * must match the vertical (no copy-paste across industries).
 */
export interface IndustryCitation {
  /** Sentence body after the linked source name */
  text: string;
  source: string;
  href: string;
}

export const retailCitations: IndustryCitation[] = [
  {
    source: "National Retail Federation",
    href: "https://nrf.com/research/national-retail-security-survey-2023",
    text: "retail shrink reached $112.1 billion in 2022 in the U.S. alone — making camera-based loss prevention and behavioural analytics a priority for store operators protecting margins.",
  },
  {
    source: "Omdia",
    href: "https://www.briefcam.com/company/press-releases/omdia-leading-market-research-firm-reveals-significant-bottom-line-returns-in-video-analytics-investments/",
    text: "found that over 85% of organisations achieve ROI from video analytics within one year — a benchmark retail chains use when evaluating footfall, queue and conversion analytics on existing CCTV.",
  },
];

export const logisticsCitations: IndustryCitation[] = [
  {
    source: "National Safety Council",
    href: "https://injuryfacts.nsc.org/work/safety-topics/roadway-incidents/",
    text: "reports that transportation incidents accounted for 38% of U.S. workplace deaths in 2024 — underscoring why AI-powered dock, yard and MHE safety monitoring is critical for warehouse and fleet operators.",
  },
  {
    source: "OSHA",
    href: "https://www.osha.gov/warehousing",
    text: "identifies forklifts, loading docks and conveyors among the leading hazards in warehousing — the same physical workflows video analytics monitors for PPE gaps, crowding and mishandling.",
  },
];

export const manufacturingCitations: IndustryCitation[] = [
  {
    source: "OSHA",
    href: "https://www.osha.gov/data/commonstats/",
    text: "tracks manufacturing among the sectors with the highest rates of severe workplace injuries — driving demand for continuous PPE, machine-guard and safety-zone monitoring beyond periodic audits.",
  },
  {
    source: "National Safety Council",
    href: "https://injuryfacts.nsc.org/work/work-overview/work-safety-introduction/",
    text: "estimates 3.95 million medically consulted work injuries in 2024 in the U.S. — a scale that pushes plant leaders toward 24/7 visual compliance on existing factory cameras.",
  },
];

export const educationCitations: IndustryCitation[] = [
  {
    source: "NCES",
    href: "https://nces.ed.gov/programs/coe/crime-and-safety",
    text: "publishes annual school crime and safety indicators — including hundreds of thousands of student victimizations on campus — reinforcing why schools need real-time incident detection, not only after-the-fact review.",
  },
  {
    source: "CDC",
    href: "https://www.cdc.gov/youth-violence/about/about-school-violence.html",
    text: "notes that school violence can be prevented through layered safety strategies — areas where behavioural video analytics on existing CCTV can augment human patrols without facial recognition.",
  },
];
