"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CRM_STAGES, stageLabel, type Lead } from "@/lib/crmTypes";
import { formatINR } from "@/lib/pricing";

export default function LeadsListPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [stage, setStage] = useState("all");

  useEffect(() => {
    fetch("/api/crm/leads")
      .then((r) => r.json())
      .then((d) => { if (d.ok) setLeads(d.leads); setLoading(false); });
  }, []);

  const rows = useMemo(() => {
    const s = q.trim().toLowerCase();
    return leads.filter(
      (l) =>
        (stage === "all" || l.stage === stage) &&
        (!s || l.customer.name.toLowerCase().includes(s) || (l.customer.company ?? "").toLowerCase().includes(s) || l.refNo.toLowerCase().includes(s))
    );
  }, [leads, q, stage]);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-text">All Leads</h1>
          <p className="mt-0.5 text-sm text-text-muted">{leads.length} total</p>
        </div>
        <Link href="/crm/leads/new" className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:brightness-110">
          + New lead
        </Link>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <input
          placeholder="Search…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-accent"
        />
        <select value={stage} onChange={(e) => setStage(e.target.value)} className="rounded-lg border border-border bg-surface px-3 py-2 text-sm">
          <option value="all">All stages</option>
          {CRM_STAGES.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
        </select>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-surface">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-bg/60 text-left text-xs text-text-muted">
              <th className="px-4 py-3 font-medium">Ref</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Stage</th>
              <th className="px-4 py-3 font-medium">Value</th>
              <th className="px-4 py-3 font-medium">Next follow-up</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-text-muted">Loading…</td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-text-muted">No leads.</td></tr>
            ) : rows.map((l) => (
              <tr key={l.id} className="border-b border-border last:border-0 hover:bg-bg/50">
                <td className="px-4 py-3">
                  <Link href={`/crm/leads/${l.id}`} className="font-medium text-accent hover:underline">{l.refNo}</Link>
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium text-text">{l.customer.name}</div>
                  {l.customer.company && <div className="text-xs text-text-muted">{l.customer.company}</div>}
                </td>
                <td className="px-4 py-3"><span className="rounded-full bg-bg px-2 py-0.5 text-xs font-medium text-text-muted">{stageLabel(l.stage)}</span></td>
                <td className="px-4 py-3 text-text">{(l.orderValue ?? l.quoteAmount) ? formatINR(l.orderValue ?? l.quoteAmount!) : "—"}</td>
                <td className="px-4 py-3 text-text-muted">{l.nextFollowUp ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
