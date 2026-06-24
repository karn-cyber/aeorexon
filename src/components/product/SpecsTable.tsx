"use client";

import { useState } from "react";
import type { ProductSpecs } from "@/lib/types";

const LABELS: Record<string, string> = {
  flowRateMinLH: "Min flow (l/h)",
  flowRateMaxLH: "Max flow (l/h)",
  maxPressureBar: "Max pressure (bar)",
  powerSupply: "Power supply",
  pumpHead: "Pump head",
  diaphragm: "Diaphragm",
  diaphragmWarrantyYears: "Diaphragm warranty (yrs)",
  enclosure: "Enclosure",
  strokeRateMin: "Min stroke rate (str/min)",
  strokeRateMax: "Max stroke rate (str/min)",
  motorKw: "Motor",
  controlType: "Control type",
  levelControlInput: "Level control input",
  atex: "ATEX certified",
  wifiCapable: "Wi-Fi capable",
  modbusCapable: "Modbus capable",
  installationType: "Mounting",
  probeInput: "Probe input",
  timer: "Timer",
  atexRating: "ATEX rating",
  strokeRegulation: "Stroke regulation",
  housing: "Housing",
  diaphragmDia: "Diaphragm Ø",
  strokeRate: "Stroke rate",
  strokeLength: "Stroke length",
  strokeMm: "Stroke (mm)",
  weightKg: "Weight (kg)",
  communication: "Communication",
  display: "Display",
  output: "Outputs",
  operatingModes: "Operating modes",
  drive: "Drive",
  wettedPart: "Wetted part",
};

const BASIC_KEYS = [
  "flowRateMinLH",
  "flowRateMaxLH",
  "maxPressureBar",
  "powerSupply",
  "pumpHead",
  "controlType",
];

function format(key: string, value: unknown): string {
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (key === "controlType" && typeof value === "string")
    return value[0].toUpperCase() + value.slice(1);
  return String(value);
}

function Rows({ specs, keys }: { specs: ProductSpecs; keys: string[] }) {
  const rows = keys.filter((k) => specs[k] !== undefined);
  return (
    <table className="w-full text-sm">
      <tbody>
        {rows.map((key, i) => (
          <tr key={key} className={i % 2 ? "bg-bg/60" : ""}>
            <td className="w-1/2 px-4 py-2.5 font-medium text-text-muted">
              {LABELS[key] ?? key}
            </td>
            <td className="px-4 py-2.5 text-text">{format(key, specs[key])}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function SpecsTable({ specs }: { specs: ProductSpecs }) {
  const [tab, setTab] = useState<"basic" | "full">("basic");
  const allKeys = [
    ...BASIC_KEYS,
    ...Object.keys(specs).filter((k) => !BASIC_KEYS.includes(k)),
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      <div className="flex border-b border-border">
        {(["basic", "full"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-3 text-sm font-semibold capitalize transition ${
              tab === t
                ? "border-b-2 border-accent text-primary"
                : "text-text-muted hover:text-text"
            }`}
          >
            {t === "basic" ? "Basic" : "Full specifications"}
          </button>
        ))}
      </div>
      <Rows specs={specs} keys={tab === "basic" ? BASIC_KEYS : allKeys} />
    </div>
  );
}
