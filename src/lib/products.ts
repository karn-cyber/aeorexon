import clientPromise from "@/lib/mongodb";
import { products as seedProducts, productsBySlug } from "@/data/products";
import type { Product, CategorySlug } from "@/lib/types";

const DB_NAME = process.env.MONGODB_DB ?? "aorexon";
const COLLECTION = "products";

/**
 * Reads all products from MongoDB. Falls back to the static seed data if the
 * collection is empty or unreachable, so the catalogue always renders.
 */
export async function getAllProducts(): Promise<Product[]> {
  try {
    const client = await clientPromise;
    const docs = await client
      .db(DB_NAME)
      .collection<Product>(COLLECTION)
      .find({}, { projection: { _id: 0 } })
      .toArray();
    if (docs.length > 0) return docs;
  } catch {
    // fall through to seed data
  }
  return seedProducts;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const client = await clientPromise;
    const doc = await client
      .db(DB_NAME)
      .collection<Product>(COLLECTION)
      .findOne({ slug }, { projection: { _id: 0 } });
    if (doc) return doc;
  } catch {
    // fall through
  }
  return productsBySlug[slug] ?? null;
}

export async function getProductsByCategory(
  category: CategorySlug
): Promise<Product[]> {
  const all = await getAllProducts();
  return all.filter((p) => p.category === category);
}

export async function getProductsByApplication(tag: string): Promise<Product[]> {
  const all = await getAllProducts();
  return all.filter((p) => p.applicationTags.includes(tag));
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const all = await getAllProducts();
  return all.filter((p) => p.featured);
}

/** Resolve a list of slugs to products, preserving order. */
export async function getProductsBySlugs(slugs: string[]): Promise<Product[]> {
  const all = await getAllProducts();
  const map = new Map(all.map((p) => [p.slug, p]));
  return slugs.map((s) => map.get(s)).filter((p): p is Product => Boolean(p));
}
