import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import {
  upsertProduct,
  patchProduct,
  deleteProduct,
  getProductBySlug,
} from "@/lib/products";
import type { Product, CategorySlug } from "@/lib/types";
import { PRODUCT_CATEGORIES } from "@/lib/productCategories";

const CATEGORIES: CategorySlug[] = PRODUCT_CATEGORIES.map((c) => c.value);

function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Create or fully update a product.
export async function POST(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json();

    const name: string = (body.name ?? "").trim();
    if (!name) return NextResponse.json({ ok: false, error: "Name is required" }, { status: 400 });

    const category: CategorySlug = CATEGORIES.includes(body.category)
      ? body.category
      : "accessories";
    const slug = (body.slug ? slugify(body.slug) : slugify(name)) || slugify(name);

    const existing = await getProductBySlug(slug);

    const product: Product = {
      slug,
      name,
      fullName: body.fullName?.trim() || name,
      shortDesc: body.shortDesc?.trim() || "",
      useCaseDesc: body.useCaseDesc?.trim() || "",
      category,
      subcategory: body.subcategory?.trim() || undefined,
      brand: body.brand?.trim() || "SEKO",
      usedFor: Array.isArray(body.usedFor) ? body.usedFor : existing?.usedFor ?? [],
      specs: typeof body.specs === "object" && body.specs ? body.specs : existing?.specs ?? {},
      models: Array.isArray(body.models) ? body.models : existing?.models ?? [],
      modelColumns: body.modelColumns ?? existing?.modelColumns,
      searchTags: Array.isArray(body.searchTags) ? body.searchTags : existing?.searchTags ?? [],
      applicationTags: Array.isArray(body.applicationTags)
        ? body.applicationTags
        : existing?.applicationTags ?? [],
      upsellRules: existing?.upsellRules ?? [],
      relatedProducts: existing?.relatedProducts ?? [],
      images: Array.isArray(body.images) ? body.images : existing?.images ?? [],
      documents: existing?.documents,
      isDirectBuy: Boolean(body.isDirectBuy ?? (typeof body.price === "number" && body.price > 0)),
      featured: Boolean(body.featured ?? existing?.featured),
      price: typeof body.price === "number" ? body.price : existing?.price,
      discountPercent:
        typeof body.discountPercent === "number" ? body.discountPercent : existing?.discountPercent,
      offerLabel: body.offerLabel?.trim() || undefined,
      stockQty: typeof body.stockQty === "number" ? body.stockQty : existing?.stockQty,
    };

    await upsertProduct(product);
    return NextResponse.json({ ok: true, slug, created: !existing });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    const status = msg.includes("Unauthorized") ? 403 : 500;
    return NextResponse.json({ ok: false, error: msg }, { status });
  }
}

// Quick patch (price / discount / offer / featured) without sending the whole product.
export async function PATCH(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json();
    const slug: string = body.slug;
    if (!slug) return NextResponse.json({ ok: false, error: "slug required" }, { status: 400 });

    const patch: Record<string, unknown> = {};
    if ("price" in body) patch.price = body.price === null ? undefined : Number(body.price);
    if ("discountPercent" in body)
      patch.discountPercent = body.discountPercent === null ? undefined : Number(body.discountPercent);
    if ("offerLabel" in body) patch.offerLabel = body.offerLabel || undefined;
    if ("featured" in body) patch.featured = Boolean(body.featured);
    if ("isDirectBuy" in body) patch.isDirectBuy = Boolean(body.isDirectBuy);
    if ("stockQty" in body) patch.stockQty = Number(body.stockQty);

    // Auto-enable direct buy when a price is set.
    if (typeof patch.price === "number" && patch.price > 0 && !("isDirectBuy" in body)) {
      patch.isDirectBuy = true;
    }

    await patchProduct(slug, patch);
    return NextResponse.json({ ok: true, slug });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: msg }, { status: msg.includes("Unauthorized") ? 403 : 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await requireAdmin();
    const slug = new URL(req.url).searchParams.get("slug");
    if (!slug) return NextResponse.json({ ok: false, error: "slug required" }, { status: 400 });
    await deleteProduct(slug);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: msg }, { status: msg.includes("Unauthorized") ? 403 : 500 });
  }
}
