import Link from "next/link";
import { notFound } from "next/navigation";
import { solutionAreas, solutionBySlug } from "@/data/solutions";
import { Icon } from "@/components/Icon";

// Generic detail page for data-driven areas (PNG gas pipeline, URB bearings).
// Lynchpin has its own dedicated route with collections.
export function generateStaticParams() {
  return solutionAreas
    .filter((a) => a.href === `/solutions/${a.slug}`)
    .map((a) => ({ slug: a.slug }));
}

export async function generateMetadata(props: PageProps<"/solutions/[slug]">) {
  const { slug } = await props.params;
  const area = solutionBySlug[slug];
  return { title: area ? `${area.name} — Aorexon` : "Aorexon" };
}

export default async function SolutionDetailPage(
  props: PageProps<"/solutions/[slug]">
) {
  const { slug } = await props.params;
  const area = solutionBySlug[slug];
  if (!area) notFound();

  return (
    <div>
      <section className="bg-primary text-white">
        <div className="mx-auto max-w-5xl px-4 py-14">
          <nav className="mb-6 text-sm text-white/60">
            <Link href="/solutions" className="hover:text-white">Areas of work</Link>
            <span className="mx-2">/</span>
            <span className="text-white">{area.name}</span>
          </nav>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
            <Icon name="handshake" size={14} /> {area.relationship} · {area.partner}
          </span>
          <h1 className="mt-4 flex items-center gap-3 text-3xl font-extrabold sm:text-4xl">
            <Icon name={area.icon} size={36} className="text-accent" />
            {area.name}
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-white/80">{area.tagline}</p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-12">
        <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <p className="text-lg leading-relaxed text-text-muted">{area.intro}</p>

            <h2 className="mt-8 text-xl font-bold text-text">What we offer</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {area.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2.5 rounded-lg border border-border bg-surface p-4 text-sm text-text">
                  <Icon name="check" size={18} className="mt-0.5 shrink-0 text-success" />
                  {h}
                </li>
              ))}
            </ul>
          </div>

          <aside className="h-fit rounded-xl border border-border bg-surface p-6 lg:sticky lg:top-24">
            <div className="flex items-center gap-2 text-sm font-semibold text-text-muted">
              <Icon name="building-2" size={18} /> {area.partner}
            </div>
            <p className="mt-3 text-sm text-text-muted">
              Aorexon is the {area.relationship.toLowerCase()} for {area.partner}. Get in
              touch for specifications, availability and project quotes.
            </p>
            <a
              href={area.cta.href}
              target={area.cta.external ? "_blank" : undefined}
              rel={area.cta.external ? "noopener noreferrer" : undefined}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent py-3 font-semibold text-white hover:brightness-110"
            >
              {area.cta.label}
              <Icon name={area.cta.external ? "external-link" : "arrow-right"} size={16} />
            </a>
            <Link
              href={`/chat/new?name=${encodeURIComponent(area.name)}`}
              className="mt-2 block w-full rounded-lg border border-primary py-3 text-center font-semibold text-primary hover:bg-primary hover:text-white"
            >
              Request a Quote — Chat
            </Link>
            <a
              href="tel:9011023081"
              className="mt-4 flex items-center justify-center gap-2 text-sm font-medium text-text-muted hover:text-primary"
            >
              <Icon name="phone" size={15} /> Need help? Call 9011023081
            </a>
          </aside>
        </div>
      </div>
    </div>
  );
}
