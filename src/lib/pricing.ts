import type { Product } from "@/lib/types";

export interface PriceInfo {
  hasPrice: boolean;
  /** List price (before discount). */
  mrp: number;
  /** Effective price after any discount. */
  price: number;
  discountPercent: number;
  offerLabel?: string;
}

export function getPriceInfo(p: Pick<Product, "price" | "discountPercent" | "offerLabel">): PriceInfo {
  const mrp = typeof p.price === "number" && p.price > 0 ? p.price : 0;
  const discount =
    typeof p.discountPercent === "number"
      ? Math.max(0, Math.min(100, p.discountPercent))
      : 0;
  const price = Math.round(mrp * (1 - discount / 100));
  return {
    hasPrice: mrp > 0,
    mrp,
    price,
    discountPercent: discount,
    offerLabel: p.offerLabel,
  };
}

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export function formatINR(amount: number): string {
  return inr.format(amount);
}
