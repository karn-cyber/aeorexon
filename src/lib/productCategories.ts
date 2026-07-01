import type { CategorySlug } from "@/lib/types";

// All categories an admin can classify a product under — the six dosing
// categories plus the newer business areas (furniture, bearings).
export const PRODUCT_CATEGORIES: { value: CategorySlug; label: string }[] = [
  { value: "solenoid-wall", label: "Solenoid · Wall" },
  { value: "solenoid-base", label: "Solenoid · Base" },
  { value: "motor-driven", label: "Motor-Driven" },
  { value: "peristaltic", label: "Peristaltic" },
  { value: "controllers", label: "Controllers" },
  { value: "accessories", label: "Accessories" },
  { value: "furniture", label: "Furniture & Seating" },
  { value: "bearings", label: "Bearings" },
];

export const categoryLabel = (slug: string): string =>
  PRODUCT_CATEGORIES.find((c) => c.value === slug)?.label ?? slug;
