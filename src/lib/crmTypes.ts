// Shared CRM types + pipeline stage definitions (safe to import client-side).

export type StageKey =
  | "new"
  | "quoted"
  | "follow_up"
  | "won"
  | "fulfilment"
  | "closed"
  | "lost";

export const CRM_STAGES: { key: StageKey; label: string; hint: string }[] = [
  { key: "new", label: "Approached", hint: "New lead / cold call / inquiry" },
  { key: "quoted", label: "Quotation Sent", hint: "Quote issued, awaiting response" },
  { key: "follow_up", label: "Follow-up", hint: "Chasing / negotiating" },
  { key: "won", label: "Order Confirmed", hint: "PO received / verbal confirm" },
  { key: "fulfilment", label: "In Fulfilment", hint: "Advance → dispatch → delivery → install" },
  { key: "closed", label: "Closed / Won", hint: "Delivered & fully paid" },
  { key: "lost", label: "Lost", hint: "Did not convert" },
];

export const REQUIREMENT_TYPES = [
  { key: "cold_call", label: "Cold call" },
  { key: "quotation", label: "Needs quotation" },
  { key: "inquiry", label: "Inquiry" },
] as const;

export interface OrderItem {
  desc: string;
  qty: number;
  rate: number;
}

export interface Activity {
  at: string;
  note: string;
  by: string;
}

export interface Lead {
  id: string;
  refNo: string;
  customer: {
    name: string;
    company?: string;
    phone?: string;
    email?: string;
    address?: string;
    gstin?: string;
  };
  approachDate: string;
  requirementType: string;
  requirement: string;
  stage: StageKey;
  // Quote
  quoteAmount?: number;
  quoteSentDate?: string;
  // Quotation pricing controls (feed the generated documents)
  quoteMarkupPct?: number;
  quoteDiscountPct?: number;
  quoteDiscountMode?: "shown" | "real";
  quoteGstPct?: number;
  quoteIncludeGst?: boolean;
  // Order
  poNumber?: string;
  orderValue?: number;
  items: OrderItem[];
  // Fulfilment milestones
  advanceAmount?: number;
  advanceDate?: string;
  proformaNo?: string;
  dispatchDate?: string;
  deliveryDate?: string;
  installationRequired?: boolean;
  installationDate?: string;
  finalInvoiceNo?: string;
  finalPaymentAmount?: number;
  finalPaymentDate?: string;
  // Workflow
  nextFollowUp?: string;
  owner?: string;
  activities: Activity[];
  createdAt: string;
  updatedAt: string;
}

export const stageLabel = (k: string) =>
  CRM_STAGES.find((s) => s.key === k)?.label ?? k;
