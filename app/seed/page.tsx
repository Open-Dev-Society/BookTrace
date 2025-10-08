"use client";

import { useState } from "react";

export default function SeedPage() {
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState(false);

  async function runSeed() {
    setLoading(true);
    setStatus("");
    try {
      const res = await fetch("/api/seed", { method: "POST" });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Seed failed");
      setStatus("Seeded successfully.");
    } catch (e: any) {
      setStatus(e?.message ?? "Seed failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-xl font-semibold mb-4">Seed Example Data</h1>
      <p className="text-neutral-700 mb-4">Insert a couple of example books, labels, topics, and sources into your Supabase database.</p>
      <button
        className="px-3 py-2 rounded border bg-white text-sm disabled:opacity-50"
        onClick={runSeed}
        disabled={loading}
      >
        {loading ? "Seeding…" : "Run Seed"}
      </button>
      {status && <div className="mt-3 text-sm text-neutral-800">{status}</div>}
    </main>
  );
}


