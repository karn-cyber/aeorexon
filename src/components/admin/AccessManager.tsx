"use client";

import { useEffect, useState } from "react";
import type { AdminRecord } from "@/lib/admins";
import { Icon } from "@/components/Icon";

export function AccessManager() {
  const [admins, setAdmins] = useState<AdminRecord[]>([]);
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/admins");
    const data = await res.json();
    if (data.ok) setAdmins(data.admins);
    setLoading(false);
  }
  useEffect(() => {
    load();
  }, []);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error);
      setEmail("");
      await load();
    } catch (e2) {
      setError(e2 instanceof Error ? e2.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  async function remove(em: string) {
    if (!confirm(`Remove admin access for ${em}?`)) return;
    const res = await fetch(`/api/admin/admins?email=${encodeURIComponent(em)}`, { method: "DELETE" });
    const data = await res.json();
    if (!data.ok) {
      alert(data.error);
      return;
    }
    await load();
  }

  return (
    <div className="max-w-2xl">
      <form onSubmit={add} className="flex gap-2 rounded-xl border border-border bg-surface p-4">
        <input
          type="email"
          required
          placeholder="teammate@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 rounded-lg border border-border px-3 py-2.5 text-sm outline-none focus:border-primary-light"
        />
        <button disabled={busy} className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 font-semibold text-white hover:brightness-110 disabled:opacity-50">
          <Icon name="plus" size={16} /> Grant access
        </button>
      </form>
      {error && <p className="mt-2 text-sm text-error">{error}</p>}

      <p className="mt-2 text-xs text-text-muted">
        Anyone you add can sign in with that email (via Clerk) and get full admin access.
      </p>

      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-surface">
        {loading ? (
          <div className="p-5 text-sm text-text-muted">Loading…</div>
        ) : (
          <table className="w-full text-sm">
            <tbody>
              {admins.map((a) => (
                <tr key={a.email} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">
                    <div className="font-medium text-text">{a.email}</div>
                    <div className="text-xs text-text-muted">
                      {a.addedBy === "bootstrap (env)" ? "Bootstrap admin (env var)" : `Added by ${a.addedBy ?? "—"}`}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {a.addedBy === "bootstrap (env)" ? (
                      <span className="text-xs text-text-muted">Permanent</span>
                    ) : (
                      <button onClick={() => remove(a.email)} className="text-text-muted hover:text-error" aria-label={`Remove ${a.email}`}>
                        <Icon name="trash-2" size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
