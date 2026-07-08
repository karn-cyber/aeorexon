"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  slug: string;
  name: string;
  /** Unit price snapshot (after discount) at the time of adding. */
  unitPrice: number;
  qty: number;
  image?: string;
}

interface CartState {
  items: CartItem[];
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
  count: () => number;
  total: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item, qty = 1) => {
        const items = get().items;
        const existing = items.find((i) => i.slug === item.slug);
        if (existing) {
          set({
            items: items.map((i) =>
              i.slug === item.slug ? { ...i, qty: i.qty + qty, unitPrice: item.unitPrice } : i
            ),
          });
        } else {
          set({ items: [...items, { ...item, qty }] });
        }
      },
      setQty: (slug, qty) =>
        set({
          items: get()
            .items.map((i) => (i.slug === slug ? { ...i, qty: Math.max(1, qty) } : i))
            .filter((i) => i.qty > 0),
        }),
      remove: (slug) => set({ items: get().items.filter((i) => i.slug !== slug) }),
      clear: () => set({ items: [] }),
      count: () => get().items.reduce((n, i) => n + i.qty, 0),
      total: () => get().items.reduce((s, i) => s + i.unitPrice * i.qty, 0),
    }),
    { name: "aorexon-cart" }
  )
);
