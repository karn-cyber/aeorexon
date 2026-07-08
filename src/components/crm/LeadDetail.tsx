"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CRM_STAGES, stageLabel, type Lead, type OrderItem, type StageKey } from "@/lib/crmTypes";
import { formatINR } from "@/lib/pricing";
import { COMPANY } from "@/lib/company";
import { Icon } from "@/components/Icon";

const F = "w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary-light";
const L = "mb-1 block text-[11px] font-semibold uppercase tracking-wide text-text-muted";

export function LeadDetail({ id }: { id: string }) {
  const router = useRouter();
  const [lead, setLead] = useState<Lead | null>(null);
  const [d, setD] = useState<Partial<Lead>>({});
  const [items, setItems] = useState<OrderItem[]>([]);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [notFound, setNotFound] = useState(false);

  async function load() {
    const res = await fetch(`/api/crm/leads/${id}`);
    if (res.status === 404) { setNotFound(true); return; }
    const data = await res.json();
    if (data.ok) {
      setLead(data.lead);
      setD(data.lead);
      setItems(data.lead.items ?? []);
    }
  }
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (notFound) return <p className="text-text-muted">Lead not found. <button onClick={() => router.push("/crm")} className="text-accent underline">Back to pipeline</button></p>;
  if (!lead) return <p className="text-text-muted">Loading…</p>;

  const set = (k: keyof Lead, v: unknown) => setD((p) => ({ ...p, [k]: v }));
  const setCust = (k: string, v: string) => setD((p) => ({ ...p, customer: { ...(p.customer as Lead["customer"]), [k]: v } }));

  async function save(extra?: Partial<Lead> & { note?: string }) {
    setSaving(true);
    const payload = { ...d, items, ...extra };
    const res = await fetch(`/api/crm/leads/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (data.ok) { setLead(data.lead); setD(data.lead); setItems(data.lead.items ?? []); }
    setSaving(false);
  }

  async function addNote() {
    if (!note.trim()) return;
    const res = await fetch(`/api/crm/leads/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ note }),
    });
    const data = await res.json();
    if (data.ok) { setLead(data.lead); setNote(""); }
  }

  async function setStage(stage: StageKey) {
    set("stage", stage);
    await save({ stage, note: `Stage → ${stageLabel(stage)}` });
  }

  const orderTotal = items.reduce((s, i) => s + i.qty * i.rate, 0);

  function printDoc(kind: "quotation" | "proforma" | "invoice" | "letter") {
    const w = window.open("", "_blank");
    if (!w) return;
    const cust = d.customer as Lead["customer"];
    const titleMap = { quotation: "QUOTATION", proforma: "PROFORMA INVOICE", invoice: "TAX INVOICE", letter: "" };
    const rows = items.map((it, i) => `<tr><td>${i + 1}</td><td>${it.desc}</td><td style="text-align:right">${it.qty}</td><td style="text-align:right">${formatINR(it.rate)}</td><td style="text-align:right">${formatINR(it.qty * it.rate)}</td></tr>`).join("");
    const bank = COMPANY.bank;
    const body = kind === "letter"
      ? `<p>Date: ${new Date().toISOString().slice(0,10)}</p>
         <p>To,<br/>${cust?.name ?? ""}${cust?.company ? "<br/>" + cust.company : ""}</p>
         <h2>Introduction — ${COMPANY.name}</h2>
         <p>Dear ${cust?.name ?? "Sir/Madam"},</p>
         <p>${COMPANY.name} — <i>${COMPANY.tagline}</i> — is pleased to introduce our range of industrial dosing pumps, controllers, PNG pipeline installation services, URB bearings and architectural seating. Please find our catalogue at your website. We look forward to serving your requirement: <b>${d.requirement ?? ""}</b>.</p>
         <p>Regards,<br/>${COMPANY.contactPerson}<br/>${COMPANY.name}<br/>${COMPANY.phone} · ${COMPANY.email}</p>`
      : `<div class="row"><div><b>${titleMap[kind]}</b><br/>Ref: ${lead?.refNo}<br/>Date: ${new Date().toISOString().slice(0,10)}</div>
           <div style="text-align:right"><b>${COMPANY.name}</b><br/>${COMPANY.phone}<br/>${COMPANY.email}<br/>GSTIN: ${COMPANY.gstin}</div></div>
         <p><b>To:</b> ${cust?.name ?? ""}${cust?.company ? ", " + cust.company : ""}${cust?.gstin ? "<br/>GSTIN: " + cust.gstin : ""}</p>
         <table><thead><tr><th>#</th><th>Description</th><th>Qty</th><th>Rate</th><th>Amount</th></tr></thead><tbody>${rows || '<tr><td colspan=5>No line items</td></tr>'}</tbody>
           <tfoot><tr><td colspan="4" style="text-align:right"><b>Total</b></td><td style="text-align:right"><b>${formatINR(orderTotal)}</b></td></tr>
           ${kind === "proforma" && d.advanceAmount ? `<tr><td colspan="4" style="text-align:right">Advance</td><td style="text-align:right">${formatINR(d.advanceAmount)}</td></tr>` : ""}</tfoot>
         </table>
         ${kind !== "invoice" ? `<div class="bank"><b>Bank details</b><br/>${bank.accountName} · A/c ${bank.accountNo}<br/>${bank.name}, ${bank.branch} · IFSC ${bank.ifsc}</div>` : ""}
         ${kind === "proforma" ? `<p class="muted">This is a proforma invoice issued against advance payment. Final tax invoice will follow on dispatch.</p>` : ""}`;
    w.document.write(`<html><head><title>${lead?.refNo} ${titleMap[kind] || "Letter"}</title>
      <style>body{font-family:Inter,Arial,sans-serif;padding:40px;color:#0d1a28;font-size:13px}
      h1,h2{color:#14263f} .row{display:flex;justify-content:space-between;margin-bottom:20px}
      table{width:100%;border-collapse:collapse;margin:16px 0} th,td{border:1px solid #d5dde4;padding:8px}
      th{background:#eef2f5;text-align:left} .bank{margin-top:20px;padding:12px;border:1px dashed #d5dde4}
      .muted{color:#5a6b7b;font-size:12px} </style></head><body>
      <h1>${COMPANY.name}</h1><div class="muted">${COMPANY.tagline}</div><hr/>${body}</body></html>`);
    w.document.close(); w.focus(); w.print();
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="mono-label text-text-muted">{lead.refNo} · approached {lead.approachDate}</div>
          <h1 className="text-2xl font-extrabold text-text">{lead.customer.name}</h1>
          {lead.customer.company && <p className="text-text-muted">{lead.customer.company}</p>}
        </div>
        <button onClick={() => router.push("/crm")} className="mono-label text-accent hover:underline">← Pipeline</button>
      </div>

      {/* Stage stepper */}
      <div className="flex flex-wrap gap-2 rounded-xl border border-border bg-surface p-3">
        {CRM_STAGES.map((s) => (
          <button key={s.key} onClick={() => setStage(s.key)} title={s.hint}
            className={`mono-label rounded-full px-3 py-1.5 font-semibold ${lead.stage === s.key ? "bg-primary text-white" : "border border-border text-text-muted hover:border-primary-light"}`}>
            {s.label}
          </button>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        {/* Left: editable fields */}
        <div className="space-y-5">
          <Section title="Customer & requirement">
            <div className="grid gap-3 sm:grid-cols-2">
              <div><label className={L}>Name</label><input className={F} value={d.customer?.name ?? ""} onChange={(e) => setCust("name", e.target.value)} /></div>
              <div><label className={L}>Company</label><input className={F} value={d.customer?.company ?? ""} onChange={(e) => setCust("company", e.target.value)} /></div>
              <div><label className={L}>Phone</label><input className={F} value={d.customer?.phone ?? ""} onChange={(e) => setCust("phone", e.target.value)} /></div>
              <div><label className={L}>Email</label><input className={F} value={d.customer?.email ?? ""} onChange={(e) => setCust("email", e.target.value)} /></div>
              <div className="sm:col-span-2"><label className={L}>GSTIN</label><input className={F} value={d.customer?.gstin ?? ""} onChange={(e) => setCust("gstin", e.target.value)} /></div>
            </div>
            <div className="mt-3"><label className={L}>Requirement</label><textarea rows={2} className={F} value={d.requirement ?? ""} onChange={(e) => set("requirement", e.target.value)} /></div>
          </Section>

          <Section title="Quotation">
            <div className="grid gap-3 sm:grid-cols-2">
              <div><label className={L}>Quote amount (₹)</label><input type="number" className={F} value={d.quoteAmount ?? ""} onChange={(e) => set("quoteAmount", Number(e.target.value) || undefined)} /></div>
              <div><label className={L}>Quote sent date</label><input type="date" className={F} value={d.quoteSentDate ?? ""} onChange={(e) => set("quoteSentDate", e.target.value)} /></div>
            </div>
          </Section>

          <Section title="Order & line items">
            <div className="grid gap-3 sm:grid-cols-2">
              <div><label className={L}>PO number</label><input className={F} value={d.poNumber ?? ""} onChange={(e) => set("poNumber", e.target.value)} /></div>
              <div><label className={L}>Order value (₹)</label><input type="number" className={F} value={d.orderValue ?? ""} onChange={(e) => set("orderValue", Number(e.target.value) || undefined)} /></div>
            </div>
            <div className="mt-3 space-y-2">
              {items.map((it, i) => (
                <div key={i} className="flex gap-2">
                  <input className={`${F} flex-1`} placeholder="Description" value={it.desc} onChange={(e) => setItems(items.map((x, j) => j === i ? { ...x, desc: e.target.value } : x))} />
                  <input type="number" className={`${F} w-16`} placeholder="Qty" value={it.qty} onChange={(e) => setItems(items.map((x, j) => j === i ? { ...x, qty: Number(e.target.value) } : x))} />
                  <input type="number" className={`${F} w-24`} placeholder="Rate" value={it.rate} onChange={(e) => setItems(items.map((x, j) => j === i ? { ...x, rate: Number(e.target.value) } : x))} />
                  <button onClick={() => setItems(items.filter((_, j) => j !== i))} className="text-text-muted hover:text-error"><Icon name="trash-2" size={16} /></button>
                </div>
              ))}
              <button onClick={() => setItems([...items, { desc: "", qty: 1, rate: 0 }])} className="mono-label text-accent hover:underline">+ Add item ({formatINR(orderTotal)})</button>
            </div>
          </Section>

          <Section title="Fulfilment & payment tracking">
            <div className="grid gap-3 sm:grid-cols-2">
              <div><label className={L}>Advance received (₹)</label><input type="number" className={F} value={d.advanceAmount ?? ""} onChange={(e) => set("advanceAmount", Number(e.target.value) || undefined)} /></div>
              <div><label className={L}>Advance date</label><input type="date" className={F} value={d.advanceDate ?? ""} onChange={(e) => set("advanceDate", e.target.value)} /></div>
              <div><label className={L}>Proforma No.</label><input className={F} value={d.proformaNo ?? ""} onChange={(e) => set("proformaNo", e.target.value)} /></div>
              <div><label className={L}>Dispatch date (ex-OEM)</label><input type="date" className={F} value={d.dispatchDate ?? ""} onChange={(e) => set("dispatchDate", e.target.value)} /></div>
              <div><label className={L}>Delivery date</label><input type="date" className={F} value={d.deliveryDate ?? ""} onChange={(e) => set("deliveryDate", e.target.value)} /></div>
              <div className="flex items-center gap-2 pt-6"><input type="checkbox" checked={!!d.installationRequired} onChange={(e) => set("installationRequired", e.target.checked)} className="h-4 w-4 accent-[var(--color-accent)]" /><span className="text-sm">Installation required</span></div>
              {d.installationRequired && <div><label className={L}>Installation date</label><input type="date" className={F} value={d.installationDate ?? ""} onChange={(e) => set("installationDate", e.target.value)} /></div>}
              <div><label className={L}>Final invoice No.</label><input className={F} value={d.finalInvoiceNo ?? ""} onChange={(e) => set("finalInvoiceNo", e.target.value)} /></div>
              <div><label className={L}>Final payment (₹)</label><input type="number" className={F} value={d.finalPaymentAmount ?? ""} onChange={(e) => set("finalPaymentAmount", Number(e.target.value) || undefined)} /></div>
              <div><label className={L}>Final payment date</label><input type="date" className={F} value={d.finalPaymentDate ?? ""} onChange={(e) => set("finalPaymentDate", e.target.value)} /></div>
            </div>
          </Section>

          <div className="flex items-center gap-3">
            <button onClick={() => save()} disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 font-semibold text-white hover:brightness-110 disabled:opacity-50">
              <Icon name="save" size={18} /> {saving ? "Saving…" : "Save changes"}
            </button>
            <div className="flex items-center gap-2"><label className={L}>Next follow-up</label><input type="date" className={F} value={d.nextFollowUp ?? ""} onChange={(e) => set("nextFollowUp", e.target.value)} /></div>
          </div>
        </div>

        {/* Right: documents + activity */}
        <div className="space-y-5">
          <Section title="Documents">
            <div className="grid grid-cols-2 gap-2">
              <DocBtn label="Quotation" onClick={() => printDoc("quotation")} />
              <DocBtn label="Proforma Invoice" onClick={() => printDoc("proforma")} />
              <DocBtn label="Tax Invoice" onClick={() => printDoc("invoice")} />
              <DocBtn label="Intro Letter" onClick={() => printDoc("letter")} />
            </div>
            <p className="mt-2 text-xs text-text-muted">Opens a print-ready document (Save as PDF). Bank details come from company settings.</p>
          </Section>

          <Section title="Activity log">
            <div className="flex gap-2">
              <input className={`${F} flex-1`} placeholder="Add a note / call log…" value={note} onChange={(e) => setNote(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addNote()} />
              <button onClick={addNote} className="rounded-lg bg-primary px-4 text-sm font-semibold text-white">Add</button>
            </div>
            <div className="mt-3 max-h-80 space-y-3 overflow-y-auto">
              {[...(lead.activities ?? [])].reverse().map((a, i) => (
                <div key={i} className="border-l-2 border-accent pl-3">
                  <div className="text-sm text-text">{a.note}</div>
                  <div className="mono-label text-text-muted">{new Date(a.at).toLocaleString("en-IN")} · {a.by}</div>
                </div>
              ))}
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <h2 className="mono-label mb-3 font-bold text-primary">{title}</h2>
      {children}
    </div>
  );
}

function DocBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center gap-2 rounded-lg border border-border px-3 py-2.5 text-sm font-semibold text-text hover:border-primary-light">
      <Icon name="file-text" size={16} className="text-accent" /> {label}
    </button>
  );
}
