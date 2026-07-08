import Link from "next/link";
import Image from "next/image";
import { Icon } from "@/components/Icon";
import { ProductCard } from "@/components/product/ProductCard";
import { FurnitureStrip } from "@/components/home/FurnitureStrip";
import { HeroCarousel, type Slide } from "@/components/home/HeroCarousel";
import { getFeaturedProducts } from "@/lib/products";

type Service = {
  tag: string;
  label: string;
  desc: string;
  cta: string;
  href: string;
  bar: string;
  icon: string;
} & ({ img: string } | { graphic: true });

const services: Service[] = [
  {
    tag: "INFRASTRUCTURE",
    label: "PNG Gas Pipelines",
    desc: "High-pressure PNG installation with structural integrity and NDT-verified welds.",
    cta: "View project logs",
    href: "/solutions/png-gas-pipeline",
    bar: "bg-accent",
    icon: "waypoints",
    img: "/pipeline/hero.jpg",
  },
  {
    tag: "FLUID CONTROL",
    label: "Dosing Pumps",
    desc: "Precision chemical dosing with tight variance tolerance across the SEKO range.",
    cta: "Tech specs",
    href: "/products",
    bar: "bg-gold",
    icon: "droplets",
    img: "/hero/dosing-pump.jpg",
  },
  {
    tag: "AUTOMATION",
    label: "Controllers",
    desc: "Smart control units for real-time water-quality monitoring and feedback loops.",
    cta: "Control suite",
    href: "/categories/controllers",
    bar: "bg-primary-light",
    icon: "gauge",
    img: "/hero/controller.jpg",
  },
  {
    tag: "ARCHITECTURAL",
    label: "Furniture",
    desc: "Architectural-grade seating for cafés, hospitality and specialised interiors.",
    cta: "Gallery",
    href: "/solutions/lynchpin-seating",
    bar: "bg-accent-light",
    icon: "armchair",
    img: "/partners/lynchpin/cafe-1.jpg",
  },
];

function ServiceCard({ s }: { s: Service }) {
  return (
    <Link
      href={s.href}
      className="group flex flex-col overflow-hidden rounded-lg border border-border bg-surface transition hover:-translate-y-1 hover:shadow-xl"
    >
      <div className={`h-1 ${s.bar}`} />
      <div className="relative aspect-[4/3] overflow-hidden bg-primary">
        {"img" in s ? (
          <Image src={s.img} alt={s.label} fill sizes="(max-width:768px) 50vw, 25vw" className="object-cover transition duration-500 group-hover:scale-105" />
        ) : (
          <div className="tech-grid-dark flex h-full w-full items-center justify-center bg-gradient-to-br from-primary to-ink">
            <Icon name={s.icon} size={52} strokeWidth={1.25} className="text-accent-light/60" />
          </div>
        )}
        <span className="mono-label absolute left-3 top-3 rounded bg-black/55 px-2 py-1 text-white/85 backdrop-blur">
          {s.tag}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold text-primary">{s.label}</h3>
        <p className="mt-1 flex-1 text-sm text-text-muted">{s.desc}</p>
        <span className="mono-label mt-4 inline-flex items-center gap-1.5 font-bold text-accent">
          {s.cta} <Icon name="arrow-right" size={14} />
        </span>
      </div>
    </Link>
  );
}

const heroSlides: Slide[] = [
  { img: "/pipeline/hero.jpg", tag: "GAS INFRASTRUCTURE", title: "PNG Pipeline Installation", href: "/solutions/png-gas-pipeline" },
  { img: "/hero/dosing-pump.jpg", tag: "FLUID CONTROL", title: "Dosing Pumps & Controllers", href: "/products" },
  { img: "/partners/lynchpin/cafe-1.jpg", tag: "ARCHITECTURAL", title: "Café & Dining Seating", href: "/solutions/lynchpin-seating" },
];

