import { redirect } from "next/navigation";
import { getCurrentUserInfo } from "@/lib/auth";
import { ChatScreen } from "@/components/chat/ChatScreen";

export const metadata = { title: "Chat — Aorexon" };

export default async function ChatPage(props: PageProps<"/chat">) {
  const params = await props.searchParams;
  const { email, isAdmin } = await getCurrentUserInfo();
  if (!email) redirect("/sign-in?redirect_url=/chat");

  const c = typeof params.c === "string" ? params.c : undefined;
  const prefill = params.prefill === "1";

  return <ChatScreen isAdmin={isAdmin} initialConversationId={c} prefill={prefill} />;
}
