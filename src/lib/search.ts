import Fuse from "fuse.js";
import type { Product } from "@/lib/types";

// Maps natural-language intent keywords to application tags. Search queries are
// scanned for these phrases to bias results toward the right use-case.
export const intentMap: Record<string, string[]> = {
  "swimming pool": ["swimming-pool", "chlorination"],
  pool: ["swimming-pool", "chlorination"],
  boiler: ["boiler-feed", "high-pressure"],
  chlorine: ["chlorination", "water-treatment"],
  ph: ["ph-control", "water-treatment"],
  solar: ["solar-offgrid"],
  "off grid": ["solar-offgrid"],
  "12v": ["solar-offgrid"],
  battery: ["solar-offgrid"],
  atex: ["hazardous-area"],
  explosive: ["hazardous-area"],
  "zone 2": ["hazardous-area"],
  wastewater: ["wastewater"],
  sewage: ["wastewater"],
  food: ["food-beverage"],
  cip: ["food-beverage"],
  beverage: ["food-beverage"],
  "reverse osmosis": ["reverse-osmosis"],
  "ro plant": ["reverse-osmosis"],
  "cooling tower": ["cooling-tower"],
  wifi: ["iot-remote"],
  "wi-fi": ["iot-remote"],
  remote: ["iot-remote"],
  iot: ["iot-remote"],
  scada: ["iot-remote"],
  modbus: ["iot-remote"],
  peristaltic: ["peristaltic"],
  slurry: ["peristaltic"],
  viscous: ["peristaltic"],
  hypochlorite: ["chlorination", "peristaltic"],
  "sodium hypochlorite": ["chlorination", "peristaltic"],
  electroplating: ["electroplating"],
  "nickel plating": ["electroplating"],
  coagulant: ["water-treatment", "wastewater"],
  flocculant: ["wastewater", "peristaltic"],
};

export interface NumericIntent {
  minFlowLH?: number;
  minPressureBar?: number;
}

/** Parse "500 l/h" / "20 bar" / "100bar" style requirements from a query. */
export function parseNumericIntent(query: string): NumericIntent {
  const intent: NumericIntent = {};
  const q = query.toLowerCase();

  const flow = q.match(/(\d+(?:\.\d+)?)\s*l\s*\/?\s*h/);
  if (flow) intent.minFlowLH = parseFloat(flow[1]);

  const bar = q.match(/(\d+(?:\.\d+)?)\s*bar/);
  if (bar) intent.minPressureBar = parseFloat(bar[1]);

  return intent;
}

/** Returns the application tags implied by the query's intent keywords. */
export function matchIntentTags(query: string): string[] {
  const q = query.toLowerCase();
  const tags = new Set<string>();
  for (const [keyword, mapped] of Object.entries(intentMap)) {
    if (q.includes(keyword)) mapped.forEach((t) => tags.add(t));
  }
  return [...tags];
}

export interface SearchResult {
  product: Product;
  score: number;
}

/**
 * Smart search: blends fuzzy text matching (Fuse.js over name/desc/tags) with
 * intent-tag boosting and numeric (flow/pressure) filtering.
 */
export function searchProducts(
  query: string,
  products: Product[]
): SearchResult[] {
  const trimmed = query.trim();
  if (!trimmed) return products.map((product) => ({ product, score: 0 }));

  const intentTags = matchIntentTags(trimmed);
  const numeric = parseNumericIntent(trimmed);

  const fuse = new Fuse(products, {
    includeScore: true,
    threshold: 0.45,
    ignoreLocation: true,
    keys: [
      { name: "name", weight: 3 },
      { name: "fullName", weight: 2 },
      { name: "shortDesc", weight: 1 },
      { name: "useCaseDesc", weight: 1 },
      { name: "searchTags", weight: 2 },
      { name: "applicationTags", weight: 2 },
      { name: "subcategory", weight: 1 },
    ],
  });

  const fuseHits = fuse.search(trimmed);

  // Build a score map: lower Fuse score = better, so invert to a 0..1 relevance.
  const scored = new Map<string, number>();
  for (const hit of fuseHits) {
    scored.set(hit.item.slug, 1 - (hit.score ?? 1));
  }

  // Boost products matching intent tags even if text didn't match strongly.
  for (const product of products) {
    let bonus = 0;
    if (intentTags.some((t) => product.applicationTags.includes(t))) {
      bonus += 0.6;
    }
    if (bonus > 0) {
      scored.set(product.slug, (scored.get(product.slug) ?? 0) + bonus);
    }
  }

  let results: SearchResult[] = products
    .filter((p) => scored.has(p.slug))
    .map((product) => ({ product, score: scored.get(product.slug) ?? 0 }));

  // Apply numeric filtering on capability.
  if (numeric.minFlowLH !== undefined) {
    results = results.filter(
      (r) => (r.product.specs.flowRateMaxLH ?? 0) >= numeric.minFlowLH!
    );
  }
  if (numeric.minPressureBar !== undefined) {
    results = results.filter(
      (r) => (r.product.specs.maxPressureBar ?? 0) >= numeric.minPressureBar!
    );
  }

  return results.sort((a, b) => b.score - a.score);
}
