"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCompareStore } from "@/stores/compareStore";
import { productsBySlug } from "@/data/products";
import type { Product } from "@/lib/types";

const ROWS: { key: string; label: string; get: (p: Product) => string }[] = [
  { key: "category", label: "Category", get: (p) => p.category },
  { key: "flow", label: "Flow rate", get: (p) => {
      const { flowRateMinLH: a, flowRateMaxLH: b } = p.specs;
      return b !== undefined ? `${a ?? 0}–${b} l/h` : "—";
    } },
  { key: "pressure", label: "Max pressure", get: (p) => p.specs.maxPressureBar ? `${p.specs.maxPressureBar} bar` : "—" },
  { key: "control", label: "Control", get: (p) => (p.specs.controlType ? String(p.specs.controlType) : "—") },
  { key: "head", label: "Pump head", get: (p) => (p.specs.pumpHead ? String(p.specs.pumpHead) : "—") },
  { key: "power", label: "Power", get: (p) => (p.specs.powerSupply ?? p.specs.motorKw ? String(p.specs.powerSupply ?? p.specs.motorKw) : "—") },
  { key: "atex", label: "ATEX", get: (p) => (p.specs.atex ? "Yes" : "No") },
  { key: "wifi", label: "Wi-Fi", get: (p) => (p.specs.wifiCapable ? "Yes" : "No") },
  { key: "buy", label: "Direct buy", get: (p) => (p.isDirectBuy ? "Yes" : "Quote only") },
];

export default function ComparePage() {
  const slugs = useCompareStore((s) => s.slugs);
  const remove = useCompareStore((s) => s.remove);
  const clear = useCompareStore((s) => s.clear);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const products = slugs.map((s) => productsBySlug[s]).filter(Boolean) as Product[];

  if (products.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-text">Nothing to compare yet</h1>
        <p className="mt-2 text-text-muted">
          Add up to 3 products using the “Compare” checkbox on any product card.
        </p>
        <Link
          href="/products"
          className="mt-6 inline-block rounded-lg bg-accent px-6 py-3 font-semibold text-white hover:brightness-110"
        >
          Browse catalogue
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-text">Compare ({products.length}/3)</h1>
        <button onClick={clear} className="text-sm font-medium text-text-muted hover:text-error">
          Clear all
        </button>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-border bg-surface">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="w-40 px-4 py-3" />
              {products.map((p) => (
                <th key={p.slug} className="px-4 py-3 text-left align-top">
                  <Link href={`/products/${p.slug}`} className="font-bold text-primary hover:underline">
                    {p.name}
                  </Link>
                  <button
                    onClick={() => remove(p.slug)}
                    className="ml-2 text-xs text-text-muted hover:text-error"
                  >
                    ✕
                  </button>
                  <p className="mt-1 line-clamp-2 text-xs font-normal text-text-muted">
                    {p.shortDesc}
                  </p>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row, i) => (
              <tr key={row.key} className={i % 2 ? "bg-bg/50" : ""}>
                <td className="px-4 py-3 font-medium text-text-muted">{row.label}</td>
                {products.map((p) => (
                  <td key={p.slug} className="px-4 py-3 capitalize text-text">
                    {row.get(p)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
