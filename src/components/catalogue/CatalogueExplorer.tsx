"use client";

import { useMemo, useState } from "react";
import type { Product, CategorySlug } from "@/lib/types";
import { ProductGrid } from "@/components/product/ProductGrid";

const CATEGORY_OPTIONS: { value: CategorySlug; label: string }[] = [
  { value: "solenoid-wall", label: "Solenoid · Wall" },
  { value: "solenoid-base", label: "Solenoid · Base" },
  { value: "motor-driven", label: "Motor-Driven" },
  { value: "peristaltic", label: "Peristaltic" },
  { value: "controllers", label: "Controllers" },
  { value: "accessories", label: "Accessories" },
];

const FLOW_RANGES = [
  { label: "0–10 l/h", min: 0, max: 10 },
  { label: "10–100 l/h", min: 10, max: 100 },
  { label: "100–500 l/h", min: 100, max: 500 },
  { label: "500–1000 l/h", min: 500, max: 1000 },
  { label: "1000+ l/h", min: 1000, max: Infinity },
];

const PRESSURE_RANGES = [
  { label: "Up to 10 bar", max: 10 },
  { label: "Up to 20 bar", max: 20 },
  { label: "Up to 50 bar", max: 50 },
  { label: "50–100 bar", max: 100 },
];

type SortKey = "relevance" | "flow-asc" | "flow-desc" | "pressure-desc";

function CheckRow({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 py-1 text-sm text-text-muted hover:text-text">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 accent-[var(--color-accent)]"
      />
      {label}
    </label>
  );
}

export function CatalogueExplorer({ products }: { products: Product[] }) {
  const [cats, setCats] = useState<Set<string>>(new Set());
  const [flowIdx, setFlowIdx] = useState<number | null>(null);
  const [pressureIdx, setPressureIdx] = useState<number | null>(null);
  const [apps, setApps] = useState<Set<string>>(new Set());
  const [atexOnly, setAtexOnly] = useState(false);
  const [wifiOnly, setWifiOnly] = useState(false);
  const [sort, setSort] = useState<SortKey>("relevance");

  const allApps = useMemo(
    () =>
      [...new Set(products.flatMap((p) => p.applicationTags))].sort(),
    [products]
  );

  function toggle(set: Set<string>, setter: (s: Set<string>) => void, v: string) {
    const next = new Set(set);
    next.has(v) ? next.delete(v) : next.add(v);
    setter(next);
  }

  const filtered = useMemo(() => {
    let out = products.filter((p) => {
      if (cats.size && !cats.has(p.category)) return false;
      if (flowIdx !== null) {
        const r = FLOW_RANGES[flowIdx];
        const f = p.specs.flowRateMaxLH;
        if (f === undefined || f < r.min || f > r.max) return false;
      }
      if (pressureIdx !== null) {
        const r = PRESSURE_RANGES[pressureIdx];
        const bar = p.specs.maxPressureBar;
        if (bar === undefined || bar > r.max) return false;
      }
      if (apps.size && !p.applicationTags.some((t) => apps.has(t))) return false;
      if (atexOnly && !p.specs.atex) return false;
      if (wifiOnly && !p.specs.wifiCapable) return false;
      return true;
    });

    const flowOf = (p: Product) => p.specs.flowRateMaxLH ?? 0;
    const pressOf = (p: Product) => p.specs.maxPressureBar ?? 0;
    if (sort === "flow-asc") out = [...out].sort((a, b) => flowOf(a) - flowOf(b));
    if (sort === "flow-desc") out = [...out].sort((a, b) => flowOf(b) - flowOf(a));
    if (sort === "pressure-desc")
      out = [...out].sort((a, b) => pressOf(b) - pressOf(a));
    return out;
  }, [products, cats, flowIdx, pressureIdx, apps, atexOnly, wifiOnly, sort]);

  const appLabel = (t: string) =>
    t.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");

  const hasFilters =
    cats.size || apps.size || flowIdx !== null || pressureIdx !== null || atexOnly || wifiOnly;

  return (
    <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
      <aside className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wide text-text">Filters</h2>
          {hasFilters ? (
            <button
              onClick={() => {
                setCats(new Set());
                setApps(new Set());
                setFlowIdx(null);
                setPressureIdx(null);
                setAtexOnly(false);
                setWifiOnly(false);
              }}
              className="text-xs font-medium text-accent hover:underline"
            >
              Clear all
            </button>
          ) : null}
        </div>

        <FilterGroup title="Category">
          {CATEGORY_OPTIONS.map((c) => (
            <CheckRow
              key={c.value}
              checked={cats.has(c.value)}
              onChange={() => toggle(cats, setCats, c.value)}
              label={c.label}
            />
          ))}
        </FilterGroup>

        <FilterGroup title="Flow rate">
          {FLOW_RANGES.map((r, i) => (
            <label
              key={r.label}
              className="flex cursor-pointer items-center gap-2 py-1 text-sm text-text-muted hover:text-text"
            >
              <input
                type="radio"
                name="flow"
                checked={flowIdx === i}
                onChange={() => setFlowIdx(flowIdx === i ? null : i)}
                onClick={() => flowIdx === i && setFlowIdx(null)}
                className="h-4 w-4 accent-[var(--color-accent)]"
              />
              {r.label}
            </label>
          ))}
        </FilterGroup>

        <FilterGroup title="Max pressure">
          {PRESSURE_RANGES.map((r, i) => (
            <label
              key={r.label}
              className="flex cursor-pointer items-center gap-2 py-1 text-sm text-text-muted hover:text-text"
            >
              <input
                type="radio"
                name="pressure"
                checked={pressureIdx === i}
                onChange={() => setPressureIdx(pressureIdx === i ? null : i)}
                onClick={() => pressureIdx === i && setPressureIdx(null)}
                className="h-4 w-4 accent-[var(--color-accent)]"
              />
              {r.label}
            </label>
          ))}
        </FilterGroup>

        <FilterGroup title="Application">
          <div className="max-h-56 overflow-y-auto pr-1">
            {allApps.map((t) => (
              <CheckRow
                key={t}
                checked={apps.has(t)}
                onChange={() => toggle(apps, setApps, t)}
                label={appLabel(t)}
              />
            ))}
          </div>
        </FilterGroup>

        <FilterGroup title="Features">
          <CheckRow checked={atexOnly} onChange={() => setAtexOnly(!atexOnly)} label="ATEX certified" />
          <CheckRow checked={wifiOnly} onChange={() => setWifiOnly(!wifiOnly)} label="IoT / Wi-Fi" />
        </FilterGroup>
      </aside>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-text-muted">
            {filtered.length} product{filtered.length === 1 ? "" : "s"}
          </p>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary-light"
          >
            <option value="relevance">Sort: Featured</option>
            <option value="flow-desc">Flow: High → Low</option>
            <option value="flow-asc">Flow: Low → High</option>
            <option value="pressure-desc">Pressure: High → Low</option>
          </select>
        </div>
        <ProductGrid products={filtered} />
      </div>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-text-muted">
        {title}
      </h3>
      {children}
    </div>
  );
}
