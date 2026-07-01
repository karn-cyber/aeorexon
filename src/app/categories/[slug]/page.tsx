import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { categories } from "@/data/categories";
import { getProductsByCategory } from "@/lib/products";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Icon } from "@/components/Icon";
import type { CategorySlug } from "@/lib/types";

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata(
  props: PageProps<"/categories/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const cat = categories.find((c) => c.slug === slug);
  return { title: cat ? `${cat.name} — Aorexon` : "Category — Aorexon" };
}

export default async function CategoryPage(props: PageProps<"/categories/[slug]">) {
  const { slug } = await props.params;
  const cat = categories.find((c) => c.slug === slug);
  if (!cat) notFound();

  const products = await getProductsByCategory(slug as CategorySlug);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
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
