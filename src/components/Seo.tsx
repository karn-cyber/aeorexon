// Renders a JSON-LD structured-data block for rich results.
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

const SITE_URL = "https://www.aorexonsystems.in";

export const organizationSchema: Record<string, unknown> = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Aorexon Systems",
  legalName: "Aorexon Systems",
  url: SITE_URL,
  logo: `${SITE_URL}/hero/controller.jpg`,
  slogan: "Engineering Solutions. Delivering Excellence.",
  description:
    "SEKO dosing pumps & controllers, PNG gas pipeline installation, URB industrial bearings and Lynchpin furniture.",
  foundingDate: "1994",
  email: "aorexonsystems@outlook.com",
  telephone: "+91-9011023081",
  areaServed: "IN",
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
  name: "Aorexon Systems",
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};
