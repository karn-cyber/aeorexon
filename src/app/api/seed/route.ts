import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { products } from "@/data/products";

const DB_NAME = process.env.MONGODB_DB ?? "aorexon";

// Seeds the products collection from the static catalogue. Idempotent (upserts
// by slug). POST to run. In production you'd guard this with an admin check.
export async function POST() {
  try {
    const client = await clientPromise;
    const col = client.db(DB_NAME).collection("products");

    await col.createIndex({ slug: 1 }, { unique: true });
    await col.createIndex({ category: 1 });
    await col.createIndex({ applicationTags: 1 });

    for (const p of products) {
      await col.updateOne({ slug: p.slug }, { $set: p }, { upsert: true });
    }

    const count = await col.countDocuments();
    return NextResponse.json({
      ok: true,
      message: `Seeded ${products.length} products`,
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
