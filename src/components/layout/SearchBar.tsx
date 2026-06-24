"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function SearchBar({
  large = false,
  initialQuery = "",
}: {
  large?: boolean;
  initialQuery?: string;
}) {
  const router = useRouter();
  const [q, setQ] = useState(initialQuery);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = q.trim();
    if (trimmed) router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  }

  return (
    <form onSubmit={submit} className="w-full">
      <div className="relative">
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={
            large
              ? "Describe what you need — e.g. 'chlorine dosing for swimming pool'"
              : "Search pumps, controllers, use-cases…"
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
  );
}
