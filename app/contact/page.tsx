import { Suspense } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import GridBackground from "@/components/GridBackground";
import ContactClient from "@/components/ContactClient";
import { getData } from "@/lib/data";

export const metadata = { title: "Contact — Fikri" };

export default async function ContactPage() {
  const S = await getData();

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-[#f5f5f5] font-sans overflow-x-hidden">
      <GridBackground />
      <Nav active="/contact" />

      <header className="relative z-10 max-w-[1100px] mx-auto px-8 pt-[140px] pb-5 max-[640px]:px-5 max-[640px]:pt-[104px]">
        <div className="font-mono text-[12.5px] text-[#525252] mb-5">
          ~/fikri <span className="text-[#404040]">/</span> <span className="text-[#a3a3a3]">contact</span>
        </div>
        <h1 className="text-[clamp(44px,8vw,96px)] font-bold tracking-[-0.04em] leading-[0.92]">LET&apos;S TALK</h1>
        <p className="max-w-[560px] text-base leading-[1.6] text-[#a3a3a3] mt-6">
          Tiga cara menghubungiku — pilih yang paling nyaman buatmu.
        </p>
      </header>

      <section className="relative z-10 max-w-[1100px] mx-auto px-8 py-9 max-[640px]:px-5">
        <Suspense>
          <ContactClient profile={S.profile} />
        </Suspense>
      </section>

      <footer className="relative z-10 max-w-[1100px] mx-auto px-8 pt-[60px] pb-10 max-[640px]:px-5">
        <div className="flex justify-between items-center flex-wrap gap-4 font-mono text-xs text-[#525252] pt-6 border-t border-white/8">
          <span>© 2024 FIKRI · MAKASSAR, ID</span>
          <Link href="/" className="text-[#a3a3a3] no-underline hover-link">
            ← BACK HOME
          </Link>
        </div>
      </footer>
    </div>
  );
}
