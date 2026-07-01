import { NextResponse } from "next/server";
import { getAllProducts } from "@/lib/products";
import { searchProducts } from "@/lib/search";
import { primaryImage } from "@/lib/format";
import { getPriceInfo } from "@/lib/pricing";

const CATEGORY_LABELS: Record<string, string> = {
  "solenoid-wall": "Solenoid pump",
  "solenoid-base": "Solenoid pump",
  "motor-driven": "Motor pump",
  peristaltic: "Peristaltic pump",
  controllers: "Controller",
  accessories: "Accessory",
  furniture: "Seating",
  bearings: "Bearing",
};

// Lightweight autocomplete — top matches (incl. furniture chairs & bearings).
export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get("q")?.trim() ?? "";
  if (q.length < 2) return NextResponse.json({ ok: true, suggestions: [] });

  const products = await getAllProducts();
  const results = searchProducts(q, products).slice(0, 8);

  const suggestions = results.map(({ product }) => {
    const info = getPriceInfo(product);
    return {
      slug: product.slug,
      name: product.name,
      category: CATEGORY_LABELS[product.category] ?? product.category,
      image: primaryImage(product)?.url ?? null,
      price: info.hasPrice ? info.price : null,
    };
  });

  return NextResponse.json({ ok: true, suggestions });
}
