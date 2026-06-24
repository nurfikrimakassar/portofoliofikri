export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import GridBackground from "@/components/GridBackground";
import ImageSlot from "@/components/ImageSlot";
import BlockBody from "@/components/BlockBody";
import { getData } from "@/lib/data";

export async function generateStaticParams() {
  const S = await getData();
  return S.automation.map((a) => ({ id: a.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const S = await getData();
  const item = S.automation.find((a) => a.id === id);
  if (!item) return {};
  const C = S.detail.cs[id] || {};
  const desc = C.summary || `${item.problem} — ${item.result}`;
  return {
    title: item.title,
    description: desc.slice(0, 160),
    openGraph: {
      title: item.title,
      description: desc.slice(0, 160),
      images: C.cover ? [{ url: C.cover }] : [],
    },
  };
}

export default async function CaseStudyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const S = await getData();
  const item = S.automation.find((a) => a.id === id);
  if (!item) notFound();
  const C = S.detail.cs[id] || {};
  const meta = C.meta?.length
    ? C.meta
    : [
        { k: "KLIEN", v: "Internal / Freelance" },
        { k: "PERAN", v: "Automation Engineer" },
        { k: "TAHUN", v: "2024" },
        { k: "STACK", v: item.stack },
      ];
  const results = C.results?.length
    ? C.results
    : [
        { num: "3 jam", label: "DIHEMAT / MINGGU" },
        { num: "0", label: "SALAH KETIK SEJAK RILIS" },
        { num: "1×", label: "KLIK UNTUK SELURUH ALUR" },
      ];

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-[#f5f5f5] font-sans overflow-x-hidden">
      <GridBackground />
      <Nav active="/products" />

      <header className="relative z-10 max-w-[880px] mx-auto px-8 pt-[132px] max-[640px]:px-6 max-[640px]:pt-[104px]">
        <Link href="/products" className="font-mono text-[12.5px] text-[#737373] no-underline hover-link">
          ← ~/fikri / products / case-study
        </Link>
        <div className="font-mono text-xs tracking-[0.15em] text-[#525252] my-7">CASE STUDY · AUTOMATION</div>
        <h1 className="text-[clamp(34px,5.5vw,62px)] font-bold tracking-[-0.03em] leading-[1.02]">{item.title}</h1>
        <p className="text-[clamp(17px,2vw,21px)] leading-[1.55] text-[#a3a3a3] mt-6 max-w-[640px]">
          {C.summary ||
            "Mengubah proses invoicing manual mingguan menjadi sistem terjadwal yang membuat, mengubah ke PDF, dan mengirim invoice tanpa sentuhan tangan."}
        </p>
        <div className="grid grid-cols-4 gap-px bg-white/8 border border-white/8 mt-10 max-[980px]:grid-cols-2">
          {meta.map((m) => (
            <div key={m.k} className="bg-[#0a0a0a] p-5">
              <div className="font-mono text-[11px] text-[#525252] mb-2">{m.k}</div>
              <div className="text-[15px] text-[#d4d4d4]">{m.v}</div>
            </div>
          ))}
        </div>
      </header>

      <div className="relative z-10 max-w-[880px] mx-auto px-8 max-[640px]:px-6">
        <ImageSlot
          url={C.cover}
          alt={`Cover ${item.title}`}
          placeholder="Gambar cover · ratio bebas"
          className="block w-full aspect-video my-10"
        />
        <div className="flex flex-col gap-7 mt-11">
          <BlockBody body={C.body || []} />
        </div>

        <div className="mt-14 pb-16">
          <div className="font-mono text-[11.5px] tracking-[0.15em] text-[#737373] mb-5">{`// HASIL`}</div>
          <div className="grid grid-cols-3 gap-px bg-white/8 border border-white/8 max-[980px]:grid-cols-1">
            {results.map((r) => (
              <div key={r.label} className="bg-[#0a0a0a] px-6 py-[30px]">
                <div className="text-[clamp(34px,4vw,46px)] font-bold tracking-[-0.02em] leading-none">{r.num}</div>
                <div className="font-mono text-[11.5px] text-[#737373] mt-3">{r.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer className="relative z-10 max-w-[880px] mx-auto px-8 pb-10 max-[640px]:px-6">
        <div className="flex justify-between items-center flex-wrap gap-4 font-mono text-xs text-[#525252] pt-6 border-t border-white/10">
          <Link href="/products" className="text-[#a3a3a3] no-underline hover-link">
            ← SEMUA PRODUCTS
          </Link>
          <Link href="/contact" className="text-[#a3a3a3] no-underline hover-link">
            BUTUH AUTOMATION SERUPA? →
          </Link>
        </div>
      </footer>
    </div>
  );
}
