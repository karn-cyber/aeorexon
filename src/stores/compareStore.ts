"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

const MAX_COMPARE = 3;

interface CompareState {
  slugs: string[];
  toggle: (slug: string) => void;
  remove: (slug: string) => void;
  clear: () => void;
  has: (slug: string) => boolean;
  isFull: () => boolean;
}

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      slugs: [],
      toggle: (slug) => {
        const { slugs } = get();
        if (slugs.includes(slug)) {
          set({ slugs: slugs.filter((s) => s !== slug) });
        } else if (slugs.length < MAX_COMPARE) {
          set({ slugs: [...slugs, slug] });
        }
      },
      remove: (slug) => set({ slugs: get().slugs.filter((s) => s !== slug) }),
      clear: () => set({ slugs: [] }),
      has: (slug) => get().slugs.includes(slug),
      isFull: () => get().slugs.length >= MAX_COMPARE,
    }),
    { name: "aorexon-compare" }
  )
);

export { MAX_COMPARE };
