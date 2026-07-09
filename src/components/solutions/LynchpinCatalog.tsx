"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Chair, LynchpinSeries } from "@/data/lynchpin";
import { Icon } from "@/components/Icon";

// Reveal-on-scroll: adds .is-visible to [data-reveal] as they enter the viewport.
function useScrollReveal(deps: unknown[]) {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll("[data-reveal]:not(.is-visible)"));
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

function ChairCard({ chair, index, onOpen }: { chair: Chair; index: number; onOpen: () => void }) {
  return (
    <div data-reveal className="tilt-scene" style={{ transitionDelay: `${(index % 6) * 40}ms` }}>
      <button
        onClick={onOpen}
        className="tilt-card group flex w-full flex-col overflow-hidden rounded-xl border border-border bg-surface text-left"
      >
        <div className="relative aspect-square w-full overflow-hidden bg-gradient-to-b from-bg to-white">
          <Image
            src={chair.image}
            alt={chair.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
            className="tilt-float object-contain p-3"
          />
        </div>
        <div className="px-3 py-2.5">
          <div className="truncate text-sm font-semibold text-text group-hover:text-accent">{chair.name}</div>
          <div className="mono-label text-text-muted">Lynchpin</div>
        </div>
      </button>
    </div>
  );
}

function Lightbox({
  items,
  index,
  onClose,
  onNav,
}: {
  items: Chair[];
  index: number;
  onClose: () => void;
  onNav: (i: number) => void;
}) {
  const chair = items[index];
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNav((index + 1) % items.length);
      if (e.key === "ArrowLeft") onNav((index - 1 + items.length) % items.length);
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [index, items.length, onClose, onNav]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4" onClick={onClose}>
      <button className="absolute right-4 top-4 text-white/80 hover:text-white" onClick={onClose} aria-label="Close"><Icon name="x" size={28} /></button>
      <button className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 sm:left-6" onClick={(e) => { e.stopPropagation(); onNav((index - 1 + items.length) % items.length); }} aria-label="Previous"><Icon name="chevron-right" size={26} className="rotate-180" /></button>
      <button className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 sm:right-6" onClick={(e) => { e.stopPropagation(); onNav((index + 1) % items.length); }} aria-label="Next"><Icon name="chevron-right" size={26} /></button>
      <div className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-white">
          <Image src={chair.image} alt={chair.name} fill sizes="90vw" className="object-contain p-6" />
        </div>
        <div className="mt-4 text-center text-white">
          <h3 className="text-2xl font-bold">{chair.name}</h3>
          <p className="text-sm text-white/60">Lynchpin · {index + 1} of {items.length}</p>
          <div className="mt-4 flex justify-center gap-3">
            <Link href={`/chat/new?slug=lynchpin-${chair.slug}&name=${encodeURIComponent(chair.name)}`} className="rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:brightness-110">Request a quote</Link>
            <a href="tel:9011023081" className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10"><Icon name="phone" size={16} /> Call</a>
          </div>
        </div>
      </div>
    </div>
  );
}

function Grid({ items, onOpen }: { items: Chair[]; onOpen: (i: number, list: Chair[]) => void }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
      {items.map((c, i) => (
        <ChairCard key={c.slug} chair={c} index={i} onOpen={() => onOpen(i, items)} />
      ))}
    </div>
  );
}

export function LynchpinCatalog({
  series,
  lifestyle,
}: {
  series: LynchpinSeries[];
  lifestyle: Record<string, string>;
}) {
  const [query, setQuery] = useState("");
  const [box, setBox] = useState<{ list: Chair[]; index: number } | null>(null);
  const q = query.trim().toLowerCase();
  const searching = q.length > 0;

  useScrollReveal([query]);

  const scrollTo = (key: string) =>
    document.getElementById(`series-${key}`)?.scrollIntoView({ behavior: "smooth", block: "start" });

  const results = searching
    ? series.flatMap((s) => s.items).filter((c) => c.name.toLowerCase().includes(q))
    : [];
  const marquee = series.flatMap((s) => s.items.slice(0, 3)).slice(0, 18);

  return (
    <div>
      {!searching && (
        <div className="overflow-hidden border-y border-border bg-surface py-4">
          <div className="marquee-track gap-4">
            {[...marquee, ...marquee].map((c, i) => (
              <div key={i} className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg border border-border bg-white">
                <Image src={c.image} alt={c.name} fill sizes="96px" className="object-contain p-2" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sticky series nav + search */}
      <div className="sticky top-0 z-30 border-b border-border bg-bg/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-3">
          <div className="flex flex-1 gap-2 overflow-x-auto">
            {series.map((s) => (
              <button
                key={s.key}
                onClick={() => scrollTo(s.key)}
                className="shrink-0 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-text-muted hover:border-accent hover:text-accent"
              >
                {s.title} · {s.items.length}
              </button>
            ))}
          </div>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search…"
            className="w-32 shrink-0 rounded-full border border-border bg-surface px-4 py-2 text-sm outline-none focus:border-accent sm:w-56"
          />
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4">
        {searching ? (
          <section className="py-8">
            <h2 className="mb-4 text-lg font-bold text-text">
              {results.length} result{results.length === 1 ? "" : "s"} for “{query}”
            </h2>
            <Grid items={results} onOpen={(i, list) => setBox({ list, index: i })} />
          </section>
        ) : (
          series.map((s) => (
            <CollectionBlock
              key={s.key}
              seriesKey={s.key}
              title={s.title}
              blurb={s.intro}
              image={lifestyle[s.key]}
              items={s.items}
              onOpen={(i) => setBox({ list: s.items, index: i })}
            />
          ))
        )}
      </div>

      {box && (
        <Lightbox items={box.list} index={box.index} onClose={() => setBox(null)} onNav={(i) => setBox({ list: box.list, index: i })} />
      )}
    </div>
  );
}

const CollectionBlock = ({
  seriesKey,
  title,
  blurb,
  image,
  items,
  onOpen,
}: {
  seriesKey: string;
  title: string;
  blurb: string;
  image?: string;
  items: Chair[];
  onOpen: (i: number) => void;
}) => (
  <section id={`series-${seriesKey}`} className="scroll-mt-20 py-10">
    {image ? (
      <div data-reveal className="relative mb-6 overflow-hidden rounded-2xl">
        <div className="relative h-52 w-full sm:h-72">
          <Image src={image} alt={title} fill sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        </div>
        <div className="absolute bottom-0 left-0 p-6 text-white">
          <h2 className="text-2xl font-extrabold sm:text-3xl">{title}</h2>
          <p className="mt-1 max-w-lg text-sm text-white/85">{blurb}</p>
          <p className="mono-label mt-2 text-white/70">{items.length} designs</p>
        </div>
      </div>
    ) : (
      <div data-reveal className="mb-5 border-l-2 border-accent pl-4">
        <h2 className="text-2xl font-extrabold text-text">{title}</h2>
        <p className="mt-1 max-w-lg text-sm text-text-muted">{blurb}</p>
        <p className="mono-label mt-1 text-text-muted">{items.length} designs</p>
      </div>
    )}
    <Grid items={items} onOpen={(i) => onOpen(i)} />
  </section>
);
