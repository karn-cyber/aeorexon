import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUserInfo } from "@/lib/auth";
import { Icon } from "@/components/Icon";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: "layout-dashboard" },
  { href: "/admin/products", label: "Products", icon: "package" },
  { href: "/admin/orders", label: "Orders", icon: "shopping-cart" },
  { href: "/admin/chat", label: "Messages", icon: "handshake" },
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
    <div className="mx-auto flex max-w-7xl gap-8 px-4 py-8">
      <aside className="hidden w-56 shrink-0 lg:block">
        <div className="sticky top-24 space-y-1">
          <p className="px-3 pb-2 text-xs font-bold uppercase tracking-wide text-text-muted">
            Admin
          </p>
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
  );
}
