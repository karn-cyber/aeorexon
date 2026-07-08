import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { getCurrentUserInfo } from "@/lib/auth";
import { CrmNav } from "@/components/crm/CrmNav";
import { Icon } from "@/components/Icon";

export const metadata = { title: "Aorexon CRM" };

export default async function CrmLayout({ children }: { children: React.ReactNode }) {
  const { isAdmin, name, email } = await getCurrentUserInfo();

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <Icon name="shield-alert" size={44} className="mx-auto text-error" />
        <h1 className="mt-4 text-xl font-bold text-text">CRM access required</h1>
        <p className="mt-2 text-sm text-text-muted">
          {email ? `${email} isn’t a CRM user.` : "Please sign in."} Ask an admin for access.
        </p>
        <Link href="/" className="mt-6 inline-block rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white">
          Back to site
        </Link>
      </div>
    );
  }

  const brand = (
    <Link href="/crm" className="flex items-center gap-2">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-black text-gold">A</span>
      <span className="text-base font-bold tracking-tight text-text">
        Aorexon <span className="text-text-muted">CRM</span>
      </span>
    </Link>
  );

  return (
    <div className="min-h-screen bg-bg">
      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-border bg-surface px-4 py-3 lg:hidden">
        {brand}
        <div className="flex items-center gap-2">
          <CrmNav variant="top" />
          <UserButton />
        </div>
      </header>

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-60 flex-col border-r border-border bg-surface p-4 lg:flex">
        <div className="px-2 pb-6 pt-1">{brand}</div>
        <CrmNav variant="sidebar" />
        <div className="mt-auto border-t border-border pt-3">
          <div className="flex items-center gap-3 px-1 py-2">
            <UserButton />
            <div className="min-w-0">
              <div className="truncate text-sm font-medium text-text">{name ?? "Signed in"}</div>
              <div className="truncate text-xs text-text-muted">{email}</div>
            </div>
          </div>
          <Link href="/" className="mt-1 flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-text-muted hover:bg-bg hover:text-text">
            <Icon name="chevron-right" size={16} className="rotate-180" /> Back to site
          </Link>
        </div>
      </aside>

      <main className="px-4 py-6 lg:ml-60 lg:px-8 lg:py-8">{children}</main>
    </div>
  );
}
