import Link from "next/link";
import { SearchBar } from "./SearchBar";

const navLinks = [
  { href: "/products", label: "Catalogue" },
  { href: "/categories/solenoid-wall", label: "Solenoid" },
  { href: "/categories/motor-driven", label: "Motor Pumps" },
  { href: "/categories/peristaltic", label: "Peristaltic" },
  { href: "/categories/controllers", label: "Controllers" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 lg:flex-row lg:items-center lg:gap-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-extrabold uppercase tracking-tight">
            <span className="text-primary">A</span>
            <span className="text-accent">O</span>
            <span className="text-primary">REXON</span>
          </Link>
          <Link
            href="/rfq"
            className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white lg:hidden"
          >
            Get a Quote
          </Link>
        </div>

        <div className="flex-1 lg:max-w-xl">
          <SearchBar />
        </div>

        <nav className="hidden items-center gap-5 text-sm font-medium text-text-muted lg:flex">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-primary">
              {l.label}
            </Link>
          ))}
          <Link
            href="/rfq"
            className="rounded-lg bg-accent px-4 py-2 font-semibold text-white hover:brightness-110"
          >
            Get a Quote
          </Link>
        </nav>
      </div>
    </header>
  );
}
