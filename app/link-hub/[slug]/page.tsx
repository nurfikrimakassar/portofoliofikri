import { notFound } from "next/navigation";
import GridBackground from "@/components/GridBackground";
import { getData } from "@/lib/data";
import { findGroupBySlug, groupSlug } from "@/lib/linkHub";

// Literal Tailwind classes per fact count (a template-literal class name
// wouldn't be picked up at build time) — each with its own responsive
// step-down so the box never gets cramped on a phone.
function factGridClass(count: number): string {
  if (count <= 1) return "grid-cols-1";
  if (count === 2) return "grid-cols-2 max-[380px]:grid-cols-1";
  if (count === 3) return "grid-cols-3 max-[560px]:grid-cols-2 max-[380px]:grid-cols-1";
  return "grid-cols-4 max-[640px]:grid-cols-2 max-[380px]:grid-cols-1";
}

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

      <div className="relative z-10 max-w-[1040px] mx-auto px-8 py-20 max-[640px]:px-6 max-[640px]:py-14">
        <h1 className="text-[clamp(30px,4.5vw,46px)] font-bold tracking-[-0.03em] leading-[1.1]">{g.title}</h1>

        {(() => {
          const facts = [
            g.role && { label: "ROLE", value: g.role },
            g.type && { label: "TYPE", value: g.type },
            g.location && { label: "LOCATION", value: g.location },
            g.duration && { label: "DURATION", value: g.duration },
          ].filter((f): f is { label: string; value: string } => Boolean(f));
          if (facts.length === 0) return null;
          return (
            // gap-px + bg draws the dividing lines as seams instead of
            // per-cell borders, so it stays correct no matter how the grid
            // wraps at each breakpoint (a border-right approach breaks the
            // moment a row wraps to fewer columns on a phone).
            <div className={`grid ${factGridClass(facts.length)} gap-px bg-white/10 border border-white/10 mt-10`}>
              {facts.map((f) => (
                <div key={f.label} className="bg-[#0a0a0a] px-6 py-6">
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

        {g.intro && <p className="text-[16px] leading-[1.65] text-[#a3a3a3] mt-12">{g.intro}</p>}

        <div className="mt-14">
          {g.links.length === 0 ? (
            <p className="font-mono text-[12px] text-[#525252]">Belum ada link di group ini.</p>
          ) : (
            <div className="divide-y divide-white/[0.08] border-t border-b border-white/[0.08]">
              {g.links.map((l) => (
                <div key={l.id} className="py-8 flex items-center justify-between gap-6 flex-wrap">
                  <span className="text-[21px] font-semibold tracking-[-0.01em]">{l.label}</span>
                  <a
                    href={l.url}
                    target="_blank"
                    rel="noreferrer"
                    className="shrink-0 font-mono text-[12px] px-5 py-3 border border-white/20 text-[#f5f5f5] no-underline whitespace-nowrap hover-fill"
                  >
                    VISIT LINK ↗
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
