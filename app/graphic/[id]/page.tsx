import Link from "next/link";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import GridBackground from "@/components/GridBackground";
import { getData } from "@/lib/data";
import { GraphicContentBlock } from "@/lib/types";
import { migrateGraphicContent } from "@/lib/graphicContent";

// Each photo-row is a CSS grid with N equal-width columns, so the row always
// spans edge to edge; every image is w-full/h-auto, so its height simply
// follows from that shared width and its own aspect ratio.
const GRID_COLS: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2 max-[560px]:grid-cols-1",
  3: "grid-cols-3 max-[860px]:grid-cols-2 max-[520px]:grid-cols-1",
  4: "grid-cols-4 max-[980px]:grid-cols-3 max-[720px]:grid-cols-2 max-[460px]:grid-cols-1",
};

const DEMO_CONTENT: GraphicContentBlock[] = [
  {
    id: "demo-text",
    type: "text",
    text: "A short story about this piece — the brief, the concept, and the decisions behind it. Replace this in Admin → DETAIL → Graphic Design.",
  },
  {
    id: "demo-row-1",
    type: "row",
    images: [
      { id: "d1", cap: "Logo & wordmark" },
      { id: "d2", cap: "Palette & type" },
    ],
  },
  {
    id: "demo-row-2",
    type: "row",
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
  const firstRowImage = migrateGraphicContent(G).find(
    (b): b is Extract<GraphicContentBlock, { type: "row" }> => b.type === "row" && !!b.images[0]?.url,
  )?.images[0]?.url;
  return {
    title: item.title,
    description: G.desc?.slice(0, 160) || `${item.title} — Graphic design by Fikri`,
    openGraph: {
      title: item.title,
      description: G.desc?.slice(0, 160) || `${item.title} — Graphic design by Fikri`,
      images: G.cover ? [{ url: G.cover }] : firstRowImage ? [{ url: firstRowImage }] : [],
    },
  };
}

export default async function GraphicDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const S = await getData();
  const item = S.graphicWorks.find((g) => g.id === id);
  if (!item) notFound();
  const G = S.detail.graphic[id] || {};
  const content = G.content?.length || G.imageNote || G.galleryRows?.length ? migrateGraphicContent(G) : DEMO_CONTENT;
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
        <p className="text-[clamp(16px,1.8vw,20px)] leading-[1.6] text-[#a3a3a3] mt-6">
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
        <div className="flex flex-col gap-10 mt-14 pb-20">
          {content.map((blk) => {
            if (blk.type === "text") {
              return blk.text ? (
                <p key={blk.id} className="text-[clamp(16px,1.7vw,18px)] leading-[1.8] text-[#d4d4d4] text-balance-pretty">
                  {blk.text}
                </p>
              ) : null;
            }

            const count = Math.min(4, Math.max(1, blk.images.length));
            const gridClass = GRID_COLS[count];
            return (
              <div key={blk.id} className={`grid ${gridClass} gap-4`}>
                {blk.images.map((img) => {
                  const media = img.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={img.url}
                      alt={img.cap || ""}
                      loading="lazy"
                      className="block w-full h-auto grayscale transition-[filter] duration-500 ease-out group-hover:grayscale-0"
                    />
                  ) : (
                    <div className="aspect-[4/3] w-full flex items-center justify-center border border-dashed border-white/15 bg-white/[0.02] font-mono text-[11px] text-[#525252]">
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
