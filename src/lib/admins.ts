import "server-only";
import clientPromise from "@/lib/mongodb";

const DB_NAME = process.env.MONGODB_DB ?? "aorexon";
const COLLECTION = "admins";

export interface AdminRecord {
  email: string;
  addedBy?: string;
  createdAt?: string;
}

function bootstrapEmails(): string[] {
  return (process.env.ADMIN_BOOTSTRAP_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

async function collection() {
  const client = await clientPromise;
  const col = client.db(DB_NAME).collection<AdminRecord>(COLLECTION);
  await col.createIndex({ email: 1 }, { unique: true });
  return col;
}

/** True if the email is a bootstrap admin or present in the admins collection. */
export async function isAdminEmail(email?: string | null): Promise<boolean> {
  if (!email) return false;
  const e = email.toLowerCase();
  if (bootstrapEmails().includes(e)) return true;
  try {
    const col = await collection();
    return Boolean(await col.findOne({ email: e }));
  } catch {
    return false;
  }
}

export async function listAdmins(): Promise<AdminRecord[]> {
  const col = await collection();
  const docs = await col.find({}, { projection: { _id: 0 } }).toArray();
  const boot = bootstrapEmails().map((email) => ({
    email,
    addedBy: "bootstrap (env)",
  }));
  // Merge env bootstrap admins (shown but not removable) with DB admins.
  const seen = new Set(docs.map((d) => d.email));
  return [...boot.filter((b) => !seen.has(b.email)), ...docs];
}

export async function addAdmin(email: string, addedBy: string): Promise<void> {
  const e = email.trim().toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e)) throw new Error("Invalid email");
  const col = await collection();
  await col.updateOne(
    { email: e },
    { $setOnInsert: { email: e, addedBy, createdAt: new Date().toISOString() } },
    { upsert: true }
  );
}

export async function removeAdmin(email: string): Promise<void> {
  const e = email.trim().toLowerCase();
  if (bootstrapEmails().includes(e)) {
    throw new Error("Cannot remove a bootstrap admin (set via env var)");
  }
  const col = await collection();
  await col.deleteOne({ email: e });
}

export function isBootstrapEmail(email: string): boolean {
  return bootstrapEmails().includes(email.trim().toLowerCase());
}
