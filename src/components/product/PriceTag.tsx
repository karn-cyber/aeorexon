import type { Product } from "@/lib/types";
import { getPriceInfo, formatINR } from "@/lib/pricing";

// Server component — renders price + discount, or a "quote-only" hint.
export function PriceTag({
  product,
  size = "md",
}: {
  product: Product;
  size?: "sm" | "md" | "lg";
}) {
  const info = getPriceInfo(product);

  if (!info.hasPrice) {
    return (
      <span
        className={`font-semibold text-text-muted ${
          size === "lg" ? "text-base" : "text-sm"
        }`}
      >
        Price on request
      </span>
    );
  }

  const priceClass =
    size === "lg" ? "text-3xl" : size === "sm" ? "text-base" : "text-xl";

  return (
    <div className="flex flex-wrap items-baseline gap-2">
      <span className={`font-extrabold text-text ${priceClass}`}>
        {formatINR(info.price)}
      </span>
      {info.discountPercent > 0 && (
        <>
          <span className="text-sm text-text-muted line-through">
            {formatINR(info.mrp)}
          </span>
          <span className="rounded bg-success/15 px-1.5 py-0.5 text-xs font-bold text-success">
            {info.discountPercent}% off
          </span>
        </>
      )}
      {info.offerLabel && (
        <span className="rounded bg-accent/15 px-1.5 py-0.5 text-xs font-bold text-accent">
          {info.offerLabel}
        </span>
      )}
    </div>
  );
}
