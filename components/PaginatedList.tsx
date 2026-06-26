"use client";
import { useState } from "react";
import Link from "next/link";

// ─── Pagination controls ───────────────────────────────────────────────────────

function Controls({
  page,
  total,
  onPage,
  theme = "dark",
}: {
  page: number;
  total: number;
  onPage: (p: number) => void;
  theme?: "dark" | "light";
}) {
  if (total <= 1) return null;
  const dark = theme === "dark";
  const dim = dark ? "text-[#525252]" : "text-[#a3a3a3]";
  const active = dark ? "text-[#f5f5f5]" : "text-[#0a0a0a]";
  const border = dark ? "border-white/14" : "border-black/16";
  const activeBg = dark ? "bg-white/8" : "bg-black/8";

  return (
    <div className="flex items-center justify-between mt-8 font-mono text-[12px]">
      <span className={dim}>{page} / {total}</span>
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPage(page - 1)}
          disabled={page <= 1}
          className={`px-3 py-2 border ${border} ${page > 1 ? `${active} cursor-pointer` : `${dim} opacity-30 cursor-not-allowed`}`}
        >
          ← PREV
        </button>
        {Array.from({ length: total }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => onPage(p)}
            className={`w-9 py-2 text-center border ${border} cursor-pointer ${p === page ? `${active} ${activeBg}` : dim}`}
          >
            {p}
          </button>
        ))}
        <button
          onClick={() => onPage(page + 1)}
          disabled={page >= total}
          className={`px-3 py-2 border ${border} ${page < total ? `${active} cursor-pointer` : `${dim} opacity-30 cursor-not-allowed`}`}
        >
          NEXT →
        </button>
      </div>
    </div>
  );
}

// ─── Web works rows ────────────────────────────────────────────────────────────

type WebWork = { id: string; idx: string; title: string; cat: string; desc: string; year: string };

export function PaginatedWebWorks({ items, perPage }: { items: WebWork[]; perPage: number }) {
  const [page, setPage] = useState(1);
  const total = Math.ceil(items.length / perPage);
  const slice = items.slice((page - 1) * perPage, page * perPage);

  return (
    <>
      {slice.map((w) => (
        <Link
          key={w.id}
          href={`/work/${w.id}`}
          data-r="workrow"
          className="hover-row grid grid-cols-[auto_1fr_auto] gap-8 items-center py-8 px-4 border-t border-white/10 no-underline text-[#f5f5f5] max-[640px]:grid-cols-1 max-[640px]:gap-2.5"
        >
          <span className="font-mono text-[13px] text-[#525252]">{w.idx}</span>
          <div>
            <div className="flex items-baseline gap-4 flex-wrap">
              <span className="text-[clamp(22px,2.8vw,34px)] font-semibold tracking-[-0.02em]">{w.title}</span>
              <span className="font-mono text-xs text-[#737373]">{w.cat}</span>
            </div>
            <p className="text-[15px] text-[#a3a3a3] mt-2 max-w-[560px]">{w.desc}</p>
          </div>
          <div className="flex items-center gap-5">
            <span className="font-mono text-xs text-[#737373]">{w.year}</span>
            <span className="text-[22px] text-[#737373]">↗︎</span>
          </div>
        </Link>
      ))}
      <div className="border-t border-white/10" />
      <Controls page={page} total={total} onPage={setPage} />
    </>
  );
}

// ─── Graphic grid ──────────────────────────────────────────────────────────────

type GraphicWork = { id: string; title: string; cat: string; cover?: string | null };

export function PaginatedGraphics({
  items,
  perPage,
}: {
  items: GraphicWork[];
  perPage: number;
}) {
  const [page, setPage] = useState(1);
  const total = Math.ceil(items.length / perPage);
  const slice = items.slice((page - 1) * perPage, page * perPage);

  return (
    <>
      <div className="grid grid-cols-3 gap-px bg-white/8 border border-white/8 max-[980px]:grid-cols-2 max-[640px]:grid-cols-1">
        {slice.map((g) => (
          <Link
            key={g.id}
            href={`/graphic/${g.id}`}
            className="hover-panel relative bg-[#0a0a0a] aspect-[4/3] flex flex-col justify-end p-5 no-underline text-[#f5f5f5] overflow-hidden"
          >
            {g.cover ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={g.cover}
                  alt={g.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-50"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              </>
            ) : (
              <div
                className="absolute inset-0 opacity-60"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.04) 1px,transparent 1px)",
                  backgroundSize: "22px 22px",
                }}
              />
            )}
            <div className="absolute top-[18px] left-5 font-mono text-[11px] text-[#525252]">{g.cat}</div>
            <div className="relative text-lg font-semibold tracking-[-0.01em]">{g.title}</div>
          </Link>
        ))}
      </div>
      <Controls page={page} total={total} onPage={setPage} />
    </>
  );
}

// ─── Digital products grid ─────────────────────────────────────────────────────

