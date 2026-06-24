import Link from "next/link";
import { SearchBar } from "@/components/layout/SearchBar";
import { ProductCard } from "@/components/product/ProductCard";
import { categories, useCases } from "@/data/categories";
import { getFeaturedProducts } from "@/lib/products";

const USE_CASE_TILES = [
  "water-treatment",
  "swimming-pool",
  "boiler-feed",
  "electroplating",
  "solar-offgrid",
  "iot-remote",
];

export default async function Home() {
  const featured = await getFeaturedProducts();
  const tiles = useCases.filter((u) => USE_CASE_TILES.includes(u.slug));

  return (
    <div>
      {/* Hero */}
      <section className="bg-primary text-white">
        <div className="mx-auto max-w-4xl px-4 py-20 text-center">
          <h1 className="text-4xl font-extrabold sm:text-5xl">
            Industrial Equipment, <span className="text-accent">Ordered Intelligently</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/70">
            Dosing pumps, controllers and accessories from SEKO / Water &amp; Industry —
            matched to your use case, with full specs and no phone calls.
          </p>
          <div className="mx-auto mt-8 max-w-2xl">
            <SearchBar large />
          </div>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              href="/products"
              className="rounded-lg bg-accent px-6 py-3 font-semibold text-white hover:brightness-110"
            >
              Browse Catalogue
            </Link>
            <Link
              href="/rfq"
              className="rounded-lg border border-white/30 px-6 py-3 font-semibold text-white hover:bg-white/10"
            >
              Request a Quote
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-16 px-4 py-16">
        {/* Shop by use case */}
        <section>
          <h2 className="text-2xl font-bold text-text">Shop by use case</h2>
          <p className="mt-1 text-text-muted">Tell us the job — we’ll point you to the right pump.</p>
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
            {tiles.map((u) => (
              <Link
                key={u.slug}
                href={`/use-cases/${u.slug}`}
                className="group rounded-xl border border-border bg-surface p-5 transition hover:border-primary-light hover:shadow-md"
              >
                <div className="text-3xl">{u.icon}</div>
                <div className="mt-3 font-bold text-text group-hover:text-primary">
                  {u.title.replace(/^Dosing (Pumps )?for /i, "").replace(/^Chemical Dosing for /i, "")}
                </div>
                <div className="mt-1 line-clamp-2 text-sm text-text-muted">{u.intro}</div>
              </Link>
            ))}
          </div>
        </section>

        {/* Shop by category */}
        <section>
          <h2 className="text-2xl font-bold text-text">Shop by category</h2>
          <div className="mt-6 flex gap-4 overflow-x-auto pb-2">
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/categories/${c.slug}`}
                className="group flex w-56 shrink-0 flex-col rounded-xl border border-border bg-surface p-5 transition hover:border-primary-light hover:shadow-md"
              >
                <div className="text-3xl">{c.icon}</div>
                <div className="mt-3 font-bold text-text group-hover:text-primary">{c.name}</div>
                <div className="mt-1 text-sm text-text-muted">{c.short}</div>
              </Link>
            ))}
          </div>
        </section>

        {/* Why Aorexon */}
        <section className="grid gap-6 rounded-2xl bg-surface p-8 sm:grid-cols-3">
          {[
            { t: "Use-case matched", d: "Every product leads with what it’s for — not just a spec sheet." },
            { t: "Full specs, no calls", d: "Browse the entire catalogue, models and datasheets without logging in." },
            { t: "Order direct or get a quote", d: "Buy standard stock items, or request a quote for custom and large orders." },
          ].map((b) => (
            <div key={b.t}>
              <h3 className="font-bold text-primary">{b.t}</h3>
              <p className="mt-1 text-sm text-text-muted">{b.d}</p>
            </div>
          ))}
        </section>

        {/* Featured products */}
        {featured.length > 0 && (
          <section>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-text">Featured products</h2>
              <Link href="/products" className="text-sm font-semibold text-accent hover:underline">
                View all →
              </Link>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
