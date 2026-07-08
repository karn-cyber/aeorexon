"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/types";
import { formatINR, getPriceInfo } from "@/lib/pricing";
import { PRODUCT_CATEGORIES, categoryLabel } from "@/lib/productCategories";
import { Icon } from "@/components/Icon";

interface Row {
  slug: string;
  name: string;
  category: string;
  price?: number;
  discountPercent?: number;
  offerLabel?: string;
  featured?: boolean;
}

export function AdminProductsTable({ products }: { products: Product[] }) {
  const router = useRouter();
  const [rows, setRows] = useState<Row[]>(
    products.map((p) => ({
      slug: p.slug,
      name: p.name,
      category: p.category,
      price: p.price,
      discountPercent: p.discountPercent,
      offerLabel: p.offerLabel,
      featured: p.featured,
    }))
  );
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState<Partial<Row>>({});
  const [busy, setBusy] = useState(false);
  const [filter, setFilter] = useState("");
  const [cat, setCat] = useState<string>("all");

  function startEdit(r: Row) {
    setEditing(r.slug);
    setDraft({ price: r.price, discountPercent: r.discountPercent, offerLabel: r.offerLabel });
  }

  async function save(slug: string) {
    setBusy(true);
    try {
      const res = await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          price: draft.price === undefined || (draft.price as unknown) === "" ? null : Number(draft.price),
          discountPercent:
            draft.discountPercent === undefined || (draft.discountPercent as unknown) === ""
              ? null
              : Number(draft.discountPercent),
          offerLabel: draft.offerLabel ?? "",
        }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error);
      setRows((rs) =>
        rs.map((r) =>
          r.slug === slug
            ? { ...r, price: draft.price ? Number(draft.price) : undefined, discountPercent: draft.discountPercent ? Number(draft.discountPercent) : undefined, offerLabel: draft.offerLabel }
            : r
        )
      );
      setEditing(null);
      router.refresh();
    } catch (e) {
      alert("Failed: " + (e instanceof Error ? e.message : e));
    } finally {
      setBusy(false);
    }
  }

  async function del(slug: string, name: string) {
    if (!confirm(`Delete "${name}"? This removes it from the catalogue.`)) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/products?slug=${encodeURIComponent(slug)}`, { method: "DELETE" });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error);
      setRows((rs) => rs.filter((r) => r.slug !== slug));
      router.refresh();
    } catch (e) {
      alert("Failed: " + (e instanceof Error ? e.message : e));
    } finally {
      setBusy(false);
    }
  }

  const visible = rows.filter((r) => {
    if (cat !== "all" && r.category !== cat) return false;
    const f = filter.toLowerCase();
    return r.name.toLowerCase().includes(f) || r.slug.includes(f);
  });

  // Category tabs with live counts (only categories that have products, + All).
  const counts = rows.reduce<Record<string, number>>((acc, r) => {
    acc[r.category] = (acc[r.category] ?? 0) + 1;
    return acc;
  }, {});
  const catTabs = [
    { value: "all", label: "All", n: rows.length },
    ...PRODUCT_CATEGORIES.filter((c) => counts[c.value]).map((c) => ({
      value: c.value as string,
      label: c.label,
      n: counts[c.value],
    })),
  ];

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        {catTabs.map((t) => (
          <button
            key={t.value}
            onClick={() => setCat(t.value)}
            className={`rounded-full px-3 py-1.5 text-sm font-semibold transition ${
              cat === t.value
                ? "bg-primary text-white"
                : "border border-border bg-surface text-text-muted hover:border-primary-light"
            }`}
          >
            {t.label} <span className="opacity-70">({t.n})</span>
          </button>
        ))}
      </div>
      <input
        placeholder="Filter products…"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="mb-4 w-full max-w-xs rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary-light"
      />
      <div className="overflow-x-auto rounded-xl border border-border bg-surface">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-bg/60 text-left">
              <th className="px-4 py-3 font-semibold text-text-muted">Product</th>
              <th className="px-4 py-3 font-semibold text-text-muted">Price (INR)</th>
              <th className="px-4 py-3 font-semibold text-text-muted">Discount %</th>
              <th className="px-4 py-3 font-semibold text-text-muted">Offer</th>
              <th className="px-4 py-3 font-semibold text-text-muted">Effective</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {visible.map((r) => {
              const isEdit = editing === r.slug;
              const eff = getPriceInfo(r);
              return (
                <tr key={r.slug} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">
                    <Link href={`/products/${r.slug}`} className="font-medium text-text hover:text-primary">
                      {r.name}
                    </Link>
                    <div className="text-xs text-text-muted">{categoryLabel(r.category)}</div>
                  </td>
                  <td className="px-4 py-3">
                    {isEdit ? (
                      <input
                        type="number"
                        defaultValue={r.price ?? ""}
                        onChange={(e) => setDraft({ ...draft, price: e.target.value as unknown as number })}
                        className="w-28 rounded border border-border px-2 py-1"
                      />
                    ) : r.price ? (
                      formatINR(r.price)
                    ) : (
                      <span className="text-text-muted">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {isEdit ? (
                      <input
                        type="number"
                        defaultValue={r.discountPercent ?? ""}
                        onChange={(e) => setDraft({ ...draft, discountPercent: e.target.value as unknown as number })}
                        className="w-20 rounded border border-border px-2 py-1"
                      />
                    ) : (
                      r.discountPercent ?? "—"
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {isEdit ? (
                      <input
                        defaultValue={r.offerLabel ?? ""}
                        onChange={(e) => setDraft({ ...draft, offerLabel: e.target.value })}
                        placeholder="e.g. Sale"
                        className="w-28 rounded border border-border px-2 py-1"
                      />
                    ) : (
                      r.offerLabel ?? "—"
                    )}
                  </td>
                  <td className="px-4 py-3 font-semibold">
                    {eff.hasPrice ? formatINR(eff.price) : <span className="text-text-muted">Quote</span>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      {isEdit ? (
                        <>
                          <button onClick={() => save(r.slug)} disabled={busy} className="inline-flex items-center gap-1 rounded bg-accent px-2.5 py-1.5 text-xs font-semibold text-white disabled:opacity-50">
                            <Icon name="save" size={14} /> Save
                          </button>
                          <button onClick={() => setEditing(null)} className="text-xs text-text-muted hover:text-text">Cancel</button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => startEdit(r)} className="text-text-muted hover:text-primary" aria-label="Edit price">
                            <Icon name="tag" size={16} />
                          </button>
                          <Link href={`/admin/products/${r.slug}/edit`} className="text-text-muted hover:text-primary" aria-label="Edit product">
                            <Icon name="pencil" size={16} />
                          </Link>
                          <button onClick={() => del(r.slug, r.name)} className="text-text-muted hover:text-error" aria-label="Delete">
                            <Icon name="trash-2" size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
