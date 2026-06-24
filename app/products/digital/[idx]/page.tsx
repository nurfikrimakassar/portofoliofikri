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

export default async function ProductDetailPage({ params }: { params: Promise<{ idx: string }> }) {
  const { idx } = await params;
  const S = await getData();

  const product = S.products.find((p) => p.idx.toLowerCase() === idx);
  if (!product) notFound();

  const D = (S.detail.prod ?? {})[product.idx] || {};
  const buyLabel = product.linkLabel || "BELI SEKARANG →";

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-[#f5f5f5] font-sans overflow-x-hidden">
      <Nav active="/products" />

      <div className="relative z-10 max-w-[1200px] mx-auto px-8 pt-[100px] pb-20 max-[640px]:px-5 max-[640px]:pt-[80px]">
        <Link href="/products" className="font-mono text-[12.5px] text-[#737373] no-underline hover-link">
          ← ~/fikri / products / digital
        </Link>

        {/* Split layout */}
        <div className="mt-10 grid grid-cols-[1fr_1fr] gap-14 items-start max-[768px]:grid-cols-1 max-[768px]:gap-8">

          {/* Left — sticky cover */}
          <div className="sticky top-[100px] max-[768px]:static">
            {(D.cover || product.image) ? (
              <div className="relative w-full aspect-[4/5] bg-white/[0.04] overflow-hidden">
                <Image
                  src={D.cover || product.image!}
                  alt={product.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ objectFit: "cover" }}
                  priority
                />
              </div>
            ) : (
              <div className="w-full aspect-[4/5] bg-white/[0.04] flex items-center justify-center">
                <span className="font-mono text-[13px] text-[#525252]">{product.idx}</span>
              </div>
            )}
          </div>

          {/* Right — content */}
          <div className="flex flex-col gap-7 pt-2">
            <div className="flex items-center gap-3 font-mono text-[11px]">
              <span className="px-2.5 py-1 bg-white/8 text-[#737373]">{product.stat}</span>
              <span className="text-[#525252] tracking-[0.12em]">DIGITAL PRODUCT</span>
            </div>

            <h1 className="text-[clamp(30px,4vw,52px)] font-bold tracking-[-0.03em] leading-[1.05]">
              {product.title}
            </h1>

            <p className="text-[15px] leading-[1.7] text-[#a3a3a3] whitespace-pre-line">{product.desc}</p>

            <div className="flex gap-2 flex-wrap">
              {product.tags.map((t) => (
                <span key={t} className="font-mono text-[10.5px] px-2.5 py-1 border border-white/14 text-[#525252]">
                  {t}
                </span>
              ))}
            </div>

            <div className="pt-7 border-t border-white/10 flex items-center justify-between gap-5 flex-wrap">
              <span className="text-[36px] font-bold tracking-[-0.02em]">{product.price}</span>
              {product.buyLink ? (
                <a
                  href={product.buyLink}
                  target="_blank"
                  rel="noreferrer"
                  className="px-8 py-4 bg-[#f5f5f5] text-[#0a0a0a] font-mono text-[13px] font-semibold tracking-[0.04em] no-underline"
                >
                  {buyLabel}
                </a>
              ) : (
                <span className="font-mono text-[11px] text-[#525252]">Link pembelian belum diset</span>
              )}
            </div>
          </div>
        </div>

        {/* Body blocks below split */}
        {D.body && D.body.length > 0 && (
          <div className="mt-20 border-t border-white/10 pt-14 max-w-[720px]">
            <BlockBody blocks={D.body} />
          </div>
        )}
      </div>
    </div>
  );
}
