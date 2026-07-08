"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCartStore } from "@/stores/cartStore";
import { Icon } from "@/components/Icon";

export function CartLink() {
  const items = useCartStore((s) => s.items);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const count = mounted ? items.reduce((n, i) => n + i.qty, 0) : 0;

  return (
    <Link
      href="/cart"
      className="relative inline-flex items-center text-text-muted hover:text-primary"
      aria-label={`Cart (${count} items)`}
    >
      <Icon name="shopping-cart" size={22} />
      {count > 0 && (
        <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-white">
          {count}
        </span>
      )}
    </Link>
  );
}
