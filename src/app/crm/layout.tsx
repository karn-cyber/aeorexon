import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { getCurrentUserInfo } from "@/lib/auth";
import { Icon } from "@/components/Icon";

export const metadata = { title: "Aorexon CRM" };

export default async function CrmLayout({ children }: { children: React.ReactNode }) {
  const { isAdmin, email } = await getCurrentUserInfo();

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <Icon name="shield-alert" size={48} className="mx-auto text-error" />
        <h1 className="mt-4 text-2xl font-bold text-text">CRM access required</h1>
        <p className="mt-2 text-text-muted">
          {email ? `${email} is not a CRM user.` : "Please sign in."} Ask an admin to grant
          access under Team Access.
        </p>
        <Link href="/" className="mt-6 inline-block rounded-lg bg-accent px-6 py-3 font-semibold text-white">
          Back to site
        </Link>
      </div>
    );
  }

  const nav = [
    { href: "/crm", label: "Pipeline", icon: "layout-dashboard" },
    { href: "/crm/leads/new", label: "New Lead", icon: "plus" },
  ];

  return (
    <div className="min-h-screen bg-bg">
      <header className="sticky top-0 z-30 border-b border-border bg-ink text-white">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
          <Link href="/crm" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-[6px] bg-white/10 text-sm font-black text-gold">A</span>
            <span className="font-extrabold uppercase tracking-tight">Aorexon <span className="text-white/50">CRM</span></span>
          </Link>
          <nav className="mono-label ml-4 hidden gap-4 sm:flex">
            {nav.map((n) => (
              <Link key={n.href} href={n.href} className="inline-flex items-center gap-1.5 text-white/70 hover:text-white">
                <Icon name={n.icon} size={14} /> {n.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-3">
            <Link href="/" className="mono-label text-white/60 hover:text-white">← Site</Link>
            <UserButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
    </div>
  );
}