type Product = { idx: string; stat: string; title: string; desc: string; tags: string[]; price: string };

export function PaginatedProducts({ items, perPage }: { items: Product[]; perPage: number }) {
  const [page, setPage] = useState(1);
  const total = Math.ceil(items.length / perPage);
  const slice = items.slice((page - 1) * perPage, page * perPage);

  return (
    <>
      <div className="grid grid-cols-3 gap-5 max-[980px]:grid-cols-2 max-[640px]:grid-cols-1">
        {slice.map((p, i) => (
          <Link
            key={i}
            href={`/products/digital/${p.idx.toLowerCase()}`}
            className="hover-card flex flex-col border border-black/14 bg-white p-[26px] h-[300px] no-underline text-[#0a0a0a]"
          >
            <div className="flex justify-between items-center mb-6 font-mono text-[11.5px] text-[#737373]">
              <span>{p.idx}</span>
              <span className="px-2.5 py-1 bg-[#0a0a0a] text-[#f5f5f5]">{p.stat}</span>
            </div>
            <h3 className="text-[22px] font-bold tracking-[-0.01em] mb-3">{p.title}</h3>
            <p className="text-[14.5px] leading-[1.6] text-[#404040] line-clamp-3">{p.desc}</p>
            <div className="flex gap-2 mt-auto pt-[18px] flex-wrap">
              {p.tags.map((t) => (
                <span key={t} className="font-mono text-[10.5px] px-2 py-1 border border-black/16 text-[#525252]">{t}</span>
              ))}
            </div>
            <div className="flex justify-between items-center pt-[18px] border-t border-black/10">
              <span className="text-xl font-bold">{p.price}</span>
              <span className="font-mono text-xs px-3.5 py-2.5 bg-[#0a0a0a] text-[#f5f5f5]">LIHAT →</span>
            </div>
          </Link>
        ))}
      </div>
      <Controls page={page} total={total} onPage={setPage} theme="light" />
    </>
  );
}

// ─── Automation rows ───────────────────────────────────────────────────────────

type Automation = { id: string; idx: string; title: string; stack: string; problem: string; result: string };

export function PaginatedAutomation({ items, perPage }: { items: Automation[]; perPage: number }) {
  const [page, setPage] = useState(1);
  const total = Math.ceil(items.length / perPage);
  const slice = items.slice((page - 1) * perPage, page * perPage);

  return (
    <>
      <div className="flex flex-col gap-px bg-black/12 border border-black/12">
        {slice.map((a) => (
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
              <span className="text-[#a3a3a3]">Problem →</span> {a.problem}{" "}
              <span className="text-[#a3a3a3]">Hasil →</span>{" "}
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
      <Controls page={page} total={total} onPage={setPage} theme="light" />
    </>
  );
}

// ─── Delivered project cards ───────────────────────────────────────────────────

type DeliveredWork = { id: string; cat: string; year: string; title: string; desc: string };

export function PaginatedDelivered({ items, perPage }: { items: DeliveredWork[]; perPage: number }) {
  const [page, setPage] = useState(1);
  const total = Math.ceil(items.length / perPage);
  const slice = items.slice((page - 1) * perPage, page * perPage);

  return (
    <>
      <div className="grid grid-cols-3 gap-5 max-[980px]:grid-cols-2 max-[640px]:grid-cols-1">
        {slice.map((d) => (
          <Link
            key={d.id}
            href={`/work/${d.id}`}
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
      <Controls page={page} total={total} onPage={setPage} theme="light" />
    </>
  );
}

// ─── Blog post rows ────────────────────────────────────────────────────────────

type BlogPost = { id: string; date: string; title: string; cat: string; read: string };

export function PaginatedBlog({ items, perPage }: { items: BlogPost[]; perPage: number }) {
  const [page, setPage] = useState(1);
  const total = Math.ceil(items.length / perPage);
  const slice = items.slice((page - 1) * perPage, page * perPage);

  return (
    <>
      {slice.map((b) => (
        <Link
          key={b.id}
          href={`/blog/${b.id}`}
          data-r="blogrow"
          className="hover-row grid grid-cols-[120px_1fr_auto_auto] gap-7 items-center py-[26px] px-4 border-t border-white/10 no-underline text-[#f5f5f5] max-[640px]:grid-cols-1 max-[640px]:gap-1.5"
        >
          <span className="font-mono text-[13px] text-[#525252]">{b.date}</span>
          <span className="text-[clamp(18px,2vw,24px)] font-medium tracking-[-0.01em]">{b.title}</span>
          <span className="font-mono text-[11px] text-[#737373] border border-white/14 px-2.5 py-1.5 w-fit">{b.cat}</span>
          <span className="font-mono text-xs text-[#525252]">{b.read}</span>
        </Link>
      ))}
      <div className="border-t border-white/10" />
      <Controls page={page} total={total} onPage={setPage} />
    </>
  );
}
