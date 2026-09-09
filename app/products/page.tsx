import Link from "next/link";
import Nav from "@/components/Nav";
import { PaginatedProducts, PaginatedAutomation, PaginatedDelivered } from "@/components/PaginatedList";
import { getData } from "@/lib/data";

export const metadata = { title: "Products — Fikri" };

export default async function ProductsPage() {
  const S = await getData();

  const delivered = S.webWorks.map((w) => ({
    id: w.id,
    cat: w.cat,
    year: w.year,
    title: w.title,
    desc: w.desc,
  }));

  return (
    <div className="relative min-h-screen bg-[#f5f5f5] text-[#0a0a0a] font-sans overflow-x-hidden">
      <Nav theme="light" active="/products" />

      <header className="relative z-10 max-w-[1180px] mx-auto px-8 pt-36 pb-12 max-[640px]:px-5 max-[640px]:pt-28">
        <div className="font-mono text-[12px] text-[#a3a3a3] mb-6">
          ~/fikri <span className="text-[#d4d4d4]">/</span> <span className="text-[#525252]">products</span>
        </div>
        <h1 className="text-[clamp(44px,7vw,88px)] font-bold tracking-[-0.035em] leading-[0.98]">
          PRODUCTS
          <br />
          &amp; AUTOMATION
        </h1>
        <p className="max-w-[560px] text-[16px] leading-[1.65] text-[#525252] mt-7">
          Templates and automation systems I sell, problem-solving case studies, and projects I&apos;ve shipped.
        </p>
      </header>

      <section className="relative z-10 max-w-[1180px] mx-auto px-8 py-12 max-[640px]:px-5">
        <div className="flex items-baseline gap-4 mb-8 font-mono">
          <span className="text-[12px] tracking-[0.2em] text-[#525252]">{`// DIGITAL PRODUCTS · FOR SALE`}</span>
          <div className="flex-1 h-px bg-black/[0.08]" />
          <span className="text-[11px] text-[#a3a3a3]">{String(S.products.length).padStart(2, "0")} products</span>
        </div>
        <PaginatedProducts items={S.products} perPage={6} />

        <div className="mt-24 flex items-baseline gap-4 mb-8 font-mono">
          <span className="text-[12px] tracking-[0.2em] text-[#525252]">{`// AUTOMATION · CASE STUDY`}</span>
          <div className="flex-1 h-px bg-black/[0.08]" />
          <span className="text-[11px] text-[#a3a3a3]">{String(S.automation.length).padStart(2, "0")} cases</span>
        </div>
        <PaginatedAutomation items={S.automation} perPage={6} />

        <div className="mt-24 flex items-baseline gap-4 mb-8 font-mono">
          <span className="text-[12px] tracking-[0.2em] text-[#525252]">{`// WEBSITES & PROJECTS DELIVERED`}</span>
          <div className="flex-1 h-px bg-black/[0.08]" />
          <span className="text-[11px] text-[#a3a3a3]">{String(S.webWorks.length).padStart(2, "0")} projects</span>
        </div>
        <PaginatedDelivered items={delivered} perPage={6} />
      </section>

      <footer className="relative z-10 max-w-[1180px] mx-auto px-8 pt-16 pb-10 max-[640px]:px-5">
        <div className="flex justify-between items-center flex-wrap gap-4 font-mono text-[11px] text-[#a3a3a3] pt-7 border-t border-black/[0.09]">
          <span>© 2024 FIKRI · MAKASSAR, ID</span>
          <Link href="/" className="text-[#525252] no-underline hover-link-dark">
            ← BACK HOME
          </Link>
        </div>
      </footer>
    </div>
  );
}
