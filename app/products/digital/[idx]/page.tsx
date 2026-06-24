export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import BlockBody from "@/components/BlockBody";
import { getData } from "@/lib/data";

export async function generateStaticParams() {
  const S = await getData();
  return S.products.map((p) => ({ idx: p.idx.toLowerCase() }));
}

export async function generateMetadata({ params }: { params: Promise<{ idx: string }> }) {
  const { idx } = await params;
  const S = await getData();
  const product = S.products.find((p) => p.idx.toLowerCase() === idx);
  if (!product) return {};
  const D = (S.detail.prod ?? {})[product.idx] || {};
  return {
    title: product.title,
    description: product.desc.slice(0, 160),
    openGraph: {
      title: product.title,
      description: product.desc.slice(0, 160),
      images: D.cover ? [{ url: D.cover }] : product.image ? [{ url: product.image }] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ idx: string }> }) {
  const { idx } = await params;
  const S = await getData();

  const product = S.products.find((p) => p.idx.toLowerCase() === idx);
  if (!product) notFound();

  const D = (S.detail.prod ?? {})[product.idx] || {};
  const coverSrc = D.cover || product.image;
  const buyLabel = product.linkLabel || "BELI SEKARANG";

  return (
    <div className="relative min-h-screen bg-[#f5f5f5] text-[#0a0a0a] font-sans overflow-x-hidden">
      <Nav theme="light" active="/products" />

      <div className="relative z-10 max-w-[1180px] mx-auto px-8 pt-[132px] pb-16 max-[640px]:px-5 max-[640px]:pt-[104px]">
        <Link href="/products" className="font-mono text-[12.5px] text-[#737373] no-underline hover-link-dark">
          ← ~/fikri / products
        </Link>

        {/* Split layout */}
        <div className="mt-8 grid grid-cols-[1.05fr_1fr] gap-14 items-start max-[860px]:grid-cols-1 max-[860px]:gap-8">

          {/* Left — sticky cover image */}
          <div className="sticky top-[80px] max-[860px]:static border border-black/14 bg-white p-3 relative">
            <span className="absolute top-3.5 left-3.5 z-10 font-mono text-[11px] px-2.5 py-1 bg-[#0a0a0a] text-[#f5f5f5]">
              {product.idx}
            </span>
            {coverSrc ? (
              <div className="relative w-full" style={{ height: "clamp(300px,34vw,440px)" }}>
                <Image
                  src={coverSrc}
                  alt={product.title}
                  fill
                  sizes="(max-width: 860px) 100vw, 50vw"
                  style={{ objectFit: "cover" }}
                  priority
                />
              </div>
            ) : (
              <div
                className="w-full flex items-center justify-center font-mono text-[11.5px] text-[#a3a3a3] bg-[#ededed]"
                style={{ height: "clamp(300px,34vw,440px)" }}
              >
                Gambar diatur di Admin
              </div>
            )}
          </div>

          {/* Right — content column */}
          <div className="flex flex-col">
            {/* Scrollable content */}
            <div className="flex-1">
              <div className="flex items-center gap-3 font-mono text-[11.5px] text-[#737373] mb-[18px]">
                <span className="px-2.5 py-1 bg-[#0a0a0a] text-[#f5f5f5]">{product.stat}</span>
                <span className="text-[#a3a3a3]">DIGITAL PRODUCT</span>
              </div>

              <h1 className="text-[clamp(30px,4.5vw,48px)] font-bold tracking-[-0.03em] leading-[1.05]">
                {product.title}
              </h1>

              <p className="text-[16.5px] leading-[1.65] text-[#404040] mt-5 whitespace-pre-line">
                {product.desc}
              </p>

              <div className="flex gap-2 mt-[22px] flex-wrap">
                {product.tags.map((t) => (
                  <span key={t} className="font-mono text-[10.5px] px-2.5 py-[5px] border border-black/16 text-[#525252]">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Price + buy button footer */}
            <div className="pt-[22px] mt-[18px] border-t border-black/12 bg-[#f5f5f5]">
              <div>
                <div className="font-mono text-[11px] text-[#737373] mb-1.5">HARGA</div>
                <div className="text-[34px] font-bold tracking-[-0.02em]">{product.price}</div>
              </div>
              {product.buyLink ? (
                <>
                  <a
                    href={product.buyLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2.5 mt-[18px] px-7 py-[18px] bg-[#0a0a0a] text-[#f5f5f5] no-underline font-mono text-[14px] font-semibold tracking-[0.05em] w-full hover:bg-[#262626] transition-colors"
                  >
                    {buyLabel} →
                  </a>
                  <p className="font-mono text-[11px] text-[#a3a3a3] mt-3 text-center">
                    Kamu akan diarahkan ke halaman pembayaran
                  </p>
                </>
              ) : (
                <div className="mt-[18px] px-7 py-[18px] bg-black/6 font-mono text-[12px] text-[#a3a3a3] text-center">
                  Link pembelian belum diset
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Body blocks */}
        {D.body && D.body.length > 0 && (
          <div className="max-w-[760px] mx-auto mt-16">
            <div className="font-mono text-[12px] tracking-[0.15em] text-[#737373] mb-6">
              {`// TENTANG PRODUK`}
            </div>
            <BlockBody body={D.body} />
          </div>
        )}

        {/* Footer nav */}
        <div className="mt-16 flex justify-between items-center flex-wrap gap-4 font-mono text-[12px] text-[#a3a3a3] pt-6 border-t border-black/10">
          <Link href="/products" className="text-[#525252] no-underline hover-link-dark">
            ← SEMUA PRODUK
          </Link>
          <Link href="/contact" className="text-[#525252] no-underline hover-link-dark">
            BUTUH BANTUAN? →
          </Link>
        </div>
      </div>
    </div>
  );
}
