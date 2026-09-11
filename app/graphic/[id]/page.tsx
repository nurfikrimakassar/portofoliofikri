import Link from "next/link";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import GridBackground from "@/components/GridBackground";
import { getData } from "@/lib/data";
import { GalleryRow } from "@/lib/types";

// Every image in a row renders at this height; width follows its own aspect ratio.
const ROW_HEIGHT: Record<number, string> = {
  1: "h-[460px] max-[720px]:h-[320px] max-[480px]:h-[220px]",
  2: "h-[380px] max-[720px]:h-[280px] max-[480px]:h-[200px]",
  3: "h-[300px] max-[720px]:h-[220px] max-[480px]:h-[170px]",
  4: "h-[240px] max-[720px]:h-[180px] max-[480px]:h-[140px]",
};

const DEMO_ROWS: GalleryRow[] = [
  {
    id: "demo-1",
    images: [
      { id: "d1", cap: "Logo & wordmark" },
      { id: "d2", cap: "Palette & type" },
    ],
  },
  {
    id: "demo-2",
    images: [
      { id: "d3", cap: "Application" },
      { id: "d4", cap: "Social material" },
      { id: "d5", cap: "Final mockup" },
    ],
  },
];

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
      images: G.cover ? [{ url: G.cover }] : G.galleryRows?.[0]?.images?.[0]?.url ? [{ url: G.galleryRows[0].images[0].url }] : [],
    },
  };
}

export default async function GraphicDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const S = await getData();
  const item = S.graphicWorks.find((g) => g.id === id);
  if (!item) notFound();
  const G = S.detail.graphic[id] || {};
  const rows = G.galleryRows?.length ? G.galleryRows : DEMO_ROWS;
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
        {G.cover ? (
          <figure className="group m-0 my-14">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={G.cover}
              alt={`Cover ${item.title}`}
              className="block w-full h-auto grayscale transition-[filter] duration-500 ease-out group-hover:grayscale-0"
            />
          </figure>
        ) : (
          <div className="my-14 flex aspect-video items-center justify-center border border-dashed border-white/15 bg-white/[0.02] font-mono text-[12px] text-[#525252]">
            Cover · any ratio
          </div>
        )}

        {G.imageNote && (
          <div className="max-w-[720px] mx-auto py-4">
            <div className="font-mono text-[11px] tracking-[0.2em] text-[#525252] mb-4">{`// APPROACH`}</div>
            <p className="text-[clamp(16px,1.7vw,18px)] leading-[1.8] text-[#d4d4d4] text-balance-pretty">
              {G.imageNote}
            </p>
          </div>
        )}

        <div className="flex flex-col gap-8 mt-14 pb-20">
          {rows.map((row) => {
            const count = Math.min(4, Math.max(1, row.images.length));
            const heightClass = ROW_HEIGHT[count];
            return (
              <div key={row.id} className="flex flex-wrap gap-4">
                {row.images.map((img) => {
                  const media = img.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={img.url}
                      alt={img.cap || ""}
                      loading="lazy"
                      className={`block w-auto max-w-full grayscale transition-[filter] duration-500 ease-out group-hover:grayscale-0 ${heightClass}`}
                    />
                  ) : (
                    <div
                      className={`w-[260px] max-w-full flex items-center justify-center border border-dashed border-white/15 bg-white/[0.02] font-mono text-[11px] text-[#525252] ${heightClass}`}
                    >
                      Image
                    </div>
                  );
                  return (
                    <figure key={img.id} className="group m-0 flex flex-col">
                      {img.href ? (
                        <a href={img.href} target="_blank" rel="noreferrer" className="block" title="View on Instagram">
                          {media}
                        </a>
                      ) : (
                        media
                      )}
                      {img.cap && (
                        <figcaption className="font-mono text-[11px] text-[#525252] mt-3">
                          {img.cap}
                          {img.href && <span className="text-[#a3a3a3]"> · Instagram ↗</span>}
                        </figcaption>
                      )}
                    </figure>
                  );
                })}
              </div>
            );
          })}
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
