import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { useCases } from "@/data/categories";
import { getProductBySlug, getProductsBySlugs, getProductsByApplication } from "@/lib/products";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductGrid } from "@/components/product/ProductGrid";

export function generateStaticParams() {
  return useCases.map((u) => ({ slug: u.slug }));
}

export async function generateMetadata(
  props: PageProps<"/use-cases/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const uc = useCases.find((u) => u.slug === slug);
  return uc
    ? { title: `${uc.title} — Aorexon`, description: uc.intro }
    : { title: "Use case — Aorexon" };
}

export default async function UseCasePage(props: PageProps<"/use-cases/[slug]">) {
  const { slug } = await props.params;
  const uc = useCases.find((u) => u.slug === slug);
  if (!uc) notFound();

  const primary = await getProductBySlug(uc.primarySlug);
  const alts = await getProductsBySlugs(uc.altSlugs);
  // Everything else tagged with this application, minus the ones already shown.
  const shown = new Set([uc.primarySlug, ...uc.altSlugs]);
  const more = (await getProductsByApplication(slug)).filter((p) => !shown.has(p.slug));

  return (
    <div>
      <section className="bg-primary text-white">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center">
          <div className="text-5xl">{uc.icon}</div>
          <h1 className="mt-4 text-4xl font-extrabold">{uc.title}</h1>
          <p className="mx-auto mt-3 max-w-2xl text-lg text-white/70">{uc.intro}</p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-12 px-4 py-12">
        {primary && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-wide text-accent">
              Recommended
            </h2>
            <div className="mt-3 grid gap-6 rounded-2xl border border-accent/30 bg-accent-light/30 p-6 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <h3 className="text-2xl font-bold text-text">{primary.fullName ?? primary.name}</h3>
                <p className="mt-2 text-text-muted">{primary.useCaseDesc}</p>
              </div>
              <Link
                href={`/products/${primary.slug}`}
                className="shrink-0 rounded-lg bg-accent px-6 py-3 text-center font-semibold text-white hover:brightness-110"
              >
                View {primary.name} →
              </Link>
            </div>
          </section>
        )}

        {alts.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-text">Also consider</h2>
            <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {alts.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </section>
        )}

        {more.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-text">More for this application</h2>
            <div className="mt-4">
              <ProductGrid products={more} />
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
