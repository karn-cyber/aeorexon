import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { categories } from "@/data/categories";
import { getProductsByCategory } from "@/lib/products";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Icon } from "@/components/Icon";
import { JsonLd, breadcrumbSchema, collectionSchema } from "@/components/Seo";
import type { CategorySlug } from "@/lib/types";

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata(
  props: PageProps<"/categories/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const cat = categories.find((c) => c.slug === slug);
  if (!cat) return { title: "Category not found" };
  const description = `${cat.short} Buy ${cat.name.toLowerCase()} from Aorexon Systems — specs, pricing and quotes.`;
  return {
    title: `${cat.name} — Buy Online`,
    description,
    alternates: { canonical: `/categories/${slug}` },
    openGraph: {
      title: `${cat.name} | Aorexon Systems`,
      description,
      url: `/categories/${slug}`,
    },
  };
}

export default async function CategoryPage(props: PageProps<"/categories/[slug]">) {
  const { slug } = await props.params;
  const cat = categories.find((c) => c.slug === slug);
  if (!cat) notFound();

  const products = await getProductsByCategory(slug as CategorySlug);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Catalogue", path: "/products" },
          { name: cat.name, path: `/categories/${slug}` },
        ])}
      />
      <JsonLd
        data={collectionSchema({
          name: cat.name,
          description: cat.short,
          path: `/categories/${slug}`,
          items: products.map((p) => ({ name: p.name, path: `/products/${p.slug}` })),
        })}
      />
      <div className="flex items-center gap-3">
        <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon name={cat.icon} size={30} />
        </span>
        <div>
          <h1 className="text-3xl font-extrabold text-text">{cat.name}</h1>
          <p className="text-text-muted">{cat.short}</p>
        </div>
      </div>
      <div className="mt-8">
        <ProductGrid products={products} />
      </div>
    </div>
  );
}
