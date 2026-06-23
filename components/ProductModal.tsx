"use client";

import { useState } from "react";
import Image from "next/image";
import { Product } from "@/lib/types";

export default function ProductCards({ products }: { products: Product[] }) {
  const [active, setActive] = useState<Product | null>(null);

  return (
    <>
      <div className="grid grid-cols-3 gap-5 max-[980px]:grid-cols-2 max-[640px]:grid-cols-1">
        {products.map((p, i) => (
          <button
            key={i}
            onClick={() => setActive(p)}
            className="hover-card flex flex-col border border-black/14 bg-white p-[26px] min-h-[300px] text-left w-full"
          >
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
              <span className="font-mono text-xs px-3.5 py-2.5 bg-[#0a0a0a] text-[#f5f5f5]">
                LIHAT →
              </span>
            </div>
          </button>
        ))}
      </div>

      {active && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-black/70 backdrop-blur-sm"
          onClick={() => setActive(null)}
        >
          <div
            className="relative w-full max-w-[480px] bg-[#0f0f0f] border border-white/12 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {active.image ? (
              <div className="relative w-full aspect-video">
                <Image
                  src={active.image}
                  alt={active.title}
                  fill
                  sizes="480px"
                  style={{ objectFit: "cover" }}
                />
              </div>
            ) : (
              <div className="w-full aspect-video bg-white/[0.04] flex items-center justify-center font-mono text-[12px] text-[#525252]">
                {active.idx}
              </div>
            )}

            <div className="p-7">
              <div className="flex justify-between items-start gap-4 mb-3">
                <h2 className="text-[22px] font-bold tracking-[-0.02em] text-[#f5f5f5] leading-tight">
                  {active.title}
                </h2>
                <span className="font-mono text-[11px] px-2.5 py-1 bg-white/8 text-[#737373] whitespace-nowrap">
                  {active.stat}
                </span>
              </div>
              <p className="text-[14px] leading-[1.65] text-[#a3a3a3] mb-5">{active.desc}</p>
              <div className="flex gap-2 flex-wrap mb-6">
                {active.tags.map((t) => (
                  <span key={t} className="font-mono text-[10px] px-2 py-1 border border-white/14 text-[#525252]">
                    {t}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between pt-5 border-t border-white/10">
                <span className="text-[24px] font-bold text-[#f5f5f5]">{active.price}</span>
                {active.link ? (
                  <a
                    href={active.link}
                    target="_blank"
                    rel="noreferrer"
                    className="px-6 py-3 bg-[#f5f5f5] text-[#0a0a0a] font-mono text-[12.5px] font-semibold tracking-[0.04em] no-underline"
                  >
                    BELI SEKARANG →
                  </a>
                ) : (
                  <span className="font-mono text-[11px] text-[#525252]">Link belum diset</span>
                )}
              </div>
            </div>

            <button
              onClick={() => setActive(null)}
              className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-black/50 text-[#a3a3a3] font-mono text-[13px]"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}
