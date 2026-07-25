// Renders a JSON-LD structured-data block for rich results.
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export const SITE_URL = "https://www.aorexonsystems.in";
const ORG_ID = `${SITE_URL}/#organization`;

// Stable Organization entity. A shared @id lets every other schema (Product,
// Service, WebSite) reference the same company node so search engines resolve
// one consistent brand entity for "Aorexon Systems".
export const organizationSchema: Record<string, unknown> = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": ORG_ID,
  name: "Aorexon Systems",
  legalName: "Aorexon Systems",
  alternateName: ["Aorexon", "Aorexon Systems India"],
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/hero/controller.jpg`,
    caption: "Aorexon Systems",
  },
  image: `${SITE_URL}/hero/dosing-pump.jpg`,
  slogan: "Engineering Solutions. Delivering Excellence.",
  description:
    "Aorexon Systems is an Indian industrial-equipment supplier: SEKO dosing pumps & water-quality controllers, PNG gas pipeline installation, URB industrial bearings and Lynchpin café, office and dining furniture. Established 1994.",
  foundingDate: "1994",
  email: "aorexonsystems@outlook.com",
  telephone: "+91-9011023081",
  address: {
    "@type": "PostalAddress",
    addressCountry: "IN",
  },
  areaServed: { "@type": "Country", name: "India" },
  knowsAbout: [
    "Dosing pumps",
    "Chemical dosing systems",
    "Water quality controllers",
    "PNG gas pipeline installation",
    "Industrial bearings",
    "Café, office and dining furniture",
    "Industrial equipment supply",
  ],
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: "+91-9011023081",
      contactType: "sales",
      email: "aorexonsystems@outlook.com",
      areaServed: "IN",
      availableLanguage: ["en", "hi"],
    },
  ],
  sameAs: [],
};

export const websiteSchema: Record<string, unknown> = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: "Aorexon Systems",
  url: SITE_URL,
  publisher: { "@id": ORG_ID },
  inLanguage: "en-IN",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

/** BreadcrumbList schema from an ordered list of {name, path} crumbs. */
export function breadcrumbSchema(
  items: { name: string; path: string }[]
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

/** FAQPage schema from question/answer pairs — eligible for rich results. */
export function faqSchema(
  qa: { question: string; answer: string }[]
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: qa.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

/** Service schema for an area-of-work / solution page. */
export function serviceSchema(input: {
  name: string;
  description: string;
  path: string;
  serviceType?: string;
}): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: input.name,
    description: input.description,
    ...(input.serviceType ? { serviceType: input.serviceType } : {}),
    url: `${SITE_URL}${input.path}`,
    provider: { "@id": ORG_ID },
    areaServed: { "@type": "Country", name: "India" },
  };
}

/** CollectionPage + ItemList schema for a category / listing page. */
export function collectionSchema(input: {
  name: string;
  description: string;
  path: string;
  items: { name: string; path: string }[];
}): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: input.name,
    description: input.description,
    url: `${SITE_URL}${input.path}`,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: input.items.length,
      itemListElement: input.items.map((it, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: it.name,
        url: `${SITE_URL}${it.path}`,
      })),
    },
  };
}
