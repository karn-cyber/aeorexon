import type { MetadataRoute } from "next";
import { getAllProducts } from "@/lib/products";
import { categories, useCases } from "@/data/categories";
import { solutionAreas } from "@/data/solutions";

const SITE_URL = "https://www.aorexonsystems.in";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entry = (
    path: string,
    priority = 0.7,
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] = "weekly"
  ): MetadataRoute.Sitemap[number] => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  });

  const staticRoutes = [
    entry("", 1, "daily"),
    entry("/products", 0.9, "daily"),
    entry("/solutions", 0.8),
    entry("/rfq", 0.5, "monthly"),
    entry("/compare", 0.4, "monthly"),
  ];

  const categoryRoutes = categories.map((c) => entry(`/categories/${c.slug}`, 0.7));
  const useCaseRoutes = useCases.map((u) => entry(`/use-cases/${u.slug}`, 0.6));
  const solutionRoutes = solutionAreas
    .filter((s) => s.href.startsWith("/solutions/"))
    .map((s) => entry(s.href, 0.8));

  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const products = await getAllProducts();
    productRoutes = products.map((p) => entry(`/products/${p.slug}`, 0.6));
  } catch {
    // fall back to static routes only
  }

  const all = [
    ...staticRoutes,
    ...categoryRoutes,
    ...useCaseRoutes,
    ...solutionRoutes,
    ...productRoutes,
  ];

  // De-duplicate by URL (a route can be declared both statically and via data).
  const seen = new Map<string, MetadataRoute.Sitemap[number]>();
  for (const route of all) {
    if (!seen.has(route.url)) seen.set(route.url, route);
  }
  return [...seen.values()];
}
