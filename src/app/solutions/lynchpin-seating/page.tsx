import Link from "next/link";
import Image from "next/image";
import { lynchpinCollections, lynchpinContact, solutionBySlug } from "@/data/solutions";
import { Icon } from "@/components/Icon";

export const metadata = {
  title: "Café & Dining Seating — Lynchpin | Aorexon",
  description:
    "Lynchpin café and dining chair collections, supplied by Aorexon as a channel partner.",
};

const area = solutionBySlug["lynchpin-seating"];

function Collection({
  data,
}: {
  data: typeof lynchpinCollections.cafe;
}) {
  return (
    <section className="mt-12">
      <div className="grid gap-6 lg:grid-cols-2 lg:items-center">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-white">
          <Image
            src={data.heroImage}
            alt={data.title}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div>
          <h2 className="text-2xl font-extrabold text-text">{data.title}</h2>
          <p className="mt-2 text-text-muted">{data.intro}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {data.models.map((m) => (
              <span
                key={m}
                className="rounded-full border border-border bg-surface px-3 py-1.5 text-sm font-medium text-text"
              >
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>

      {data.gallery.length > 0 && (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {data.gallery.map((src, i) => (
            <div key={src} className="relative aspect-square overflow-hidden rounded-xl border border-border bg-white">
              <Image
                src={src}
                alt={`${data.title} chair ${i + 1}`}
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
                className="object-contain p-3"
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default function LynchpinPage() {
  return (
    <div>
      <section className="bg-primary text-white">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <nav className="mb-6 text-sm text-white/60">
            <Link href="/solutions" className="hover:text-white">Areas of work</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Café &amp; Dining Seating</span>
          </nav>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
            <Icon name="handshake" size={14} /> Channel Partner · Lynchpin
          </span>
          <h1 className="mt-4 flex items-center gap-3 text-3xl font-extrabold sm:text-4xl">
            <Icon name="armchair" size={36} className="text-accent" />
            Café &amp; Dining Seating
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-white/80">
            {area.intro} <span className="italic">“My Chair, My Pride.”</span>
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/rfq" className="rounded-lg bg-accent px-6 py-3 font-semibold text-white hover:brightness-110">
              Request a quote
            </Link>
            <a href="tel:9011023081" className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-6 py-3 font-semibold text-white hover:bg-white/10">
              <Icon name="phone" size={18} /> 9011023081
            </a>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-8">
        <Collection data={lynchpinCollections.cafe} />
        <Collection data={lynchpinCollections.dining} />

        <div className="mt-12 rounded-xl border border-border bg-surface p-6">
          <div className="flex items-center gap-2 text-sm font-semibold text-text-muted">
            <Icon name="building-2" size={18} /> Manufactured by {lynchpinContact.brand}
          </div>
          <p className="mt-2 flex items-start gap-2 text-sm text-text-muted">
            <Icon name="map-pin" size={16} className="mt-0.5 shrink-0" />
            {lynchpinContact.address}
          </p>
          <p className="mt-4 text-sm text-text-muted">
            Aorexon supplies the full Lynchpin range as a channel partner — for cafés,
            restaurants, hospitality projects and homes. Contact us for finishes,
            bulk pricing and project quotes.
          </p>
        </div>
      </div>
    </div>
  );
}
