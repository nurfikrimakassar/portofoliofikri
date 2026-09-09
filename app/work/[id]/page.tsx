
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
        { k: "TYPE", v: "—" },
        { k: "ROLE", v: "—" },
        { k: "YEAR", v: item.year },
      ];
  const metaRows: typeof meta[] = [];
  for (let i = 0; i < meta.length; i += 3) metaRows.push(meta.slice(i, i + 3));

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-[#f5f5f5] font-sans overflow-x-hidden">
      <GridBackground />
      <Nav active="/work" />

      <header className="relative z-10 max-w-[1040px] mx-auto px-8 pt-36 max-[640px]:px-6 max-[640px]:pt-28">
        <Link href="/work" className="font-mono text-[12px] text-[#737373] no-underline hover-link">
          ← ~/fikri / work
        </Link>
        <div className="flex flex-wrap gap-3 items-center mt-8 mb-6 font-mono text-[11px] tracking-[0.1em] text-[#737373]">
          <span className="text-[#d4d4d4]">{item.cat}</span>
          <span className="text-[#3a3a3a]">/</span>
          <span>{item.year}</span>
        </div>
        <h1 className="text-[clamp(32px,5vw,54px)] font-bold tracking-[-0.035em] leading-[1.05]">{item.title}</h1>
        <p className="text-[clamp(17px,2vw,21px)] leading-[1.6] text-[#a3a3a3] mt-6">{item.desc}</p>

        {/* PROJECT FACTS */}
        <div className="mt-12">
          {metaRows.map((row, ri) => (
            <dl
              key={ri}
              className="grid grid-cols-3 gap-x-10 gap-y-6 py-6 border-t border-white/[0.08] max-[720px]:grid-cols-2 max-[480px]:grid-cols-1"
            >
              {row.map((m) => {
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
          ))}
          <div className="border-t border-white/[0.08]" />
        </div>

        {detail.link && detail.link !== "#" && (
          <a
            href={detail.link}
            target="_blank"
            rel="noreferrer"
            className="inline-flex mt-9 font-mono text-[12px] px-5 py-3 border border-white/20 text-[#f5f5f5] no-underline whitespace-nowrap hover-fill"
          >
            {detail.linkLabel || "VIEW LIVE"} ↗
          </a>
        )}
      </header>

      <div className="relative z-10 max-w-[1040px] mx-auto px-8 max-[640px]:px-6">
        <ImageSlot
          url={detail.cover}
          alt={`Cover ${item.title}`}
          placeholder="Cover image · 1600×900 (16:9)"
          className="block w-full aspect-video my-14"
        />
        <article className="flex flex-col gap-6 text-[17.5px] leading-[1.8] text-[#d4d4d4] max-w-[720px] mx-auto">
          <BlockBody body={detail.body || []} />
        </article>
      </div>

      <footer className="relative z-10 max-w-[1040px] mx-auto mt-20 px-8 pb-10 max-[640px]:px-6">
        <div className="flex justify-between items-center flex-wrap gap-4 font-mono text-[11px] text-[#525252] pt-7 border-t border-white/[0.08]">
          <Link href="/work" className="text-[#a3a3a3] no-underline hover-link">
            ← ALL PROJECTS
          </Link>
          <Link href="/contact" className="text-[#a3a3a3] no-underline hover-link">
            DISCUSS A PROJECT →
          </Link>
        </div>
      </footer>
    </div>
  );
}
