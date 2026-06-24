"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Icon } from "@/components/Icon";

interface NavLink {
  href: string;
  label: string;
}

export function MobileMenu({
  links,
  isAdmin,
}: {
  links: NavLink[];
  isAdmin: boolean;
}) {
  const [open, setOpen] = useState(false);

  // Lock body scroll while the menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="flex items-center text-text hover:text-primary"
      >
        <Icon name="menu" size={24} />
      </button>

      {open && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 flex h-full w-72 max-w-[80%] flex-col bg-surface shadow-xl">
            <div className="flex items-center justify-between border-b border-border px-4 py-4">
              <span className="text-xl font-extrabold uppercase tracking-tight">
                <span className="text-primary">A</span>
                <span className="text-accent">O</span>
                <span className="text-primary">REXON</span>
              </span>
              <button onClick={() => setOpen(false)} aria-label="Close menu" className="text-text-muted hover:text-text">
                <Icon name="x" size={24} />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto p-2">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between rounded-lg px-3 py-3 text-base font-medium text-text hover:bg-bg"
                >
                  {l.label}
                  <Icon name="chevron-right" size={18} className="text-text-muted" />
                </Link>
              ))}
              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setOpen(false)}
                  className="mt-1 flex items-center gap-2 rounded-lg px-3 py-3 text-base font-semibold text-primary hover:bg-bg"
                >
                  <Icon name="layout-dashboard" size={18} /> Admin dashboard
                </Link>
              )}
            </nav>
            <div className="border-t border-border p-4">
              <Link
                href="/rfq"
                onClick={() => setOpen(false)}
                className="block w-full rounded-lg bg-accent py-3 text-center font-semibold text-white"
              >
                Get a Quote
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
