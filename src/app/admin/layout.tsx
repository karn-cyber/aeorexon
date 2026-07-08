import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { getCurrentUserInfo } from "@/lib/auth";
import { Icon } from "@/components/Icon";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: "layout-dashboard" },
  { href: "/admin/products", label: "Products", icon: "package" },
  { href: "/admin/price-list", label: "Price list builder", icon: "tag" },
  { href: "/admin/orders", label: "Orders", icon: "shopping-cart" },
  { href: "/admin/chat", label: "Messages", icon: "handshake" },
  { href: "/crm", label: "CRM / Pipeline", icon: "waypoints" },
  { href: "/admin/access", label: "Team access", icon: "users" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAdmin, email } = await getCurrentUserInfo();

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <Icon name="shield-alert" size={48} className="mx-auto text-error" />
        <h1 className="mt-4 text-2xl font-bold text-text">Admin access required</h1>
        <p className="mt-2 text-text-muted">
          {email
            ? `${email} is not an admin. Ask an existing admin to grant access from Team access.`
            : "Please sign in with an admin account."}
        </p>
        <Link href="/" className="mt-6 inline-block rounded-lg bg-accent px-6 py-3 font-semibold text-white">
          Back to site
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-surface px-4 py-3">
        <Link href="/admin" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-black text-gold">A</span>
          <span className="text-base font-bold tracking-tight text-text">Aorexon <span className="text-text-muted">Admin</span></span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/" className="text-sm text-text-muted hover:text-text">← Site</Link>
          <UserButton />
        </div>
      </header>
      <div className="mx-auto flex max-w-7xl gap-8 px-4 py-8">
        <aside className="hidden w-56 shrink-0 lg:block">
          <div className="sticky top-20 space-y-1">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-text-muted hover:bg-surface hover:text-primary"
              >
                <Icon name={n.icon} size={18} />
                {n.label}
              </Link>
            ))}
          </div>
        </aside>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
