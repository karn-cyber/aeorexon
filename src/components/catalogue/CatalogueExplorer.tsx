"use client";

import { useMemo, useState } from "react";
import type { Product, CategorySlug } from "@/lib/types";
import { ProductGrid } from "@/components/product/ProductGrid";
import { getPriceInfo } from "@/lib/pricing";
import { Icon } from "@/components/Icon";

const CATEGORY_OPTIONS: { value: CategorySlug; label: string }[] = [
  { value: "solenoid-wall", label: "Solenoid · Wall" },
  { value: "solenoid-base", label: "Solenoid · Base" },
  { value: "motor-driven", label: "Motor-Driven" },
  { value: "peristaltic", label: "Peristaltic" },
  { value: "controllers", label: "Controllers" },
  { value: "accessories", label: "Accessories" },
  { value: "furniture", label: "Furniture & Seating" },
  { value: "bearings", label: "Bearings" },
];

const PUMP_CATS = new Set<string>([
  "solenoid-wall",
  "solenoid-base",
  "motor-driven",
  "peristaltic",
  "controllers",
  "accessories",
]);

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

type SortKey = "relevance" | "flow-desc" | "flow-asc" | "pressure-desc" | "price-asc" | "price-desc";

function CheckRow({
  checked,
  onChange,
  label,
  count,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
  count?: number;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 py-1.5 text-sm text-text-muted hover:text-text">
      <input type="checkbox" checked={checked} onChange={onChange} className="h-4 w-4 accent-[var(--color-accent)]" />
      <span className="flex-1">{label}</span>
      {count !== undefined && <span className="text-xs text-text-muted/70">{count}</span>}
    </label>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-border py-4 first:pt-0 last:border-0 lg:rounded-xl lg:border lg:bg-surface lg:p-4">
      <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-text-muted">{title}</h3>
      {children}
    </div>
  );
}

