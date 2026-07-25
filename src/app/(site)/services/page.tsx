import Link from "next/link";
import type { Metadata } from "next";
import { solutionAreas } from "@/data/solutions";
import { Icon } from "@/components/Icon";
import { JsonLd, breadcrumbSchema, SITE_URL } from "@/components/Seo";

const DESCRIPTION =
  "Aorexon Systems' services: SEKO dosing pump & water-quality controller supply, PNG gas pipeline installation, URB industrial bearing supply, and Lynchpin café, office & dining furniture — for industrial, commercial and hospitality clients across India.";

export const metadata: Metadata = {
  title: "Our Services — Dosing, Pipelines, Bearings & Furniture",
  description: DESCRIPTION,
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Our Services | Aorexon Systems",
    description: DESCRIPTION,
    url: "/services",
  },
};

// Four service lines, in the order we want them presented.
const ORDER = ["dosing-systems", "png-gas-pipeline", "urb-bearings", "lynchpin-seating"];
const serviceLines = ORDER.map((slug) => solutionAreas.find((a) => a.slug === slug)!).filter(
  Boolean
);

const itemListSchema: Record<string, unknown> = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Aorexon Systems services",
  itemListElement: serviceLines.map((s, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "Service",
      name: s.name,
      description: s.tagline,
      serviceType: s.category,
      url: `${SITE_URL}${s.href}`,
      provider: { "@id": `${SITE_URL}/#organization` },
      areaServed: { "@type": "Country", name: "India" },
    },
  })),
};

const steps = [
  { icon: "target", title: "Tell us your requirement", desc: "Share your application, flow/pressure, site or bill of quantities." },
  { icon: "clipboard-list", title: "We specify & quote", desc: "We match the right equipment or scope and send pricing and lead times." },
  { icon: "handshake", title: "Supply & support", desc: "We deliver, install where applicable, and support you after handover." },
];

export default function ServicesPage() {
  return (
    <div>
      <JsonLd data={itemListSchema} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
        ])}
      />

      {/* Hero */}
      <section className="bg-ink text-white">
        <div className="tech-grid-dark">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <p className="mono-label text-accent-light">// WHAT WE DO</p>
            <h1 className="mt-3 max-w-3xl text-3xl font-extrabold sm:text-5xl">
              Our services
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-white/75">
              Aorexon Systems brings four engineering service lines under one roof — fluid
              dosing &amp; automation, gas infrastructure, industrial bearings and
              architectural-grade furniture — for industrial, commercial and hospitality clients
              across India since 2026.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/contact" className="mono-label inline-flex items-center gap-2 rounded-md bg-accent px-6 py-3.5 font-bold text-white transition hover:brightness-110">
                Contact us <Icon name="arrow-right" size={15} />
              </Link>
              <Link href="/products" className="mono-label inline-flex items-center gap-2 rounded-md border border-white/25 px-6 py-3.5 font-bold text-white transition hover:bg-white/10">
                Browse products
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Service lines */}
      <section className="tech-grid border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-2xl font-extrabold text-primary">Service lines</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {serviceLines.map((s) => (
              <div
                key={s.slug}
                className="flex flex-col rounded-xl border border-border bg-surface p-6"
              >
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon name={s.icon} size={24} />
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-primary">{s.name}</h3>
                    <p className="mono-label text-text-muted">{s.category}</p>
                  </div>
                </div>
                <p className="mt-4 flex-1 text-sm text-text-muted">{s.intro}</p>
                <ul className="mt-4 space-y-2">
                  {s.highlights.slice(0, 3).map((h) => (
                    <li key={h} className="flex items-start gap-2 text-sm text-text">
                      <Icon name="check" size={16} className="mt-0.5 shrink-0 text-success" />
                      {h}
                    </li>
                  ))}
                </ul>
                <Link
                  href={s.href}
                  className="mono-label mt-5 inline-flex items-center gap-1.5 font-bold text-accent hover:underline"
                >
                  Learn more <Icon name="arrow-right" size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How we work */}
      <section className="tech-grid">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-2xl font-extrabold text-primary">How we work</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {steps.map((st, i) => (
              <div key={st.title} className="rounded-xl border border-border bg-surface p-6">
                <div className="flex items-center justify-between">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <Icon name={st.icon} size={20} />
                  </span>
                  <span className="mono-label text-text-muted">0{i + 1}</span>
                </div>
                <h3 className="mt-4 font-bold text-primary">{st.title}</h3>
                <p className="mt-1 text-sm text-text-muted">{st.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col items-start justify-between gap-4 rounded-xl border border-border bg-primary p-8 text-white sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-bold">Ready to get started?</h2>
              <p className="mt-1 text-white/70">Get specifications, availability and a quote for your project.</p>
            </div>
            <Link
              href="/contact"
              className="mono-label inline-flex shrink-0 items-center gap-2 rounded-md bg-gold px-6 py-3.5 font-bold text-primary transition hover:brightness-105"
            >
              Contact Aorexon Systems <Icon name="arrow-right" size={15} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
