import Link from "next/link";
import { notFound } from "next/navigation";
import GridBackground from "@/components/GridBackground";
import { getData } from "@/lib/data";
import { getLinkHubPrefix } from "@/lib/linkHub";

export async function generateStaticParams() {
  const S = await getData();
  return S.linkHub.groups.map((g) => ({ slug: g.slug?.trim() || g.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const S = await getData();
  const g = S.linkHub.groups.find((x) => (x.slug?.trim() || x.id) === slug);
  if (!g) return {};
  return {
    title: `${g.title} — ${S.linkHub.headline}`,
    description: g.intro,
    robots: { index: false, follow: false },
  };
}

export default async function LinkHubGroupPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const S = await getData();
  const g = S.linkHub.groups.find((x) => (x.slug?.trim() || x.id) === slug);
  if (!g) notFound();
  const prefix = await getLinkHubPrefix();

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-[#f5f5f5] font-sans overflow-x-hidden">
      <GridBackground />

      <div className="relative z-10 max-w-[720px] mx-auto px-8 py-20 max-[640px]:px-6 max-[640px]:py-14">
        <Link href={prefix || "/"} className="font-mono text-[12px] text-[#737373] no-underline hover-link">
          ← back
        </Link>

        {(g.type || g.location) && (
          <div className="flex items-center gap-2.5 flex-wrap font-mono text-[11px] tracking-[0.1em] text-[#737373] mt-8 mb-4">
            {g.type && <span className="border border-white/18 text-[#d4d4d4] px-2 py-1">{g.type}</span>}
            {g.location && <span>{g.location}</span>}
          </div>
        )}
        <h1 className="text-[clamp(28px,4vw,42px)] font-bold tracking-[-0.03em] leading-[1.1] mb-5">{g.title}</h1>
        {g.intro && <p className="text-[16px] leading-[1.65] text-[#a3a3a3] max-w-[560px] mb-14">{g.intro}</p>}

        {g.links.length === 0 ? (
          <p className="font-mono text-[12px] text-[#525252]">Belum ada link di group ini.</p>
        ) : (
          <div className="divide-y divide-white/[0.08] border-t border-b border-white/[0.08]">
            {g.links.map((l) => (
              <a
                key={l.id}
                href={l.url}
                target="_blank"
                rel="noreferrer"
                className="hover-row-tight flex justify-between items-center gap-5 py-5 no-underline text-[#f5f5f5]"
              >
                <span className="text-[16px] font-medium tracking-[-0.005em]">{l.label}</span>
                <span className="text-[16px] text-[#525252]">↗</span>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
