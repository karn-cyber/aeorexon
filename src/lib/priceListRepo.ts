import clientPromise from "@/lib/mongodb";
import { priceList as seedPriceList, type PriceItem } from "@/data/priceList";

const DB_NAME = process.env.MONGODB_DB ?? "aorexon";

/** Reads the channel price list from MongoDB, falling back to the static seed. */
export async function getPriceList(): Promise<PriceItem[]> {
  try {
    const client = await clientPromise;
    const docs = await client
      .db(DB_NAME)
      .collection<PriceItem>("priceList")
      .find({}, { projection: { _id: 0 } })
      .toArray();
    if (docs.length > 0) return docs;
  } catch {
    // fall through to seed
  }
  return seedPriceList;
}

export function priceGroupsOf(items: PriceItem[]): string[] {
  return [...new Set(items.map((p) => p.group))];
}
