import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/types";
import { flowSummary, pressureSummary, controlLabel, primaryImage } from "@/lib/format";
import { Icon } from "@/components/Icon";
import { PriceTag } from "./PriceTag";
import { CompareToggle } from "./CompareToggle";

const CATEGORY_LABELS: Record<string, string> = {
  "solenoid-wall": "Solenoid · Wall",
  "solenoid-base": "Solenoid · Base",
  "motor-driven": "Motor-Driven",
  peristaltic: "Peristaltic",
  controllers: "Controller",
  accessories: "Accessory",
};

export function ProductCard({ product }: { product: Product }) {
  const flow = flowSummary(product);
  const pressure = pressureSummary(product);
  const control = controlLabel(product);
  const image = primaryImage(product);

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-sm transition hover:shadow-md">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-white">
          {image ? (
            <Image
              src={image.url}
              alt={image.alt || product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-contain p-4 transition group-hover:scale-[1.03]"
              unoptimized={image.url.startsWith("data:")}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-text-muted">
              <Icon name="image-off" size={40} strokeWidth={1.5} />
            </div>
          )}
        </div>
      </Link>
      <Link href={`/products/${product.slug}`} className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center justify-between">
          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-primary">
            {CATEGORY_LABELS[product.category] ?? product.category}
          </span>
          <div className="flex gap-1">
            {product.specs.atex && (
              <span className="rounded bg-warning/15 px-1.5 py-0.5 text-[10px] font-bold text-warning">
                ATEX
              </span>
            )}
            {product.specs.wifiCapable && (
              <span className="rounded bg-success/15 px-1.5 py-0.5 text-[10px] font-bold text-success">
                Wi-Fi
              </span>
            )}
          </div>
        </div>

        <h3 className="text-lg font-bold text-text group-hover:text-primary">
          {product.name}
        </h3>
        <p className="mt-1 line-clamp-3 flex-1 text-sm text-text-muted">
          {product.shortDesc}
        </p>

        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-muted">
          {flow && (
            <span>
              <span className="font-semibold text-text">{flow}</span> flow
            </span>
          )}
          {pressure && (
            <span>
              <span className="font-semibold text-text">{pressure}</span>
            </span>
          )}
          {control && <span>{control} control</span>}
        </div>

        <div className="mt-3">
          <PriceTag product={product} size="sm" />
        </div>
      </Link>

      <div className="flex items-center justify-between border-t border-border px-5 py-3">
        <CompareToggle slug={product.slug} />
        <Link
          href={`/products/${product.slug}`}
          className="text-sm font-semibold text-accent hover:underline"
        >
          View details →
        </Link>
      </div>
    </div>
  );
}
