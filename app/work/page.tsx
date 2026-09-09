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

      <header className="relative z-10 max-w-[1180px] mx-auto px-8 pt-36 pb-12 max-[640px]:px-5 max-[640px]:pt-28">
        <div className="font-mono text-[12px] text-[#525252] mb-6">
          ~/fikri <span className="text-[#3a3a3a]">/</span> <span className="text-[#a3a3a3]">work</span>
        </div>
        <h1 className="text-[clamp(44px,7vw,88px)] font-bold tracking-[-0.035em] leading-[0.98]">
          SELECTED
          <br />
          WORK
        </h1>
        <p className="max-w-[560px] text-[16px] leading-[1.65] text-[#a3a3a3] mt-7">
          Web &amp; engineering projects I&apos;ve built, alongside a set of graphic design work. Each project opens to a full write-up: what it was, my role, the impact, and what I took away.
        </p>
      </header>

      <section className="relative z-10 max-w-[1180px] mx-auto px-8 py-12 max-[640px]:px-5">
        <div className="flex items-baseline gap-4 mb-4 font-mono">
          <span className="text-[12px] tracking-[0.2em] text-[#737373]">{`// WEB & ENGINEERING`}</span>
          <div className="flex-1 h-px bg-white/[0.07]" />
          <span className="text-[11px] text-[#525252]">{String(S.webWorks.length).padStart(2, "0")} projects</span>
        </div>
        <PaginatedWebWorks items={S.webWorks} perPage={3} />

        <div className="flex items-baseline gap-4 mt-24 mb-8 font-mono">
          <span className="text-[12px] tracking-[0.2em] text-[#737373]">{`// GRAPHIC DESIGN`}</span>
          <div className="flex-1 h-px bg-white/[0.07]" />
          <span className="text-[11px] text-[#525252]">{String(S.graphicWorks.length).padStart(2, "0")} pieces</span>
        </div>
        <PaginatedGraphics items={graphics} perPage={6} />
      </section>

      <footer className="relative z-10 max-w-[1180px] mx-auto px-8 pt-16 pb-10 mt-12 max-[640px]:px-5">
        <div className="flex justify-between items-center flex-wrap gap-4 font-mono text-[11px] text-[#525252] pt-7 border-t border-white/[0.07]">
          <span>© 2024 FIKRI · MAKASSAR, ID</span>
          <Link href="/" className="text-[#a3a3a3] no-underline hover-link">
            ← BACK HOME
          </Link>
        </div>
      </footer>
    </div>
  );
}
