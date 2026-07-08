import { redirect } from "next/navigation";
import { getCurrentUserInfo } from "@/lib/auth";
import { getOrCreateConversation } from "@/lib/chat";

// Auth-gated by proxy.ts — unauthenticated users are sent to /sign-in and
// returned here after login. Creates (or reopens) the product quote thread,
// then redirects into the full chat screen.
export default async function NewChatPage(props: PageProps<"/chat/new">) {
  const params = await props.searchParams;
  const slug = typeof params.slug === "string" ? params.slug : undefined;
  const name = typeof params.name === "string" ? params.name : "General enquiry";

  const { email, name: userName } = await getCurrentUserInfo();
  if (!email) redirect("/sign-in?redirect_url=/chat");

  const conv = await getOrCreateConversation(
    { email, name: userName ?? email, isAdmin: false },
    name,
    slug
  );
  redirect(`/chat?c=${conv.id}&prefill=1`);
}
