"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CRM_STAGES, stageLabel, type Lead, type OrderItem, type StageKey } from "@/lib/crmTypes";
import { formatINR } from "@/lib/pricing";
import { computeLine, grandTotal, type QuoteSettings } from "@/lib/quoteBuilder";
import { priceList } from "@/data/priceList";
import { COMPANY } from "@/lib/company";
import { Icon } from "@/components/Icon";

const F = "w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/15";
const L = "mb-1 block text-xs font-medium text-text-muted";

export function LeadDetail({ id }: { id: string }) {
  const router = useRouter();
  const [lead, setLead] = useState<Lead | null>(null);
  const [d, setD] = useState<Partial<Lead>>({});
  const [items, setItems] = useState<OrderItem[]>([]);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [pquery, setPquery] = useState("");

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
    const total = grandTotal(
      items.map((it) =>
        computeLine({ code: "", desc: it.desc, moc: "", base: it.rate, group: "", qty: it.qty }, {
          markupPct: d.quoteMarkupPct ?? 0,
          discountPct: d.quoteDiscountPct ?? 0,
          discountMode: d.quoteDiscountMode ?? "shown",
          gstPct: d.quoteGstPct ?? 18,
          includeGst: d.quoteIncludeGst ?? false,
          roundTo: 1,
          withQty: true,
        })
      )
    );
    const payload = { ...d, items, quoteAmount: total || d.quoteAmount, ...extra };
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

  // Quotation pricing settings live on the draft so they save with the lead.
  const qs: QuoteSettings = {
    markupPct: d.quoteMarkupPct ?? 0,
    discountPct: d.quoteDiscountPct ?? 0,
    discountMode: d.quoteDiscountMode ?? "shown",
    gstPct: d.quoteGstPct ?? 18,
    includeGst: d.quoteIncludeGst ?? false,
    roundTo: 1,
    withQty: true,
  };
  const lines = items.map((it) =>
    computeLine({ code: "", desc: it.desc, moc: "", base: it.rate, group: "", qty: it.qty }, qs)
  );
  const grand = grandTotal(lines);
  const showDisc = qs.discountPct > 0;

  function printDoc(kind: "quotation" | "proforma" | "invoice" | "letter") {
    const w = window.open("", "_blank");
    if (!w) return;
    const cust = d.customer as Lead["customer"];
    const titleMap = { quotation: "QUOTATION", proforma: "PROFORMA INVOICE", invoice: "TAX INVOICE", letter: "" };
    const rows = lines.map((l, i) => `<tr><td>${i + 1}</td><td>${l.desc}</td><td style="text-align:right">${l.qty}</td>${showDisc ? `<td style="text-align:right;text-decoration:line-through;color:#888">${formatINR(l.listPrice)}</td><td style="text-align:right">${qs.discountPct}%</td>` : ""}<td style="text-align:right">${formatINR(l.net)}</td>${qs.includeGst ? `<td style="text-align:right">${formatINR(l.gstAmount * l.qty)}</td>` : ""}<td style="text-align:right">${formatINR(l.lineTotal)}</td></tr>`).join("");
    const colspan = 3 + (showDisc ? 2 : 0) + (qs.includeGst ? 1 : 0);
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
         <table><thead><tr><th>#</th><th>Description</th><th>Qty</th>${showDisc ? "<th>List</th><th>Disc</th>" : ""}<th>Unit</th>${qs.includeGst ? `<th>GST ${qs.gstPct}%</th>` : ""}<th>Amount</th></tr></thead><tbody>${rows || `<tr><td colspan=${colspan + 1}>No line items</td></tr>`}</tbody>
           <tfoot><tr><td colspan="${colspan}" style="text-align:right"><b>Grand Total${qs.includeGst ? " (incl. GST)" : ""}</b></td><td style="text-align:right"><b>${formatINR(grand)}</b></td></tr>
           ${kind === "proforma" && d.advanceAmount ? `<tr><td colspan="${colspan}" style="text-align:right">Advance received</td><td style="text-align:right">${formatINR(d.advanceAmount)}</td></tr><tr><td colspan="${colspan}" style="text-align:right">Balance due</td><td style="text-align:right">${formatINR(Math.max(0, grand - d.advanceAmount))}</td></tr>` : ""}</tfoot>
         </table>
         ${!qs.includeGst ? `<p class="muted">GST ${qs.gstPct}% extra. Ex-works. Transport extra.</p>` : ""}
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
      <div className="flex flex-wrap gap-1.5 rounded-xl border border-border bg-surface p-2">
        {CRM_STAGES.map((s) => (
          <button key={s.key} onClick={() => setStage(s.key)} title={s.hint}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${lead.stage === s.key ? "bg-accent text-white" : "text-text-muted hover:bg-bg"}`}>
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

          <Section title="Quotation builder">
            {/* Product selector */}
            <label className={L}>Add products (from price list)</label>
            <input
              className={F}
              placeholder="Search code or spec…"
              value={pquery}
              onChange={(e) => setPquery(e.target.value)}
            />
            {pquery.trim().length >= 2 && (
              <div className="mt-1 max-h-44 overflow-y-auto rounded-lg border border-border">
                {priceList
                  .filter((p) => (p.code + " " + p.desc).toLowerCase().includes(pquery.trim().toLowerCase()))
                  .slice(0, 8)
                  .map((p) => (
                    <button
                      key={p.code}
                      onClick={() => {
                        setItems([...items, { desc: `${p.code} — ${p.desc}${p.moc ? " (" + p.moc + ")" : ""}`, qty: 1, rate: p.base }]);
                        setPquery("");
                      }}
                      className="flex w-full items-center justify-between gap-2 border-b border-border px-3 py-2 text-left text-sm last:border-0 hover:bg-bg"
                    >
                      <span className="min-w-0"><span className="font-medium text-text">{p.code}</span> <span className="text-text-muted">· {p.desc}</span></span>
                      <span className="shrink-0 text-text-muted">{formatINR(p.base)}</span>
                    </button>
                  ))}
              </div>
            )}

            {/* Line items — base (cost) rate */}
            <div className="mt-4 space-y-2">
              <div className="flex gap-2 px-1 text-[11px] font-medium text-text-muted">
                <span className="flex-1">Item</span><span className="w-14 text-center">Qty</span><span className="w-24 text-right">Base ₹</span><span className="w-6" />
              </div>
              {items.map((it, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input className={`${F} flex-1`} placeholder="Description" value={it.desc} onChange={(e) => setItems(items.map((x, j) => j === i ? { ...x, desc: e.target.value } : x))} />
                  <input type="number" className={`${F} w-14`} value={it.qty} onChange={(e) => setItems(items.map((x, j) => j === i ? { ...x, qty: Number(e.target.value) } : x))} />
                  <input type="number" className={`${F} w-24`} value={it.rate} onChange={(e) => setItems(items.map((x, j) => j === i ? { ...x, rate: Number(e.target.value) } : x))} />
                  <button onClick={() => setItems(items.filter((_, j) => j !== i))} className="text-text-muted hover:text-error"><Icon name="trash-2" size={16} /></button>
                </div>
              ))}
              <button onClick={() => setItems([...items, { desc: "", qty: 1, rate: 0 }])} className="text-sm font-medium text-accent hover:underline">+ Add blank line</button>
            </div>

            {/* Pricing controls */}
            <div className="mt-5 rounded-lg border border-border bg-bg/50 p-4">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <div><label className={L}>Commission / markup %</label><input type="number" className={F} value={d.quoteMarkupPct ?? ""} onChange={(e) => set("quoteMarkupPct", Number(e.target.value) || 0)} /></div>
                <div><label className={L}>Discount %</label><input type="number" className={F} value={d.quoteDiscountPct ?? ""} onChange={(e) => set("quoteDiscountPct", Number(e.target.value) || 0)} /></div>
                <div>
                  <label className={L}>GST %</label>
                  <div className="flex items-center gap-2">
                    <input type="number" className={`${F} w-20`} value={d.quoteGstPct ?? 18} onChange={(e) => set("quoteGstPct", Number(e.target.value) || 0)} />
                    <label className="flex items-center gap-1 text-xs text-text-muted"><input type="checkbox" checked={!!d.quoteIncludeGst} onChange={(e) => set("quoteIncludeGst", e.target.checked)} className="h-4 w-4 accent-[var(--color-accent)]" /> add</label>
                  </div>
                </div>
              </div>
              {showDisc && (
                <div className="mt-3">
                  <label className={L}>Discount type</label>
                  <div className="flex flex-wrap gap-2 text-xs">
                    {(["shown", "real"] as const).map((m) => (
                      <label key={m} className={`flex cursor-pointer items-center gap-1.5 rounded-lg border px-3 py-1.5 ${(d.quoteDiscountMode ?? "shown") === m ? "border-accent bg-accent/5 text-text" : "border-border text-text-muted"}`}>
                        <input type="radio" name="qdm" checked={(d.quoteDiscountMode ?? "shown") === m} onChange={() => set("quoteDiscountMode", m)} className="accent-[var(--color-accent)]" />
                        {m === "shown" ? "Shown only (price unchanged)" : "Real (reduces price)"}
                      </label>
                    ))}
                  </div>
                </div>
              )}
              {/* Live preview */}
              {lines.length > 0 && (
                <div className="mt-4 border-t border-border pt-3 text-sm">
                  {lines.map((l, i) => (
                    <div key={i} className="flex items-center justify-between py-0.5 text-text-muted">
                      <span className="truncate pr-2">{l.desc || "—"} ×{l.qty}</span>
                      <span className="shrink-0">
                        {showDisc && <span className="mr-1 text-xs line-through">{formatINR(l.listPrice)}</span>}
                        <span className="font-medium text-text">{formatINR(l.lineTotal)}</span>
                      </span>
                    </div>
                  ))}
                  <div className="mt-2 flex justify-between border-t border-border pt-2 font-bold text-text">
                    <span>Grand total {qs.includeGst ? "(incl. GST)" : `(+${qs.gstPct}% GST)`}</span>
                    <span>{formatINR(grand)}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div><label className={L}>Quote sent date</label><input type="date" className={F} value={d.quoteSentDate ?? ""} onChange={(e) => set("quoteSentDate", e.target.value)} /></div>
              <div><label className={L}>PO number (on order)</label><input className={F} value={d.poNumber ?? ""} onChange={(e) => set("poNumber", e.target.value)} /></div>
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
      <h2 className="mb-3 text-sm font-semibold text-text">{title}</h2>
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
