import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { listAdmins, addAdmin, removeAdmin } from "@/lib/admins";

export async function GET() {
  try {
    await requireAdmin();
    return NextResponse.json({ ok: true, admins: await listAdmins() });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: msg }, { status: msg.includes("Unauthorized") ? 403 : 500 });
  }
}

export async function POST(req: Request) {
  try {
    const actor = await requireAdmin();
    const { email } = await req.json();
    await addAdmin(email, actor);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: msg }, { status: msg.includes("Unauthorized") ? 403 : 400 });
  }
}

export async function DELETE(req: Request) {
  try {
    await requireAdmin();
    const email = new URL(req.url).searchParams.get("email");
    if (!email) return NextResponse.json({ ok: false, error: "email required" }, { status: 400 });
    await removeAdmin(email);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: msg }, { status: msg.includes("Unauthorized") ? 403 : 400 });
  }
}
