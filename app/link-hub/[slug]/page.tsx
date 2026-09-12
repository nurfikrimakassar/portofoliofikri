import { notFound } from "next/navigation";
import GridBackground from "@/components/GridBackground";
import { getData } from "@/lib/data";
import { findGroupBySlug, groupSlug } from "@/lib/linkHub";

export async function generateStaticParams() {
  const S = await getData();
  const slugs = S.linkHub.groups.map((_, i) => ({ slug: groupSlug(S.linkHub.groups, i) }));
  // Cache Components requires at least one static param at build time. Before
  // any group exists yet, fall back to a placeholder — real slugs still
  // render fine on demand (dynamicParams defaults to true), this one just
  // 404s via the lookup below if anyone ever hits it.
  return slugs.length > 0 ? slugs : [{ slug: "_placeholder" }];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const S = await getData();
  const g = findGroupBySlug(S.linkHub.groups, slug);
  if (!g) return {};
  return {
    title: `${g.title} — ${S.linkHub.headline}`,
    description: g.intro,
    openGraph: g.cover ? { images: [{ url: g.cover }] } : undefined,
    robots: { index: false, follow: false },
  };
}

export default async function LinkHubGroupPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const S = await getData();
  const g = findGroupBySlug(S.linkHub.groups, slug);
  if (!g) notFound();

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-[#f5f5f5] font-sans overflow-x-hidden">
      <GridBackground />

      <div className="relative z-10 max-w-[720px] mx-auto px-8 py-20 max-[640px]:px-6 max-[640px]:py-14">
        {g.type && (
          <div className="font-mono text-[11px] tracking-[0.2em] text-[#525252] mb-4">{`// ${g.type.toUpperCase()}`}</div>
        )}
        <h1 className="text-[clamp(30px,4.5vw,46px)] font-bold tracking-[-0.03em] leading-[1.1] mb-5">{g.title}</h1>
        {g.intro && <p className="text-[16px] leading-[1.65] text-[#a3a3a3]">{g.intro}</p>}

        {(g.type || g.location) && (
          <dl className="grid grid-cols-2 gap-x-10 gap-y-6 mt-10 pt-8 border-t border-white/[0.08] max-[480px]:grid-cols-1">
            {g.type && (
              <div>
                <dt className="font-mono text-[10.5px] tracking-[0.16em] text-[#525252] mb-1.5">TYPE</dt>
                <dd className="text-[14.5px] text-[#d4d4d4]">{g.type}</dd>
              </div>
            )}
            {g.location && (
              <div>
                <dt className="font-mono text-[10.5px] tracking-[0.16em] text-[#525252] mb-1.5">LOCATION</dt>
                <dd className="text-[14.5px] text-[#d4d4d4]">{g.location}</dd>
              </div>
            )}
          </dl>
        )}

        {g.cover && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={g.cover} alt={g.title} className="block w-full h-auto mt-12" />
        )}

        <div className="mt-14">
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
    </div>
  );
}
