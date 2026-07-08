"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useCartStore } from "@/stores/cartStore";
import { formatINR } from "@/lib/pricing";
import { Icon } from "@/components/Icon";

export default function CheckoutPage() {
  const items = useCartStore((s) => s.items);
  const clear = useCartStore((s) => s.clear);
  const { user } = useUser();
  const [mounted, setMounted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<{ orderRef: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", notes: "" });

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (user) {
      setForm((f) => ({
        ...f,
        name: f.name || user.fullName || "",
        email: f.email || user.primaryEmailAddress?.emailAddress || "",
      }));
    }
  }, [user]);

  if (!mounted) return null;

  const total = items.reduce((s, i) => s + i.unitPrice * i.qty, 0);

  if (done) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <Icon name="check" size={48} className="mx-auto text-success" />
        <h1 className="mt-4 text-3xl font-extrabold text-text">Order placed</h1>
        <p className="mt-2 text-text-muted">
          Your order reference is <span className="font-bold text-text">{done.orderRef}</span>.
          Our team will contact you shortly to confirm payment and delivery.
        </p>
        <p className="mt-1 text-sm text-text-muted">
          Need help now? Call <a href="tel:9011023081" className="font-semibold text-accent">9011023081</a>.
        </p>
        <Link href="/products" className="mt-6 inline-block rounded-lg bg-accent px-6 py-3 font-semibold text-white hover:brightness-110">
          Continue browsing
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-text">Your cart is empty</h1>
        <Link href="/products" className="mt-6 inline-block rounded-lg bg-accent px-6 py-3 font-semibold text-white hover:brightness-110">
          Browse catalogue
        </Link>
      </div>
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, contact: form }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Failed to place order");
      clear();
      setDone({ orderRef: data.orderRef });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  const field = "w-full rounded-lg border border-border px-3 py-2.5 text-sm outline-none focus:border-primary-light";

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-extrabold text-text">Checkout</h1>
      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_360px]">
        <form onSubmit={submit} className="space-y-4 rounded-xl border border-border bg-surface p-6">
          <h2 className="font-bold text-text">Contact &amp; delivery details</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <input required placeholder="Full name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={field} />
            <input required type="email" placeholder="Email *" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={field} />
            <input required placeholder="Phone *" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={field} />
            <input placeholder="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className={field} />
          </div>
          <textarea placeholder="Delivery address / notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3} className={field} />
          {error && <p className="text-sm text-error">{error}</p>}
          <p className="text-xs text-text-muted">
            Online payment is not enabled yet — placing the order sends it to our team, who will
            confirm pricing, payment and delivery with you.
          </p>
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-accent py-3 font-semibold text-white hover:brightness-110 disabled:opacity-50"
          >
            {submitting ? "Placing order…" : "Place order"}
          </button>
        </form>

        <div className="h-fit rounded-xl border border-border bg-surface p-6">
          <h2 className="font-bold text-text">Order summary</h2>
          <div className="mt-4 space-y-2 text-sm">
            {items.map((i) => (
              <div key={i.slug} className="flex justify-between">
                <span className="text-text-muted">{i.name} × {i.qty}</span>
                <span className="font-medium text-text">{formatINR(i.unitPrice * i.qty)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between border-t border-border pt-4 text-lg">
            <span className="font-medium text-text-muted">Total</span>
            <span className="font-extrabold text-text">{formatINR(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
