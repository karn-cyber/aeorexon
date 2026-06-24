import Link from "next/link";
import { useCases } from "@/data/categories";

const titleBySlug: Record<string, string> = Object.fromEntries(
  useCases.map((u) => [u.slug, u.title.replace(/^.*for /i, "").replace(/^Dosing /i, "")])
);

const FALLBACK_LABELS: Record<string, string> = {
  "potable-water": "Potable Water",
};

function label(tag: string): string {
  if (titleBySlug[tag]) return titleBySlug[tag];
  if (FALLBACK_LABELS[tag]) return FALLBACK_LABELS[tag];
  return tag
    .split("-")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}

export function ApplicationTags({ tags }: { tags: string[] }) {
  if (tags.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => {
        const hasPage = useCases.some((u) => u.slug === tag);
        const content = (
          <span className="inline-block rounded-full border border-border bg-surface px-3 py-1.5 text-sm font-medium text-text-muted transition hover:border-primary-light hover:text-primary">
            {label(tag)}
          </span>
        );
        return hasPage ? (
          <Link key={tag} href={`/use-cases/${tag}`}>
            {content}
          </Link>
        ) : (
          <span key={tag}>{content}</span>
        );
      })}
    </div>
  );
}
