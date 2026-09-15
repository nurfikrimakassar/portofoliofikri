"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PortfolioData } from "@/lib/types";
import ProfileTab from "./admin/tabs/ProfileTab";
import ExperienceTab from "./admin/tabs/ExperienceTab";
import WorksTab from "./admin/tabs/WorksTab";
import ProductsTab from "./admin/tabs/ProductsTab";
import BlogTab from "./admin/tabs/BlogTab";
import DetailTab from "./admin/tabs/DetailTab";
import LinkHubTab from "./admin/tabs/LinkHubTab";

const TABS = [
  { id: "profile", label: "PROFIL & KONTAK" },
  { id: "experience", label: "EXPERIENCE" },
  { id: "works", label: "WORKS" },
  { id: "products", label: "PRODUCTS" },
  { id: "blog", label: "BLOG" },
  { id: "detail", label: "DETAIL" },
  { id: "linkhub", label: "LINK HUB" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function AdminClient({ initialData }: { initialData: PortfolioData }) {
  const [data, setData] = useState<PortfolioData>(initialData);
  const [tab, setTab] = useState<TabId>("profile");
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<string>("");
  const [saveError, setSaveError] = useState<string>("");
  const router = useRouter();

  async function save() {
    setSaving(true);
    setSaveError("");
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setSavedAt(new Date().toLocaleTimeString("id-ID"));
      } else if (res.status === 401) {
        // Don't redirect: navigating away would wipe this tab's unsaved
        // `data` state. Let the user log back in from a fresh tab (the
        // session cookie is shared across tabs) and retry Simpan here.
        setSaveError(
          "Sesi login sudah habis — perubahan ini BELUM tersimpan. Jangan refresh/tutup tab ini. Buka /admin/login di tab baru, login ulang, lalu kembali ke sini dan klik SIMPAN lagi."
        );
      } else {
        setSaveError("Gagal menyimpan (server error). Coba klik SIMPAN lagi.");
      }
    } catch {
      setSaveError("Gagal menyimpan — cek koneksi internet, lalu coba lagi.");
    } finally {
      setSaving(false);
    }
  }

  async function logout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f5f5] font-sans">
      <div className="sticky top-0 z-20 bg-[#0a0a0a]/90 backdrop-blur border-b border-white/10">
        <div className="flex items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="font-mono text-[12.5px] text-[#a3a3a3] no-underline hover-link">
              ~/fikri
            </Link>
            <span className="text-[#404040]">/</span>
            <span className="font-mono text-[12.5px] text-[#f5f5f5]">admin</span>
          </div>
          <div className="flex items-center gap-3">
            {!saveError && savedAt && (
              <span className="font-mono text-[11px] text-[#737373]">Tersimpan {savedAt}</span>
            )}
            <button
              onClick={save}
              disabled={saving}
              className="px-5 py-2.5 bg-[#f5f5f5] text-[#0a0a0a] font-mono text-[12.5px] font-semibold tracking-[0.04em] disabled:opacity-50"
            >
              {saving ? "MENYIMPAN..." : "SIMPAN"}
            </button>
            <button
              onClick={logout}
              className="px-4 py-2.5 border border-white/18 text-[#a3a3a3] font-mono text-[12px] tracking-[0.04em]"
            >
              KELUAR
            </button>
          </div>
        </div>
        {saveError && (
          <div className="px-6 py-3 bg-[#3a1414] border-t border-red-500/30 font-mono text-[12px] text-[#ffb4b4] leading-[1.6]">
            {saveError}
          </div>
        )}
      </div>

      <div className="max-w-[1100px] mx-auto px-6 py-8 flex gap-8 max-[820px]:flex-col">
        <nav className="flex md:flex-col gap-2 font-mono text-[12px] tracking-[0.04em] flex-wrap shrink-0 md:w-[200px]">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="text-left px-3.5 py-2.5 border"
              style={{
                borderColor: tab === t.id ? "#f5f5f5" : "rgba(255,255,255,0.12)",
                background: tab === t.id ? "#f5f5f5" : "transparent",
                color: tab === t.id ? "#0a0a0a" : "#a3a3a3",
              }}
            >
              {t.label}
            </button>
          ))}
        </nav>

        <div className="flex-1 min-w-0">
          {tab === "profile" && <ProfileTab data={data} setData={setData} />}
          {tab === "experience" && <ExperienceTab data={data} setData={setData} />}
          {tab === "works" && <WorksTab data={data} setData={setData} />}
          {tab === "products" && <ProductsTab data={data} setData={setData} />}
          {tab === "blog" && <BlogTab data={data} setData={setData} />}
          {tab === "detail" && <DetailTab data={data} setData={setData} />}
          {tab === "linkhub" && <LinkHubTab data={data} setData={setData} />}
        </div>
      </div>
    </div>
  );
}
