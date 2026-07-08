"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { REQUIREMENT_TYPES } from "@/lib/crmTypes";
import { Icon } from "@/components/Icon";

export default function NewLeadPage() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [f, setF] = useState({
    name: "",
    company: "",
    phone: "",
    email: "",
    approachDate: new Date().toISOString().slice(0, 10),
    requirementType: "inquiry",
    requirement: "",
    nextFollowUp: "",
  });

  const set = (k: keyof typeof f, v: string) => setF((p) => ({ ...p, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/crm/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: { name: f.name, company: f.company, phone: f.phone, email: f.email },
          approachDate: f.approachDate,
          requirementType: f.requirementType,
          requirement: f.requirement,
          nextFollowUp: f.nextFollowUp || undefined,
        }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error);
      router.push(`/crm/leads/${data.lead.id}`);
    } catch (e2) {
      setError(e2 instanceof Error ? e2.message : "Failed");
      setBusy(false);
    }
  }

  const field = "w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-primary-light";
  const label = "mb-1 block text-xs font-semibold uppercase tracking-wide text-text-muted";

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-extrabold text-text">New Lead</h1>
      <p className="mb-6 text-sm text-text-muted">Log a customer you approached today.</p>
      <form onSubmit={submit} className="space-y-5 rounded-xl border border-border bg-surface p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className={label}>Customer name *</label><input required value={f.name} onChange={(e) => set("name", e.target.value)} className={field} /></div>
          <div><label className={label}>Company</label><input value={f.company} onChange={(e) => set("company", e.target.value)} className={field} /></div>
          <div><label className={label}>Phone</label><input value={f.phone} onChange={(e) => set("phone", e.target.value)} className={field} /></div>
          <div><label className={label}>Email</label><input type="email" value={f.email} onChange={(e) => set("email", e.target.value)} className={field} /></div>
          <div><label className={label}>Approached on</label><input type="date" value={f.approachDate} onChange={(e) => set("approachDate", e.target.value)} className={field} /></div>
          <div>
            <label className={label}>Requirement type</label>
            <select value={f.requirementType} onChange={(e) => set("requirementType", e.target.value)} className={field}>
              {REQUIREMENT_TYPES.map((r) => <option key={r.key} value={r.key}>{r.label}</option>)}
            </select>
          </div>
        </div>
        <div><label className={label}>Requirement / notes</label><textarea rows={3} value={f.requirement} onChange={(e) => set("requirement", e.target.value)} className={field} /></div>
        <div className="max-w-xs"><label className={label}>Next follow-up date</label><input type="date" value={f.nextFollowUp} onChange={(e) => set("nextFollowUp", e.target.value)} className={field} /></div>
        {error && <p className="text-sm text-error">{error}</p>}
        <div className="flex gap-3">
          <button type="submit" disabled={busy} className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 font-semibold text-white hover:brightness-110 disabled:opacity-50">
            <Icon name="plus" size={18} /> {busy ? "Creating…" : "Create lead"}
          </button>
          <button type="button" onClick={() => router.push("/crm")} className="rounded-lg border border-border px-6 py-3 font-semibold text-text">Cancel</button>
        </div>
      </form>
    </div>
  );
}
