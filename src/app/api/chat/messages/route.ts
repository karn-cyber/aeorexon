import { NextResponse } from "next/server";
import { getCurrentUserInfo } from "@/lib/auth";
import { getMessages, addMessage, type Requester } from "@/lib/chat";

async function requester(): Promise<Requester | null> {
  const { email, name, isAdmin } = await getCurrentUserInfo();
  if (!email) return null;
  return { email, name: name ?? email, isAdmin };
}

export async function GET(req: Request) {
  const user = await requester();
  if (!user) return NextResponse.json({ ok: false, error: "Sign in required" }, { status: 401 });
  const conversationId = new URL(req.url).searchParams.get("conversationId");
  if (!conversationId) return NextResponse.json({ ok: false, error: "conversationId required" }, { status: 400 });
  const messages = await getMessages(conversationId, user);
  if (messages === null) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true, messages });
}

export async function POST(req: Request) {
  const user = await requester();
  if (!user) return NextResponse.json({ ok: false, error: "Sign in required" }, { status: 401 });
  const { conversationId, text } = await req.json();
  if (!conversationId || !text?.trim())
    return NextResponse.json({ ok: false, error: "conversationId and text required" }, { status: 400 });
  const msg = await addMessage(conversationId, user, text);
  if (!msg) return NextResponse.json({ ok: false, error: "Not found or empty" }, { status: 404 });
  return NextResponse.json({ ok: true, message: msg });
}
