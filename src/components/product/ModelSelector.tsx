"use client";

import { useState } from "react";
import type { ProductModel } from "@/lib/types";

interface Props {
  models: ProductModel[];
  columns?: { key: string; label: string }[];
}

// Interactive: the buyer enters a required flow / pressure and the table
// highlights every model whose capability meets it.
export function ModelSelector({ models, columns }: Props) {
  const [reqFlow, setReqFlow] = useState("");
  const [reqPressure, setReqPressure] = useState("");

  const cols =
    columns ??
    ([
      { key: "code", label: "Model" },
      { key: "maxFlowLH", label: "Max flow (l/h)" },
      { key: "maxPressureBar", label: "Max pressure (bar)" },
      { key: "freqStrMin", label: "Freq (str/min)" },
    ] as { key: string; label: string }[]);

  const flow = parseFloat(reqFlow);
  const pressure = parseFloat(reqPressure);
  const filtering = !Number.isNaN(flow) || !Number.isNaN(pressure);

  function matches(m: ProductModel): boolean {
    if (!filtering) return false;
    const okFlow =
      Number.isNaN(flow) || (m.maxFlowLH ?? Infinity) >= flow;
    const okPressure =
      Number.isNaN(pressure) || (m.maxPressureBar ?? Infinity) >= pressure;
    return okFlow && okPressure;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-4 rounded-xl border border-border bg-surface p-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-text-muted">
            Required flow (l/h)
          </label>
          <input
            type="number"
            min={0}
            value={reqFlow}
            onChange={(e) => setReqFlow(e.target.value)}
            placeholder="e.g. 50"
            className="w-32 rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary-light"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-text-muted">
            Required pressure (bar)
          </label>
          <input
            type="number"
            min={0}
            value={reqPressure}
            onChange={(e) => setReqPressure(e.target.value)}
            placeholder="e.g. 10"
            className="w-32 rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary-light"
          />
        </div>
        {filtering && (
          <p className="text-xs text-text-muted">
            Highlighting models that meet your requirement.
          </p>
        )}
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-surface">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-bg/60 text-left">
              {cols.map((c) => (
                <th key={c.key} className="px-4 py-2.5 font-semibold text-text-muted">
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {models.map((m, i) => {
              const hit = matches(m);
              return (
                <tr
                  key={(m.code as string) ?? i}
                  className={
                    hit
                      ? "bg-success/10 ring-1 ring-inset ring-success/40"
                      : i % 2
                        ? "bg-bg/40"
                        : ""
                  }
                >
                  {cols.map((c) => (
                    <td key={c.key} className="px-4 py-2.5 text-text">
                      {m[c.key] !== undefined ? String(m[c.key]) : "—"}
                      {c.key === "code" && hit && (
                        <span className="ml-2 text-xs font-semibold text-success">
                          ✓ match
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
