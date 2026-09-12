import { Suspense } from "react";
import Link from "next/link";
import GridBackground from "@/components/GridBackground";
import { getData } from "@/lib/data";
import { getLinkHubPrefix } from "@/lib/linkHub";
import { LinkHubGroup } from "@/lib/types";

export async function generateMetadata() {
  const S = await getData();
  const { headline, description } = S.linkHub;
  return {
    title: headline || "Links — Fikri",
    description,
    openGraph: { title: headline, description },
    twitter: { card: "summary", title: headline, description },
    robots: { index: false, follow: false },
  };
}

// Reading the Host header (via getLinkHubPrefix) is a request-time API, so
// under Cache Components it has to sit behind its own Suspense boundary
// instead of blocking the whole page — the static shell above still
// prerenders, and just this list streams in.
async function GroupRows({ groups }: { groups: LinkHubGroup[] }) {
  const prefix = await getLinkHubPrefix();
  return (
    <div className="flex flex-col divide-y divide-white/[0.08] border-t border-b border-white/[0.08]">
      {groups.map((g) => {
        const slug = g.slug?.trim() || g.id;
        return (
          <div key={g.id} className="py-8 flex items-start justify-between gap-6 flex-wrap">
            <div className="max-w-[440px]">
              {(g.type || g.location) && (
                <div className="flex items-center gap-2.5 flex-wrap font-mono text-[11px] tracking-[0.1em] text-[#737373] mb-3">
                  {g.type && <span className="border border-white/18 text-[#d4d4d4] px-2 py-1">{g.type}</span>}
                  {g.location && <span>{g.location}</span>}
                </div>
              )}
              <h2 className="text-[21px] font-semibold tracking-[-0.01em] mb-1.5">{g.title}</h2>
              {g.intro && <p className="text-[14px] leading-[1.6] text-[#a3a3a3]">{g.intro}</p>}
            </div>
            <Link
              href={`${prefix}/${slug}`}
              className="shrink-0 font-mono text-[12px] px-5 py-3 border border-white/20 text-[#f5f5f5] no-underline whitespace-nowrap hover-fill"
            >
              VISIT LINK →
            </Link>
          </div>
        );
      })}
    </div>
  );
}

export default async function LinkHubPage() {
  const S = await getData();
  const hub = S.linkHub;
  const P = S.profile;

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-[#f5f5f5] font-sans overflow-x-hidden">
      <GridBackground />

      <div className="relative z-10 max-w-[720px] mx-auto px-8 py-20 max-[640px]:px-6 max-[640px]:py-14">
        <a
          href="https://nurfikri.com"
          className="inline-flex items-center gap-2.5 no-underline text-[#f5f5f5] mb-16 max-[640px]:mb-12"
        >
          <span className="inline-flex items-center justify-center w-[30px] h-[30px] border border-white/25 font-mono font-bold text-sm">
            F
          </span>
          <span className="font-mono text-[13px] tracking-[0.08em] text-[#a3a3a3]">nurfikri.com</span>
        </a>

        <h1 className="text-[clamp(30px,4.5vw,48px)] font-bold tracking-[-0.03em] leading-[1.1] mb-5">
          {hub.headline}
        </h1>
        {hub.description && (
          <p className="text-[16px] leading-[1.65] text-[#a3a3a3] max-w-[560px] mb-16 max-[640px]:mb-12">
            {hub.description}
          </p>
        )}

        {hub.groups.length === 0 ? (
          <p className="font-mono text-[12px] text-[#525252]">
            Belum ada group. Isi di Admin → nurfikri.com/admin → tab LINK HUB.
          </p>
        ) : (
          <Suspense fallback={<div className="font-mono text-[12px] text-[#525252]">Loading…</div>}>
            <GroupRows groups={hub.groups} />
          </Suspense>
        )}

        <div className="mt-16 pt-7 border-t border-white/[0.08] font-mono text-[11px] text-[#525252]">
          {P.name} · {P.location}
        </div>
      </div>
    </div>
  );
}
