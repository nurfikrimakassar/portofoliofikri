import GridBackground from "@/components/GridBackground";
import { getData } from "@/lib/data";

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
            Belum ada link. Isi di Admin → nurfikri.com/admin → tab LINK HUB.
          </p>
        ) : (
          <div className="flex flex-col gap-12">
            {hub.groups.map((g) => (
              <div key={g.id}>
                <div className="font-mono text-[11px] tracking-[0.2em] text-[#525252] mb-4 uppercase">{g.title}</div>
                <div className="divide-y divide-white/[0.08] border-t border-white/[0.08]">
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
              </div>
            ))}
          </div>
        )}

        <div className="mt-20 pt-7 border-t border-white/[0.08] font-mono text-[11px] text-[#525252]">
          {P.name} · {P.location}
        </div>
      </div>
    </div>
  );
}
