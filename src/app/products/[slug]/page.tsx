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
import { ProductGallery } from "@/components/product/ProductGallery";
import { PriceTag } from "@/components/product/PriceTag";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { getPriceInfo } from "@/lib/pricing";
import { primaryImage } from "@/lib/format";
import { Icon } from "@/components/Icon";

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
  const priceInfo = getPriceInfo(product);
  const image = primaryImage(product);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <nav className="mb-6 text-sm text-text-muted">
        <Link href="/products" className="hover:text-primary">Catalogue</Link>
        <span className="mx-2">/</span>
        <span className="text-text">{product.name}</span>
      </nav>

      {/* Full-width header */}
      <header className="mb-6">
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
        <h1 className="mt-2 text-2xl font-extrabold text-text sm:text-3xl">
          {product.fullName ?? product.name}
        </h1>
        <p className="mt-2 text-base text-text-muted sm:mt-3 sm:text-lg">{product.shortDesc}</p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:gap-10">
        {/* Left column — details (after gallery/price on mobile) */}
        <div className="order-2 space-y-8 lg:order-1 lg:space-y-10">
          {product.usedFor && product.usedFor.length > 0 && (
            <section className="rounded-xl border border-border bg-surface p-5">
              <h2 className="text-sm font-bold uppercase tracking-wide text-primary">
                This product is for:
              </h2>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {product.usedFor.map((u) => (
                  <li key={u} className="flex items-start gap-2 text-sm text-text">
                    <Icon name="check" size={16} className="mt-0.5 shrink-0 text-accent" />
                    {u}
                  </li>
                ))}
              </ul>
            </section>
          )}

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

        {/* Right column — gallery + price + CTA (first on mobile, sticky on desktop) */}
        <div className="order-1 space-y-6 lg:order-2 lg:sticky lg:top-24 lg:self-start">
          <ProductGallery images={product.images ?? []} name={product.name} />

          {/* Key callouts + CTA */}
          <div className="rounded-xl border border-border bg-surface p-6">
            <div className="mb-4 border-b border-border pb-4">
              <PriceTag product={product} size="lg" />
            </div>
            <div className="space-y-4">
              {callouts.map((c) => (
                <div key={c.label} className="flex items-center justify-between">
                  <span className="text-sm text-text-muted">{c.label}</span>
                  <span className="font-bold text-text">{c.value}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 space-y-2">
              {priceInfo.hasPrice ? (
                <AddToCartButton
                  slug={product.slug}
                  name={product.name}
                  unitPrice={priceInfo.price}
                  image={image?.url}
                />
              ) : null}
              <Link
                href={`/chat/new?slug=${encodeURIComponent(product.slug)}&name=${encodeURIComponent(product.name)}`}
                className={`flex w-full items-center justify-center gap-2 rounded-lg py-3 text-center font-semibold ${
                  priceInfo.hasPrice
                    ? "border border-primary text-primary hover:bg-primary hover:text-white"
                    : "bg-accent text-white hover:brightness-110"
                }`}
              >
                <Icon name="handshake" size={18} /> Request a Quote — Chat
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
                      <Icon name="file-text" size={16} /> {d.name}
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
