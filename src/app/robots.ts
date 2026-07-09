import type { MetadataRoute } from "next";

const SITE_URL = "https://www.aorexonsystems.in";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Keep private/app areas out of the index.
        disallow: ["/admin", "/crm", "/account", "/chat", "/api", "/sign-in", "/sign-up", "/checkout", "/cart"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
