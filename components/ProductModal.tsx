import Link from "next/link";
import { Product } from "@/lib/types";

export default function ProductCards({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-3 gap-5 max-[980px]:grid-cols-2 max-[640px]:grid-cols-1">
      {products.map((p, i) => (
        <Link
          key={i}
          href={`/products/digital/${p.idx.toLowerCase()}`}
          className="hover-card flex flex-col border border-black/14 bg-white p-[26px] min-h-[300px] no-underline text-[#0a0a0a]"
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
        </Link>
      ))}
    </div>
  );
}
