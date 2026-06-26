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
          <span className="text-[11.5px] text-[#a3a3a3]">{S.products.length} products</span>
        </div>
        <PaginatedProducts items={S.products} perPage={6} />

        <div className="mt-[72px] flex items-baseline gap-3.5 mb-8 font-mono">
          <span className="text-[13px] tracking-[0.15em] text-[#525252]">{`// AUTOMATION · CASE STUDY`}</span>
          <div className="flex-1 h-px bg-black/12" />
          <span className="text-[11.5px] text-[#a3a3a3]">{S.automation.length} cases</span>
        </div>
        <PaginatedAutomation items={S.automation} perPage={3} />

        <div className="mt-[72px] flex items-baseline gap-3.5 mb-8 font-mono">
          <span className="text-[13px] tracking-[0.15em] text-[#525252]">{`// WEBSITES & PROJECTS DELIVERED`}</span>
          <div className="flex-1 h-px bg-black/12" />
          <span className="text-[11.5px] text-[#a3a3a3]">{S.webWorks.length} projects</span>
        </div>
        <PaginatedDelivered items={delivered} perPage={6} />
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
