import Link from "next/link";
import Image from "next/image";
import { Icon } from "@/components/Icon";

export const metadata = {
  title: "PNG Gas Pipeline Installation — Aorexon Systems",
  description:
    "End-to-end Piped Natural Gas (PNG) pipeline installation for residential, commercial and industrial premises. Channel partner: Chaze Engineering Solutions.",
};

const services = [
  { icon: "building-2", title: "Residential PNG", desc: "Riser, GI/MDPE piping and metered connections for apartments, societies and homes." },
  { icon: "settings", title: "Commercial & Industrial", desc: "High-load pipeline networks for kitchens, boilers, furnaces and process plants." },
  { icon: "waypoints", title: "Transmission Lines", desc: "Precision-engineered natural-gas transmission lines with schematic-driven welding." },
  { icon: "shield-alert", title: "Testing & Commissioning", desc: "Pressure testing, NDT weld inspection, leak detection and safety certification." },
];

const gallery = [
  { src: "/pipeline/1.jpg", label: "IMG_01: WELD_ASSY" },
  { src: "/pipeline/2.jpg", label: "IMG_02: VALVE_STATION" },
  { src: "/pipeline/3.jpg", label: "IMG_03: RESIDENTIAL_CONNECT" },
  { src: "/pipeline/4.jpg", label: "IMG_04: TRANSMISSION_LINE" },
];

const standards = [
  { k: "ASTM A53 Pipe Class", v: "Certified" },
  { k: "Max PSI Capacity", v: "2,500 PSI" },
  { k: "Welding Standard", v: "API 1104" },
  { k: "Inspection", v: "Ultrasonic NDT" },
];

export default function PngPipelinePage() {
  return (
    <div>
      {/* Hero over pipeline photo */}
      <section className="relative overflow-hidden">
        <div className="relative h-[68vh] min-h-[460px] w-full">
          <Image src="/pipeline/hero.jpg" alt="PNG pipeline installation" fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-ink/30" />
          <div className="tech-grid-dark absolute inset-0 opacity-50" />
        </div>
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto w-full max-w-7xl px-4">
            <nav className="mono-label mb-4 text-white/60">
              <Link href="/solutions" className="hover:text-white">AREAS_OF_WORK</Link> / PNG_PIPELINE
            </nav>
            <div className="max-w-xl rounded-lg border border-white/15 bg-ink/70 p-7 backdrop-blur">
              <p className="mono-label text-accent-light">SYSTEM SPECIFICATION 15+500 // CHANNEL PARTNER: CHAZE ENGINEERING</p>
              <h1 className="mt-3 text-4xl font-extrabold text-white sm:text-5xl">PNG Pipeline Installation</h1>
              <p className="mt-4 text-white/75">
                Industrial-grade infrastructure deployment featuring precision-engineered
                natural-gas transmission lines and schematic-driven welding operations —
                delivered end-to-end.
              </p>
              <div className="mono-label mt-5 flex gap-8 border-t border-white/15 pt-4 text-white/80">
                <div><div className="text-white/45">Project Status</div><div className="mt-1 text-accent-light">ACTIVE DELIVERY</div></div>
                <div><div className="text-white/45">Safety Rating</div><div className="mt-1 text-accent-light">CLASS-A ZERO-INC.</div></div>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/chat/new?name=PNG%20Gas%20Pipeline%20Installation" className="mono-label rounded-md bg-gold px-6 py-3 font-bold text-primary hover:brightness-105">
                  Request installation quote
                </Link>
                <a href="tel:9011023081" className="mono-label inline-flex items-center gap-2 rounded-md border border-white/25 px-6 py-3 font-bold text-white hover:bg-white/10">
                  <Icon name="phone" size={16} /> 90110 23081
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services (installation offering) */}
      <section className="tech-grid border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <p className="mono-label text-accent">// INSTALLATION SERVICES</p>
          <h2 className="mt-2 text-3xl font-extrabold text-primary">What we install</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s) => (
              <div key={s.title} className="rounded-lg border border-border bg-surface p-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon name={s.icon} size={22} />
                </span>
                <h3 className="mt-4 font-bold text-primary">{s.title}</h3>
                <p className="mt-1 text-sm text-text-muted">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Operational gallery */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="flex items-end justify-between">
          <h2 className="text-3xl font-extrabold text-primary">Operational Gallery</h2>
          <span className="mono-label text-text-muted">ENGINEERING_EXCELLENCE_VISUAL_AUDIT</span>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {gallery.map((g) => (
            <div key={g.src} className="group relative aspect-[4/5] overflow-hidden rounded-lg border border-border bg-primary">
              <Image src={g.src} alt={g.label} fill sizes="(max-width:768px) 50vw, 25vw" className="object-cover transition duration-500 group-hover:scale-105" />
              <span className="mono-label absolute bottom-2 left-2 rounded bg-black/60 px-2 py-1 text-white/85 backdrop-blur">{g.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Standards + precision */}
      <section className="bg-ink text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 lg:grid-cols-2">
          <div>
            <p className="mono-label text-accent-light">// PROJECT ENGINEERING STANDARDS</p>
            <h2 className="mt-2 text-3xl font-extrabold">Built to code, verified end to end</h2>
            <p className="mt-3 max-w-md text-white/70">
              Our PNG installation strictly adheres to international safety and structural
              protocols — ensuring longevity, compliance and zero-incident delivery.
            </p>
            <dl className="mt-6 divide-y divide-white/10 border-y border-white/10">
              {standards.map((s) => (
                <div key={s.k} className="flex items-center justify-between py-3">
                  <dt className="mono-label text-white/55">{s.k}</dt>
                  <dd className="font-bold text-accent-light">{s.v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="relative overflow-hidden rounded-lg border border-white/10 bg-white/5 p-8">
            <div className="tech-grid-dark absolute inset-0" />
            <div className="relative text-center">
              <Icon name="settings" size={40} className="mx-auto text-accent-light" />
              <h3 className="mt-4 text-2xl font-extrabold">High-Precision Logic</h3>
              <p className="mx-auto mt-2 max-w-sm text-sm text-white/65">
                Every joint, valve and weld is verified through ultrasonic non-destructive
                testing (NDT) before commissioning.
              </p>
              <Link href="/chat/new?name=PNG%20Gas%20Pipeline%20Installation" className="mono-label mt-6 inline-flex items-center gap-2 rounded-md bg-accent-light px-6 py-3 font-bold text-ink hover:brightness-105">
                Enquire about a project <Icon name="arrow-right" size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
