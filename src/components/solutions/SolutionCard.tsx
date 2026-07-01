import Link from "next/link";
import type { SolutionArea } from "@/data/solutions";
import { Icon } from "@/components/Icon";

const RELATIONSHIP_STYLE: Record<string, string> = {
  Dealer: "bg-primary/10 text-primary",
  "Authorised Dealer": "bg-success/15 text-success",
  "Channel Partner": "bg-accent/15 text-accent",
};

export function SolutionCard({ area }: { area: SolutionArea }) {
  return (
    <Link
      href={area.href}
      target={area.external ? "_blank" : undefined}
      rel={area.external ? "noopener noreferrer" : undefined}
      className="group flex flex-col rounded-xl border border-border bg-surface p-6 transition hover:border-primary-light hover:shadow-md"
    >
      <div className="flex items-center justify-between">
        <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon name={area.icon} size={24} />
        </span>
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
            RELATIONSHIP_STYLE[area.relationship] ?? "bg-primary/10 text-primary"
          }`}
        >
          <Icon name="handshake" size={13} />
          {area.relationship}
        </span>
      </div>
      <h3 className="mt-4 text-lg font-bold text-text group-hover:text-primary">
        {area.name}
      </h3>
      <p className="mt-1 flex-1 text-sm text-text-muted">{area.tagline}</p>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs font-medium text-text-muted">{area.partner}</span>
        <span className="inline-flex items-center gap-1 text-sm font-semibold text-accent">
          {area.external ? "Visit" : "Explore"}
          <Icon name={area.external ? "external-link" : "arrow-right"} size={15} />
        </span>
      </div>
    </Link>
  );
}
