
import Link from "next/link";
import Image from "next/image";
import Nav from "@/components/Nav";
import GridBackground from "@/components/GridBackground";
import { LiveClock, RoleTyping } from "@/components/HeroBits";
import { getData } from "@/lib/data";

const MONTHS: Record<string, number> = {
  JAN:1,FEB:2,MAR:3,APR:4,MEI:5,MAY:5,JUN:6,
  JUL:7,AGU:8,AUG:8,SEP:9,OKT:10,OCT:10,NOV:11,DES:12,DEC:12,
};
function parsePeriodStart(period: string): number {
  const start = period.split(/\s*[—–-]\s*/)[0].trim();
  const [mon, yr] = start.split(/\s+/);
  const month = MONTHS[mon?.toUpperCase()] ?? 0;
  const year = parseInt((yr ?? "").replace(/\D/g, "").slice(0, 4)) || 0;
  return year * 100 + month;
}
function sortExperience<T extends { period: string }>(list: T[]): T[] {
  return [...list].sort((a, b) => {
    const aNow = /now/i.test(a.period) ? 1 : 0;
    const bNow = /now/i.test(b.period) ? 1 : 0;
    if (bNow !== aNow) return bNow - aNow;
    return parsePeriodStart(b.period) - parsePeriodStart(a.period);
  });
}

