"use client";

import { useState } from "react";

type HealthResult = {
  ok: boolean;
  message: string;
  db?: string;
  databases?: string[];
  error?: string;
};

export default function Home() {
  const [result, setResult] = useState<HealthResult | null>(null);
  const [loading, setLoading] = useState(false);

  async function checkConnection() {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/health");
      const data = (await res.json()) as HealthResult;
      setResult(data);
    } catch (err) {
      setResult({
        ok: false,
        message: "Request failed",
        error: err instanceof Error ? err.message : String(err),
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-3xl font-bold">aorexon</h1>
      <p className="text-gray-500">Next.js + MongoDB connection check</p>

      <button
        onClick={checkConnection}
        disabled={loading}
        className="rounded-lg bg-black px-5 py-2.5 text-white transition hover:bg-gray-800 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-gray-200"
      >
        {loading ? "Checking…" : "Check DB connection"}
      </button>

      {result && (
        <div
          className={`w-full max-w-md rounded-lg border p-4 text-sm ${
            result.ok
              ? "border-green-500 bg-green-50 dark:bg-green-950/30"
              : "border-red-500 bg-red-50 dark:bg-red-950/30"
          }`}
        >
          <p className="font-semibold">
            {result.ok ? "✅ " : "❌ "}
            {result.message}
          </p>
          {result.db && <p className="mt-1">Database: {result.db}</p>}
          {result.databases && (
            <p className="mt-1">Available: {result.databases.join(", ")}</p>
          )}
          {result.error && (
            <p className="mt-1 break-words text-red-600">{result.error}</p>
          )}
        </div>
      )}
    </main>
  );
}
