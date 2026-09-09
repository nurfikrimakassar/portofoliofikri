import Link from "next/link";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import GridBackground from "@/components/GridBackground";
import ImageSlot from "@/components/ImageSlot";
import { getData } from "@/lib/data";

export async function generateStaticParams() {
  const S = await getData();
  return S.graphicWorks.map((g) => ({ id: g.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const S = await getData();
  const item = S.graphicWorks.find((g) => g.id === id);
  if (!item) return {};
  const G = S.detail.graphic[id] || {};
  return {
    title: item.title,
    description: G.desc?.slice(0, 160) || `${item.title} — Graphic design by Fikri`,
    openGraph: {
      title: item.title,
      description: G.desc?.slice(0, 160) || `${item.title} — Graphic design by Fikri`,
      images: G.cover ? [{ url: G.cover }] : G.gallery?.[0]?.url ? [{ url: G.gallery[0].url }] : [],
    },
  };
}

export default async function GraphicDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const S = await getData();
  const item = S.graphicWorks.find((g) => g.id === id);
  if (!item) notFound();
  const G = S.detail.graphic[id] || {};
  const gallery = G.gallery?.length
    ? G.gallery
    : [
        { id: "gg-1", cap: "Logo & wordmark" },
        { id: "gg-2", cap: "Palette & type" },
        { id: "gg-3", cap: "Application / packaging" },
        { id: "gg-4", cap: "Social material" },
        { id: "gg-5", cap: "Final mockup" },
      ];
  const meta = G.meta?.length
    ? G.meta
    : [
        { k: "CATEGORY", v: item.cat },
        { k: "TYPE", v: "—" },
        { k: "ROLE", v: "—" },
        { k: "YEAR", v: "2024" },
      ];

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-[#f5f5f5] font-sans overflow-x-hidden">
      <GridBackground />
      <Nav active="/work" />

      <header className="relative z-10 max-w-[1040px] mx-auto px-8 pt-36 max-[640px]:px-6 max-[640px]:pt-28">
        <Link href="/work" className="font-mono text-[12px] text-[#737373] no-underline hover-link">
          ← ~/fikri / work / graphic
        </Link>
        <div className="font-mono text-[11px] tracking-[0.2em] text-[#525252] mt-8 mb-4">{`// ${item.cat.toUpperCase()}`}</div>
        <h1 className="text-[clamp(34px,5.5vw,60px)] font-bold tracking-[-0.035em] leading-[1.03]">{item.title}</h1>
        <p className="text-[clamp(16px,1.8vw,20px)] leading-[1.6] text-[#a3a3a3] mt-6 max-w-[560px]">
          {G.desc || "One or two sentences describing this piece — what it was for and what it involved."}
        </p>

        {/* PROJECT FACTS */}
        <dl className="grid grid-cols-2 gap-x-10 gap-y-6 mt-12 pt-10 border-t border-white/[0.08] max-[640px]:grid-cols-1">
          {meta.map((m) => {
            const isLink = /^https?:\/\//i.test(m.v);
            return (
              <div key={m.k}>
                <dt className="font-mono text-[10.5px] tracking-[0.16em] text-[#525252] mb-1.5">{m.k}</dt>
                <dd className="text-[14.5px] text-[#d4d4d4] leading-[1.5]">
                  {isLink ? (
                    <a href={m.v} target="_blank" rel="noreferrer" className="text-[#f5f5f5] no-underline border-b border-white/25 hover-link">
                      {m.v.replace(/^https?:\/\//, "").replace(/\/$/, "")} ↗
                    </a>
                  ) : (
                    m.v
                  )}
                </dd>
              </div>
            );
          })}
        </dl>

        {G.link && G.link !== "#" && (
          <a
            href={G.link}
            target="_blank"
            rel="noreferrer"
            className="inline-flex mt-9 font-mono text-[12px] px-5 py-3 border border-white/20 text-[#f5f5f5] no-underline whitespace-nowrap hover-fill"
          >
            {G.linkLabel || "VIEW FULL SET"} ↗
          </a>
        )}
      </header>

      <div className="relative z-10 max-w-[1040px] mx-auto px-8 max-[640px]:px-6">
        <ImageSlot
          url={G.cover}
          alt={`Cover ${item.title}`}
          placeholder="Cover · any ratio"
          fit="contain"
          className="block w-full h-[520px] my-14"
        />

        {G.imageNote && (
          <div className="max-w-[720px] mx-auto py-4">
            <div className="font-mono text-[11px] tracking-[0.2em] text-[#525252] mb-4">{`// APPROACH`}</div>
            <p className="text-[clamp(16px,1.7vw,18px)] leading-[1.8] text-[#d4d4d4] text-balance-pretty">
              {G.imageNote}
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-6 mt-14 max-[720px]:grid-cols-1 pb-20">
          {gallery.map((g) => (
            <figure key={g.id} className="m-0">
              <ImageSlot
                url={g.url}
                alt={g.cap}
                placeholder="Image · any ratio"
                fit="contain"
                className="block w-full h-[360px] bg-[#101010]"
              />
              <figcaption className="font-mono text-[11px] text-[#525252] mt-3">{g.cap}</figcaption>
            </figure>
          ))}
        </div>
      </div>

      <footer className="relative z-10 max-w-[1040px] mx-auto px-8 pb-10 max-[640px]:px-6">
        <div className="flex justify-between items-center flex-wrap gap-4 font-mono text-[11px] text-[#525252] pt-7 border-t border-white/[0.08]">
          <Link href="/work" className="text-[#a3a3a3] no-underline hover-link">
            ← ALL WORK
          </Link>
          <Link href="/contact" className="text-[#a3a3a3] no-underline hover-link">
            START A DESIGN PROJECT →
          </Link>
        </div>
      </footer>
    </div>
  );
}
