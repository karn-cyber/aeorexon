import Link from "next/link";
import { Icon } from "@/components/Icon";

export const metadata = { title: "Request a Quote — Aorexon" };

// Quotes are handled via the built-in chat. This page routes users into it.
export default function RfqPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center">
      <Icon name="handshake" size={56} strokeWidth={1.5} className="mx-auto text-accent" />
      <h1 className="mt-4 text-3xl font-extrabold text-text">Request a Quote</h1>
      <p className="mt-3 text-text-muted">
        Chat directly with our team for pricing, availability and lead times. Sign in
        (Google or email) to start a conversation — your messages go straight to us.
      </p>
      <Link
        href="/chat/new?name=Quote%20request"
        className="mt-8 inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 font-semibold text-white hover:brightness-110"
      >
        <Icon name="handshake" size={18} /> Start a quote chat
      </Link>
      <div className="mt-4">
        <a href="tel:9011023081" className="text-sm font-medium text-text-muted hover:text-primary">
          Or call 9011023081
        </a>
      </div>
      <div className="mt-2">
        <Link href="/products" className="text-sm font-medium text-primary hover:underline">
          ← Back to catalogue
        </Link>
      </div>
    </div>
  );
}
