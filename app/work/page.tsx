export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";
import Nav from "@/components/Nav";
import GridBackground from "@/components/GridBackground";
import { getData } from "@/lib/data";

export const metadata = { title: "Work — Fikri" };

export default async function WorkPage() {
  const S = await getData();

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-[#f5f5f5] font-sans overflow-x-hidden">
      <GridBackground />
      <Nav active="/work" />

      <header className="relative z-10 max-w-[1280px] mx-auto px-8 pt-[140px] pb-10 max-[640px]:px-5 max-[640px]:pt-[104px]">
        <div className="font-mono text-[12.5px] text-[#525252] mb-5">
          ~/fikri <span className="text-[#404040]">/</span> <span className="text-[#a3a3a3]">work</span>
        </div>
        <h1 className="text-[clamp(44px,7vw,88px)] font-bold tracking-[-0.03em] leading-[0.95]">
          SELECTED
          <br />
          WORK
        </h1>
        <p className="max-w-[560px] text-base leading-[1.6] text-[#a3a3a3] mt-6">
          Proyek web &amp; engineering yang kubangun, ditambah seri karya graphic design. Klik untuk detail tiap proyek.
        </p>
      </header>

      <section className="relative z-10 max-w-[1280px] mx-auto px-8 py-10 max-[640px]:px-5">
        <div className="flex items-baseline gap-3.5 mb-2 font-mono">
          <span className="text-[13px] tracking-[0.15em] text-[#737373]">{`// WEB & ENGINEERING`}</span>
          <div className="flex-1 h-px bg-white/8" />
        </div>
        {S.webWorks.map((w) => (
          <Link
            key={w.id}
            href={`/work/${w.id}`}
            data-r="workrow"
            className="hover-row grid grid-cols-[auto_1fr_auto] gap-8 items-center py-8 px-4 border-t border-white/10 no-underline text-[#f5f5f5] max-[640px]:grid-cols-1 max-[640px]:gap-2.5"
          >
            <span className="font-mono text-[13px] text-[#525252]">{w.idx}</span>
            <div>
              <div className="flex items-baseline gap-4 flex-wrap">
                <span className="text-[clamp(22px,2.8vw,34px)] font-semibold tracking-[-0.02em]">{w.title}</span>
                <span className="font-mono text-xs text-[#737373]">{w.cat}</span>
              </div>
              <p className="text-[15px] text-[#a3a3a3] mt-2 max-w-[560px]">{w.desc}</p>
            </div>
            <div className="flex items-center gap-5">
              <span className="font-mono text-xs text-[#737373]">{w.year}</span>
              <span className="text-[22px] text-[#737373]">↗</span>
            </div>
          </Link>
        ))}
        <div className="border-t border-white/10" />

        <div className="flex items-baseline gap-3.5 mt-[72px] mb-7 font-mono">
          <span className="text-[13px] tracking-[0.15em] text-[#737373]">{`// GRAPHIC DESIGN`}</span>
          <div className="flex-1 h-px bg-white/8" />
          <span className="text-[11.5px] text-[#525252]">{S.graphicWorks.length} pieces</span>
        </div>
        <div className="grid grid-cols-3 gap-px bg-white/8 border border-white/8 max-[980px]:grid-cols-2 max-[640px]:grid-cols-1">
          {S.graphicWorks.map((g) => (
            <Link
              key={g.id}
              href={`/graphic/${g.id}`}
              className="hover-panel relative bg-[#0a0a0a] aspect-[4/3] flex flex-col justify-end p-5 no-underline text-[#f5f5f5] overflow-hidden"
            >
              {S.detail.graphic[g.id]?.cover ? (
                <>
                  <Image
                    src={S.detail.graphic[g.id].cover!}
                    alt={g.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 980px) 50vw, 33vw"
                    style={{ objectFit: "cover" }}
                    className="opacity-50"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                </>
              ) : (
                <div
                  className="absolute inset-0 opacity-60"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(255,255,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.04) 1px,transparent 1px)",
                    backgroundSize: "22px 22px",
                  }}
                />
              )}
              <div className="absolute top-[18px] left-5 font-mono text-[11px] text-[#525252]">{g.cat}</div>
              <div className="relative text-lg font-semibold tracking-[-0.01em]">{g.title}</div>
            </Link>
          ))}
        </div>
      </section>

      <footer className="relative z-10 max-w-[1280px] mx-auto px-8 pt-[60px] pb-10 mt-10 max-[640px]:px-5">
        <div className="flex justify-between items-center flex-wrap gap-4 font-mono text-xs text-[#525252] pt-6 border-t border-white/8">
          <span>© 2024 FIKRI · MAKASSAR, ID</span>
          <Link href="/" className="text-[#a3a3a3] no-underline hover-link">
            ← BACK HOME
          </Link>
        </div>
      </footer>
    </div>
  );
}
