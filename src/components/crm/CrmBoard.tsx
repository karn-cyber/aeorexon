"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CRM_STAGES, type Lead, type StageKey } from "@/lib/crmTypes";
import { formatINR } from "@/lib/pricing";
import { Icon } from "@/components/Icon";

const BOARD_STAGES = CRM_STAGES.filter((s) => s.key !== "lost");

export function CrmBoard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  async function load() {
    const res = await fetch("/api/crm/leads");
    const data = await res.json();
    if (data.ok) setLeads(data.leads);
    setLoading(false);
  }
  useEffect(() => {
    load();
  }, []);

  async function move(id: string, stage: StageKey) {
    setLeads((ls) => ls.map((l) => (l.id === id ? { ...l, stage } : l)));
    await fetch(`/api/crm/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stage, note: `Moved to ${stage}` }),
    });
  }

  const today = new Date().toISOString().slice(0, 10);
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return leads;
    return leads.filter(
      (l) =>
        l.customer.name.toLowerCase().includes(s) ||
        (l.customer.company ?? "").toLowerCase().includes(s) ||
        l.refNo.toLowerCase().includes(s)
    );
  }, [leads, q]);

  const stats = useMemo(() => {
    let pipeline = 0;
    let due = 0;
    for (const l of leads) {
      if (l.stage !== "closed" && l.stage !== "lost") pipeline += l.orderValue ?? l.quoteAmount ?? 0;
      if (l.nextFollowUp && l.nextFollowUp <= today && l.stage !== "closed" && l.stage !== "lost") due++;
    }
    return { pipeline, due, total: leads.length };
  }, [leads, today]);

  if (loading) return <p className="text-text-muted">Loading pipeline…</p>;

  return (
    <div>
      {/* Stats */}
      <div className="mb-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat label="Total leads" value={String(stats.total)} icon="users" />
        <Stat label="Open pipeline" value={formatINR(stats.pipeline)} icon="tag" />
        <Stat label="Follow-ups due" value={String(stats.due)} icon="handshake" accent={stats.due > 0} />
        <Link href="/crm/leads/new" className="flex items-center justify-center gap-2 rounded-xl bg-accent p-5 font-semibold text-white hover:brightness-110">
          <Icon name="plus" size={18} /> New Lead
        </Link>
      </div>

      <input
        placeholder="Search leads (name / company / ref)…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="mb-4 w-full max-w-sm rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary-light"
      />

      {/* Kanban */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {BOARD_STAGES.map((stage) => {
          const items = filtered.filter((l) => l.stage === stage.key);
          return (
            <div key={stage.key} className="w-72 shrink-0">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="mono-label font-bold text-primary">{stage.label}</h3>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">{items.length}</span>
              </div>
              <div className="space-y-2">
                {items.map((l) => (
                  <LeadCard key={l.id} lead={l} today={today} onMove={move} />
                ))}
                {items.length === 0 && (
                  <div className="rounded-lg border border-dashed border-border p-4 text-center text-xs text-text-muted">
                    None
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Stat({ label, value, icon, accent }: { label: string; value: string; icon: string; accent?: boolean }) {
  return (
    <div className={`rounded-xl border p-5 ${accent ? "border-warning/40 bg-warning/10" : "border-border bg-surface"}`}>
      <div className="flex items-center justify-between">
        <Icon name={icon} size={18} className={accent ? "text-warning" : "text-primary"} />
      </div>
      <div className="mt-2 text-2xl font-extrabold text-text">{value}</div>
      <div className="mono-label text-text-muted">{label}</div>
    </div>
  );
}

function LeadCard({ lead, today, onMove }: { lead: Lead; today: string; onMove: (id: string, s: StageKey) => void }) {
  const overdue = lead.nextFollowUp && lead.nextFollowUp <= today;
  const value = lead.orderValue ?? lead.quoteAmount;
  return (
    <div className="rounded-lg border border-border bg-surface p-3 shadow-sm">
      <Link href={`/crm/leads/${lead.id}`} className="block">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-text">{lead.customer.name}</span>
          <span className="mono-label text-text-muted">{lead.refNo}</span>
        </div>
        {lead.customer.company && <div className="text-xs text-text-muted">{lead.customer.company}</div>}
        <p className="mt-1 line-clamp-2 text-xs text-text-muted">{lead.requirement || "—"}</p>
        <div className="mt-2 flex items-center gap-2">
          {value ? <span className="text-sm font-bold text-primary">{formatINR(value)}</span> : null}
          {lead.nextFollowUp && (
            <span className={`mono-label rounded px-1.5 py-0.5 ${overdue ? "bg-error/15 text-error" : "bg-primary/10 text-primary"}`}>
              F/U {lead.nextFollowUp.slice(5)}
            </span>
          )}
        </div>
      </Link>
      <select
        value={lead.stage}
        onChange={(e) => onMove(lead.id, e.target.value as StageKey)}
        className="mt-2 w-full rounded border border-border bg-bg px-2 py-1 text-xs outline-none"
      >
        {CRM_STAGES.map((s) => (
          <option key={s.key} value={s.key}>{s.label}</option>
        ))}
      </select>
    </div>
  );
}
