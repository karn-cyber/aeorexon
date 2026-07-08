import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { getCurrentUserInfo } from "@/lib/auth";
import { Icon } from "@/components/Icon";

export const dynamic = "force-dynamic";

// Reached only when signed in (the middleware redirects signed-out users to the
// Clerk portal — the same reliable server-side flow the CRM uses).
export default async function AccountPage() {
  const { email, name, isAdmin } = await getCurrentUserInfo();

  const tiles = [
    { href: "/chat", label: "Messages", icon: "handshake" },
    { href: "/cart", label: "Cart", icon: "shopping-cart" },
    { href: "/compare", label: "Compare", icon: "sliders-horizontal" },
    ...(isAdmin
      ? [
          { href: "/admin", label: "Admin Dashboard", icon: "layout-dashboard" },
          { href: "/crm", label: "CRM / Pipeline", icon: "waypoints" },
        ]
      : []),
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="flex items-center gap-4">
        <UserButton />
        <div>
          <h1 className="text-2xl font-extrabold text-text">My Account</h1>
          <p className="mono-label text-text-muted">{name ?? email} {email ? `· ${email}` : ""}</p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {tiles.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="flex flex-col gap-2 rounded-xl border border-border bg-surface p-5 transition hover:border-accent hover:shadow-sm"
          >
            <Icon name={t.icon} size={22} className="text-accent" />
            <span className="font-semibold text-text">{t.label}</span>
          </Link>
        ))}
      </div>

      <Link href="/" className="mono-label mt-8 inline-block text-accent hover:underline">
        ← Back to site
      </Link>
    </div>
  );
}
