import type { Product } from "@/lib/types";

/** Short "0.4–110 l/h" style flow summary. */
export function flowSummary(p: Product): string | null {
  const { flowRateMinLH: min, flowRateMaxLH: max } = p.specs;
  if (min !== undefined && max !== undefined) return `${min}–${max} l/h`;
  if (max !== undefined) return `up to ${max} l/h`;
  return null;
}

export function pressureSummary(p: Product): string | null {
  const max = p.specs.maxPressureBar;
  return max !== undefined ? `up to ${max} bar` : null;
}

const CONTROL_LABELS: Record<string, string> = {
  analogue: "Analogue",
  digital: "Digital",
  proportional: "Proportional",
  mechanical: "Mechanical",
  mixed: "Multiple",
};

export function controlLabel(p: Product): string | null {
  const c = p.specs.controlType;
  return c ? CONTROL_LABELS[c] ?? c : null;
}

/** Three headline callouts for the hero / card. */
export function keyCallouts(p: Product): { label: string; value: string }[] {
  const out: { label: string; value: string }[] = [];
  const flow = flowSummary(p);
  if (flow) out.push({ label: "Flow rate", value: flow });
  const pressure = pressureSummary(p);
  if (pressure) out.push({ label: "Max pressure", value: pressure });
  if (p.specs.enclosure) out.push({ label: "Enclosure", value: String(p.specs.enclosure) });
  else if (p.specs.pumpHead) out.push({ label: "Wetted parts", value: String(p.specs.pumpHead) });
  else if (p.specs.installationType)
    out.push({ label: "Mounting", value: String(p.specs.installationType) });
  return out.slice(0, 3);
}
