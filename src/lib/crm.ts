import "server-only";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import type { Lead, StageKey } from "@/lib/crmTypes";

const DB_NAME = process.env.MONGODB_DB ?? "aorexon";
const COL = "leads";

/* eslint-disable @typescript-eslint/no-explicit-any */
async function col() {
  const client = await clientPromise;
  const c = client.db(DB_NAME).collection(COL);
  await c.createIndex({ stage: 1, updatedAt: -1 });
  await c.createIndex({ nextFollowUp: 1 });
  return c;
}

function toLead(d: any): Lead {
  const { _id, ...rest } = d;
  return { id: String(_id), ...rest } as Lead;
}

export async function listLeads(): Promise<Lead[]> {
  const c = await col();
  const docs = await c.find({}).sort({ updatedAt: -1 }).limit(1000).toArray();
  return docs.map(toLead);
}

export async function getLead(id: string): Promise<Lead | null> {
  let _id: ObjectId;
  try {
    _id = new ObjectId(id);
  } catch {
    return null;
  }
  const c = await col();
  const d = await c.findOne({ _id });
  return d ? toLead(d) : null;
}

export async function createLead(
  data: Partial<Lead>,
  owner: string
): Promise<Lead> {
  const c = await col();
  const now = new Date().toISOString();
  const count = await c.countDocuments();
  const doc = {
    refNo: `AX-CRM-${String(count + 1).padStart(4, "0")}`,
    customer: data.customer ?? { name: "Unnamed" },
    approachDate: data.approachDate ?? now.slice(0, 10),
    requirementType: data.requirementType ?? "inquiry",
    requirement: data.requirement ?? "",
    stage: (data.stage as StageKey) ?? "new",
    items: [],
    nextFollowUp: data.nextFollowUp ?? undefined,
    owner,
    activities: [{ at: now, note: "Lead created", by: owner }],
    createdAt: now,
    updatedAt: now,
  };
  const res = await c.insertOne(doc);
  return toLead({ ...doc, _id: res.insertedId });
}

export async function updateLead(
  id: string,
  patch: Partial<Lead>
): Promise<Lead | null> {
  let _id: ObjectId;
  try {
    _id = new ObjectId(id);
  } catch {
    return null;
  }
  const c = await col();
  const { id: _drop, activities: _a, createdAt: _cr, ...rest } = patch as any;
  await c.updateOne({ _id }, { $set: { ...rest, updatedAt: new Date().toISOString() } });
  const d = await c.findOne({ _id });
  return d ? toLead(d) : null;
}

export async function addActivity(
  id: string,
  note: string,
  by: string,
  extraSet?: Partial<Lead>
): Promise<Lead | null> {
  let _id: ObjectId;
  try {
    _id = new ObjectId(id);
  } catch {
    return null;
  }
  const c = await col();
  const now = new Date().toISOString();
  const set: any = { updatedAt: now };
  if (extraSet) Object.assign(set, extraSet);
  await c.updateOne(
    { _id },
    { $push: { activities: { at: now, note, by } }, $set: set } as any
  );
  const d = await c.findOne({ _id });
  return d ? toLead(d) : null;
}

export async function deleteLead(id: string): Promise<void> {
  try {
    const c = await col();
    await c.deleteOne({ _id: new ObjectId(id) });
  } catch {
    /* ignore */
  }
}

export interface CrmStats {
  total: number;
  byStage: Record<string, number>;
  openPipelineValue: number;
  followUpsDue: number;
}

export async function crmStats(leads: Lead[]): Promise<CrmStats> {
  const today = new Date().toISOString().slice(0, 10);
  const byStage: Record<string, number> = {};
  let openPipelineValue = 0;
  let followUpsDue = 0;
  for (const l of leads) {
    byStage[l.stage] = (byStage[l.stage] ?? 0) + 1;
    if (l.stage !== "closed" && l.stage !== "lost") {
      openPipelineValue += l.orderValue ?? l.quoteAmount ?? 0;
    }
    if (l.nextFollowUp && l.nextFollowUp <= today && l.stage !== "closed" && l.stage !== "lost") {
      followUpsDue++;
    }
  }
  return { total: leads.length, byStage, openPipelineValue, followUpsDue };
}
