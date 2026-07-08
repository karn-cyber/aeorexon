"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { Icon } from "@/components/Icon";

interface Conversation {
  id: string;
  ownerEmail: string;
  ownerName: string;
  subject: string;
  productSlug?: string;
  lastMessageAt: string;
  lastMessageText: string;
  lastSender: "user" | "admin" | null;
}
interface Message {
  id: string;
  sender: "user" | "admin";
  senderName: string;
  text: string;
  createdAt: string;
}
interface Me {
  email: string;
  name: string;
  isAdmin: boolean;
}

function timeLabel(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("en-IN", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "short" });
}

export function ChatScreen({
  isAdmin,
  initialConversationId,
  prefill,
}: {
  isAdmin: boolean;
  initialConversationId?: string;
  prefill?: boolean;
}) {
  const [me, setMe] = useState<Me | null>(null);
  const [convos, setConvos] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(initialConversationId ?? null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [loadingConvos, setLoadingConvos] = useState(true);
  const endRef = useRef<HTMLDivElement>(null);
  const prefilledRef = useRef(false);

  const loadConvos = useCallback(async () => {
    const res = await fetch("/api/chat/conversations");
    const data = await res.json();
    if (data.ok) {
      setConvos(data.conversations);
      setMe(data.me);
      if (!activeId && data.conversations[0]) setActiveId(data.conversations[0].id);
    }
    setLoadingConvos(false);
  }, [activeId]);

  const loadMessages = useCallback(async (id: string) => {
    const res = await fetch(`/api/chat/messages?conversationId=${id}`);
    const data = await res.json();
    if (data.ok) setMessages(data.messages);
  }, []);

  useEffect(() => {
    loadConvos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!activeId) return;
    loadMessages(activeId);
    const t = setInterval(() => {
      loadMessages(activeId);
      loadConvos();
    }, 4000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId]);

  // Prefill the composer with the quote message on a freshly-opened empty thread.
  useEffect(() => {
    if (prefill && !prefilledRef.current && activeId && messages.length === 0) {
      const conv = convos.find((c) => c.id === activeId);
      if (conv) {
        setText(`Hi, I'd like a quote for “${conv.subject}”. Could you share pricing, availability and lead time?`);
        prefilledRef.current = true;
      }
    }
  }, [prefill, activeId, messages.length, convos]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  async function send(e?: FormEvent) {
    e?.preventDefault();
    if (!text.trim() || !activeId) return;
    setSending(true);
    const body = { conversationId: activeId, text };
    setText("");
    const res = await fetch("/api/chat/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (data.ok) {
      setMessages((m) => [...m, data.message]);
      loadConvos();
    } else {
      setText(body.text);
    }
    setSending(false);
  }

  const active = convos.find((c) => c.id === activeId) ?? null;

  return (
    <div className="mx-auto flex h-[calc(100dvh-64px)] max-w-6xl overflow-hidden border-x border-border bg-surface lg:h-[calc(100dvh-72px)]">
      {/* Conversation list */}
      <aside
        className={`w-full shrink-0 flex-col border-r border-border sm:flex sm:w-80 ${
          activeId ? "hidden sm:flex" : "flex"
        }`}
      >
        <div className="border-b border-border px-4 py-3">
          <h1 className="text-lg font-bold text-text">
            {isAdmin ? "Customer messages" : "Your quote chats"}
          </h1>
          <p className="text-xs text-text-muted">
            {isAdmin ? "Reply to quote enquiries" : "Chat with our team about quotes"}
          </p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {loadingConvos ? (
            <p className="p-4 text-sm text-text-muted">Loading…</p>
          ) : convos.length === 0 ? (
            <div className="p-6 text-center text-sm text-text-muted">
              <Icon name="handshake" size={32} className="mx-auto mb-2 text-text-muted" />
              {isAdmin ? "No customer messages yet." : "No chats yet. Request a quote on any product to start one."}
            </div>
          ) : (
            convos.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveId(c.id)}
                className={`flex w-full flex-col border-b border-border px-4 py-3 text-left hover:bg-bg ${
                  c.id === activeId ? "bg-bg" : ""
                }`}
              >
                <span className="truncate text-sm font-semibold text-text">{c.subject}</span>
                {isAdmin && <span className="truncate text-xs text-primary">{c.ownerName} · {c.ownerEmail}</span>}
                <span className="mt-0.5 flex items-center gap-1 truncate text-xs text-text-muted">
                  {c.lastSender === "admin" && "You: "}
                  {c.lastMessageText || "New enquiry"}
                </span>
              </button>
            ))
          )}
        </div>
      </aside>

      {/* Thread */}
      <section className={`flex-1 flex-col ${activeId ? "flex" : "hidden sm:flex"}`}>
        {active ? (
          <>
            <div className="flex items-center gap-3 border-b border-border px-4 py-3">
              <button className="sm:hidden" onClick={() => setActiveId(null)} aria-label="Back">
                <Icon name="chevron-right" size={22} className="rotate-180 text-text-muted" />
              </button>
              <div className="min-w-0">
                <div className="truncate font-bold text-text">{active.subject}</div>
                <div className="truncate text-xs text-text-muted">
                  {isAdmin ? `${active.ownerName} · ${active.ownerEmail}` : "Aorexon Sales"}
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto bg-bg p-4">
              {messages.length === 0 && (
                <p className="mx-auto max-w-sm rounded-lg bg-surface p-3 text-center text-sm text-text-muted">
                  Start the conversation — your message goes straight to our team.
                </p>
              )}
              {messages.map((m) => {
                const mine = me ? (m.sender === "admin") === me.isAdmin : m.sender === "user";
                return (
                  <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                      mine ? "bg-accent text-white" : "border border-border bg-surface text-text"
                    }`}>
                      {!mine && <div className="mb-0.5 text-xs font-semibold opacity-70">{m.sender === "admin" ? "Aorexon" : m.senderName}</div>}
                      <p className="whitespace-pre-wrap break-words">{m.text}</p>
                      <div className={`mt-1 text-[10px] ${mine ? "text-white/70" : "text-text-muted"}`}>{timeLabel(m.createdAt)}</div>
                    </div>
                  </div>
                );
              })}
              <div ref={endRef} />
            </div>

            <form onSubmit={send} className="flex items-end gap-2 border-t border-border p-3">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
                }}
                rows={1}
                placeholder="Type a message…"
                className="max-h-32 flex-1 resize-none rounded-xl border border-border px-4 py-2.5 text-sm outline-none focus:border-primary-light"
              />
              <button
                type="submit"
                disabled={sending || !text.trim()}
                className="rounded-xl bg-accent px-5 py-2.5 font-semibold text-white hover:brightness-110 disabled:opacity-50"
              >
                Send
              </button>
            </form>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center text-text-muted">
            Select a conversation
          </div>
        )}
      </section>
    </div>
  );
}
