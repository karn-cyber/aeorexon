import Link from "next/link";
import type { Product } from "@/lib/types";
import { productsBySlug } from "@/data/products";

// The signature Aorexon feature: a context-aware panel that reads the product's
// upsellRules and links the buyer to the right next-tier / alternative product.
export function UseCaseMatchPanel({ product }: { product: Product }) {
  const rules = product.upsellRules.filter((r) => productsBySlug[r.targetSlug]);
  if (rules.length === 0) return null;

  return (
    <section className="rounded-xl border border-accent/30 bg-accent-light/40 p-5">
      <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-accent">
        <span aria-hidden>🎯</span> Is this the right fit?
      </h2>
      <ul className="mt-3 space-y-2">
        {rules.map((rule) => (
          <li key={rule.targetSlug + rule.condition}>
            <Link
              href={`/products/${rule.targetSlug}`}
              className="group flex items-center justify-between gap-3 rounded-lg bg-surface px-4 py-3 text-sm shadow-sm transition hover:shadow-md"
            >
              <span className="font-medium text-text">{rule.label}</span>
              <span className="shrink-0 font-bold text-accent group-hover:translate-x-0.5">
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
