import { NextResponse } from "next/server";
import { getCurrentUserInfo } from "@/lib/auth";
import { listConversations, getOrCreateConversation, type Requester } from "@/lib/chat";

async function requester(): Promise<Requester | null> {
  const { email, name, isAdmin } = await getCurrentUserInfo();
  if (!email) return null;
  return { email, name: name ?? email, isAdmin };
}

export async function GET() {
  const user = await requester();
  if (!user) return NextResponse.json({ ok: false, error: "Sign in required" }, { status: 401 });
  return NextResponse.json({ ok: true, conversations: await listConversations(user), me: user });
}

// Start (or reopen) a conversation for a product/subject.
export async function POST(req: Request) {
  const user = await requester();
  if (!user) return NextResponse.json({ ok: false, error: "Sign in required" }, { status: 401 });
  const body = await req.json();
  const subject = (body.subject ?? "").toString().trim() || "General enquiry";
  const productSlug = body.productSlug ? String(body.productSlug) : undefined;
  const conv = await getOrCreateConversation(user, subject, productSlug);
  return NextResponse.json({ ok: true, conversation: conv });
}
