import Link from "next/link";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { SearchBar } from "./SearchBar";
import { Icon } from "@/components/Icon";
import { CartLink } from "@/components/cart/CartLink";
import { getCurrentUserInfo } from "@/lib/auth";

const navLinks = [
  { href: "/products", label: "Catalogue" },
  { href: "/categories/solenoid-wall", label: "Solenoid" },
  { href: "/categories/motor-driven", label: "Motor Pumps" },
  { href: "/categories/peristaltic", label: "Peristaltic" },
  { href: "/categories/controllers", label: "Controllers" },
];

export async function Navbar() {
  const { isAdmin, email } = await getCurrentUserInfo();
  const signedIn = Boolean(email);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 lg:flex-row lg:items-center lg:gap-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-extrabold uppercase tracking-tight">
            <span className="text-primary">A</span>
            <span className="text-accent">O</span>
            <span className="text-primary">REXON</span>
          </Link>
          <div className="flex items-center gap-3 lg:hidden">
            <CartLink />
            <Link
              href="/rfq"
              className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white"
            >
              Quote
            </Link>
          </div>
        </div>

        <div className="flex-1 lg:max-w-lg">
          <SearchBar />
        </div>

        <nav className="hidden items-center gap-5 text-sm font-medium text-text-muted lg:flex">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-primary">
              {l.label}
            </Link>
          ))}

          {isAdmin && (
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 font-semibold text-primary hover:text-accent"
            >
              <Icon name="layout-dashboard" size={16} /> Admin
            </Link>
          )}

          <CartLink />

          {signedIn ? (
            <UserButton />
          ) : (
            <SignInButton mode="modal">
              <button className="inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 font-semibold text-text hover:border-primary-light hover:text-primary">
                <Icon name="log-in" size={16} /> Log in
              </button>
            </SignInButton>
          )}

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
