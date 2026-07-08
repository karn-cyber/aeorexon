import { ChatScreen } from "@/components/chat/ChatScreen";

export const metadata = { title: "Messages — Admin" };

// Admin inbox: sees all customer quote conversations and replies as Aorexon.
export default function AdminChatPage() {
  return (
    <div className="-mx-4 -my-8">
      <ChatScreen isAdmin />
    </div>
  );
}
