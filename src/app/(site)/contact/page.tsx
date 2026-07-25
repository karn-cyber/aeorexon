import Link from "next/link";
import type { Metadata } from "next";
import { Icon } from "@/components/Icon";
import { COMPANY } from "@/lib/company";
import { JsonLd, breadcrumbSchema, SITE_URL } from "@/components/Seo";

const DESCRIPTION =
  "Contact Aorexon Systems for dosing pumps, PNG gas pipeline installation, URB bearings and Lynchpin furniture. Call +91 90110 23081 or email aorexonsystems@outlook.com for specs, availability and quotes.";

export const metadata: Metadata = {
  title: "Contact Aorexon Systems — Phone, Email & Quote Requests",
  description: DESCRIPTION,
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact Aorexon Systems",
    description: DESCRIPTION,
    url: "/contact",
  },
};

const contactPageSchema: Record<string, unknown> = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact Aorexon Systems",
  description: DESCRIPTION,
  url: `${SITE_URL}/contact`,
  isPartOf: { "@id": `${SITE_URL}/#website` },
  about: { "@id": `${SITE_URL}/#organization` },
  mainEntity: {
    "@id": `${SITE_URL}/#organization`,
    "@type": "Organization",
    name: "Aorexon Systems",
    telephone: "+91-9011023081",
    email: "aorexonsystems@outlook.com",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+91-9011023081",
      email: "aorexonsystems@outlook.com",
      contactType: "sales",
      areaServed: "IN",
      availableLanguage: ["en", "hi"],
    },
  },
};

const channels = [
  {
    icon: "phone",
    label: "Call us",
    value: COMPANY.phone,
    href: "tel:9011023081",
    note: "Fastest way to reach our sales team.",
  },
  {
    icon: "mail",
    label: "Email us",
    value: COMPANY.email,
    href: `mailto:${COMPANY.email}`,
    note: "Send specifications, drawings or a bill of quantities.",
  },
];

export default function ContactPage() {
  return (
    <div>
      <JsonLd data={contactPageSchema} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ])}
      />

      {/* Hero */}
      <section className="bg-primary text-white">
        <div className="mx-auto max-w-5xl px-4 py-14">
          <nav className="mb-6 text-sm text-white/60">
            <Link href="/" className="hover:text-white">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Contact</span>
          </nav>
          <p className="mono-label text-accent-light">// GET IN TOUCH</p>
          <h1 className="mt-3 text-3xl font-extrabold sm:text-4xl">Contact Aorexon Systems</h1>
          <p className="mt-4 max-w-2xl text-lg text-white/80">
            Talk to us about SEKO dosing pumps and controllers, PNG gas pipeline installation,
            URB industrial bearings or Lynchpin furniture. We&apos;ll help you specify the right
            equipment and turn it around with pricing, availability and lead times.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          {/* Contact channels */}
          <div>
            <h2 className="text-xl font-bold text-text">How to reach us</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {channels.map((c) => (
                <a
                  key={c.label}
                  href={c.href}
                  className="group rounded-xl border border-border bg-surface p-5 transition hover:-translate-y-0.5 hover:border-accent hover:shadow-md"
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <Icon name={c.icon} size={20} />
                  </span>
                  <div className="mono-label mt-4 text-text-muted">{c.label}</div>
                  <div className="mt-1 text-lg font-bold text-primary group-hover:text-accent">
                    {c.value}
                  </div>
                  <p className="mt-1 text-sm text-text-muted">{c.note}</p>
                </a>
              ))}
            </div>

            <dl className="mt-8 grid gap-5 rounded-xl border border-border bg-surface p-6 sm:grid-cols-2">
              <div>
                <dt className="mono-label text-text-muted">Contact person</dt>
                <dd className="mt-1 flex items-center gap-2 font-semibold text-text">
                  <Icon name="users" size={16} className="text-accent" /> {COMPANY.contactPerson}
                </dd>
              </div>
              <div>
                <dt className="mono-label text-text-muted">Area served</dt>
                <dd className="mt-1 flex items-center gap-2 font-semibold text-text">
                  <Icon name="map-pin" size={16} className="text-accent" /> India
                </dd>
              </div>
              <div>
                <dt className="mono-label text-text-muted">Business</dt>
                <dd className="mt-1 flex items-center gap-2 font-semibold text-text">
                  <Icon name="building-2" size={16} className="text-accent" /> Industrial equipment supplier · Est. 2026
                </dd>
              </div>
              <div>
                <dt className="mono-label text-text-muted">Tagline</dt>
                <dd className="mt-1 text-sm text-text-muted">{COMPANY.tagline}</dd>
              </div>
            </dl>
          </div>

          {/* Quote CTA */}
          <aside className="h-fit rounded-xl border border-border bg-surface p-6 lg:sticky lg:top-24">
            <h2 className="text-lg font-bold text-text">Request a quote</h2>
            <p className="mt-2 text-sm text-text-muted">
              Tell us what you need and we&apos;ll respond with pricing, specifications and lead
              times. No account required to start a chat.
            </p>
            <Link
              href="/chat/new?name=Quote%20request"
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent py-3 font-semibold text-white hover:brightness-110"
            >
              <Icon name="handshake" size={18} /> Start a quote chat
            </Link>
            <a
              href="tel:9011023081"
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-primary py-3 font-semibold text-primary hover:bg-primary hover:text-white"
            >
              <Icon name="phone" size={16} /> Call {COMPANY.phone}
            </a>
            <div className="mt-6 border-t border-border pt-5">
              <p className="mono-label text-text-muted">Explore</p>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <Link href="/services" className="font-medium text-accent hover:underline">
                    Our services →
                  </Link>
                </li>
                <li>
                  <Link href="/products" className="font-medium text-accent hover:underline">
                    Product catalogue →
                  </Link>
                </li>
                <li>
                  <Link href="/solutions" className="font-medium text-accent hover:underline">
                    Areas of work →
                  </Link>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
