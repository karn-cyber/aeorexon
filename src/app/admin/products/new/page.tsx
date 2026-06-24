import { ProductEditor } from "@/components/admin/ProductEditor";

export default function NewProductPage() {
  return (
    <div>
      <h1 className="text-3xl font-extrabold text-text">Add product</h1>
      <p className="mt-1 mb-6 text-text-muted">Create a new catalogue product.</p>
      <ProductEditor />
    </div>
  );
}
