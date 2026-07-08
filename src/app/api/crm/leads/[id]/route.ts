import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getLead, updateLead, addActivity, deleteLead } from "@/lib/crm";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await ctx.params;
    const lead = await getLead(id);
    if (!lead) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    return NextResponse.json({ ok: true, lead });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: msg }, { status: msg.includes("Unauthorized") ? 403 : 500 });
  }
}

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const actor = await requireAdmin();
    const { id } = await ctx.params;
    const body = await req.json();
    // If a note is supplied, log it as an activity (and apply any field changes).
    if (typeof body.note === "string" && body.note.trim()) {
      const { note, ...rest } = body;
      const lead = await addActivity(id, note.trim(), actor, rest);
      if (!lead) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
      return NextResponse.json({ ok: true, lead });
    }
    const lead = await updateLead(id, body);
    if (!lead) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    return NextResponse.json({ ok: true, lead });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: msg }, { status: msg.includes("Unauthorized") ? 403 : 500 });
  }
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await ctx.params;
    await deleteLead(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: msg }, { status: msg.includes("Unauthorized") ? 403 : 500 });
  }
}
