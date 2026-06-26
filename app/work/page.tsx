import Link from "next/link";
import Nav from "@/components/Nav";
import GridBackground from "@/components/GridBackground";
import { PaginatedWebWorks, PaginatedGraphics } from "@/components/PaginatedList";
import { getData } from "@/lib/data";

export const metadata = { title: "Work — Fikri" };

export default async function WorkPage() {
  const S = await getData();

  const graphics = S.graphicWorks.map((g) => ({
    id: g.id,
    title: g.title,
    cat: g.cat,
    cover: S.detail.graphic[g.id]?.cover ?? null,
  }));

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
          <span className="text-[11.5px] text-[#525252]">{S.webWorks.length} projects</span>
        </div>
        <PaginatedWebWorks items={S.webWorks} perPage={6} />

        <div className="flex items-baseline gap-3.5 mt-[72px] mb-7 font-mono">
          <span className="text-[13px] tracking-[0.15em] text-[#737373]">{`// GRAPHIC DESIGN`}</span>
          <div className="flex-1 h-px bg-white/8" />
          <span className="text-[11.5px] text-[#525252]">{S.graphicWorks.length} pieces</span>
        </div>
        <PaginatedGraphics items={graphics} perPage={6} />
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
