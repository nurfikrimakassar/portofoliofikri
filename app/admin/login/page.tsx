"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({ error: "Gagal login." }));
      setError(data.error || "Gagal login.");
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f5f5] font-sans flex items-center justify-center px-6">
      <form onSubmit={submit} className="w-full max-w-[360px] border border-white/12 p-8">
        <div className="font-mono text-xs tracking-[0.15em] text-[#737373] mb-4">~/fikri / admin</div>
        <h1 className="text-2xl font-bold tracking-[-0.02em] mb-6">Masuk Admin</h1>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          autoFocus
          className="w-full bg-white/[0.03] border border-white/14 text-[#f5f5f5] text-sm px-4 py-3.5 outline-none mb-4 font-mono"
        />
        {error && <div className="text-sm text-[#f87171] mb-4 font-mono">{error}</div>}
        <button
          type="submit"
          disabled={loading}
          className="w-full px-6 py-3.5 bg-[#f5f5f5] text-[#0a0a0a] font-mono text-[13px] font-semibold tracking-[0.04em] hover-fill disabled:opacity-50"
        >
          {loading ? "MEMERIKSA..." : "MASUK →"}
        </button>
      </form>
    </div>
  );
}
