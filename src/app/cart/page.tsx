"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useCartStore } from "@/stores/cartStore";
import { formatINR } from "@/lib/pricing";
import { Icon } from "@/components/Icon";

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const setQty = useCartStore((s) => s.setQty);
  const remove = useCartStore((s) => s.remove);
  const clear = useCartStore((s) => s.clear);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const total = items.reduce((s, i) => s + i.unitPrice * i.qty, 0);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <Icon name="shopping-cart" size={48} strokeWidth={1.5} className="mx-auto text-text-muted" />
        <h1 className="mt-4 text-2xl font-bold text-text">Your cart is empty</h1>
        <p className="mt-2 text-text-muted">
          Add priced products to your cart, or request a quote for custom orders.
        </p>
        <Link
          href="/products"
          className="mt-6 inline-block rounded-lg bg-accent px-6 py-3 font-semibold text-white hover:brightness-110"
        >
          Browse catalogue
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-text">Your cart</h1>
        <button onClick={clear} className="text-sm font-medium text-text-muted hover:text-error">
          Clear cart
        </button>
      </div>

      <div className="mt-6 space-y-3">
        {items.map((item) => (
          <div
            key={item.slug}
            className="flex items-center gap-4 rounded-xl border border-border bg-surface p-4"
          >
            <Link href={`/products/${item.slug}`} className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-border bg-white">
              {item.image ? (
                <Image src={item.image} alt={item.name} fill sizes="64px" className="object-contain p-1" unoptimized={item.image.startsWith("data:")} />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-text-muted">
                  <Icon name="image-off" size={20} />
                </span>
              )}
            </Link>
            <div className="flex-1">
              <Link href={`/products/${item.slug}`} className="font-semibold text-text hover:text-primary">
                {item.name}
              </Link>
              <div className="text-sm text-text-muted">{formatINR(item.unitPrice)} each</div>
            </div>
            <div className="flex items-center gap-1 rounded-lg border border-border">
              <button onClick={() => setQty(item.slug, item.qty - 1)} className="px-3 py-1.5 text-text-muted hover:text-primary" aria-label="Decrease">−</button>
              <span className="w-8 text-center text-sm font-semibold">{item.qty}</span>
              <button onClick={() => setQty(item.slug, item.qty + 1)} className="px-3 py-1.5 text-text-muted hover:text-primary" aria-label="Increase">+</button>
            </div>
            <div className="w-24 text-right font-bold text-text">
              {formatINR(item.unitPrice * item.qty)}
            </div>
            <button onClick={() => remove(item.slug)} className="text-text-muted hover:text-error" aria-label={`Remove ${item.name}`}>
              <Icon name="trash-2" size={18} />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-col items-end gap-4 rounded-xl border border-border bg-surface p-6">
        <div className="flex w-full max-w-xs items-center justify-between text-lg">
          <span className="font-medium text-text-muted">Total</span>
          <span className="font-extrabold text-text">{formatINR(total)}</span>
        </div>
        <Link
          href="/checkout"
          className="rounded-lg bg-accent px-8 py-3 font-semibold text-white hover:brightness-110"
        >
          Proceed to checkout
        </Link>
      </div>
    </div>
  );
}
