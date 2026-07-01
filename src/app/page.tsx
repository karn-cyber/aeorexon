import Link from "next/link";
import Image from "next/image";
import { SearchBar } from "@/components/layout/SearchBar";
import { Icon } from "@/components/Icon";
import { ProductCard } from "@/components/product/ProductCard";
import { FurnitureStrip } from "@/components/home/FurnitureStrip";
import { categories } from "@/data/categories";
import { getFeaturedProducts } from "@/lib/products";

// Amazon-style "pick a department" tiles — photo where we have it, otherwise a
// clean graphic tile. Never a stopper: the page keeps going below.
type Tile = {
  label: string;
  sub: string;
  href: string;
  icon: string;
} & (
  | { kind: "cover"; img: string }
  | { kind: "product"; img: string }
  | { kind: "graphic" }
);

const departments: Tile[] = [
  {
    label: "Dosing Pumps",
    sub: "SEKO / Water & Industry",
    href: "/products",
    icon: "droplets",
    kind: "cover",
    img: "/hero/dosing-pump.jpg",
  },
  {
    label: "Café & Dining Seating",
    sub: "Lynchpin",
    href: "/solutions/lynchpin-seating",
    icon: "armchair",
    kind: "cover",
    img: "/partners/lynchpin/cafe-1.jpg",
  },
  {
    label: "PNG Gas Pipelines",
    sub: "Chaze Engineering",
    href: "/solutions/png-gas-pipeline",
    icon: "waypoints",
    kind: "graphic",
  },
  {
    label: "URB Bearings",
    sub: "URB Group, Romania",
    href: "/solutions/urb-bearings",
    icon: "circle-dot",
    kind: "graphic",
  },
];

function DepartmentTile({ t }: { t: Tile }) {
  return (
    <Link
      href={t.href}
      className="group relative flex h-52 flex-col justify-end overflow-hidden rounded-2xl border border-border sm:h-60"
    >
      {t.kind === "cover" && (
        <>
          <Image src={t.img} alt={t.label} fill sizes="(max-width:640px) 50vw, 25vw" className="object-cover transition duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
        </>
      )}
      {t.kind === "product" && (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200" />
          <Image src={t.img} alt={t.label} fill sizes="(max-width:640px) 50vw, 25vw" className="object-contain p-6 transition duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
        </>
      )}
      {t.kind === "graphic" && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-light">
          <Icon name={t.icon} size={64} strokeWidth={1.25} className="absolute right-4 top-4 text-white/25" />
        </div>
      )}
      <div className="relative p-4 text-white">
        <div className="flex items-center gap-1.5 text-xs font-medium text-white/75">
          <Icon name={t.icon} size={14} /> {t.sub}
        </div>
        <div className="mt-1 text-lg font-bold leading-tight">{t.label}</div>
        <div className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-accent-light">
          Shop <Icon name="arrow-right" size={14} />
        </div>
      </div>
    </Link>
  );
}

export default async function Home() {
  const featured = await getFeaturedProducts();

  return (
    <div>
      {/* Hero — minimal, product-first, shows what we do */}
      <section className="border-b border-border bg-surface">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 lg:grid-cols-2 lg:py-16">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-accent">
              Dosing systems · Gas pipelines · Bearings · Seating
            </p>
            <h1 className="mt-3 text-4xl font-extrabold leading-tight text-text sm:text-5xl">
              One supplier for what your{" "}
              <span className="text-primary">site</span> and{" "}
              <span className="text-primary">space</span> need.
            </h1>
            <p className="mt-4 max-w-xl text-lg text-text-muted">
              Browse dosing pumps and controllers, request gas-pipeline and bearing
              supply, and fit out cafés with Lynchpin seating — all in one place.
            </p>
            <div className="mt-6 max-w-xl">
              <SearchBar large />
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/products" className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 font-semibold text-white hover:brightness-110">
                <Icon name="shopping-cart" size={18} /> Browse products
              </Link>
              <Link href="/solutions" className="rounded-lg border border-border px-6 py-3 font-semibold text-text hover:border-primary-light">
                Our areas of work
              </Link>
            </div>
          </div>

          {/* Compact photo collage of what we do */}
          <div className="grid grid-cols-2 gap-3">
            <div className="relative col-span-2 h-36 overflow-hidden rounded-2xl sm:h-44">
              <Image src="/hero/dosing-pump.jpg" alt="SEKO dosing pump" fill sizes="(max-width: 1024px) 100vw, 45vw" className="object-cover" priority />
              <span className="absolute bottom-2.5 left-2.5 rounded-full bg-black/55 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">Dosing pumps</span>
            </div>
            <div className="relative h-28 overflow-hidden rounded-xl sm:h-32">
              <Image src="/hero/controller.jpg" alt="Water quality controller" fill sizes="22vw" className="object-cover" />
              <span className="absolute bottom-2 left-2 rounded-full bg-black/55 px-2 py-0.5 text-[11px] font-semibold text-white backdrop-blur">Controllers</span>
            </div>
            <div className="relative h-28 overflow-hidden rounded-xl sm:h-32">
              <Image src="/partners/lynchpin/cafe-1.jpg" alt="Café & dining seating" fill sizes="22vw" className="object-cover" />
              <span className="absolute bottom-2 left-2 rounded-full bg-black/55 px-2 py-0.5 text-[11px] font-semibold text-white backdrop-blur">Seating</span>
            </div>
          </div>
        </div>
      </section>

      {/* Department selector */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-bold text-text">What are you looking for?</h2>
          <Link href="/solutions" className="hidden text-sm font-semibold text-accent hover:underline sm:inline">
            See all →
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {departments.map((t) => (
            <DepartmentTile key={t.label} t={t} />
          ))}
        </div>
      </section>

      {/* Featured products (products-first) */}
      {featured.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-14">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-text">Featured products</h2>
            <Link href="/products" className="text-sm font-semibold text-accent hover:underline">
              View all →
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Dynamic furniture strip */}
      <FurnitureStrip />

      {/* Shop pumps by category */}
      <section className="mx-auto max-w-7xl px-4 py-14">
        <h2 className="text-2xl font-bold text-text">Shop dosing equipment by category</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/categories/${c.slug}`}
              className="group flex flex-col items-center rounded-xl border border-border bg-surface p-5 text-center transition hover:border-primary-light hover:shadow-md"
            >
              <Icon name={c.icon} size={30} strokeWidth={1.75} className="text-primary" />
              <div className="mt-3 text-sm font-semibold text-text group-hover:text-primary">
                {c.name.replace(/ \(.*\)/, "")}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Why Aorexon */}
      <section className="mx-auto max-w-7xl px-4 pb-16">
        <div className="grid gap-6 rounded-2xl bg-surface p-8 sm:grid-cols-3">
          {[
            { t: "Use-case matched", d: "Products lead with what they’re for — not just a spec sheet." },
            { t: "Full specs, no calls", d: "Browse the whole catalogue and datasheets without logging in." },
            { t: "Buy direct or get a quote", d: "Order stock items online, or request a quote for projects." },
          ].map((b) => (
            <div key={b.t}>
              <h3 className="font-bold text-primary">{b.t}</h3>
              <p className="mt-1 text-sm text-text-muted">{b.d}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
