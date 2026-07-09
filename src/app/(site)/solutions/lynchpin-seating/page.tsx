import Link from "next/link";
import Image from "next/image";
import { lynchpinSeries, lynchpinLifestyle } from "@/data/lynchpin";
import { lynchpinContact, solutionBySlug } from "@/data/solutions";
import { LynchpinCatalog } from "@/components/solutions/LynchpinCatalog";
import { Icon } from "@/components/Icon";

export const metadata = {
  title: "Furniture & Seating — Lynchpin | Aorexon",
  description:
    "Lynchpin's full furniture range — café, dining, high-counter, lounge, recliner, sofa, table and workstation collections, supplied by Aorexon as a channel partner.",
};

const area = solutionBySlug["lynchpin-seating"];

export default function LynchpinPage() {
  const total = lynchpinSeries.reduce((n, s) => n + s.items.length, 0);

  return (
    <div>
      {/* Immersive hero */}
      <section className="relative overflow-hidden">
        <div className="relative h-[60vh] min-h-[420px] w-full">
          <Image
            src={lynchpinLifestyle.cafe}
            alt="Lynchpin seating"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/60 to-primary/20" />
        </div>
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto w-full max-w-6xl px-4 pb-10 text-white">
            <nav className="mb-4 text-sm text-white/70">
              <Link href="/solutions" className="hover:text-white">Areas of work</Link>
              <span className="mx-2">/</span>
              <span className="text-white">Café &amp; Dining Seating</span>
            </nav>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
              <Icon name="handshake" size={14} /> Channel Partner · Lynchpin
            </span>
            <h1 className="mt-4 flex items-center gap-3 text-4xl font-extrabold sm:text-5xl">
              <Icon name="armchair" size={40} className="text-accent" />
              Furniture &amp; Seating
            </h1>
            <p className="mt-3 max-w-2xl text-lg text-white/85">
              {area.intro} <span className="italic">“My Chair, My Pride.”</span>
            </p>
            <p className="mt-2 text-sm font-semibold uppercase tracking-wide text-white/70">
              {total} designs across {lynchpinSeries.length} collections
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/chat/new?name=Caf%C3%A9%20%26%20Dining%20Seating%20(Lynchpin)" className="rounded-lg bg-accent px-6 py-3 font-semibold text-white hover:brightness-110">
                Request a quote
              </Link>
              <a href="tel:9011023081" className="inline-flex items-center gap-2 rounded-lg border border-white/40 px-6 py-3 font-semibold text-white hover:bg-white/10">
                <Icon name="phone" size={18} /> 9011023081
              </a>
            </div>
          </div>
        </div>
      </section>

      <LynchpinCatalog series={lynchpinSeries} lifestyle={lynchpinLifestyle} />

      {/* Manufacturer info */}
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="rounded-xl border border-border bg-surface p-6">
          <div className="flex items-center gap-2 text-sm font-semibold text-text-muted">
            <Icon name="building-2" size={18} /> Manufactured by {lynchpinContact.brand}
          </div>
          <p className="mt-2 flex items-start gap-2 text-sm text-text-muted">
            <Icon name="map-pin" size={16} className="mt-0.5 shrink-0" />
            {lynchpinContact.address}
          </p>
          <p className="mt-4 text-sm text-text-muted">
            Aorexon supplies the full Lynchpin range as a channel partner — for cafés,
            restaurants, hospitality projects and homes. Contact us for finishes, colours,
            bulk pricing and project quotes.
          </p>
        </div>
      </div>
    </div>
  );
}
