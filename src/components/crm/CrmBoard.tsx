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
    let won = 0;
    for (const l of leads) {
      const open = l.stage !== "closed" && l.stage !== "lost";
      if (open) pipeline += l.orderValue ?? l.quoteAmount ?? 0;
      if (open && l.nextFollowUp && l.nextFollowUp <= today) due++;
      if (l.stage === "closed") won++;
    }
    return { pipeline, due, won, total: leads.length };
  }, [leads, today]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-text-muted">
        Loading pipeline…
      </div>
    );
  }

  return (
    <div>
      {/* Stats — minimal, borderless tiles */}
      <div className="mb-6 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-4">
        <Stat label="Total leads" value={String(stats.total)} />
        <Stat label="Open pipeline" value={formatINR(stats.pipeline)} />
        <Stat label="Follow-ups due" value={String(stats.due)} tone={stats.due > 0 ? "warn" : undefined} />
        <Stat label="Won" value={String(stats.won)} tone="good" />
      </div>

      {/* Toolbar */}
      <div className="mb-4 flex items-center gap-3">
        <div className="relative flex-1 sm:max-w-xs">
          <input
            placeholder="Search leads…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full rounded-lg border border-border bg-surface py-2 pl-3 pr-3 text-sm outline-none focus:border-accent"
          />
        </div>
        <Link
          href="/crm/leads/new"
          className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:brightness-110"
        >
          <Icon name="plus" size={16} /> New lead
        </Link>
      </div>

      {/* Kanban */}
      <div className="flex gap-3 overflow-x-auto pb-4">
        {BOARD_STAGES.map((stage) => {
          const items = filtered.filter((l) => l.stage === stage.key);
          return (
            <div key={stage.key} className="w-[17rem] shrink-0">
              <div className="mb-2 flex items-center justify-between px-1">
                <h3 className="text-sm font-semibold text-text">{stage.label}</h3>
                <span className="text-xs font-medium text-text-muted">{items.length}</span>
              </div>
              <div className="space-y-2 rounded-xl bg-surface/60 p-1.5">
                {items.map((l) => (
                  <LeadCard key={l.id} lead={l} today={today} onMove={move} />
                ))}
                {items.length === 0 && (
                  <div className="rounded-lg border border-dashed border-border/70 py-6 text-center text-xs text-text-muted">
                    —
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

function Stat({ label, value, tone }: { label: string; value: string; tone?: "warn" | "good" }) {
  const color = tone === "warn" ? "text-warning" : tone === "good" ? "text-success" : "text-text";
  return (
    <div className="bg-surface p-4">
      <div className={`text-xl font-bold ${color}`}>{value}</div>
      <div className="mt-0.5 text-xs text-text-muted">{label}</div>
    </div>
  );
}

function LeadCard({ lead, today, onMove }: { lead: Lead; today: string; onMove: (id: string, s: StageKey) => void }) {
  const overdue = lead.nextFollowUp && lead.nextFollowUp <= today;
  const value = lead.orderValue ?? lead.quoteAmount;
  return (
    <div className="group rounded-lg border border-border bg-surface p-3 transition hover:border-accent/50 hover:shadow-sm">
      <Link href={`/crm/leads/${lead.id}`} className="block">
        <div className="flex items-start justify-between gap-2">
          <span className="text-sm font-semibold text-text group-hover:text-accent">{lead.customer.name}</span>
          {value ? <span className="shrink-0 text-xs font-semibold text-text-muted">{formatINR(value)}</span> : null}
        </div>
        {lead.customer.company && <div className="truncate text-xs text-text-muted">{lead.customer.company}</div>}
        {lead.nextFollowUp && (
          <div className={`mt-2 inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-medium ${overdue ? "bg-error/10 text-error" : "bg-bg text-text-muted"}`}>
            <Icon name="handshake" size={11} /> {overdue ? "Overdue" : "Follow-up"} · {lead.nextFollowUp.slice(5)}
          </div>
        )}
      </Link>
      <select
        value={lead.stage}
        onChange={(e) => onMove(lead.id, e.target.value as StageKey)}
        aria-label="Move stage"
        className="mt-2 w-full cursor-pointer rounded-md border border-border bg-bg px-2 py-1 text-xs text-text-muted outline-none hover:border-accent focus:border-accent"
      >
        {CRM_STAGES.map((s) => (
          <option key={s.key} value={s.key}>{s.label}</option>
        ))}
      </select>
    </div>
  );
}
