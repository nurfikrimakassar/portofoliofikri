export const dynamic = "force-dynamic";

import Link from "next/link";
import Nav from "@/components/Nav";
import { getData } from "@/lib/data";

export const metadata = { title: "Products — Fikri" };

export default async function ProductsPage() {
  const S = await getData();
  const delivered = S.webWorks.slice(0, 3).map((w) => ({
    title: w.title,
    cat: w.cat,
    year: w.year,
    desc: w.desc,
  }));

  return (
    <div className="relative min-h-screen bg-[#f5f5f5] text-[#0a0a0a] font-sans overflow-x-hidden">
      <Nav theme="light" active="/products" />

      <header className="relative z-10 max-w-[1280px] mx-auto px-8 pt-[140px] pb-10 max-[640px]:px-5 max-[640px]:pt-[104px]">
        <div className="font-mono text-[12.5px] text-[#a3a3a3] mb-5">
          ~/fikri <span className="text-[#d4d4d4]">/</span> <span className="text-[#525252]">products</span>
        </div>
        <h1 className="text-[clamp(44px,7vw,88px)] font-bold tracking-[-0.03em] leading-[0.95]">
          PRODUCTS
          <br />
          &amp; AUTOMATION
        </h1>
        <p className="max-w-[560px] text-base leading-[1.6] text-[#525252] mt-6">
          Template &amp; sistem automation yang kujual, studi kasus problem-solving, dan project yang sudah kuselesaikan.
        </p>
      </header>

      <section className="relative z-10 max-w-[1280px] mx-auto px-8 py-10 max-[640px]:px-5">
        <div className="flex items-baseline gap-3.5 mb-7 font-mono">
          <span className="text-[13px] tracking-[0.15em] text-[#525252]">{`// DIGITAL PRODUCTS · FOR SALE`}</span>
          <div className="flex-1 h-px bg-black/12" />
        </div>
        <div className="grid grid-cols-3 gap-5 max-[980px]:grid-cols-2 max-[640px]:grid-cols-1">
          {S.products.map((p, i) => (
            <div key={i} className="hover-card flex flex-col border border-black/14 bg-white p-[26px] min-h-[300px]">
              <div className="flex justify-between items-center mb-6 font-mono text-[11.5px] text-[#737373]">
                <span>{p.idx}</span>
                <span className="px-2.5 py-1 bg-[#0a0a0a] text-[#f5f5f5]">{p.stat}</span>
              </div>
              <h3 className="text-[22px] font-bold tracking-[-0.01em] mb-3">{p.title}</h3>
              <p className="text-[14.5px] leading-[1.6] text-[#404040] flex-1">{p.desc}</p>
              <div className="flex gap-2 my-[18px] flex-wrap">
                {p.tags.map((t) => (
                  <span key={t} className="font-mono text-[10.5px] px-2 py-1 border border-black/16 text-[#525252]">
                    {t}
                  </span>
                ))}
              </div>
              <div className="flex justify-between items-center pt-[18px] border-t border-black/10">
                <span className="text-xl font-bold">{p.price}</span>
                <Link href="/contact" className="font-mono text-xs px-3.5 py-2.5 bg-[#0a0a0a] text-[#f5f5f5] no-underline">
                  GET →
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-[72px] flex items-baseline gap-3.5 mb-8 font-mono">
          <span className="text-[13px] tracking-[0.15em] text-[#525252]">{`// AUTOMATION · CASE STUDY`}</span>
          <div className="flex-1 h-px bg-black/12" />
        </div>
        <div className="flex flex-col gap-px bg-black/12 border border-black/12">
          {S.automation.map((a) => (
            <div
              key={a.id}
              data-r="caserow"
              className="hover-light-row grid grid-cols-[auto_1.2fr_2fr_auto] gap-7 items-center bg-[#f5f5f5] px-[22px] py-[26px] max-[640px]:grid-cols-1 max-[640px]:gap-3"
            >
              <span className="font-mono text-xs text-[#a3a3a3]">{a.idx}</span>
              <div>
                <div className="text-[19px] font-bold tracking-[-0.01em]">{a.title}</div>
                <div className="font-mono text-[11.5px] text-[#737373] mt-1">{a.stack}</div>
              </div>
              <div className="text-sm text-[#404040] leading-[1.55]">
                <span className="text-[#a3a3a3]">Problem →</span> {a.problem} <span className="text-[#a3a3a3]">Hasil →</span>{" "}
                <span className="font-semibold">{a.result}</span>
              </div>
              <Link
                href={`/products/${a.id}`}
                className="font-mono text-[11.5px] px-3 py-2 border border-black/20 text-[#0a0a0a] no-underline whitespace-nowrap"
              >
                READ →
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-[72px] flex items-baseline gap-3.5 mb-8 font-mono">
          <span className="text-[13px] tracking-[0.15em] text-[#525252]">{`// WEBSITES & PROJECTS DELIVERED`}</span>
          <div className="flex-1 h-px bg-black/12" />
        </div>
        <div className="grid grid-cols-3 gap-5 max-[980px]:grid-cols-2 max-[640px]:grid-cols-1">
          {delivered.map((d, i) => (
            <Link
              key={i}
              href="/contact"
              className="hover-card flex flex-col border border-black/14 bg-white p-6 min-h-[180px] no-underline text-[#0a0a0a]"
            >
              <div className="flex justify-between font-mono text-[11px] text-[#737373] mb-auto">
                <span>{d.cat}</span>
                <span>{d.year}</span>
              </div>
              <h3 className="text-xl font-bold tracking-[-0.01em] mt-5">{d.title}</h3>
              <p className="text-[13.5px] text-[#404040] leading-[1.55] mt-2">{d.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <footer className="relative z-10 max-w-[1280px] mx-auto px-8 pt-[60px] pb-10 max-[640px]:px-5">
        <div className="flex justify-between items-center flex-wrap gap-4 font-mono text-xs text-[#a3a3a3] pt-6 border-t border-black/10">
          <span>© 2024 FIKRI · MAKASSAR, ID</span>
          <Link href="/" className="text-[#525252] no-underline hover-link-dark">
            ← BACK HOME
          </Link>
        </div>
      </footer>
    </div>
  );
}
