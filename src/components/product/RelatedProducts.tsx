import Link from "next/link";
import type { Product, RelationType } from "@/lib/types";
import { getProductsBySlugs } from "@/lib/products";

const SECTIONS: { type: RelationType; title: string }[] = [
  { type: "accessory", title: "Often ordered with" },
  { type: "alternative", title: "Alternatives to consider" },
  { type: "upgrade", title: "Upgrade path" },
];

export async function RelatedProducts({ product }: { product: Product }) {
  // Resolve all related slugs once.
  const allSlugs = product.relatedProducts.map((r) => r.slug);
  const resolved = await getProductsBySlugs(allSlugs);
  const bySlug = new Map(resolved.map((p) => [p.slug, p]));

  const groups = SECTIONS.map((section) => ({
    ...section,
    items: product.relatedProducts
      .filter((r) => r.type === section.type)
      .map((r) => bySlug.get(r.slug))
      .filter((p): p is Product => Boolean(p)),
  })).filter((g) => g.items.length > 0);

  if (groups.length === 0) return null;

  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <div key={group.type}>
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-text-muted">
            {group.title}
          </h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {group.items.map((p) => (
              <Link
                key={p.slug}
                href={`/products/${p.slug}`}
                className="rounded-lg border border-border bg-surface p-4 transition hover:border-primary-light hover:shadow-sm"
              >
                <div className="font-semibold text-text">{p.name}</div>
                <div className="mt-1 line-clamp-2 text-xs text-text-muted">
                  {p.shortDesc}
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