export default async function Home() {
  const featured = await getFeaturedProducts();

  return (
    <div>
      <HeroCarousel slides={heroSlides} />

      {/* ── Core services ── */}
      <section className="tech-grid border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="mono-label text-accent">// CAPABILITIES</p>
              <h2 className="mt-2 text-3xl font-extrabold text-primary">Core Services &amp; Products</h2>
            </div>
            <p className="mono-label max-w-xs text-text-muted">
              Integrated solutions across four verticals. Zero-tolerance quality protocols
              applied to every component.
            </p>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {services.map((s) => (
              <ServiceCard key={s.label} s={s} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Case study band ── */}
      <section className="bg-ink text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <p className="mono-label text-accent-light">CASE_STUDY_001 // ENERGY_SECTOR</p>
            <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
              400 km Pipeline Network Optimization
            </h2>
            <p className="mt-4 max-w-2xl text-white/70">
              Aorexon delivered a full-scale automated dosing and monitoring network for a
              trans-regional gas line — cutting maintenance cost and eliminating manual error
              through controller automation and NDT-verified welding.
            </p>
            <div className="mt-8 flex gap-12">
              <div>
                <div className="text-3xl font-extrabold text-accent-light">99.9%</div>
                <div className="mono-label mt-1 text-white/50">Uptime reliability</div>
              </div>
              <div>
                <div className="text-3xl font-extrabold text-accent-light">API 1104</div>
                <div className="mono-label mt-1 text-white/50">Welding standard</div>
              </div>
            </div>
          </div>
          <div className="grid gap-4">
            <div className="rounded-lg border border-white/10 bg-white/5 p-6">
              <Icon name="settings" size={22} className="text-accent-light" />
              <h3 className="mt-3 font-bold">Precision</h3>
              <p className="mt-1 text-sm text-white/60">Blueprints crafted to micron-level accuracy before fabrication begins.</p>
            </div>
            <div className="rounded-lg bg-accent-light p-6 text-ink">
              <Icon name="shield-alert" size={22} />
              <h3 className="mt-3 font-bold">Compliance</h3>
              <p className="mt-1 text-sm text-ink/70">Certified to international ISO 9001 and safety standards.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured products ── */}
      {featured.length > 0 && (
        <section className="tech-grid">
          <div className="mx-auto max-w-7xl px-4 py-16">
            <div className="flex items-center justify-between">
              <div>
                <p className="mono-label text-accent">// CATALOGUE</p>
                <h2 className="mt-2 text-3xl font-extrabold text-primary">Featured Products</h2>
              </div>
              <Link href="/products" className="mono-label font-bold text-accent hover:underline">View all →</Link>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {featured.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Furniture strip ── */}
      <FurnitureStrip />

      {/* ── Engineering protocols ── */}
      <section className="border-t border-border tech-grid">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="mono-label text-accent">// PROTOCOLS</p>
            <h2 className="mt-2 text-3xl font-extrabold text-primary">Engineering Protocols</h2>
            <p className="mt-3 max-w-md text-text-muted">
              Our commitment to safety is engineered into every joint, valve and circuit board
              we deploy. We don&apos;t just build systems — we build guarantees.
            </p>
            <ul className="mono-label mt-6 space-y-3">
              {["ASTM_COMPLIANT_STEEL", "TRIPLE_CHECK_WELD_INSPECTION", "REALTIME_LEAK_DETECTION", "ISO_9001_CERTIFIED"].map((p) => (
                <li key={p} className="flex items-center gap-3 text-primary">
                  <span className="h-2 w-2 shrink-0 bg-accent" /> {p}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative overflow-hidden rounded-lg border border-border bg-ink p-6 text-white">
            <div className="tech-grid-dark absolute inset-0" />
            <div className="relative">
              <div className="mono-label flex justify-between text-white/50">
                <span>DOC_REF: AX-880-SPEC</span>
                <span>REV 2</span>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-4">
                {[
                  { k: "Variance", v: "±0.01%" },
                  { k: "IP Class", v: "IP65" },
                  { k: "Max Pressure", v: "100 bar" },
                  { k: "Temp", v: "55°C" },
                  { k: "Response", v: "<1 ms" },
                  { k: "Warranty", v: "5 yr" },
                ].map((x) => (
                  <div key={x.k} className="rounded border border-white/10 bg-white/5 p-3">
                    <div className="text-lg font-extrabold text-accent-light">{x.v}</div>
                    <div className="mono-label mt-1 text-white/45">{x.k}</div>
                  </div>
                ))}
              </div>
              <Link href="/products" className="mono-label mt-6 inline-flex items-center gap-2 rounded-md bg-accent-light px-5 py-3 font-bold text-ink hover:brightness-105">
                View technical catalogue <Icon name="arrow-right" size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
