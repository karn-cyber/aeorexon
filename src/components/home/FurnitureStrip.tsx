import Link from "next/link";
import Image from "next/image";
import { cafeChairs, diningChairs } from "@/data/lynchpin";
import { Icon } from "@/components/Icon";

// Dynamic, attention-grabbing furniture teaser: an auto-scrolling band of real
// Lynchpin chairs (pure-CSS marquee), leading into the seating collection.
export function FurnitureStrip() {
  const chairs = [...cafeChairs.slice(0, 12), ...diningChairs.slice(0, 10)];

  return (
    <section className="bg-primary py-12 text-white">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
              <Icon name="armchair" size={14} /> Channel Partner · Lynchpin
            </span>
            <h2 className="mt-3 text-2xl font-extrabold sm:text-3xl">
              Café &amp; Dining Seating
            </h2>
            <p className="mt-1 text-white/70">
              {cafeChairs.length + diningChairs.length} chair designs for cafés,
              restaurants &amp; homes.
            </p>
          </div>
          <Link
            href="/solutions/lynchpin-seating"
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-3 font-semibold text-white hover:brightness-110"
          >
            Explore the collection <Icon name="arrow-right" size={18} />
          </Link>
        </div>
      </div>

      <div className="mt-8 overflow-hidden">
        <div className="marquee-track gap-4">
          {[...chairs, ...chairs].map((c, i) => (
            <Link
              key={i}
              href="/solutions/lynchpin-seating"
              className="group relative h-36 w-36 shrink-0 overflow-hidden rounded-xl bg-white sm:h-44 sm:w-44"
              aria-label={c.name}
            >
              <Image
                src={c.image}
                alt={c.name}
                fill
                sizes="176px"
                className="object-contain p-3 transition duration-500 group-hover:scale-110"
              />
              <span className="absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-black/60 to-transparent px-2 py-1.5 text-xs font-medium text-white">
                {c.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
