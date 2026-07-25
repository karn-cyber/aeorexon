import type { Metadata } from "next";
import { getAllProducts } from "@/lib/products";
import { CatalogueExplorer } from "@/components/catalogue/CatalogueExplorer";
import { JsonLd, breadcrumbSchema, collectionSchema } from "@/components/Seo";

export const metadata: Metadata = {
  title: "Product Catalogue — Dosing Pumps, Controllers & Accessories",
  description:
    "Browse Aorexon Systems' full catalogue of SEKO dosing pumps — solenoid, motor-driven and peristaltic — plus water-quality controllers and accessories. Smart filters, specs and instant quotes.",
  alternates: { canonical: "/products" },
  openGraph: {
    title: "Product Catalogue | Aorexon Systems",
    description:
      "SEKO dosing pumps, water-quality controllers and dosing accessories — specs, pricing and quotes.",
    url: "/products",
  },
};

export default async function ProductsPage() {
  const products = await getAllProducts();
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Catalogue", path: "/products" },
        ])}
      />
      <JsonLd
        data={collectionSchema({
          name: "Product Catalogue",
          description:
            "SEKO dosing pumps, water-quality controllers and accessories from Aorexon Systems.",
          path: "/products",
          items: products.map((p) => ({ name: p.name, path: `/products/${p.slug}` })),
        })}
      />
      <h1 className="text-3xl font-extrabold text-text">Catalogue</h1>
      <p className="mt-1 text-text-muted">
        {products.length} products across solenoid, motor-driven, peristaltic pumps,
        controllers and accessories.
      </p>
      <div className="mt-8">
        <CatalogueExplorer products={products} />
      </div>
    </div>
  );
}
