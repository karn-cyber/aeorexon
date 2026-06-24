import type { Product } from "@/lib/types";
import { ProductCard } from "./ProductCard";

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-surface p-12 text-center text-text-muted">
        No products match your filters. Try widening them.
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((p) => (
        <ProductCard key={p.slug} product={p} />
      ))}
    </div>
  );
}
