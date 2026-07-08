import { getAllProducts } from "@/lib/products";
import { CatalogueExplorer } from "@/components/catalogue/CatalogueExplorer";

export const metadata = {
  title: "Catalogue — Aorexon",
  description: "Browse the full SEKO / W&I dosing equipment catalogue with smart filters.",
};

export default async function ProductsPage() {
  const products = await getAllProducts();
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
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
