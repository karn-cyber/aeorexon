// Core domain types for the Aorexon catalogue.

export type CategorySlug =
  | "solenoid-wall"
  | "solenoid-base"
  | "motor-driven"
  | "peristaltic"
  | "controllers"
  | "accessories";

export interface ProductModel {
  code: string;
  /** Max pressure for this hydraulic, in bar. */
  maxPressureBar?: number;
  /** Max flow for this hydraulic, in l/h. */
  maxFlowLH?: number;
  /** Stroke frequency, strokes/min. */
  freqStrMin?: number;
  /** Free-form extra columns (pressure/flow ranges, motor kW, weight, etc.). */
  [key: string]: string | number | undefined;
}

export interface ProductSpecs {
  flowRateMinLH?: number;
  flowRateMaxLH?: number;
  maxPressureBar?: number;
  powerSupply?: string;
  pumpHead?: string;
  diaphragm?: string;
  diaphragmWarrantyYears?: number;
  enclosure?: string;
  strokeRateMin?: number;
  strokeRateMax?: number;
  motorKw?: string;
  controlType?: "analogue" | "digital" | "proportional" | "mechanical" | "mixed";
  levelControlInput?: boolean;
  atex?: boolean;
  wifiCapable?: boolean;
  modbusCapable?: boolean;
  installationType?: "wall" | "base" | "panel" | "din-rail" | "inline";
  [key: string]: string | number | boolean | undefined;
}

export interface UpsellRule {
  condition: string;
  targetSlug: string;
  label: string;
}

export type RelationType = "accessory" | "alternative" | "upgrade";

export interface ProductRelation {
  slug: string;
  type: RelationType;
}

export interface ProductDocument {
  name: string;
  url: string;
  type: "datasheet" | "manual" | "keycode";
}

export interface Product {
  slug: string;
  name: string;
  fullName?: string;
  shortDesc: string;
  useCaseDesc: string;
  category: CategorySlug;
  subcategory?: string;
  brand: string;
  /** Plain-language "this is used for" bullets shown in the hero. */
  usedFor?: string[];
  specs: ProductSpecs;
  models: ProductModel[];
  /** Column headers (in order) describing the `models` rows for the model table. */
  modelColumns?: { key: string; label: string }[];
  searchTags: string[];
  applicationTags: string[];
  upsellRules: UpsellRule[];
  relatedProducts: ProductRelation[];
  documents?: ProductDocument[];
  isDirectBuy: boolean;
  featured?: boolean;
}

export interface Category {
  slug: CategorySlug;
  name: string;
  short: string;
  icon: string;
}

export interface UseCase {
  slug: string;
  title: string;
  intro: string;
  primarySlug: string;
  altSlugs: string[];
  icon: string;
}
