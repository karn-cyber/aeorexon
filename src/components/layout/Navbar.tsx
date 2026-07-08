import Link from "next/link";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { SearchBar } from "./SearchBar";
import { MobileMenu } from "./MobileMenu";
import { Icon } from "@/components/Icon";
import { CartLink } from "@/components/cart/CartLink";
import { getCurrentUserInfo } from "@/lib/auth";

const navLinks = [
  { href: "/products", label: "Dosing Pumps" },
  { href: "/solutions/lynchpin-seating", label: "Furniture" },
  { href: "/solutions/png-gas-pipeline", label: "Pipelines" },
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
          <MobileMenu isAdmin={isAdmin} signedIn={signedIn} />

          <Link href="/" className="flex items-center gap-2 leading-none">
            <span className="flex h-8 w-8 items-center justify-center rounded-[6px] bg-primary text-sm font-black text-gold">
              A
            </span>
            <span className="hidden text-lg font-extrabold uppercase tracking-tight text-primary sm:block">
              Aorexon <span className="text-text-muted">Systems</span>
            </span>
          </Link>

          {/* Desktop search inline */}
          <div className="mx-4 hidden flex-1 lg:block">
            <SearchBar />
          </div>

          {/* Desktop nav links (mono, technical) */}
          <nav className="mono-label hidden items-center gap-5 font-semibold text-text-muted lg:flex">
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} className="transition hover:text-accent">
                {l.label}
              </Link>
            ))}
            {isAdmin && (
              <Link href="/admin" className="inline-flex items-center gap-1.5 text-accent hover:text-primary">
                <Icon name="layout-dashboard" size={14} /> Admin
              </Link>
            )}
          </nav>

          {/* Always-visible actions (right) */}
          <div className="ml-auto flex items-center gap-3 lg:ml-0">
            {signedIn && (
              <Link href="/chat" className="text-text-muted hover:text-accent" aria-label="Messages" title="Messages">
                <Icon name="handshake" size={22} />
              </Link>
            )}
            <CartLink />
            {signedIn ? (
              <UserButton />
            ) : (
              <SignInButton mode="modal">
                <button className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm font-semibold text-text hover:border-accent hover:text-accent">
                  <Icon name="log-in" size={16} />
                  <span className="hidden sm:inline">Log in</span>
                </button>
              </SignInButton>
            )}
            <Link
              href="/chat/new?name=Quote%20request"
              className="mono-label hidden rounded-md bg-gold px-4 py-2.5 font-bold text-primary shadow-sm transition hover:brightness-105 lg:inline-block"
            >
              Request Quote
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
