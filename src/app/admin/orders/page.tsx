import clientPromise from "@/lib/mongodb";
import { formatINR } from "@/lib/pricing";
import { Icon } from "@/components/Icon";

export const dynamic = "force-dynamic";

interface OrderDoc {
  orderRef: string;
  items: { name: string; qty: number; unitPrice: number }[];
  contact: { name: string; email: string; phone: string; company?: string | null };
  total: number;
  status: string;
  createdAt: string;
}

async function getOrders(): Promise<OrderDoc[]> {
  try {
    const client = await clientPromise;
    const db = process.env.MONGODB_DB ?? "aorexon";
    return (await client
      .db(db)
      .collection<OrderDoc>("orders")
      .find({}, { projection: { _id: 0 } })
      .sort({ createdAt: -1 })
      .limit(200)
      .toArray()) as OrderDoc[];
  } catch {
    return [];
  }
}

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return (
    <div>
      <h1 className="text-3xl font-extrabold text-text">Orders</h1>
      <p className="mt-1 text-text-muted">Orders placed through the storefront checkout.</p>

      {orders.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-border bg-surface p-12 text-center text-text-muted">
          <Icon name="shopping-cart" size={36} strokeWidth={1.5} className="mx-auto" />
          <p className="mt-3">No orders yet.</p>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {orders.map((o) => (
            <div key={o.orderRef} className="rounded-xl border border-border bg-surface p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="font-bold text-text">{o.orderRef}</span>
                  <span className="ml-2 rounded-full bg-warning/15 px-2 py-0.5 text-xs font-semibold text-warning">
                    {o.status}
                  </span>
                </div>
                <div className="text-sm text-text-muted">
                  {new Date(o.createdAt).toLocaleString("en-IN")}
                </div>
              </div>
              <div className="mt-2 text-sm text-text-muted">
                {o.contact.name} · {o.contact.email} · {o.contact.phone}
                {o.contact.company ? ` · ${o.contact.company}` : ""}
              </div>
              <div className="mt-2 text-sm text-text">
                {o.items.map((i) => `${i.name} × ${i.qty}`).join(", ")}
              </div>
              <div className="mt-2 font-bold text-text">{formatINR(o.total)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
