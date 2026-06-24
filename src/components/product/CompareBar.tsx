"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCompareStore } from "@/stores/compareStore";
import { Icon } from "@/components/Icon";

export function CompareBar() {
  const slugs = useCompareStore((s) => s.slugs);
  const remove = useCompareStore((s) => s.remove);
  const clear = useCompareStore((s) => s.clear);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted || slugs.length === 0) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-surface/95 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3">
        <span className="text-sm font-semibold text-text">
          Compare ({slugs.length}/3)
        </span>
        <div className="flex flex-1 flex-wrap gap-2">
          {slugs.map((slug) => (
            <span
              key={slug}
              className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
            >
              {slug}
              <button
                onClick={() => remove(slug)}
                className="text-primary/60 hover:text-error"
                aria-label={`Remove ${slug}`}
              >
                <Icon name="x" size={12} />
              </button>
            </span>
          ))}
        </div>
        <button
          onClick={clear}
          className="text-xs font-medium text-text-muted hover:text-error"
        >
          Clear
        </button>
        <Link
          href="/compare"
          className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:brightness-110"
        >
          Compare →
        </Link>
      </div>
    </div>
  );
}
