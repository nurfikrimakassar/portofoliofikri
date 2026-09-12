
import Link from "next/link";
import Image from "next/image";
import Nav from "@/components/Nav";
import GridBackground from "@/components/GridBackground";
import GridTexture from "@/components/GridTexture";
import BlogCarousel from "@/components/BlogCarousel";
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
  const graphicHighlights = S.graphicWorks.slice(0, 6).map((g) => ({
    id: g.id,
    title: g.title,
    cat: g.cat,
    cover: S.detail.graphic[g.id]?.cover ?? null,
  }));
  const featured = blog.posts.find((p) => p.id === blog.featuredId) || blog.posts[0];
  const blogPreview = [featured, ...blog.posts.filter((p) => p.id !== featured?.id)].filter(Boolean).slice(0, 3) as typeof blog.posts;
  const blogCards = blogPreview.map((b) => ({
    id: b.id,
    title: b.title,
    excerpt: b.excerpt,
    date: b.date,
    read: b.read,
    cat: b.cat,
    cover: S.detail.blog[b.id]?.cover ?? null,
    featured: b.id === featured?.id,
  }));
  const photos = (S.photoStrip || []).filter(Boolean);
  const photoMid = Math.ceil(photos.length / 2);
  const photoRowA = photos.slice(0, photoMid);
  const photoRowB = photos.slice(photoMid).length ? photos.slice(photoMid) : photoRowA;

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

  const container = "relative z-10 max-w-[1180px] mx-auto px-8 max-[640px]:px-5";

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-[#f5f5f5] font-sans overflow-x-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <GridBackground />
      <Nav active="/" />

      {/* HERO */}
      <header
        data-r="hero"
        className={`${container} pt-36 pb-16 max-[640px]:pt-28 max-[640px]:pb-12`}
      >
        <GridTexture />
        <div className="relative z-10 grid grid-cols-[1.5fr_0.85fr] gap-16 items-center max-[980px]:grid-cols-1 max-[980px]:gap-12">
        <div>
          <div className="flex items-center gap-2.5 font-mono text-[12px] text-[#737373] mb-8 flex-wrap">
            <span
              className="w-[6px] h-[6px] rounded-full bg-[#f5f5f5]"
              style={{ boxShadow: "0 0 8px #f5f5f5" }}
            />
            <span>AVAILABLE FOR WORK</span>
            <span className="text-[#3a3a3a]">/</span>
            <span>MAKASSAR, ID</span>
            <span className="text-[#3a3a3a]">/</span>
            <LiveClock />
          </div>
          <h1 className="text-[clamp(46px,7vw,100px)] leading-[0.98] font-bold tracking-[-0.035em] mb-7">
            {P.name}
          </h1>
          <div className="h-[34px] overflow-hidden mb-8 max-[640px]:mb-5 font-mono text-[clamp(15px,2vw,20px)] text-[#d4d4d4]">
            <span className="text-[#525252]">&gt;</span> <RoleTyping roles={P.roles} />
          </div>
          <p className="max-w-[520px] text-[clamp(15px,1.5vw,18px)] leading-[1.65] text-[#a3a3a3]">
            {P.tagline}
          </p>
          <div className="flex gap-3.5 mt-10 font-mono text-[13px] flex-wrap max-[395px]:flex-col">
            <Link
              href="/work"
              className="px-6 py-[13px] bg-[#f5f5f5] text-[#0a0a0a] no-underline font-semibold tracking-[0.04em] hover-fill max-[395px]:text-center"
            >
              VIEW WORK →
            </Link>
            <Link
              href="/products"
              className="px-6 py-[13px] border border-white/20 text-[#f5f5f5] no-underline tracking-[0.04em] hover-outline max-[395px]:text-center"
            >
              DIGITAL PRODUCTS
            </Link>
          </div>
        </div>
        <div>
          <div className="relative w-full aspect-[4/5]">
            <Image
              src="/fikri.jpg"
              alt="Fikri"
              fill
              priority
              sizes="(max-width: 980px) 100vw, 28vw"
              style={{ objectFit: "cover", filter: "grayscale(1) contrast(1.03)" }}
            />
          </div>
          <div className="mt-3 flex justify-between font-mono text-[11px] text-[#737373]">
            <span>FIKRI.JPG</span>
            <span>MAKASSAR · ID</span>
          </div>
        </div>
        </div>
      </header>

      {/* INFO STRIP */}
      <section className={container}>
        <div data-r="strip" className="grid grid-cols-3 border border-white/10 font-mono max-[640px]:grid-cols-1">
          <div className="px-6 py-6 border-r border-white/10 max-[640px]:border-r-0 max-[640px]:border-b">
            <div className="text-[11px] tracking-[0.16em] text-[#525252] mb-2">BASED IN</div>
            <div className="text-[15px] text-[#d4d4d4]">{P.location}</div>
          </div>
          <div className="px-6 py-6 border-r border-white/10 max-[640px]:border-r-0 max-[640px]:border-b">
            <div className="text-[11px] tracking-[0.16em] text-[#525252] mb-2">STUDY</div>
            <div className="text-[15px] text-[#d4d4d4]">{P.study}</div>
          </div>
          <div className="px-6 py-6">
            <div className="text-[11px] tracking-[0.16em] text-[#525252] mb-2">STATUS</div>
            <div className="text-[15px] text-[#d4d4d4]">{P.status}</div>
          </div>
        </div>
      </section>

      {/* TICKER */}
      <section className="relative z-10 mt-20">
        <div className={container}>
          <div className="font-mono text-[11px] tracking-[0.2em] text-[#525252] mb-5">STACK &amp; TOOLS</div>
        </div>
        <div className="relative overflow-hidden border-y border-white/[0.07]">
          <div className="ticker-track flex w-max">
            {[0, 1].map((dup) => (
              <span key={dup} className="flex">
                {tools.map((tl, i) => (
                  <span
                    key={`${dup}-${i}`}
                    className="flex items-center gap-6 px-6 py-5 font-mono text-[clamp(16px,1.8vw,22px)] text-[#d4d4d4] whitespace-nowrap"
                  >
                    {tl}
                    <span className="text-[#333]">/</span>
                  </span>
                ))}
              </span>
            ))}
          </div>
          <div className="absolute left-0 top-0 bottom-0 w-[34vw] max-w-[420px] min-w-[150px] max-[640px]:w-[14vw] max-[640px]:min-w-[50px] max-[640px]:max-w-[90px] pointer-events-none z-10" style={{ background: "linear-gradient(90deg,#0a0a0a 0%,#0a0a0a 45%,rgba(10,10,10,0) 100%)" }} />
          <div className="absolute right-0 top-0 bottom-0 w-[34vw] max-w-[420px] min-w-[150px] max-[640px]:w-[14vw] max-[640px]:min-w-[50px] max-[640px]:max-w-[90px] pointer-events-none z-10" style={{ background: "linear-gradient(270deg,#0a0a0a 0%,#0a0a0a 45%,rgba(10,10,10,0) 100%)" }} />
        </div>
      </section>

      {/* ABOUT */}
      <section className={`${container} py-28 max-[640px]:py-16`}>
        <div className="font-mono text-[12px] tracking-[0.2em] text-[#737373] mb-10 max-[640px]:mb-6">{`// ABOUT`}</div>
        <div data-r="intro" className="grid grid-cols-[1.4fr_1fr] gap-16 items-start max-[980px]:grid-cols-1 max-[980px]:gap-10">
          <div>
            <h2 className="text-[clamp(24px,3vw,36px)] font-semibold leading-[1.4] tracking-[-0.01em] mb-7">
              Bringing together an engineer&apos;s precision and a designer&apos;s eye, while automation handles the rest.
            </h2>
            <p className="text-[16.5px] leading-[1.75] text-[#a3a3a3]">
              Informatics Engineering student at Hasanuddin University, Makassar, who has gained diverse experience over the past few years as a <span className="text-[#f5f5f5] font-semibold">developer</span>, <span className="text-[#f5f5f5] font-semibold">product management</span>, <span className="text-[#f5f5f5] font-semibold">designer</span>, <span className="text-[#f5f5f5] font-semibold">teacher</span>, and <span className="text-[#f5f5f5] font-semibold">journalist</span>. The common thread is simple: solving problems through well-structured systems.
            </p>
          </div>
          <div data-r="stats" className="grid grid-cols-2 border border-white/10">
            {[
              [ST.roles, "PROFESSIONAL ROLES"],
              [ST.projects, "COMPLETED PROJECTS"],
              [ST.automations, "ACTIVE AUTOMATIONS"],
              [ST.products, "DIGITAL PRODUCTS"],
            ].map(([val, label], i) => (
              <div
                key={label}
                className={`px-7 py-8 ${i % 2 === 0 ? "border-r border-white/10" : ""} ${i < 2 ? "border-b border-white/10" : ""}`}
              >
                <div className="text-[clamp(40px,5vw,56px)] font-bold tracking-[-0.03em] leading-none">{val}</div>
                <div className="font-mono text-[11px] tracking-[0.12em] text-[#737373] mt-3.5">{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-24 font-mono text-[12px] tracking-[0.2em] text-[#737373] mb-2">EXPERIENCE</div>
        <div className="divide-y divide-white/[0.06]">
          {experience.map((job, i) => (
            <div
              key={i}
              data-r="exprow"
              className="grid grid-cols-[170px_1fr_auto] gap-6 items-baseline py-6 max-[640px]:grid-cols-1 max-[640px]:gap-1.5"
            >
              <span className="font-mono text-[12px] text-[#737373]">{job.period}</span>
              <div>
                <div className="text-[18px] font-semibold tracking-[-0.01em]">{job.role}</div>
                <div className="text-[14px] text-[#a3a3a3] mt-1.5">{job.org}</div>
              </div>
              <span className="font-mono text-[11px] tracking-[0.12em] text-[#525252] whitespace-nowrap">
                {job.tag}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* PHOTO STRIP */}
      {photos.length > 0 && (
        <section className="relative z-10 mb-4">
          <div className={container}>
            <div className="font-mono text-[11px] tracking-[0.2em] text-[#525252] mb-5">{`// IN FRAME`}</div>
          </div>
          <div className="relative overflow-hidden">
            <div className="flex flex-col gap-4">
              <div className="photo-row-a flex w-max gap-4">
                {[0, 1].map((dup) => (
                  <span key={dup} className="flex gap-4">
                    {photoRowA.map((src, i) => (
                      <span
                        key={`a-${dup}-${i}`}
                        className="block w-[300px] h-[220px] shrink-0 overflow-hidden max-[640px]:w-[240px] max-[640px]:h-[180px]"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={src} alt="" className="block w-full h-full object-cover grayscale contrast-[1.05]" />
                      </span>
                    ))}
                  </span>
                ))}
              </div>
              <div className="photo-row-b flex w-max gap-4">
                {[0, 1].map((dup) => (
                  <span key={dup} className="flex gap-4">
                    {photoRowB.map((src, i) => (
                      <span
                        key={`b-${dup}-${i}`}
                        className="block w-[300px] h-[220px] shrink-0 overflow-hidden max-[640px]:w-[240px] max-[640px]:h-[180px]"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={src} alt="" className="block w-full h-full object-cover grayscale contrast-[1.05]" />
                      </span>
                    ))}
                  </span>
                ))}
              </div>
            </div>
            <div
              className="absolute inset-0 pointer-events-none z-10"
              style={{
                background:
                  "linear-gradient(180deg,rgba(10,10,10,0.6) 0%,rgba(10,10,10,0) 28%,rgba(10,10,10,0) 72%,rgba(10,10,10,0.6) 100%)",
              }}
            />
            <div className="absolute left-0 top-0 bottom-0 w-[36vw] max-w-[460px] min-w-[160px] max-[640px]:w-[15vw] max-[640px]:min-w-[55px] max-[640px]:max-w-[95px] pointer-events-none z-10" style={{ background: "linear-gradient(90deg,#0a0a0a 0%,#0a0a0a 47%,rgba(10,10,10,0) 100%)" }} />
            <div className="absolute right-0 top-0 bottom-0 w-[36vw] max-w-[460px] min-w-[160px] max-[640px]:w-[15vw] max-[640px]:min-w-[55px] max-[640px]:max-w-[95px] pointer-events-none z-10" style={{ background: "linear-gradient(270deg,#0a0a0a 0%,#0a0a0a 47%,rgba(10,10,10,0) 100%)" }} />
          </div>
        </section>
      )}

      {/* SELECTED WORK */}
      <section className={`${container} py-28 max-[640px]:py-16`}>
        <div className="flex justify-between items-end flex-wrap gap-4 mb-12">
          <div>
            <div className="font-mono text-[12px] tracking-[0.2em] text-[#737373] mb-4">{`// SELECTED WORK`}</div>
            <h2 className="text-[clamp(30px,4vw,52px)] font-bold tracking-[-0.03em]">Highlight Projects</h2>
          </div>
          <Link href="/work" className="font-mono text-[12px] text-[#a3a3a3] no-underline border-b border-white/20 pb-1 hover-link">
            VIEW ALL WORK →
          </Link>
        </div>
        <div className="divide-y divide-white/[0.07]">
          {webWorks.slice(0, 3).map((w) => (
            <Link
              key={w.id}
              href={`/work/${w.id}`}
              data-r="workrow"
              className="hover-row grid grid-cols-[auto_1fr_auto] gap-8 items-center py-8 no-underline text-[#f5f5f5] max-[640px]:grid-cols-1 max-[640px]:gap-2.5"
            >
              <span className="font-mono text-[13px] text-[#525252]">{w.idx}</span>
              <div>
                <div className="flex items-baseline gap-4 flex-wrap">
                  <span className="text-[clamp(20px,2.6vw,30px)] font-semibold tracking-[-0.02em]">{w.title}</span>
                  <span className="font-mono text-[11px] tracking-[0.1em] text-[#737373]">{w.cat}</span>
                </div>
                <p className="text-[14.5px] text-[#a3a3a3] mt-2 max-w-[560px]">{w.desc}</p>
              </div>
              <span className="text-[20px] text-[#737373]">↗︎</span>
            </Link>
          ))}
        </div>

        <div className="mt-20 font-mono text-[12px] tracking-[0.2em] text-[#737373] mb-6">{`// DESIGN & IDENTITY`}</div>
        <div className="grid grid-cols-3 gap-4 max-[900px]:grid-cols-2 max-[600px]:grid-cols-1">
          {graphicHighlights.map((g) => (
            <Link
              key={g.id}
              href={`/graphic/${g.id}`}
              className="group hover-panel relative bg-[#101010] aspect-[4/3] flex flex-col justify-end p-5 no-underline text-[#f5f5f5] overflow-hidden"
            >
              {g.cover ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={g.cover}
                    alt={g.title}
                    className="absolute inset-0 w-full h-full object-cover grayscale opacity-60 transition-[filter,opacity] duration-500 ease-out group-hover:grayscale-0 group-hover:opacity-85"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                </>
              ) : null}
              <div className="absolute top-[18px] left-5 font-mono text-[11px] tracking-[0.1em] text-[#0a0a0a] bg-[#f5f5f5] px-2 py-1">{g.cat}</div>
              <div className="relative text-[17px] font-semibold tracking-[-0.01em]">{g.title}</div>
            </Link>
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <Link href="/work" className="font-mono text-[12px] text-[#a3a3a3] no-underline border-b border-white/20 pb-1 hover-link">
            VIEW ALL WORK →
          </Link>
        </div>
      </section>

      {/* DIGITAL PRODUCTS (light) */}
      <section className="relative z-10 bg-[#f5f5f5] text-[#0a0a0a]">
        <div className="max-w-[1180px] mx-auto px-8 py-20 max-[640px]:px-5 max-[640px]:py-14">
          <div className="flex justify-between items-end flex-wrap gap-4 mb-12">
            <div>
              <div className="font-mono text-[12px] tracking-[0.2em] text-[#737373] mb-4">{`// DIGITAL PRODUCTS`}</div>
              <h2 className="text-[clamp(30px,4vw,52px)] font-bold tracking-[-0.03em]">Templates &amp; Automation</h2>
            </div>
            <Link href="/products" className="font-mono text-[12px] text-[#525252] no-underline border-b pb-1" style={{ borderColor: "rgba(0,0,0,0.2)" }}>
              VIEW ALL PRODUCTS →
            </Link>
          </div>
          <div data-r="three" className="grid grid-cols-3 gap-6 max-[980px]:grid-cols-2 max-[640px]:grid-cols-1">
            {products.slice(0, 3).map((p, i) => (
              <div key={i} className="hover-card flex flex-col border border-black/10 bg-white p-6 min-h-[240px] transition-colors">
                <div className="flex justify-between items-center mb-6 font-mono text-[11px] text-[#737373]">
                  <span>{p.idx}</span>
                  <span className="text-[#0a0a0a]">{p.stat}</span>
                </div>
                <h3 className="text-[20px] font-bold tracking-[-0.01em] mb-2.5">{p.title}</h3>
                <p className="text-[13.5px] leading-[1.6] text-[#404040] line-clamp-3">{p.desc}</p>
                <div className="flex justify-between items-center pt-5 mt-auto border-t border-black/[0.08]">
                  <span className="text-[18px] font-bold">{p.price}</span>
                  <Link href={`/products/digital/${p.idx.toLowerCase()}`} className="font-mono text-[11px] px-3.5 py-2.5 bg-[#0a0a0a] text-[#f5f5f5] no-underline">
                    GET →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LATEST BLOG */}
      <section className={`${container} py-28 max-[640px]:py-16`}>
        <div className="flex justify-between items-end flex-wrap gap-4 mb-10">
          <div>
            <div className="font-mono text-[12px] tracking-[0.2em] text-[#737373] mb-4">{`// LATEST WRITING`}</div>
            <h2 className="text-[clamp(28px,3.4vw,44px)] font-bold tracking-[-0.03em]">Some Writing</h2>
          </div>
          <Link href="/blog" className="font-mono text-[12px] text-[#a3a3a3] no-underline border-b border-white/20 pb-1 hover-link">
            READ THE BLOG →
          </Link>
        </div>
        <BlogCarousel posts={blogCards} />
      </section>

      {/* FOOTER CTA */}
      <footer data-r="cta" className="relative z-10 border-t border-white/[0.07] overflow-hidden">
        <GridTexture />
        <div className="relative z-10 max-w-[1180px] mx-auto px-8 pt-28 pb-10 max-[640px]:px-5 max-[640px]:pt-16">
          <div className="font-mono text-[12px] tracking-[0.2em] text-[#737373] mb-7">{`// LET'S BUILD SOMETHING`}</div>
          <h2 className="text-[clamp(44px,9vw,128px)] font-bold tracking-[-0.045em] leading-[0.92] mb-10">
            GET IN
            <br />
            TOUCH<span className="text-[#525252]">.</span>
          </h2>
          <Link
            href="/contact"
            className="inline-flex items-center gap-3 px-8 py-4 bg-[#f5f5f5] text-[#0a0a0a] no-underline font-mono text-[13px] font-semibold tracking-[0.04em] mb-20 hover-fill"
          >
            START A PROJECT →
          </Link>
          <div className="flex justify-between items-center flex-wrap gap-4 font-mono text-[11px] text-[#525252] pt-7 border-t border-white/[0.07]">
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
