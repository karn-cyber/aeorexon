import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { products } from "@/data/products";
import { cafeChairs, diningChairs, type Chair } from "@/data/lynchpin";
import type { Product } from "@/lib/types";

const DB_NAME = process.env.MONGODB_DB ?? "aorexon";

// Turn a Lynchpin chair into a manageable catalogue product (furniture category).
function chairToProduct(chair: Chair, series: "Café" | "Dining"): Product {
  return {
    slug: `lynchpin-${chair.slug}`,
    name: chair.name,
    fullName: `Lynchpin ${chair.name} — ${series} Chair`,
    shortDesc: `${series} chair from the Lynchpin seating collection.`,
    useCaseDesc: `The ${chair.name} is part of Lynchpin's ${series} series — durable, design-forward seating for cafés, restaurants, hospitality and homes.`,
    category: "furniture",
    subcategory: `${series} Series`,
    brand: "Lynchpin",
    usedFor: ["Cafés & restaurants", "Hospitality & lounges", "Home dining"],
    specs: { installationType: undefined },
    models: [],
    searchTags: [
      "chair",
      "seating",
      "furniture",
      "lynchpin",
      series.toLowerCase(),
      chair.name.toLowerCase(),
    ],
    applicationTags: ["furniture", "seating", series === "Café" ? "cafe" : "dining"],
    upsellRules: [],
    relatedProducts: [],
    images: [{ url: chair.image, alt: chair.name, isPrimary: true }],
    isDirectBuy: false,
    featured: false,
  };
}

// Seeds the products collection: dosing catalogue + Lynchpin furniture. Idempotent
// (upserts by slug). POST to run.
export async function POST() {
  try {
    const client = await clientPromise;
    const col = client.db(DB_NAME).collection("products");

    await col.createIndex({ slug: 1 }, { unique: true });
    await col.createIndex({ category: 1 });
    await col.createIndex({ applicationTags: 1 });

    const furniture: Product[] = [
      ...cafeChairs.map((c) => chairToProduct(c, "Café")),
      ...diningChairs.map((c) => chairToProduct(c, "Dining")),
    ];

    const all: Product[] = [...products, ...furniture];
    for (const p of all) {
      await col.updateOne({ slug: p.slug }, { $set: p }, { upsert: true });
    }

    const count = await col.countDocuments();
    return NextResponse.json({
      ok: true,
      message: `Seeded ${products.length} dosing products + ${furniture.length} furniture`,
      totalInCollection: count,
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const client = await clientPromise;
    const count = await client
      .db(DB_NAME)
      .collection("products")
      .countDocuments();
    return NextResponse.json({ ok: true, totalInCollection: count });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
