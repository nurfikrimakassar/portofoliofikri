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
  return S.webWorks.map((w) => ({ id: w.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const S = await getData();
  const item = S.webWorks.find((w) => w.id === id);
  if (!item) return {};
  const D = S.detail.project[id] || {};
  return {
    title: item.title,
    description: D.body?.find((b) => b.type === "para")?.text?.slice(0, 160) || item.desc,
    openGraph: {
      title: item.title,
      description: D.body?.find((b) => b.type === "para")?.text?.slice(0, 160) || item.desc,
      images: D.cover ? [{ url: D.cover }] : [],
    },
  };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const S = await getData();
  const item = S.webWorks.find((w) => w.id === id);
  if (!item) notFound();
  const detail = S.detail.project[id] || {};
  const meta = detail.meta?.length
    ? detail.meta
    : [
        { k: "ROLE", v: "Design & Development" },
        { k: "YEAR", v: item.year },
        { k: "STACK", v: "Next.js · React" },
      ];

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-[#f5f5f5] font-sans overflow-x-hidden">
      <GridBackground />
      <Nav active="/work" />

      <header className="relative z-10 max-w-[860px] mx-auto px-8 pt-[132px] max-[640px]:px-6 max-[640px]:pt-[104px]">
        <Link href="/work" className="font-mono text-[12.5px] text-[#737373] no-underline hover-link">
          ← ~/fikri / work
        </Link>
        <div className="flex flex-wrap gap-3 items-center my-7 font-mono text-xs text-[#737373]">
          <span className="px-[11px] py-[5px] border border-white/18 text-[#d4d4d4]">{item.cat}</span>
          <span>{item.year}</span>
        </div>
        <h1 className="text-[clamp(32px,5vw,56px)] font-bold tracking-[-0.03em] leading-[1.05]">{item.title}</h1>
        <p className="text-[clamp(17px,2vw,21px)] leading-[1.55] text-[#a3a3a3] mt-6">{item.desc}</p>
        <div className="grid grid-cols-[repeat(3,auto)_1fr] gap-7 items-center mt-[34px] pt-[26px] border-t border-white/10 max-[980px]:grid-cols-2">
          {meta.map((m) => (
            <div key={m.k}>
              <div className="font-mono text-[11px] text-[#525252] mb-1.5">{m.k}</div>
              <div className="text-[14.5px] text-[#d4d4d4]">{m.v}</div>
            </div>
          ))}
          <a
            href={detail.link || "#"}
            target="_blank"
            rel="noreferrer"
            className="justify-self-end font-mono text-[12.5px] px-[18px] py-[11px] border border-white/25 text-[#f5f5f5] no-underline whitespace-nowrap hover-fill"
          >
            {detail.linkLabel || "LIHAT LIVE SITE"} ↗
          </a>
        </div>
      </header>

      <div className="relative z-10 max-w-[860px] mx-auto px-8 max-[640px]:px-6">
        <ImageSlot
          url={detail.cover}
          alt={`Cover ${item.title}`}
          placeholder="Gambar sampul · 1600×900 (16:9)"
          className="block w-full aspect-video my-10"
        />
        <article className="flex flex-col gap-6 text-[17.5px] leading-[1.75] text-[#d4d4d4] max-w-[740px] mx-auto">
          <BlockBody body={detail.body || []} />
        </article>
      </div>

      <footer className="relative z-10 max-w-[860px] mx-auto mt-14 px-8 pb-10 max-[640px]:px-6">
        <div className="flex justify-between items-center flex-wrap gap-4 font-mono text-xs text-[#525252] pt-6 border-t border-white/10">
          <Link href="/work" className="text-[#a3a3a3] no-underline hover-link">
            ← SEMUA PROJECT
          </Link>
          <Link href="/contact" className="text-[#a3a3a3] no-underline hover-link">
            DISKUSI PROJECT →
          </Link>
        </div>
      </footer>
    </div>
  );
}
