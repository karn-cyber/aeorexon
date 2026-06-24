import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

const DB_NAME = process.env.MONGODB_DB ?? "aorexon";

interface IncomingItem {
  slug: string;
  name: string;
  unitPrice: number;
  qty: number;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const items: IncomingItem[] = Array.isArray(body.items) ? body.items : [];
    const { name, email, phone, company, notes } = body.contact ?? {};

    if (items.length === 0) {
      return NextResponse.json({ ok: false, error: "Cart is empty" }, { status: 400 });
    }
    if (!name || !email || !phone) {
      return NextResponse.json(
        { ok: false, error: "Name, email and phone are required" },
        { status: 400 }
      );
    }

    const total = items.reduce((s, i) => s + i.unitPrice * i.qty, 0);
    const orderRef = "AOR-" + Math.random().toString(36).slice(2, 8).toUpperCase();

    const client = await clientPromise;
    await client
      .db(DB_NAME)
      .collection("orders")
      .insertOne({
        orderRef,
        items,
        contact: { name, email, phone, company: company ?? null, notes: notes ?? null },
        total,
        status: "PENDING",
        createdAt: new Date().toISOString(),
      });

    return NextResponse.json({ ok: true, orderRef, total });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
