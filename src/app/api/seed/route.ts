import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { products } from "@/data/products";
import { lynchpinSeries, type Chair } from "@/data/lynchpin";
import { priceList } from "@/data/priceList";
import type { Product } from "@/lib/types";

const DB_NAME = process.env.MONGODB_DB ?? "aorexon";

// Turn a Lynchpin item into a manageable catalogue product (furniture category).
function furnitureToProduct(chair: Chair, key: string, title: string): Product {
  // Café/Dining keep their original slug scheme; new series are namespaced.
  const slug =
    key === "cafe" || key === "dining"
      ? `lynchpin-${chair.slug}`
      : `lynchpin-${key}-${chair.slug}`;
  return {
    slug,
    name: chair.name,
    fullName: `Lynchpin ${chair.name} — ${title}`,
    shortDesc: `${title} from the Lynchpin collection.`,
    useCaseDesc: `The ${chair.name} is part of Lynchpin's ${title} range — durable, design-forward furniture for cafés, restaurants, offices, hospitality and homes.`,
    category: "furniture",
    subcategory: title,
    brand: "Lynchpin",
    usedFor: ["Cafés & restaurants", "Offices & hospitality", "Homes"],
    specs: { installationType: undefined },
    models: [],
    searchTags: ["furniture", "lynchpin", key, title.toLowerCase(), chair.name.toLowerCase()],
    applicationTags: ["furniture", "seating", key],
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

    const furniture: Product[] = lynchpinSeries.flatMap((s) =>
      s.items.map((c) => furnitureToProduct(c, s.key, s.title))
    );

    const all: Product[] = [...products, ...furniture];
    for (const p of all) {
      await col.updateOne({ slug: p.slug }, { $set: p }, { upsert: true });
    }

    // Seed the SEKO channel-partner price list into its own collection.
    const priceCol = client.db(DB_NAME).collection("priceList");
    await priceCol.createIndex({ code: 1 }, { unique: true });
    for (const item of priceList) {
      await priceCol.updateOne({ code: item.code }, { $set: item }, { upsert: true });
    }

    const count = await col.countDocuments();
    const priceCount = await priceCol.countDocuments();
    return NextResponse.json({
      ok: true,
      message: `Seeded ${products.length} dosing + ${furniture.length} furniture + ${priceList.length} price-list items`,
      totalInCollection: count,
      priceListInCollection: priceCount,
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
