"use client";

import { useMemo, useState } from "react";
import type { PriceItem } from "@/data/priceList";
import { formatINR } from "@/lib/pricing";
import {
  computeLine,
  grandTotal,
  toCSV,
  toText,
  type QuoteSettings,
} from "@/lib/quoteBuilder";
import { Icon } from "@/components/Icon";

export function QuoteBuilder({ items, groups }: { items: PriceItem[]; groups: string[] }) {
  const [markupPct, setMarkupPct] = useState(20);
  const [discountPct, setDiscountPct] = useState(0);
  const [discountMode, setDiscountMode] = useState<"shown" | "real">("shown");
  const [gstPct, setGstPct] = useState(18);
  const [includeGst, setIncludeGst] = useState(false);
  const [withQty, setWithQty] = useState(false);
  const [customer, setCustomer] = useState("");
  const [search, setSearch] = useState("");
  const [group, setGroup] = useState("all");
  const [qty, setQty] = useState<Record<string, number>>({});
  const [copied, setCopied] = useState(false);

  const settings: QuoteSettings = { markupPct, discountPct, discountMode, gstPct, includeGst, roundTo: 1, withQty };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter(
      (it) =>
        (group === "all" || it.group === group) &&
        (!q || it.code.toLowerCase().includes(q) || it.desc.toLowerCase().includes(q))
    );
  }, [items, group, search]);

  const selectedItems = items.filter((it) => qty[it.code] !== undefined);
  const lines = selectedItems.map((it) => computeLine({ ...it, qty: qty[it.code] }, settings));

  function toggle(code: string) {
    setQty((prev) => {
      const next = { ...prev };
      if (code in next) delete next[code];
      else next[code] = 1;
      return next;
    });
  }
  function selectAllFiltered() {
    setQty((prev) => {
      const next = { ...prev };
      filtered.forEach((it) => { if (!(it.code in next)) next[it.code] = 1; });
      return next;
    });
  }
  function clearAll() { setQty({}); }

  function download() {
    const csv = toCSV(lines, settings);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `aorexon-pricelist${customer ? "-" + customer.replace(/\s+/g, "-") : ""}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function copyForChat() {
    await navigator.clipboard.writeText(toText(lines, settings, { customer }));
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  function printDoc() {
    const w = window.open("", "_blank");
    if (!w) return;
    const rows = lines.map((l) => `<tr>
      <td>${l.code}</td><td>${l.desc}</td><td>${l.moc}</td>
      ${discountPct > 0 ? `<td style="text-decoration:line-through;color:#888">${formatINR(l.listPrice)}</td><td>${discountPct}%</td>` : ""}
      <td><b>${formatINR(l.net)}</b></td>
      ${includeGst ? `<td>${formatINR(l.gstAmount)}</td><td>${formatINR(l.unitTotal)}</td>` : ""}
      ${withQty ? `<td>${l.qty}</td><td>${formatINR(l.lineTotal)}</td>` : ""}
    </tr>`).join("");
    w.document.write(`<html><head><title>Aorexon Price List</title>
      <style>body{font-family:Inter,Arial,sans-serif;padding:32px;color:#0f172a}
      h1{color:#1a2b4a} table{width:100%;border-collapse:collapse;font-size:13px;margin-top:16px}
      th,td{border:1px solid #e2e8f0;padding:8px;text-align:left} th{background:#f8fafc}
      .muted{color:#64748b;font-size:12px;margin-top:16px}</style></head><body>
      <h1>AOREXON — Price List / Quotation</h1>
      ${customer ? `<p><b>For:</b> ${customer}</p>` : ""}
      <table><thead><tr><th>Item Code</th><th>Description</th><th>MOC</th>
      ${discountPct > 0 ? "<th>List Price</th><th>Disc.</th>" : ""}
      <th>Unit Price</th>${includeGst ? `<th>GST ${gstPct}%</th><th>Incl. GST</th>` : ""}
      ${withQty ? "<th>Qty</th><th>Line Total</th>" : ""}</tr></thead><tbody>${rows}</tbody></table>
      ${withQty ? `<h3 style="text-align:right">Grand Total: ${formatINR(grandTotal(lines))}</h3>` : ""}
      <p class="muted">${includeGst ? `Prices inclusive of ${gstPct}% GST.` : `GST ${gstPct}% extra.`} Ex-works Pune · Transport extra. Prices subject to change.</p>
      </body></html>`);
    w.document.close();
    w.focus();
    w.print();
  }

  const numField = "w-24 rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary-light";

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
      {/* Left: settings + item picker */}
      <div className="space-y-5">
        <div className="rounded-xl border border-border bg-surface p-5">
          <h2 className="mb-4 font-bold text-text">Pricing settings</h2>
          <div className="grid grid-cols-2 gap-4">
            <label className="text-sm">
              <span className="mb-1 block font-medium text-text-muted">Commission / Markup %</span>
              <input type="number" value={markupPct} onChange={(e) => setMarkupPct(Number(e.target.value) || 0)} className={numField} />
            </label>
            <label className="text-sm">
              <span className="mb-1 block font-medium text-text-muted">Discount %</span>
              <input type="number" value={discountPct} onChange={(e) => setDiscountPct(Number(e.target.value) || 0)} className={numField} />
            </label>
          </div>
          {discountPct > 0 && (
            <div className="mt-3">
              <span className="mb-1 block text-sm font-medium text-text-muted">Discount type</span>
              <div className="flex flex-wrap gap-2 text-sm">
                <label className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 ${discountMode === "shown" ? "border-accent bg-accent/5" : "border-border"}`}>
                  <input type="radio" name="dmode" checked={discountMode === "shown"} onChange={() => setDiscountMode("shown")} className="accent-[var(--color-accent)]" />
                  Shown only (price unchanged)
                </label>
                <label className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 ${discountMode === "real" ? "border-accent bg-accent/5" : "border-border"}`}>
                  <input type="radio" name="dmode" checked={discountMode === "real"} onChange={() => setDiscountMode("real")} className="accent-[var(--color-accent)]" />
                  Real (reduces price)
                </label>
              </div>
            </div>
          )}
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={includeGst} onChange={(e) => setIncludeGst(e.target.checked)} className="h-4 w-4 accent-[var(--color-accent)]" />
              Add GST
            </label>
            <input type="number" value={gstPct} onChange={(e) => setGstPct(Number(e.target.value) || 0)} className="w-16 rounded-lg border border-border px-2 py-1" disabled={!includeGst} />
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={withQty} onChange={(e) => setWithQty(e.target.checked)} className="h-4 w-4 accent-[var(--color-accent)]" />
              Quantities &amp; totals (quote)
            </label>
          </div>
          <label className="mt-4 block text-sm">
            <span className="mb-1 block font-medium text-text-muted">Customer / reference (optional)</span>
            <input value={customer} onChange={(e) => setCustomer(e.target.value)} placeholder="e.g. ABC Water Solutions" className="w-full rounded-lg border border-border px-3 py-2 outline-none focus:border-primary-light" />
          </label>
        </div>

        <div className="rounded-xl border border-border bg-surface p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-bold text-text">Select items ({selectedItems.length})</h2>
            <div className="flex gap-2 text-xs">
              <button onClick={selectAllFiltered} className="font-semibold text-accent hover:underline">Add shown</button>
              <button onClick={clearAll} className="font-semibold text-text-muted hover:text-error">Clear</button>
            </div>
          </div>
          <div className="mb-3 flex gap-2">
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search code / spec…" className="flex-1 rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary-light" />
            <select value={group} onChange={(e) => setGroup(e.target.value)} className="rounded-lg border border-border px-2 py-2 text-sm">
              <option value="all">All groups</option>
              {groups.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div className="max-h-80 overflow-y-auto rounded-lg border border-border">
            {filtered.map((it) => {
              const sel = it.code in qty;
              return (
                <label key={it.code} className={`flex cursor-pointer items-center gap-2 border-b border-border px-3 py-2 text-sm last:border-0 ${sel ? "bg-accent/5" : "hover:bg-bg"}`}>
                  <input type="checkbox" checked={sel} onChange={() => toggle(it.code)} className="h-4 w-4 accent-[var(--color-accent)]" />
                  <span className="flex-1">
                    <span className="font-medium text-text">{it.code}</span>
                    <span className="text-text-muted"> · {it.desc}{it.moc ? " · " + it.moc : ""}</span>
                  </span>
                  <span className="text-text-muted">{formatINR(it.base)}</span>
                </label>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right: preview + export */}
      <div className="rounded-xl border border-border bg-surface p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-bold text-text">Customer price list ({lines.length})</h2>
          <div className="flex flex-wrap gap-2">
            <button onClick={download} disabled={!lines.length} className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-3 py-2 text-sm font-semibold text-white hover:brightness-110 disabled:opacity-40">
              <Icon name="upload" size={15} /> CSV
            </button>
            <button onClick={printDoc} disabled={!lines.length} className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-semibold text-text hover:border-primary-light disabled:opacity-40">
              <Icon name="file-text" size={15} /> Print / PDF
            </button>
            <button onClick={copyForChat} disabled={!lines.length} className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-semibold text-text hover:border-primary-light disabled:opacity-40">
              <Icon name={copied ? "check" : "handshake"} size={15} /> {copied ? "Copied" : "Copy for chat"}
            </button>
          </div>
        </div>

        {lines.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-10 text-center text-sm text-text-muted">
            Select items on the left to build a price list.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-bg/60 text-left">
                  <th className="px-2 py-2 font-semibold text-text-muted">Item</th>
                  {discountPct > 0 && <th className="px-2 py-2 font-semibold text-text-muted">List</th>}
                  {discountPct > 0 && <th className="px-2 py-2 font-semibold text-text-muted">Disc</th>}
                  <th className="px-2 py-2 font-semibold text-text-muted">Price</th>
                  {includeGst && <th className="px-2 py-2 font-semibold text-text-muted">Incl GST</th>}
                  {withQty && <th className="px-2 py-2 font-semibold text-text-muted">Qty</th>}
                  {withQty && <th className="px-2 py-2 font-semibold text-text-muted">Total</th>}
                </tr>
              </thead>
              <tbody>
                {lines.map((l) => (
                  <tr key={l.code} className="border-b border-border last:border-0">
                    <td className="px-2 py-2">
                      <div className="font-medium text-text">{l.code}</div>
                      <div className="text-xs text-text-muted">{l.desc}</div>
                    </td>
                    {discountPct > 0 && <td className="px-2 py-2 text-text-muted line-through">{formatINR(l.listPrice)}</td>}
                    {discountPct > 0 && <td className="px-2 py-2 text-success">{discountPct}%</td>}
                    <td className="px-2 py-2 font-semibold text-text">{formatINR(l.net)}</td>
                    {includeGst && <td className="px-2 py-2">{formatINR(l.unitTotal)}</td>}
                    {withQty && (
                      <td className="px-2 py-2">
                        <input
                          type="number"
                          min={1}
                          value={l.qty}
                          onChange={(e) => setQty((p) => ({ ...p, [l.code]: Math.max(1, Number(e.target.value) || 1) }))}
                          className="w-16 rounded border border-border px-2 py-1"
                        />
                      </td>
                    )}
                    {withQty && <td className="px-2 py-2 font-semibold">{formatINR(l.lineTotal)}</td>}
                  </tr>
                ))}
              </tbody>
            </table>
            {withQty && (
              <div className="mt-3 flex justify-end border-t border-border pt-3 text-lg">
                <span className="font-medium text-text-muted">Grand total:&nbsp;</span>
                <span className="font-extrabold text-text">{formatINR(grandTotal(lines))}</span>
              </div>
            )}
            <p className="mt-3 text-xs text-text-muted">
              Base (channel) prices are hidden from the customer. {includeGst ? `Incl. ${gstPct}% GST.` : `GST ${gstPct}% extra.`} Ex-works Pune.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
