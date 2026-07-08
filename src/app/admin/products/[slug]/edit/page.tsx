import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/products";
import { ProductEditor } from "@/components/admin/ProductEditor";

export const dynamic = "force-dynamic";

export default async function EditProductPage(
  props: PageProps<"/admin/products/[slug]/edit">
) {
  const { slug } = await props.params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  return (
    <div>
      <h1 className="text-3xl font-extrabold text-text">Edit {product.name}</h1>
      <p className="mt-1 mb-6 text-text-muted">Update details, pricing and images.</p>
      <ProductEditor product={product} />
    </div>
  );
}
