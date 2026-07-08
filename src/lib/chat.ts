import "server-only";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

const DB_NAME = process.env.MONGODB_DB ?? "aorexon";

export interface Conversation {
  id: string;
  ownerEmail: string;
  ownerName: string;
  subject: string;
  productSlug?: string;
  createdAt: string;
  lastMessageAt: string;
  lastMessageText: string;
  lastSender: "user" | "admin" | null;
}

export interface Message {
  id: string;
  conversationId: string;
  sender: "user" | "admin";
  senderName: string;
  text: string;
  createdAt: string;
}

export interface Requester {
  email: string;
  name: string;
  isAdmin: boolean;
}

async function cols() {
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  const conversations = db.collection("conversations");
  const messages = db.collection("messages");
  await conversations.createIndex({ ownerEmail: 1, lastMessageAt: -1 });
  await messages.createIndex({ conversationId: 1, createdAt: 1 });
  return { conversations, messages };
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function toConversation(doc: any): Conversation {
  return {
    id: String(doc._id),
    ownerEmail: doc.ownerEmail,
    ownerName: doc.ownerName,
    subject: doc.subject,
    productSlug: doc.productSlug ?? undefined,
    createdAt: doc.createdAt,
    lastMessageAt: doc.lastMessageAt,
    lastMessageText: doc.lastMessageText ?? "",
    lastSender: doc.lastSender ?? null,
  };
}

/** Find an existing quote thread for this user+product, or create one. */
export async function getOrCreateConversation(
  user: Requester,
  subject: string,
  productSlug?: string
): Promise<Conversation> {
  const { conversations } = await cols();
  const now = new Date().toISOString();

  if (productSlug) {
    const existing = await conversations.findOne({
      ownerEmail: user.email,
      productSlug,
    });
    if (existing) return toConversation(existing);
  }

  const doc = {
    ownerEmail: user.email,
    ownerName: user.name,
    subject,
    productSlug: productSlug ?? null,
    createdAt: now,
    lastMessageAt: now,
    lastMessageText: "",
    lastSender: null,
  };
  const res = await conversations.insertOne(doc);
  return toConversation({ ...doc, _id: res.insertedId });
}

export async function listConversations(user: Requester): Promise<Conversation[]> {
  const { conversations } = await cols();
  const filter = user.isAdmin ? {} : { ownerEmail: user.email };
  const docs = await conversations
    .find(filter)
    .sort({ lastMessageAt: -1 })
    .limit(200)
    .toArray();
  return docs.map(toConversation);
}

async function authorizedConversation(
  conversationId: string,
  user: Requester
): Promise<any | null> {
  const { conversations } = await cols();
  let _id: ObjectId;
  try {
    _id = new ObjectId(conversationId);
  } catch {
    return null;
  }
  const conv = await conversations.findOne({ _id });
  if (!conv) return null;
  if (!user.isAdmin && conv.ownerEmail !== user.email) return null;
  return conv;
}

export async function getMessages(
  conversationId: string,
  user: Requester
): Promise<Message[] | null> {
  const conv = await authorizedConversation(conversationId, user);
  if (!conv) return null;
  const { messages } = await cols();
  const docs = await messages
    .find({ conversationId })
    .sort({ createdAt: 1 })
    .toArray();
  return docs.map((d: any) => ({
    id: String(d._id),
    conversationId: d.conversationId,
    sender: d.sender,
    senderName: d.senderName,
    text: d.text,
    createdAt: d.createdAt,
  }));
}

export async function addMessage(
  conversationId: string,
  user: Requester,
  text: string
): Promise<Message | null> {
  const conv = await authorizedConversation(conversationId, user);
  if (!conv) return null;
  const clean = text.trim();
  if (!clean) return null;

  const sender: "user" | "admin" =
    user.isAdmin && conv.ownerEmail !== user.email ? "admin" : "user";
  const now = new Date().toISOString();
  const { conversations, messages } = await cols();

  const doc = {
    conversationId,
    sender,
    senderName: user.name,
    text: clean.slice(0, 4000),
    createdAt: now,
  };
  const res = await messages.insertOne(doc);
  await conversations.updateOne(
    { _id: conv._id },
    { $set: { lastMessageAt: now, lastMessageText: doc.text, lastSender: sender } }
  );
  return { id: String(res.insertedId), ...doc };
}
