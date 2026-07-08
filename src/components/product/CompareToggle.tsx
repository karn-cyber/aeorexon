"use client";

import { useCompareStore } from "@/stores/compareStore";
import { useEffect, useState } from "react";

export function CompareToggle({ slug, className = "" }: { slug: string; className?: string }) {
  const toggle = useCompareStore((s) => s.toggle);
  const slugs = useCompareStore((s) => s.slugs);
  // Avoid hydration mismatch from persisted store.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const checked = mounted && slugs.includes(slug);
  const full = mounted && slugs.length >= 3 && !checked;

  return (
    <label
      className={`flex cursor-pointer items-center gap-2 text-xs font-medium ${
        full ? "cursor-not-allowed opacity-40" : "text-text-muted hover:text-primary"
      } ${className}`}
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={full}
        onChange={() => toggle(slug)}
        className="h-4 w-4 accent-[var(--color-accent)]"
      />
      Compare
    </label>
  );
}