export function CatalogueExplorer({ products }: { products: Product[] }) {
  const [cats, setCats] = useState<Set<string>>(new Set());
  const [series, setSeries] = useState<Set<string>>(new Set());
  const [flowIdx, setFlowIdx] = useState<number | null>(null);
  const [pressureIdx, setPressureIdx] = useState<number | null>(null);
  const [apps, setApps] = useState<Set<string>>(new Set());
  const [atexOnly, setAtexOnly] = useState(false);
  const [wifiOnly, setWifiOnly] = useState(false);
  const [sort, setSort] = useState<SortKey>("relevance");
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Counts per category (Amazon-style).
  const catCounts = useMemo(() => {
    const m: Record<string, number> = {};
    products.forEach((p) => (m[p.category] = (m[p.category] ?? 0) + 1));
    return m;
  }, [products]);

  const availableCats = CATEGORY_OPTIONS.filter((c) => catCounts[c.value]);

  // Furniture collections (Café / Dining series) from subcategory.
  const seriesOptions = useMemo(
    () =>
      [...new Set(products.filter((p) => p.category === "furniture" && p.subcategory).map((p) => p.subcategory!))].sort(),
    [products]
  );

  const allApps = useMemo(
    () => [...new Set(products.filter((p) => PUMP_CATS.has(p.category)).flatMap((p) => p.applicationTags))].sort(),
    [products]
  );

  // Which contextual sections to show, based on the current category selection.
  const selectedPumpOnly = cats.size > 0 && [...cats].every((c) => PUMP_CATS.has(c));
  const selectedFurnitureRelevant = cats.size === 0 || cats.has("furniture");
  const showPumpFilters = cats.size === 0 || [...cats].some((c) => PUMP_CATS.has(c));
  const showFurnitureFilter = selectedFurnitureRelevant && seriesOptions.length > 0;

  function toggle(set: Set<string>, setter: (s: Set<string>) => void, v: string) {
    const next = new Set(set);
    next.has(v) ? next.delete(v) : next.add(v);
    setter(next);
  }

  const filtered = useMemo(() => {
    let out = products.filter((p) => {
      if (cats.size && !cats.has(p.category)) return false;
      if (series.size && p.category === "furniture" && !series.has(p.subcategory ?? "")) return false;
      if (flowIdx !== null) {
        const r = FLOW_RANGES[flowIdx];
        const f = p.specs.flowRateMaxLH;
        if (f === undefined || f < r.min || f > r.max) return false;
      }
      if (pressureIdx !== null) {
        const bar = p.specs.maxPressureBar;
        if (bar === undefined || bar > PRESSURE_RANGES[pressureIdx].max) return false;
      }
      if (apps.size && !p.applicationTags.some((t) => apps.has(t))) return false;
      if (atexOnly && !p.specs.atex) return false;
      if (wifiOnly && !p.specs.wifiCapable) return false;
      return true;
    });

    const flowOf = (p: Product) => p.specs.flowRateMaxLH ?? 0;
    const pressOf = (p: Product) => p.specs.maxPressureBar ?? 0;
    const priceOf = (p: Product) => getPriceInfo(p).price || 0;
    if (sort === "flow-asc") out = [...out].sort((a, b) => flowOf(a) - flowOf(b));
    else if (sort === "flow-desc") out = [...out].sort((a, b) => flowOf(b) - flowOf(a));
    else if (sort === "pressure-desc") out = [...out].sort((a, b) => pressOf(b) - pressOf(a));
    else if (sort === "price-asc") out = [...out].sort((a, b) => (priceOf(a) || Infinity) - (priceOf(b) || Infinity));
    else if (sort === "price-desc") out = [...out].sort((a, b) => priceOf(b) - priceOf(a));
    return out;
  }, [products, cats, series, flowIdx, pressureIdx, apps, atexOnly, wifiOnly, sort]);

  const appLabel = (t: string) => t.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");

  const activeCount =
    cats.size + series.size + apps.size + (flowIdx !== null ? 1 : 0) + (pressureIdx !== null ? 1 : 0) + (atexOnly ? 1 : 0) + (wifiOnly ? 1 : 0);

  function clearAll() {
    setCats(new Set());
    setSeries(new Set());
    setApps(new Set());
    setFlowIdx(null);
    setPressureIdx(null);
    setAtexOnly(false);
    setWifiOnly(false);
  }

  const filterBody = (
    <>
      {/* Category — the primary, always-visible navigation */}
      <FilterGroup title="Category">
        {availableCats.map((c) => (
          <CheckRow
            key={c.value}
            checked={cats.has(c.value)}
            onChange={() => toggle(cats, setCats, c.value)}
            label={c.label}
            count={catCounts[c.value]}
          />
        ))}
      </FilterGroup>

      {showFurnitureFilter && (
        <FilterGroup title="Collection">
          {seriesOptions.map((s) => (
            <CheckRow key={s} checked={series.has(s)} onChange={() => toggle(series, setSeries, s)} label={s} />
          ))}
        </FilterGroup>
      )}

      {showPumpFilters && (
        <>
          <FilterGroup title="Flow rate">
            {FLOW_RANGES.map((r, i) => (
              <label key={r.label} className="flex cursor-pointer items-center gap-2 py-1.5 text-sm text-text-muted hover:text-text">
                <input type="radio" name="flow" checked={flowIdx === i} onChange={() => setFlowIdx(i)} onClick={() => flowIdx === i && setFlowIdx(null)} className="h-4 w-4 accent-[var(--color-accent)]" />
                {r.label}
              </label>
            ))}
          </FilterGroup>

          <FilterGroup title="Max pressure">
            {PRESSURE_RANGES.map((r, i) => (
              <label key={r.label} className="flex cursor-pointer items-center gap-2 py-1.5 text-sm text-text-muted hover:text-text">
                <input type="radio" name="pressure" checked={pressureIdx === i} onChange={() => setPressureIdx(i)} onClick={() => pressureIdx === i && setPressureIdx(null)} className="h-4 w-4 accent-[var(--color-accent)]" />
                {r.label}
              </label>
            ))}
          </FilterGroup>

          <FilterGroup title="Application">
            <div className="max-h-56 overflow-y-auto pr-1">
              {allApps.map((t) => (
                <CheckRow key={t} checked={apps.has(t)} onChange={() => toggle(apps, setApps, t)} label={appLabel(t)} />
              ))}
            </div>
          </FilterGroup>

          <FilterGroup title="Features">
            <CheckRow checked={atexOnly} onChange={() => setAtexOnly(!atexOnly)} label="ATEX certified" />
            <CheckRow checked={wifiOnly} onChange={() => setWifiOnly(!wifiOnly)} label="IoT / Wi-Fi" />
          </FilterGroup>
        </>
      )}
    </>
  );

  const sortOptions: { v: SortKey; label: string }[] = [
    { v: "relevance", label: "Featured" },
    { v: "price-asc", label: "Price: Low → High" },
    { v: "price-desc", label: "Price: High → Low" },
    ...(showPumpFilters
      ? ([
          { v: "flow-desc", label: "Flow: High → Low" },
          { v: "flow-asc", label: "Flow: Low → High" },
          { v: "pressure-desc", label: "Pressure: High → Low" },
        ] as { v: SortKey; label: string }[])
      : []),
  ];

  return (
    <div className="lg:grid lg:grid-cols-[260px_1fr] lg:gap-8">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wide text-text">Browse</h2>
          {activeCount > 0 && (
            <button onClick={clearAll} className="text-xs font-medium text-accent hover:underline">Clear all</button>
          )}
        </div>
        <div className="space-y-4">{filterBody}</div>
      </aside>

      <div>
        <div className="mb-4 flex items-center gap-3">
          <button
            onClick={() => setDrawerOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm font-semibold text-text lg:hidden"
          >
            <Icon name="sliders-horizontal" size={16} />
            Categories &amp; filters
            {activeCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[11px] font-bold text-white">{activeCount}</span>
            )}
          </button>
          <p className="hidden text-sm text-text-muted sm:block">
            {filtered.length} product{filtered.length === 1 ? "" : "s"}
          </p>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="ml-auto rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary-light"
          >
            {sortOptions.map((o) => (
              <option key={o.v} value={o.v}>Sort: {o.label}</option>
            ))}
          </select>
        </div>

        <p className="mb-3 text-sm text-text-muted sm:hidden">
          {filtered.length} product{filtered.length === 1 ? "" : "s"}
        </p>

        <ProductGrid products={filtered} />
      </div>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDrawerOpen(false)} />
          <div className="absolute inset-x-0 bottom-0 flex max-h-[85vh] flex-col rounded-t-2xl bg-surface shadow-xl">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <h2 className="text-base font-bold text-text">Categories &amp; filters</h2>
              <div className="flex items-center gap-3">
                {activeCount > 0 && <button onClick={clearAll} className="text-sm font-medium text-accent">Clear</button>}
                <button onClick={() => setDrawerOpen(false)} aria-label="Close" className="text-text-muted hover:text-text"><Icon name="x" size={22} /></button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-4">{filterBody}</div>
            <div className="border-t border-border p-4">
              <button onClick={() => setDrawerOpen(false)} className="w-full rounded-lg bg-accent py-3 font-semibold text-white hover:brightness-110">
                Show {filtered.length} product{filtered.length === 1 ? "" : "s"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
