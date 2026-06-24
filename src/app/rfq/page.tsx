import Link from "next/link";
import { Icon } from "@/components/Icon";

export const metadata = { title: "Request a Quote — Aorexon" };

// Placeholder for the full RFQ flow (cart-style list, contact form, DB-backed
// submission + email). The catalogue-core milestone links here; the interactive
// flow lands in a later pass.
export default function RfqPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center">
      <Icon name="clipboard-list" size={56} strokeWidth={1.5} className="mx-auto text-accent" />
      <h1 className="mt-4 text-3xl font-extrabold text-text">Request a Quote</h1>
      <p className="mt-3 text-text-muted">
        The full quote flow — add products, set quantities, and submit for pricing —
        is coming next. For now, tell us what you need and we’ll get back to you.
      </p>
      <a
        href="mailto:sales@aorexon.com?subject=Aorexon%20Quote%20Request"
        className="mt-8 inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 font-semibold text-white hover:brightness-110"
      >
        <Icon name="mail" size={18} /> Email us your requirement
      </a>
      <div className="mt-4">
        <Link href="/products" className="text-sm font-medium text-primary hover:underline">
          ← Back to catalogue
        </Link>
      </div>
    </div>
  );
}
