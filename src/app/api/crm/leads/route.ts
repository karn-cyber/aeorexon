import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { listLeads, createLead } from "@/lib/crm";

export async function GET() {
  try {
    await requireAdmin();
    return NextResponse.json({ ok: true, leads: await listLeads() });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: msg }, { status: msg.includes("Unauthorized") ? 403 : 500 });
  }
}

export async function POST(req: Request) {
  try {
    const owner = await requireAdmin();
    const body = await req.json();
    if (!body?.customer?.name?.trim()) {
      return NextResponse.json({ ok: false, error: "Customer name is required" }, { status: 400 });
    }
    const lead = await createLead(body, owner);
    return NextResponse.json({ ok: true, lead });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: msg }, { status: msg.includes("Unauthorized") ? 403 : 500 });
  }
}
