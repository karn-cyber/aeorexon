import type { PriceItem } from "@/data/priceList";
import { formatINR } from "@/lib/pricing";

export interface QuoteSettings {
  /** Commission / markup the reseller adds on top of the base (channel) price. */
  markupPct: number;
  /** Discount percentage applied (see discountMode). */
  discountPct: number;
  /**
   * "shown"  — cosmetic: a higher list price is back-computed so the discount
   *            nets exactly to the marked-up price (customer pays the markup).
   * "real"   — genuine: the marked-up price IS the list price and the discount
   *            actually reduces what the customer pays.
   */
  discountMode: "shown" | "real";
  gstPct: number;
  includeGst: boolean;
  roundTo: number;
  withQty: boolean;
}

export interface QuoteLine {
  code: string;
  desc: string;
  moc: string;
  group: string;
  base: number;
  qty: number;
  /** List price shown to the customer (before the shown discount). */
  listPrice: number;
  /** Net unit price the customer pays (after markup, after shown discount). */
  net: number;
  gstAmount: number;
  /** Net + GST per unit. */
  unitTotal: number;
  /** unitTotal × qty. */
  lineTotal: number;
}

function roundTo(v: number, step: number) {
  const s = step > 0 ? step : 1;
  return Math.round(v / s) * s;
}

export function computeLine(
  item: PriceItem & { qty?: number; markupOverride?: number },
  s: QuoteSettings
): QuoteLine {
  const markup = item.markupOverride ?? s.markupPct;
  const marked = roundTo(item.base * (1 + markup / 100), s.roundTo);

  let net = marked;
  let listPrice = marked;
  if (s.discountPct > 0) {
    if (s.discountMode === "real") {
      // Genuine reduction: list is the marked price, customer pays less.
      listPrice = marked;
      net = roundTo(marked * (1 - s.discountPct / 100), s.roundTo);
    } else {
      // Cosmetic: inflate the list so the discount nets to the marked price.
      net = marked;
      listPrice = roundTo(marked / (1 - s.discountPct / 100), s.roundTo);
    }
  }

  const gstAmount = s.includeGst ? roundTo((net * s.gstPct) / 100, 1) : 0;
  const unitTotal = net + gstAmount;
  const qty = Math.max(1, item.qty ?? 1);
  return {
    code: item.code,
    desc: item.desc,
    moc: item.moc,
    group: item.group,
    base: item.base,
    qty,
    listPrice,
    net,
    gstAmount,
    unitTotal,
    lineTotal: unitTotal * qty,
  };
}

export function grandTotal(lines: QuoteLine[]): number {
  return lines.reduce((sum, l) => sum + l.lineTotal, 0);
}

function csvCell(v: string | number): string {
  const s = String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function toCSV(lines: QuoteLine[], s: QuoteSettings): string {
  const header = [
    "Item Code",
    "Description",
    "MOC",
    ...(s.discountPct > 0 ? ["List Price (INR)", `Discount %`] : []),
    "Unit Price (INR)",
    ...(s.includeGst ? [`GST ${s.gstPct}% (INR)`, "Unit incl. GST (INR)"] : []),
    ...(s.withQty ? ["Qty", "Line Total (INR)"] : []),
  ];
  const rows = lines.map((l) => [
    l.code,
    l.desc,
    l.moc,
    ...(s.discountPct > 0 ? [l.listPrice, s.discountPct] : []),
    l.net,
    ...(s.includeGst ? [l.gstAmount, l.unitTotal] : []),
    ...(s.withQty ? [l.qty, l.lineTotal] : []),
  ]);
  const out = [header, ...rows].map((r) => r.map(csvCell).join(","));
  if (s.withQty) out.push(["", "", "", ...(s.discountPct > 0 ? ["", ""] : []), "", ...(s.includeGst ? ["", "Grand Total"] : ["Grand Total"]), "", grandTotal(lines)].map(csvCell).join(","));
  return out.join("\n");
}

/** Compact text block suitable for pasting into a chat message. */
export function toText(
  lines: QuoteLine[],
  s: QuoteSettings,
  meta: { customer?: string }
): string {
  const head = ["*Aorexon — Price List / Quotation*"];
  if (meta.customer) head.push(`For: ${meta.customer}`);
  const body = lines.map((l) => {
    const price = s.discountPct > 0
      ? `${formatINR(l.listPrice)} − ${s.discountPct}% = ${formatINR(l.net)}`
      : formatINR(l.net);
    const qty = s.withQty ? ` ×${l.qty} = ${formatINR(l.lineTotal)}` : "";
    return `• ${l.code} (${l.desc}${l.moc ? ", " + l.moc : ""}): ${price}${qty}`;
  });
  const foot = [];
  if (s.withQty) foot.push(`Grand total: ${formatINR(grandTotal(lines))}`);
  foot.push(s.includeGst ? `Prices incl. ${s.gstPct}% GST.` : `GST ${s.gstPct}% extra.`);
  foot.push("Ex-works Pune · Transport extra.");
  return [...head, "", ...body, "", ...foot].join("\n");
}
