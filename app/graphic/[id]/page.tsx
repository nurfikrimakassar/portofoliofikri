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
    description: G.desc?.slice(0, 160) || `${item.title} — Graphic Design oleh Fikri`,
    openGraph: {
      title: item.title,
      description: G.desc?.slice(0, 160) || `${item.title} — Graphic Design oleh Fikri`,
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
        { id: "gg-2", cap: "Palet & tipografi" },
        { id: "gg-3", cap: "Kemasan / aplikasi" },
        { id: "gg-4", cap: "Materi sosial" },
        { id: "gg-5", cap: "Mockup akhir" },
      ];
  const meta = [
    { k: "CATEGORY", v: item.cat },
    { k: "YEAR", v: "2024" },
    { k: "TOOLS", v: "Illustrator · Figma" },
  ];

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-[#f5f5f5] font-sans overflow-x-hidden">
      <GridBackground />
      <Nav active="/work" />

      <header className="relative z-10 max-w-[1080px] mx-auto px-8 pt-[132px] max-[640px]:px-6 max-[640px]:pt-[104px]">
        <Link href="/work" className="font-mono text-[12.5px] text-[#737373] no-underline hover-link">
          ← ~/fikri / work / graphic
        </Link>
        <div className="grid grid-cols-[1.5fr_1fr] gap-12 items-end mt-7 max-[980px]:grid-cols-1 max-[980px]:gap-6">
          <div>
            <div className="font-mono text-xs tracking-[0.15em] text-[#525252] mb-4">{`// ${item.cat.toUpperCase()}`}</div>
            <h1 className="text-[clamp(34px,5.5vw,62px)] font-bold tracking-[-0.03em] leading-[1.02]">{item.title}</h1>
            <p className="text-[clamp(16px,1.8vw,19px)] leading-[1.6] text-[#a3a3a3] mt-5 max-w-[520px]">
              {G.desc || "Identitas visual untuk kedai kopi lokal: logo, palet monokrom, sistem kemasan, dan materi sosial yang konsisten."}
            </p>
            <a
              href={G.link || "#"}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2.5 mt-6 px-[22px] py-[13px] bg-[#f5f5f5] text-[#0a0a0a] no-underline font-mono text-[12.5px] font-semibold tracking-[0.04em] hover-fill"
            >
              {G.linkLabel || "LIHAT PORTO LENGKAP"} ↗︎
            </a>
          </div>
          <div className="flex flex-col gap-px bg-white/8 border border-white/8">
            {meta.map((m) => (
              <div key={m.k} className="bg-[#0a0a0a] px-5 py-4 flex justify-between gap-4">
                <span className="font-mono text-[11.5px] text-[#525252]">{m.k}</span>
                <span className="text-sm text-[#d4d4d4] text-right">{m.v}</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-[1080px] mx-auto px-8 max-[640px]:px-6">
        <ImageSlot
          url={G.cover}
          alt={`Sampul ${item.title}`}
          placeholder="Sampul / cover · ratio bebas"
          fit="contain"
          className="block w-full h-[540px] my-10 border border-white/12"
        />

        <div className="grid grid-cols-[auto_1fr] gap-5 items-start py-5">
          <div className="font-mono text-[11.5px] tracking-[0.15em] text-[#525252] whitespace-nowrap pt-1">{`// TENTANG KARYA`}</div>
          <p className="text-[clamp(15px,1.7vw,18px)] leading-[1.7] text-[#d4d4d4] text-balance-pretty">
            {G.imageNote ||
              "Penjelasan singkat tentang gambar-gambar di bawah: konsep visual, proses, dan keputusan desain yang diambil."}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6 max-[980px]:grid-cols-1 pb-16">
          {gallery.map((g) => (
            <figure key={g.id} className="m-0">
              <ImageSlot
                url={g.url}
                alt={g.cap}
                placeholder="Desain · ratio bebas"
                fit="contain"
                className="block w-full h-[340px] border border-white/12"
              />
              <figcaption className="font-mono text-[11.5px] text-[#525252] mt-3">{g.cap}</figcaption>
            </figure>
          ))}
        </div>
      </div>

      <footer className="relative z-10 max-w-[1080px] mx-auto px-8 pb-10 max-[640px]:px-6">
        <div className="flex justify-between items-center flex-wrap gap-4 font-mono text-xs text-[#525252] pt-6 border-t border-white/10">
          <Link href="/work" className="text-[#a3a3a3] no-underline hover-link">
            ← SEMUA WORK
          </Link>
          <Link href="/contact" className="text-[#a3a3a3] no-underline hover-link">
            MULAI PROJECT DESAIN →
          </Link>
        </div>
      </footer>
    </div>
  );
}
