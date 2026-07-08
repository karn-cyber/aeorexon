import Link from "next/link";
import { getAllProducts } from "@/lib/products";
import { AdminProductsTable } from "@/components/admin/AdminProductsTable";
import { Icon } from "@/components/Icon";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await getAllProducts();
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-text">Products &amp; pricing</h1>
          <p className="mt-1 text-text-muted">
            Set prices, discounts and offers inline, or edit full product details.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 font-semibold text-white hover:brightness-110"
        >
          <Icon name="plus" size={18} /> Add product
        </Link>
      </div>
      <div className="mt-6">
        <AdminProductsTable products={products} />
      </div>
    </div>
  );
}
