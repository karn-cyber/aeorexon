import Link from "next/link";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { SearchBar } from "./SearchBar";
import { MobileMenu } from "./MobileMenu";
import { Icon } from "@/components/Icon";
import { CartLink } from "@/components/cart/CartLink";
import { getCurrentUserInfo } from "@/lib/auth";

const navLinks = [
  { href: "/products", label: "Catalogue" },
  { href: "/categories/motor-driven", label: "Motor Pumps" },
  { href: "/categories/peristaltic", label: "Peristaltic" },
  { href: "/categories/controllers", label: "Controllers" },
  { href: "/solutions", label: "Areas of Work" },
];

export async function Navbar() {
  const { isAdmin, email } = await getCurrentUserInfo();
  const signedIn = Boolean(email);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4">
        {/* Top row */}
        <div className="flex items-center gap-3 py-3">
          <MobileMenu links={navLinks} isAdmin={isAdmin} />

          <Link href="/" className="text-xl font-extrabold uppercase tracking-tight sm:text-2xl">
            <span className="text-primary">A</span>
            <span className="text-accent">O</span>
            <span className="text-primary">REXON</span>
          </Link>

          {/* Desktop search inline */}
          <div className="mx-4 hidden flex-1 lg:block">
            <SearchBar />
          </div>

          {/* Desktop nav links */}
          <nav className="hidden items-center gap-5 text-sm font-medium text-text-muted lg:flex">
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-primary">
                {l.label}
              </Link>
            ))}
            {isAdmin && (
              <Link href="/admin" className="inline-flex items-center gap-1.5 font-semibold text-primary hover:text-accent">
                <Icon name="layout-dashboard" size={16} /> Admin
              </Link>
            )}
          </nav>

          {/* Always-visible actions (right) */}
          <div className="ml-auto flex items-center gap-3 lg:ml-0">
            <CartLink />
            {signedIn ? (
              <UserButton />
            ) : (
              <SignInButton mode="modal">
                <button className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-semibold text-text hover:border-primary-light hover:text-primary">
                  <Icon name="log-in" size={16} />
                  <span className="hidden sm:inline">Log in</span>
                </button>
              </SignInButton>
            )}
            <Link
              href="/rfq"
              className="hidden rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:brightness-110 lg:inline-block"
            >
              Get a Quote
            </Link>
          </div>
        </div>

        {/* Mobile search row */}
        <div className="pb-3 lg:hidden">
          <SearchBar />
        </div>
      </div>
    </header>
  );
}
