// Aorexon's areas of work — the businesses and partnerships beyond dosing pumps.

export type Relationship =
  | "Dealer"
  | "Authorised Dealer"
  | "Channel Partner";

export interface SolutionArea {
  slug: string;
  name: string;
  /** Short category chip. */
  category: string;
  relationship: Relationship;
  /** Partner / principal / brand behind this area. */
  partner: string;
  tagline: string;
  icon: string;
  /** Longer intro shown on the dedicated page. */
  intro: string;
  highlights: string[];
  /** Primary CTA on cards / pages. */
  cta: { label: string; href: string; external?: boolean };
  /** Which detail page (internal) this area links to, if any. */
  href: string;
  external?: boolean;
}

export const solutionAreas: SolutionArea[] = [
  {
    slug: "dosing-systems",
    name: "Dosing & Water Treatment",
    category: "Water & Process",
    relationship: "Dealer",
    partner: "SEKO / Water & Industry",
    tagline: "Dosing pumps, controllers and accessories for water and process treatment.",
    icon: "droplets",
    intro:
      "Our core line: SEKO / Water & Industry solenoid, motor-driven and peristaltic dosing pumps, water-quality controllers and accessories — matched to your use case with full specs.",
    highlights: [
      "34+ products across 6 categories",
      "Use-case-first selection & smart search",
      "Order online or request a quote",
    ],
    cta: { label: "Browse the catalogue", href: "/products" },
    href: "/products",
  },
  {
    slug: "png-gas-pipeline",
    name: "PNG Gas Pipeline Installations",
    category: "Gas Infrastructure",
    relationship: "Channel Partner",
    partner: "Chaze Engineering Solutions",
    tagline: "End-to-end Piped Natural Gas (PNG) pipeline design and installation.",
    icon: "waypoints",
    intro:
      "As a channel partner of Chaze Engineering Solutions, Aorexon delivers Piped Natural Gas (PNG) pipeline installations for residential, commercial and industrial premises — from design and material supply to laying, testing and commissioning, with full safety compliance.",
    highlights: [
      "Residential, commercial & industrial PNG connections",
      "GI and MDPE pipeline supply, laying & fitting",
      "Pressure testing, leak checks & safety compliance",
      "Design, installation and commissioning",
    ],
    cta: { label: "Enquire about a PNG installation", href: "/chat/new?name=PNG%20Gas%20Pipeline%20Installation" },
    href: "/solutions/png-gas-pipeline",
  },
  {
    slug: "urb-bearings",
    name: "Industrial Bearings — URB",
    category: "Industrial Components",
    relationship: "Authorised Dealer",
    partner: "URB Group (Romania)",
    tagline: "High-quality industrial bearings from URB Group, Romania.",
    icon: "circle-dot",
    intro:
      "Aorexon is an authorised dealer for URB Group — a long-established Romanian manufacturer of high-quality bearings for industry. We supply the full URB range for maintenance, OEM and replacement needs.",
    highlights: [
      "Deep groove & angular contact ball bearings",
      "Tapered, cylindrical & spherical roller bearings",
      "Self-aligning and thrust bearings",
      "OEM, MRO and replacement supply",
    ],
    cta: {
      label: "Visit URB Group",
      href: "https://share.google/91EWqehzLj5OJovgC",
      external: true,
    },
    href: "/solutions/urb-bearings",
  },
  {
    slug: "lynchpin-seating",
    name: "Café & Dining Seating — Lynchpin",
    category: "Furniture & Seating",
    relationship: "Channel Partner",
    partner: "Lynchpin",
    tagline: "Café and dining chair collections — “My Chair, My Pride.”",
    icon: "armchair",
    intro:
      "As a channel partner of Lynchpin, Aorexon supplies their café and dining seating collections — durable, design-forward chairs for cafés, restaurants, hospitality and home dining.",
    highlights: [
      "Extensive Café and Dining chair collections",
      "Polypropylene, cushioned, woody, metal & gold finishes",
      "For cafés, restaurants, hospitality & homes",
      "Bulk and project supply",
    ],
    cta: { label: "Explore the collections", href: "/solutions/lynchpin-seating" },
    href: "/solutions/lynchpin-seating",
  },
];

export const solutionBySlug: Record<string, SolutionArea> = Object.fromEntries(
  solutionAreas.map((s) => [s.slug, s])
);

// Full Lynchpin café & dining chair data (every model + image) lives in
// src/data/lynchpin.ts, generated from the catalogues.

export const lynchpinContact = {
  brand: "Lynchpin",
  address: "#22, 6th Cross, Sampige Road, Malleshwaram, Bangalore – 560003",
  website: "www.lynchpin.co.in",
};
