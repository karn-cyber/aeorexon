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
    entry("/solutions/png-gas-pipeline", 0.8),
    entry("/solutions/urb-bearings", 0.7),
    entry("/solutions/lynchpin-seating", 0.8),
    entry("/compare", 0.4, "monthly"),
  ];

  const categoryRoutes = categories.map((c) => entry(`/categories/${c.slug}`, 0.7));
  const useCaseRoutes = useCases.map((u) => entry(`/use-cases/${u.slug}`, 0.6));
  const solutionRoutes = solutionAreas
    .filter((s) => s.href.startsWith("/solutions/"))
    .map((s) => entry(s.href, 0.7));

  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const products = await getAllProducts();
    productRoutes = products.map((p) => entry(`/products/${p.slug}`, 0.6));
  } catch {
    // fall back to static routes only
  }

  return [...staticRoutes, ...categoryRoutes, ...useCaseRoutes, ...solutionRoutes, ...productRoutes];
}
