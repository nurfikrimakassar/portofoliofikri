import { notFound } from "next/navigation";
import GridBackground from "@/components/GridBackground";
import { getData } from "@/lib/data";
import { findGroupBySlug, groupSlug } from "@/lib/linkHub";

// Matches the grid-cols count to a literal Tailwind class so it's picked up
// at build time (a template-literal class name wouldn't be).
const FACT_COLS: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
};

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
        <h1 className="text-[clamp(30px,4.5vw,46px)] font-bold tracking-[-0.03em] leading-[1.1] mb-5">{g.title}</h1>
        {g.intro && <p className="text-[16px] leading-[1.65] text-[#a3a3a3]">{g.intro}</p>}

        {(() => {
          const facts = [
            g.role && { label: "ROLE", value: g.role },
            g.type && { label: "TYPE", value: g.type },
            g.location && { label: "LOCATION", value: g.location },
            g.duration && { label: "DURATION", value: g.duration },
          ].filter((f): f is { label: string; value: string } => Boolean(f));
          if (facts.length === 0) return null;
          return (
            <div className={`grid ${FACT_COLS[facts.length]} border border-white/10 mt-10 max-[480px]:grid-cols-1`}>
              {facts.map((f, i) => (
                <div
                  key={f.label}
                  className={`px-6 py-6 ${
                    i < facts.length - 1 ? "border-r border-white/10 max-[480px]:border-r-0 max-[480px]:border-b" : ""
                  }`}
                >
                  <div className="font-mono text-[11px] tracking-[0.16em] text-[#525252] mb-2">{f.label}</div>
                  <div className="text-[15px] text-[#d4d4d4]">{f.value}</div>
                </div>
              ))}
            </div>
          );
        })()}

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
