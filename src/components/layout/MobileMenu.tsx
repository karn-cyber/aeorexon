"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SignInButton } from "@clerk/nextjs";
import { Icon } from "@/components/Icon";

interface NavLink {
  href: string;
  label: string;
  icon: string;
}

const BROWSE: NavLink[] = [
  { href: "/products", label: "Dosing Pumps", icon: "droplets" },
  { href: "/solutions/png-gas-pipeline", label: "PNG Gas Pipelines", icon: "waypoints" },
  { href: "/solutions/lynchpin-seating", label: "Furniture & Seating", icon: "armchair" },
  { href: "/solutions/urb-bearings", label: "URB Bearings", icon: "circle-dot" },
  { href: "/solutions", label: "Areas of Work", icon: "layout-dashboard" },
  { href: "/compare", label: "Compare Products", icon: "sliders-horizontal" },
];

export function MobileMenu({
  isAdmin,
  signedIn,
}: {
  isAdmin: boolean;
  signedIn: boolean;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const close = () => setOpen(false);

  const Item = ({ href, label, icon }: NavLink) => (
    <Link
      href={href}
      onClick={close}
      className="flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium text-text hover:bg-bg"
    >
      <Icon name={icon} size={20} className="text-accent" />
      <span className="flex-1">{label}</span>
      <Icon name="chevron-right" size={18} className="text-text-muted" />
    </Link>
  );

  return (
    <div className="lg:hidden">
      <button onClick={() => setOpen(true)} aria-label="Open menu" className="flex items-center text-text hover:text-accent">
        <Icon name="menu" size={26} />
      </button>

      {open && (
        <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/50" onClick={close} />
          <div className="absolute left-0 top-0 flex h-full w-[86%] max-w-sm flex-col bg-surface shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-4 py-4">
              <Link href="/" onClick={close} className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-[6px] bg-primary text-sm font-black text-gold">A</span>
                <span className="text-lg font-extrabold uppercase tracking-tight text-primary">
                  Aorexon <span className="text-text-muted">Systems</span>
                </span>
              </Link>
              <button onClick={close} aria-label="Close menu" className="text-text-muted hover:text-text">
                <Icon name="x" size={26} />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto py-3">
              <p className="mono-label px-4 pb-1 text-text-muted">Browse</p>
              {BROWSE.map((l) => (
                <Item key={l.href} {...l} />
              ))}

              <div className="my-2 border-t border-border" />
              <p className="mono-label px-4 pb-1 text-text-muted">Account</p>

              {signedIn && <Item href="/chat" label="Messages" icon="handshake" />}
              {signedIn && <Item href="/cart" label="Cart" icon="shopping-cart" />}
              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={close}
                  className="mx-3 mt-1 flex items-center gap-3 rounded-lg bg-primary px-3 py-3 text-base font-semibold text-white"
                >
                  <Icon name="layout-dashboard" size={20} className="text-gold" />
                  Admin Dashboard
                  <Icon name="chevron-right" size={18} className="ml-auto text-white/60" />
                </Link>
              )}
              {!signedIn && (
                <SignInButton mode="modal">
                  <button
                    onClick={close}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-base font-medium text-text hover:bg-bg"
                  >
                    <Icon name="log-in" size={20} className="text-accent" />
                    <span className="flex-1">Log in / Sign up</span>
                  </button>
                </SignInButton>
              )}
            </div>

            {/* Footer actions */}
            <div className="space-y-2 border-t border-border p-4">
              <Link
                href="/chat/new?name=Quote%20request"
                onClick={close}
                className="mono-label block w-full rounded-md bg-gold py-3.5 text-center font-bold text-primary"
              >
                Request Quote
              </Link>
              <a
                href="tel:9011023081"
                className="flex w-full items-center justify-center gap-2 rounded-md border border-border py-3 text-sm font-semibold text-text"
              >
                <Icon name="phone" size={16} /> Call 90110 23081
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
