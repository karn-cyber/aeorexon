import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllProducts, getProductBySlug } from "@/lib/products";
import { keyCallouts } from "@/lib/format";
import { UseCaseMatchPanel } from "@/components/product/UseCaseMatchPanel";
import { SpecsTable } from "@/components/product/SpecsTable";
import { ModelSelector } from "@/components/product/ModelSelector";
import { ApplicationTags } from "@/components/product/ApplicationTags";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { CompareToggle } from "@/components/product/CompareToggle";

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  props: PageProps<"/products/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found — Aorexon" };
  return {
    title: `${product.fullName ?? product.name} — Aorexon`,
    description: product.shortDesc,
  };
}

export default async function ProductPage(props: PageProps<"/products/[slug]">) {
  const { slug } = await props.params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const callouts = keyCallouts(product);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <nav className="mb-6 text-sm text-text-muted">
        <Link href="/products" className="hover:text-primary">Catalogue</Link>
        <span className="mx-2">/</span>
        <span className="text-text">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        {/* Left column */}
        <div className="space-y-10">
          {/* Hero */}
          <section>
            <div className="flex flex-wrap items-center gap-2">
              {product.specs.atex && (
                <span className="rounded bg-warning/15 px-2 py-0.5 text-xs font-bold text-warning">ATEX</span>
              )}
              {product.specs.wifiCapable && (
                <span className="rounded bg-success/15 px-2 py-0.5 text-xs font-bold text-success">Wi-Fi</span>
              )}
              <span className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                {product.brand}
              </span>
            </div>
            <h1 className="mt-2 text-3xl font-extrabold text-text">{product.fullName ?? product.name}</h1>
            <p className="mt-3 text-lg text-text-muted">{product.shortDesc}</p>

            {product.usedFor && product.usedFor.length > 0 && (
              <div className="mt-6 rounded-xl border border-border bg-surface p-5">
                <h2 className="text-sm font-bold uppercase tracking-wide text-primary">
                  This product is for:
                </h2>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {product.usedFor.map((u) => (
                    <li key={u} className="flex items-start gap-2 text-sm text-text">
                      <span className="mt-0.5 text-accent">✓</span>
                      {u}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          {/* Use-case description */}
          <section>
            <h2 className="text-xl font-bold text-text">Where it fits</h2>
            <p className="mt-2 leading-relaxed text-text-muted">{product.useCaseDesc}</p>
          </section>

          {/* Specs */}
          <section>
            <h2 className="mb-3 text-xl font-bold text-text">Technical specifications</h2>
            <SpecsTable specs={product.specs} />
          </section>

          {/* Model selector */}
          {product.models.length > 0 && (
            <section>
              <h2 className="mb-1 text-xl font-bold text-text">Find your model</h2>
              <p className="mb-3 text-sm text-text-muted">
                Enter your required flow and/or pressure to highlight matching models.
              </p>
              <ModelSelector models={product.models} columns={product.modelColumns} />
            </section>
          )}

          {/* Applications */}
          <section>
            <h2 className="mb-3 text-xl font-bold text-text">Applications</h2>
            <ApplicationTags tags={product.applicationTags} />
          </section>

          {/* Related */}
          <section>
            <RelatedProducts product={product} />
          </section>
        </div>

        {/* Right column (sticky) */}
        <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          {/* Key callouts + CTA */}
          <div className="rounded-xl border border-border bg-surface p-6">
            <div className="space-y-4">
              {callouts.map((c) => (
                <div key={c.label} className="flex items-center justify-between">
                  <span className="text-sm text-text-muted">{c.label}</span>
                  <span className="font-bold text-text">{c.value}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 space-y-2">
              {product.isDirectBuy && (
                <button className="w-full rounded-lg bg-accent py-3 font-semibold text-white hover:brightness-110">
                  Add to Cart
                </button>
              )}
              <Link
                href="/rfq"
                className="block w-full rounded-lg border border-primary py-3 text-center font-semibold text-primary hover:bg-primary hover:text-white"
              >
                Request a Quote
              </Link>
            </div>
            <div className="mt-4 border-t border-border pt-4">
              <CompareToggle slug={product.slug} />
            </div>
          </div>

          <UseCaseMatchPanel product={product} />

          {/* Downloads */}
          {product.documents && product.documents.length > 0 && (
            <div className="rounded-xl border border-border bg-surface p-6">
              <h3 className="text-sm font-bold uppercase tracking-wide text-text-muted">
                Downloads
              </h3>
              <ul className="mt-3 space-y-2">
                {product.documents.map((d) => (
                  <li key={d.url}>
                    <a
                      href={d.url}
                      className="flex items-center gap-2 text-sm font-medium text-accent hover:underline"
                    >
                      <span aria-hidden>📄</span> {d.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
