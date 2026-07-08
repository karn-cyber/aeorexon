import Link from "next/link";
import clientPromise from "@/lib/mongodb";
import { countProducts } from "@/lib/products";
import { listAdmins } from "@/lib/admins";
import { Icon } from "@/components/Icon";

async function countOrders(): Promise<number> {
  try {
    const client = await clientPromise;
    const db = process.env.MONGODB_DB ?? "aorexon";
    return await client.db(db).collection("orders").countDocuments();
  } catch {
    return 0;
  }
}

export default async function AdminDashboard() {
  const [products, orders, admins] = await Promise.all([
    countProducts(),
    countOrders(),
    listAdmins(),
  ]);

  const stats = [
    { label: "Products", value: products, href: "/admin/products", icon: "package" },
    { label: "Orders", value: orders, href: "/admin/orders", icon: "shopping-cart" },
    { label: "Team members", value: admins.length, href: "/admin/access", icon: "users" },
  ];

  return (
    <div>
      <h1 className="text-3xl font-extrabold text-text">Dashboard</h1>
      <p className="mt-1 text-text-muted">Manage products, pricing, orders and team access.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="rounded-xl border border-border bg-surface p-5 transition hover:border-primary-light hover:shadow-sm"
          >
            <div className="flex items-center justify-between">
              <Icon name={s.icon} size={22} className="text-primary" />
              <Icon name="chevron-right" size={18} className="text-text-muted" />
            </div>
            <div className="mt-3 text-3xl font-extrabold text-text">{s.value}</div>
            <div className="text-sm text-text-muted">{s.label}</div>
          </Link>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 font-semibold text-white hover:brightness-110"
        >
          <Icon name="plus" size={18} /> Add product
        </Link>
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 font-semibold text-text hover:border-primary-light"
        >
          <Icon name="tag" size={18} /> Manage pricing
        </Link>
      </div>
    </div>
  );
}