export default async function HomePage() {
  const S = await getData();
  const { profile: P, stats: ST, tools, webWorks, products, blog } = S;
  const experience = sortExperience(S.experience);
  const featured = blog.posts.find((p) => p.id === blog.featuredId) || blog.posts[0];
  const blogPreview = [featured, ...blog.posts.filter((p) => p.id !== featured?.id)].filter(Boolean).slice(0, 3) as typeof blog.posts;

  const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://portofoliofikri-ebon.vercel.app";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: P.name || "Nurfikri",
    url: BASE,
    jobTitle: "Web Developer & Automation Engineer",
    description: P.tagline,
    address: { "@type": "PostalAddress", addressLocality: "Makassar", addressCountry: "ID" },
    sameAs: [P.linkedinUrl, P.githubUrl, P.instagramUrl, P.tiktokUrl].filter(Boolean),
    knowsAbout: ["Web Development", "Automation", "Graphic Design", "Notion", "Next.js"],
  };

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-[#f5f5f5] font-sans overflow-x-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <GridBackground />
      <Nav active="/" />

      {/* HERO */}
      <header
        data-r="hero"
        className="relative z-10 max-w-[1280px] mx-auto px-8 pt-32 pb-20 grid grid-cols-[1.4fr_1fr] gap-14 items-center max-[980px]:grid-cols-1 max-[980px]:gap-11 max-[640px]:px-5 max-[640px]:pt-[108px] max-[640px]:pb-12"
      >
        <div>
          <div className="flex items-center gap-2.5 font-mono text-[12.5px] text-[#737373] mb-7 flex-wrap">
            <span
              className="w-[7px] h-[7px] rounded-full bg-[#f5f5f5]"
              style={{ boxShadow: "0 0 8px #f5f5f5" }}
            />
            <span>AVAILABLE FOR WORK</span>
            <span className="text-[#404040]">·</span>
            <span>MAKASSAR, ID</span>
            <span className="text-[#404040]">·</span>
            <LiveClock />
          </div>
          <h1 className="text-[clamp(48px,7vw,104px)] leading-[0.95] font-bold tracking-[-0.03em] mb-6">
            {P.name}
          </h1>
          <div className="h-[38px] overflow-hidden mb-7 font-mono text-[clamp(16px,2.2vw,22px)] text-[#d4d4d4]">
            <span className="text-[#525252]">&gt;</span> <RoleTyping roles={P.roles} />
          </div>
          <p className="max-w-[520px] text-[clamp(15px,1.5vw,18px)] leading-[1.6] text-[#a3a3a3]">
            {P.tagline}
          </p>
          <div className="flex gap-3.5 mt-9 font-mono text-[13px] flex-wrap max-[395px]:flex-col">
            <Link
              href="/work"
              className="px-6 py-[13px] bg-[#f5f5f5] text-[#0a0a0a] no-underline font-semibold tracking-[0.04em] hover-fill max-[395px]:text-center"
            >
              VIEW WORK →
            </Link>
            <Link
              href="/products"
              className="px-6 py-[13px] border border-white/25 text-[#f5f5f5] no-underline tracking-[0.04em] hover-outline max-[395px]:text-center"
            >
              DIGITAL PRODUCTS
            </Link>
          </div>
        </div>
        <div className="relative">
          <div className="relative border border-white/12 p-2.5 bg-white/[0.02]">
            <div className="absolute -top-px -left-px w-3.5 h-3.5 border-t-2 border-l-2 border-[#f5f5f5]" />
            <div className="absolute -top-px -right-px w-3.5 h-3.5 border-t-2 border-r-2 border-[#f5f5f5]" />
            <div className="absolute -bottom-px -left-px w-3.5 h-3.5 border-b-2 border-l-2 border-[#f5f5f5]" />
            <div className="absolute -bottom-px -right-px w-3.5 h-3.5 border-b-2 border-r-2 border-[#f5f5f5]" />
            <div className="relative w-full aspect-[4/5]">
              <Image
                src="/fikri.jpg"
                alt="Fikri"
                fill
                priority
                sizes="(max-width: 980px) 100vw, 45vw"
                style={{ objectFit: "cover", filter: "grayscale(1) contrast(1.05)" }}
              />
            </div>
            <div className="absolute bottom-[18px] left-[18px] right-[18px] flex justify-between font-mono text-[11px] text-[#e5e5e5]" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>
              <span>FIKRI.JPG</span>
              <span>● REC</span>
            </div>
          </div>
        </div>
      </header>

      {/* INFO STRIP */}
      <section className="relative z-10 max-w-[1280px] mx-auto px-8 max-[640px]:px-6">
        <div data-r="strip" className="grid grid-cols-3 border border-white/8 max-[640px]:grid-cols-1">
          <div className="px-6 py-[22px] border-r border-white/8 font-mono max-[640px]:border-r-0 max-[640px]:border-b">
            <div className="text-xs text-[#525252] mb-2">BASED IN</div>
            <div className="text-[15px] text-[#d4d4d4]">{P.location}</div>
          </div>
          <div className="px-6 py-[22px] border-r border-white/8 font-mono max-[640px]:border-r-0 max-[640px]:border-b">
            <div className="text-xs text-[#525252] mb-2">STUDY</div>
            <div className="text-[15px] text-[#d4d4d4]">{P.study}</div>
          </div>
          <div className="px-6 py-[22px] font-mono">
            <div className="text-xs text-[#525252] mb-2">STATUS</div>
            <div className="text-[15px] text-[#d4d4d4]">{P.status}</div>
          </div>
        </div>
      </section>

      {/* TICKER */}
      <section className="relative z-10 mt-10 border-y border-white/8 bg-[#0a0a0a]">
        <div className="max-w-[1280px] mx-auto px-8 max-[640px]:px-6">
          <div className="py-3.5 font-mono text-[11px] tracking-[0.15em] text-[#525252]">STACK &amp; TOOLS</div>
          <div className="relative overflow-hidden border-t border-white/6">
            <div className="ticker-track flex w-max">
              {[0, 1].map((dup) => (
                <span key={dup} className="flex">
                  {tools.map((tl, i) => (
                    <span
                      key={`${dup}-${i}`}
                      className="flex items-center gap-[22px] px-[22px] py-[18px] font-mono text-[clamp(18px,2vw,26px)] text-[#d4d4d4] whitespace-nowrap"
                    >
                      {tl}
                      <span className="text-[#404040]">/</span>
                    </span>
                  ))}
                </span>
              ))}
            </div>
            <div className="absolute left-0 top-0 bottom-0 w-[90px] pointer-events-none z-10" style={{ background: "linear-gradient(90deg,#0a0a0a 0%,rgba(10,10,10,0) 100%)" }} />
            <div className="absolute right-0 top-0 bottom-0 w-[90px] pointer-events-none z-10" style={{ background: "linear-gradient(270deg,#0a0a0a 0%,rgba(10,10,10,0) 100%)" }} />
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="relative z-10 max-w-[1280px] mx-auto px-8 py-[72px] max-[640px]:px-6 max-[640px]:py-14">
        <div className="font-mono text-[13px] tracking-[0.15em] text-[#737373] mb-9">{`// ABOUT`}</div>
        <div data-r="intro" className="grid grid-cols-[1.35fr_1fr] gap-14 items-start max-[980px]:grid-cols-1 max-[980px]:gap-9">
          <div>
            <h2 className="text-[clamp(25px,3vw,38px)] font-semibold leading-[1.35] tracking-[-0.01em] mb-6">
              Bringing together an engineer&apos;s precision and a designer&apos;s eye, while automation handles the rest.
            </h2>
            <p className="text-[16.5px] leading-[1.7] text-[#a3a3a3]">
              Informatics Engineering student at Hasanuddin University, Makassar, who has gained diverse experience over the past few years as a <span className="text-[#f5f5f5] font-semibold">developer</span>, <span className="text-[#f5f5f5] font-semibold">product management</span>, <span className="text-[#f5f5f5] font-semibold">designer</span>, <span className="text-[#f5f5f5] font-semibold">teacher</span>, and <span className="text-[#f5f5f5] font-semibold">journalist</span>. The common thread is simple: solving problems through well-structured systems.
            </p>
          </div>
          <div data-r="stats" className="grid grid-cols-2 gap-px bg-white/8 border border-white/8">
            {[
              [ST.roles, "PROFESSIONAL ROLES"],
              [ST.projects, "COMPLETED PROJECTS"],
              [ST.automations, "ACTIVE AUTOMATIONS"],
              [ST.products, "DIGITAL PRODUCTS"],
            ].map(([val, label]) => (
              <div key={label} className="bg-[#0a0a0a] px-[30px] py-[34px]">
                <div className="text-[clamp(44px,5vw,60px)] font-bold tracking-[-0.03em] leading-none">{val}</div>
                <div className="font-mono text-xs text-[#737373] mt-3.5">{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 font-mono text-[11.5px] tracking-[0.15em] text-[#737373] mb-6">EXPERIENCE.LOG</div>
        {experience.map((job, i) => (
          <div
            key={i}
            data-r="exprow"
            className="grid grid-cols-[160px_1fr_auto] gap-6 items-baseline py-[22px] border-t border-white/8 max-[640px]:grid-cols-1 max-[640px]:gap-1.5"
          >
            <span className="font-mono text-[12.5px] text-[#737373]">{job.period}</span>
            <div>
              <div className="text-[19px] font-semibold tracking-[-0.01em]">{job.role}</div>
              <div className="text-sm text-[#a3a3a3] mt-1.5">{job.org}</div>
            </div>
            <span className="font-mono text-[11px] text-[#525252] border border-white/12 px-2.5 py-1.5 whitespace-nowrap w-fit">
              {job.tag}
            </span>
          </div>
        ))}
        <div className="border-t border-white/8" />
      </section>

      {/* SELECTED WORK */}
      <section className="relative z-10 max-w-[1280px] mx-auto px-8 py-[72px] border-t border-white/8 max-[640px]:px-6 max-[640px]:py-14">
        <div className="flex justify-between items-end flex-wrap gap-4 mb-9">
          <div>
            <div className="font-mono text-[13px] tracking-[0.15em] text-[#737373] mb-3.5">{`// SELECTED WORK`}</div>
            <h2 className="text-[clamp(30px,4vw,52px)] font-bold tracking-[-0.03em]">Highlight Project</h2>
          </div>
          <Link href="/work" className="font-mono text-[12.5px] text-[#a3a3a3] no-underline border-b border-white/20 pb-1 hover-link">
            VIEW ALL WORK →
          </Link>
        </div>
        {webWorks.slice(0, 3).map((w) => (
          <Link
            key={w.id}
            href={`/work/${w.id}`}
            data-r="workrow"
            className="hover-row grid grid-cols-[auto_1fr_auto] gap-8 items-center py-[30px] px-4 border-t border-white/10 no-underline text-[#f5f5f5] max-[640px]:grid-cols-1 max-[640px]:gap-2.5"
          >
            <span className="font-mono text-[13px] text-[#525252]">{w.idx}</span>
            <div>
              <div className="flex items-baseline gap-4 flex-wrap">
                <span className="text-[clamp(20px,2.6vw,30px)] font-semibold tracking-[-0.02em]">{w.title}</span>
                <span className="font-mono text-xs text-[#737373]">{w.cat}</span>
              </div>
              <p className="text-[14.5px] text-[#a3a3a3] mt-1.5 max-w-[540px]">{w.desc}</p>
            </div>
            <span className="text-[22px] text-[#737373]">↗︎</span>
          </Link>
        ))}
        <div className="border-t border-white/10" />
      </section>

      {/* DIGITAL PRODUCTS (light) */}
      <section className="relative z-10 border-t border-white/8 bg-[#f5f5f5] text-[#0a0a0a]">
        <div className="max-w-[1280px] mx-auto px-8 py-[72px] max-[640px]:px-6 max-[640px]:py-14">
          <div className="flex justify-between items-end flex-wrap gap-4 mb-9">
            <div>
              <div className="font-mono text-[13px] tracking-[0.15em] text-[#737373] mb-3.5">{`// DIGITAL PRODUCTS`}</div>
              <h2 className="text-[clamp(30px,4vw,52px)] font-bold tracking-[-0.03em]">Template &amp; Automation</h2>
            </div>
            <Link href="/products" className="font-mono text-[12.5px] text-[#525252] no-underline border-b pb-1" style={{ borderColor: "rgba(0,0,0,0.2)" }}>
              VIEW ALL PRODUCTS →
            </Link>
          </div>
          <div data-r="three" className="grid grid-cols-3 gap-5 max-[980px]:grid-cols-2 max-[640px]:grid-cols-1">
            {products.slice(0, 3).map((p, i) => (
              <div key={i} className="hover-card flex flex-col border border-black/14 bg-white p-[26px] h-[300px] transition-colors">
                <div className="flex justify-between items-center mb-5 font-mono text-[11.5px] text-[#737373]">
                  <span>{p.idx}</span>
                  <span className="px-2.5 py-1 bg-[#0a0a0a] text-[#f5f5f5]">{p.stat}</span>
                </div>
                <h3 className="text-[21px] font-bold tracking-[-0.01em] mb-2.5">{p.title}</h3>
                <p className="text-sm leading-[1.6] text-[#404040] line-clamp-3">{p.desc}</p>
                <div className="flex justify-between items-center pt-[18px] mt-auto border-t border-black/10">
                  <span className="text-[19px] font-bold">{p.price}</span>
                  <Link href={`/products/digital/${p.idx.toLowerCase()}`} className="font-mono text-xs px-3.5 py-2.5 bg-[#0a0a0a] text-[#f5f5f5] no-underline">
                    GET →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LATEST BLOG */}
      <section className="relative z-10 max-w-[1280px] mx-auto px-8 py-[72px] border-t border-white/8 max-[640px]:px-6 max-[640px]:py-14">
        <div className="flex justify-between items-end flex-wrap gap-4 mb-2">
          <div>
            <div className="font-mono text-[13px] tracking-[0.15em] text-[#737373] mb-3.5">{`// LATEST WRITING`}</div>
            <h2 className="text-[clamp(28px,3.4vw,44px)] font-bold tracking-[-0.03em]">Some Blogs</h2>
          </div>
          <Link href="/blog" className="font-mono text-[12.5px] text-[#a3a3a3] no-underline border-b border-white/20 pb-1 hover-link">
            READ THE BLOG →
          </Link>
        </div>
        {blogPreview.map((b) => (
          <Link
            key={b.id}
            href={`/blog/${b.id}`}
            className="hover-row-tight flex justify-between gap-5 items-baseline py-6 px-4 border-t border-white/10 no-underline text-[#f5f5f5]"
          >
            <span className="text-[clamp(17px,2vw,22px)] font-medium tracking-[-0.01em]">{b.title}</span>
            <span className="font-mono text-xs text-[#525252] whitespace-nowrap">{b.date}</span>
          </Link>
        ))}
      </section>

      {/* FOOTER CTA */}
      <footer data-r="cta" className="relative z-10 border-t border-white/8">
        <div className="max-w-[1280px] mx-auto px-8 pt-[90px] pb-10 max-[640px]:px-6 max-[640px]:pt-16 max-[640px]:pb-10">
          <div className="font-mono text-[13px] text-[#737373] mb-6">{`// LET'S BUILD SOMETHING`}</div>
          <h2 className="text-[clamp(40px,8vw,120px)] font-bold tracking-[-0.04em] leading-[0.95] mb-8 max-[640px]:text-5xl">
            GET IN
            <br />
            TOUCH<span className="text-[#525252]">.</span>
          </h2>
          <Link
            href="/contact"
            className="inline-flex items-center gap-3 px-[30px] py-4 bg-[#f5f5f5] text-[#0a0a0a] no-underline font-mono text-sm font-semibold tracking-[0.04em] mb-[60px] hover-fill"
          >
            START A PROJECT →
          </Link>
          <div className="flex justify-between items-center flex-wrap gap-4 font-mono text-xs text-[#525252] pt-6 border-t border-white/8">
            <span>© 2024 FIKRI · MAKASSAR, ID</span>
            <span>DESIGNED &amp; BUILT WITH INTENT · NEXT.JS</span>
            <a href="#" className="text-[#a3a3a3] no-underline hover-link">
              BACK TO TOP ↑
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
