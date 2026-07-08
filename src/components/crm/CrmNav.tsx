"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/Icon";

const NAV = [
  { href: "/crm", label: "Pipeline", icon: "layout-dashboard", exact: true },
  { href: "/crm/leads/new", label: "New lead", icon: "plus" },
];

export function CrmNav({ variant }: { variant: "sidebar" | "top" }) {
  const pathname = usePathname();
  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  if (variant === "top") {
    return (
      <nav className="flex items-center gap-1">
        {NAV.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
              isActive(n.href, n.exact) ? "bg-accent/10 text-accent" : "text-text-muted hover:bg-bg"
            }`}
          >
            <Icon name={n.icon} size={16} /> {n.label}
          </Link>
        ))}
      </nav>
    );
  }

  return (
    <nav className="space-y-1">
      {NAV.map((n) => (
        <Link
          key={n.href}
          href={n.href}
          className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
            isActive(n.href, n.exact)
              ? "bg-accent/10 text-accent"
              : "text-text-muted hover:bg-bg hover:text-text"
          }`}
        >
          <Icon name={n.icon} size={18} /> {n.label}
        </Link>
      ))}
    </nav>
  );
}
