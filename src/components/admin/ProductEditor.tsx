"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Product, ProductImage, CategorySlug } from "@/lib/types";
import { Icon } from "@/components/Icon";

const CATEGORIES: { value: CategorySlug; label: string }[] = [
  { value: "solenoid-wall", label: "Solenoid · Wall" },
  { value: "solenoid-base", label: "Solenoid · Base" },
  { value: "motor-driven", label: "Motor-Driven" },
  { value: "peristaltic", label: "Peristaltic" },
  { value: "controllers", label: "Controllers" },
  { value: "accessories", label: "Accessories" },
];

const MAX_IMAGE_BYTES = 1_500_000; // ~1.5MB per image (stored as data URL in Mongo)

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function ProductEditor({ product }: { product?: Product }) {
  const router = useRouter();
  const editing = Boolean(product);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<ProductImage[]>(product?.images ?? []);
  const [form, setForm] = useState({
    name: product?.name ?? "",
    slug: product?.slug ?? "",
    category: (product?.category ?? "accessories") as CategorySlug,
    brand: product?.brand ?? "SEKO",
    subcategory: product?.subcategory ?? "",
    shortDesc: product?.shortDesc ?? "",
    useCaseDesc: product?.useCaseDesc ?? "",
    price: product?.price?.toString() ?? "",
    discountPercent: product?.discountPercent?.toString() ?? "",
    offerLabel: product?.offerLabel ?? "",
    applicationTags: (product?.applicationTags ?? []).join(", "),
    searchTags: (product?.searchTags ?? []).join(", "),
    featured: product?.featured ?? false,
  });

  function set<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function onFiles(files: FileList | null) {
    if (!files) return;
    const next: ProductImage[] = [];
    for (const file of Array.from(files)) {
      if (file.size > MAX_IMAGE_BYTES) {
        setError(`${file.name} is larger than 1.5MB — please use a smaller image.`);
        continue;
      }
      const url = await fileToDataUrl(file);
      next.push({ url, alt: form.name || file.name, isPrimary: false });
    }
    setImages((imgs) => {
      const merged = [...imgs, ...next];
      if (!merged.some((i) => i.isPrimary) && merged.length) merged[0].isPrimary = true;
      return merged;
    });
  }

  function makePrimary(idx: number) {
    setImages((imgs) => imgs.map((im, i) => ({ ...im, isPrimary: i === idx })));
  }
  function removeImage(idx: number) {
    setImages((imgs) => {
      const next = imgs.filter((_, i) => i !== idx);
      if (next.length && !next.some((i) => i.isPrimary)) next[0].isPrimary = true;
      return next;
    });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const payload = {
        name: form.name,
        slug: form.slug || undefined,
        category: form.category,
        brand: form.brand,
        subcategory: form.subcategory,
        shortDesc: form.shortDesc,
        useCaseDesc: form.useCaseDesc,
        price: form.price === "" ? null : Number(form.price),
        discountPercent: form.discountPercent === "" ? null : Number(form.discountPercent),
        offerLabel: form.offerLabel,
        applicationTags: form.applicationTags.split(",").map((t) => t.trim()).filter(Boolean),
        searchTags: form.searchTags.split(",").map((t) => t.trim()).filter(Boolean),
        featured: form.featured,
        images,
      };
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error);
      router.push("/admin/products");
      router.refresh();
    } catch (e2) {
      setError(e2 instanceof Error ? e2.message : "Failed to save");
      setBusy(false);
    }
  }

  const field = "w-full rounded-lg border border-border px-3 py-2.5 text-sm outline-none focus:border-primary-light";
  const label = "mb-1 block text-xs font-semibold uppercase tracking-wide text-text-muted";

  return (
    <form onSubmit={submit} className="max-w-3xl space-y-6">
      <div className="rounded-xl border border-border bg-surface p-6">
        <h2 className="mb-4 font-bold text-text">Basics</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={label}>Name *</label>
            <input required value={form.name} onChange={(e) => set("name", e.target.value)} className={field} />
          </div>
          <div>
            <label className={label}>Slug {editing ? "(locked)" : "(auto from name)"}</label>
            <input value={form.slug} disabled={editing} onChange={(e) => set("slug", e.target.value)} placeholder="auto" className={`${field} disabled:bg-bg/60`} />
          </div>
          <div>
            <label className={label}>Category</label>
            <select value={form.category} onChange={(e) => set("category", e.target.value as CategorySlug)} className={field}>
              {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <div>
            <label className={label}>Brand</label>
            <input value={form.brand} onChange={(e) => set("brand", e.target.value)} className={field} />
          </div>
        </div>
        <div className="mt-4">
          <label className={label}>Short description</label>
          <input value={form.shortDesc} onChange={(e) => set("shortDesc", e.target.value)} className={field} />
        </div>
        <div className="mt-4">
          <label className={label}>Use-case description</label>
          <textarea value={form.useCaseDesc} onChange={(e) => set("useCaseDesc", e.target.value)} rows={3} className={field} />
        </div>
      </div>

      <div className="rounded-xl border border-border bg-surface p-6">
        <h2 className="mb-4 font-bold text-text">Pricing &amp; offers</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className={label}>Price (INR)</label>
            <input type="number" value={form.price} onChange={(e) => set("price", e.target.value)} placeholder="Leave blank = quote-only" className={field} />
          </div>
          <div>
            <label className={label}>Discount %</label>
            <input type="number" value={form.discountPercent} onChange={(e) => set("discountPercent", e.target.value)} className={field} />
          </div>
          <div>
            <label className={label}>Offer label</label>
            <input value={form.offerLabel} onChange={(e) => set("offerLabel", e.target.value)} placeholder="e.g. Monsoon Sale" className={field} />
          </div>
        </div>
        <label className="mt-4 flex items-center gap-2 text-sm text-text">
          <input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} className="h-4 w-4 accent-[var(--color-accent)]" />
          Show in featured products on the homepage
        </label>
      </div>

      <div className="rounded-xl border border-border bg-surface p-6">
        <h2 className="mb-4 font-bold text-text">Images</h2>
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-text hover:border-primary-light">
          <Icon name="upload" size={16} /> Upload images
          <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => onFiles(e.target.files)} />
        </label>
        <p className="mt-1 text-xs text-text-muted">Up to ~1.5MB each. Click an image to set it as primary.</p>
        {images.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-3">
            {images.map((img, i) => (
              <div key={i} className="relative">
                <button type="button" onClick={() => makePrimary(i)} className={`relative block h-24 w-24 overflow-hidden rounded-lg border bg-white ${img.isPrimary ? "border-accent ring-2 ring-accent/30" : "border-border"}`}>
                  <Image src={img.url} alt={img.alt || "image"} fill sizes="96px" className="object-contain p-1" unoptimized />
                </button>
                {img.isPrimary && <span className="absolute left-1 top-1 rounded bg-accent px-1 text-[10px] font-bold text-white">Primary</span>}
                <button type="button" onClick={() => removeImage(i)} className="absolute -right-2 -top-2 rounded-full bg-error p-1 text-white" aria-label="Remove image">
                  <Icon name="x" size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-xl border border-border bg-surface p-6">
        <h2 className="mb-4 font-bold text-text">Tags</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={label}>Application tags (comma-separated)</label>
            <input value={form.applicationTags} onChange={(e) => set("applicationTags", e.target.value)} placeholder="water-treatment, chlorination" className={field} />
          </div>
          <div>
            <label className={label}>Search tags (comma-separated)</label>
            <input value={form.searchTags} onChange={(e) => set("searchTags", e.target.value)} className={field} />
          </div>
        </div>
      </div>

      {error && <p className="text-sm text-error">{error}</p>}

      <div className="flex gap-3">
        <button type="submit" disabled={busy} className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 font-semibold text-white hover:brightness-110 disabled:opacity-50">
          <Icon name="save" size={18} /> {busy ? "Saving…" : editing ? "Save changes" : "Create product"}
        </button>
        <button type="button" onClick={() => router.push("/admin/products")} className="rounded-lg border border-border px-6 py-3 font-semibold text-text hover:border-primary-light">
          Cancel
        </button>
      </div>
    </form>
  );
}
