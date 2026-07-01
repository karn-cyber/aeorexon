"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { formatINR } from "@/lib/pricing";
import { Icon } from "@/components/Icon";

interface Suggestion {
  slug: string;
  name: string;
  category: string;
  image: string | null;
  price: number | null;
}

export function SearchBar({
  large = false,
  initialQuery = "",
}: {
  large?: boolean;
  initialQuery?: string;
}) {
  const router = useRouter();
  const [q, setQ] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const boxRef = useRef<HTMLDivElement>(null);

  // Debounced suggestion fetch.
  useEffect(() => {
    const trimmed = q.trim();
    if (trimmed.length < 2) {
      setSuggestions([]);
      return;
    }
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`, { signal: ctrl.signal });
        const data = await res.json();
        if (data.ok) {
          setSuggestions(data.suggestions);
          setOpen(true);
          setActive(-1);
        }
      } catch {
        /* aborted */
      }
    }, 180);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [q]);

  // Close on outside click.
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function go(query: string) {
    const trimmed = query.trim();
    if (trimmed) {
      setOpen(false);
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    }
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (active >= 0 && suggestions[active]) {
      setOpen(false);
      router.push(`/products/${suggestions[active].slug}`);
    } else {
      go(q);
    }
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (!open || suggestions.length === 0) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, suggestions.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, -1)); }
    else if (e.key === "Escape") setOpen(false);
  }

  return (
    <div ref={boxRef} className="relative w-full">
      <form onSubmit={submit}>
        <div className="relative">
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={onKeyDown}
            onFocus={() => suggestions.length && setOpen(true)}
            autoComplete="off"
            placeholder={
              large
                ? "Search anything — 'cafe chairs', 'chlorine dosing pump'…"
                : "Search pumps, chairs, controllers…"
            }
            className={`w-full rounded-full border border-border bg-surface pl-5 pr-28 text-text shadow-sm outline-none focus:border-primary-light focus:ring-2 focus:ring-primary-light/30 ${
              large ? "py-4 text-lg" : "py-2.5 text-sm"
            }`}
          />
          <button
            type="submit"
            className={`absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-accent font-semibold text-white transition hover:brightness-110 ${
              large ? "px-6 py-2.5 text-base" : "px-4 py-1.5 text-sm"
            }`}
          >
            Search
          </button>
        </div>
      </form>

      {open && suggestions.length > 0 && (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-border bg-surface shadow-xl">
          {suggestions.map((s, i) => (
            <button
              key={s.slug}
              onMouseEnter={() => setActive(i)}
              onClick={() => { setOpen(false); router.push(`/products/${s.slug}`); }}
              className={`flex w-full items-center gap-3 px-3 py-2.5 text-left ${i === active ? "bg-bg" : "hover:bg-bg"}`}
            >
              <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-border bg-white">
                {s.image ? (
                  <Image src={s.image} alt={s.name} fill sizes="44px" className="object-contain p-1" unoptimized={s.image.startsWith("data:")} />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-text-muted"><Icon name="image-off" size={16} /></span>
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-text">{s.name}</span>
                <span className="block text-xs text-text-muted">{s.category}</span>
              </span>
              {s.price != null && (
                <span className="shrink-0 text-sm font-semibold text-text">{formatINR(s.price)}</span>
              )}
            </button>
          ))}
          <button
            onClick={() => go(q)}
            className="flex w-full items-center gap-2 border-t border-border px-3 py-2.5 text-sm font-semibold text-accent hover:bg-bg"
          >
            <Icon name="arrow-right" size={15} /> See all results for “{q.trim()}”
          </button>
        </div>
      )}
    </div>
  );
}
