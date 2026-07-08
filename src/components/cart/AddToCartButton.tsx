"use client";

import { useState } from "react";
import { useCartStore } from "@/stores/cartStore";
import { Icon } from "@/components/Icon";

export function AddToCartButton({
  slug,
  name,
  unitPrice,
  image,
  className = "",
}: {
  slug: string;
  name: string;
  unitPrice: number;
  image?: string;
  className?: string;
}) {
  const add = useCartStore((s) => s.add);
  const [added, setAdded] = useState(false);

  function handle() {
    add({ slug, name, unitPrice, image });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <button
      onClick={handle}
      className={`inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent py-3 font-semibold text-white transition hover:brightness-110 ${className}`}
    >
      <Icon name={added ? "check" : "shopping-cart"} size={18} />
      {added ? "Added to cart" : "Add to Cart"}
    </button>
  );
}
