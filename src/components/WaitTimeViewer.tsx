"use client";

import { useEffect, useState } from "react";

type Wait = { wait: number; lower: number; upper: number };

async function fetchWait(tsIso: string): Promise<Wait> {
  const api = process.env.NEXT_PUBLIC_API_BASE!;
  const res = await fetch(`${api}/wait?timestamp=${encodeURIComponent(tsIso)}`);
  if (!res.ok) throw new Error("API error");
  return res.json();
}

export default function WaitTimeViewer() {
  const [now, setNow] = useState<Wait | null>(null);
  const [at, setAt] = useState("");
  const [forecast, setForecast] = useState<Wait | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  // fetch “right now” once
  useEffect(() => {
    fetchWait(new Date().toISOString()).then(setNow).catch(console.error);
  }, []);

  async function handleClick() {
    if (!at) return;
    try {
      setBusy(true);
      setErr("");
      const w = await fetchWait(new Date(at).toISOString());
      setForecast(w);
    } catch (e: any) {
      setErr(e.message || "Unknown error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main style={{ maxWidth: 480, margin: "2rem auto", fontFamily: "sans-serif" }}>
      <h1>Bodo’s Wait-Time Estimator</h1>

      <section style={{ marginTop: "1rem" }}>
        <h2>Right now</h2>
        {now ? (
          <>
            <p style={{ fontSize: 32 }}>{now.wait.toFixed(1)} min</p>
            <small>
              95 % CI {now.lower.toFixed(1)} – {now.upper.toFixed(1)} min
            </small>
          </>
        ) : (
          <p>Loading…</p>
        )}
      </section>

      <section style={{ marginTop: "2rem" }}>
        <h2>Pick a time</h2>
        <input
          type="datetime-local"
          value={at}
          onChange={(e) => setAt(e.target.value)}
        />
        <button onClick={handleClick} disabled={busy || !at} style={{ marginLeft: 8 }}>
          {busy ? "…" : "Get forecast"}
        </button>

        {err && <p style={{ color: "red" }}>{err}</p>}
        {forecast && (
          <>
            <p style={{ fontSize: 28, marginTop: 8 }}>
              {forecast.wait.toFixed(1)} min
            </p>
            <small>
              95 % CI {forecast.lower.toFixed(1)} – {forecast.upper.toFixed(1)} min
            </small>
          </>
        )}
      </section>
    </main>
  );
}