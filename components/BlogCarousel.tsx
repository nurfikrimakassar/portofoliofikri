"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export type BlogCard = {
  id: string;
  title: string;
  excerpt?: string;
  date: string;
  read: string;
  cat: string;
  cover?: string | null;
  featured?: boolean;
};

export default function BlogCarousel({ posts }: { posts: BlogCard[] }) {
  const [index, setIndex] = useState(0);
  const total = posts.length;
  const touchStartX = useRef<number | null>(null);

  function go(delta: number) {
    setIndex((i) => (i + delta + total) % total);
  }

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
    touchStartX.current = null;
  }

  if (total === 0) return null;

  return (
    <div className="relative">
      <div className="overflow-hidden" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {posts.map((b) => (
            <Link
              key={b.id}
              href={`/blog/${b.id}`}
              className="w-full shrink-0 grid grid-cols-[1.1fr_1fr] border border-white/10 no-underline text-[#f5f5f5] overflow-hidden hover-card-dark max-[720px]:grid-cols-1"
            >
              <div className="p-10 flex flex-col justify-between max-[640px]:p-6">
                <div className="flex gap-2.5 items-center font-mono text-[11.5px] text-[#737373] flex-wrap">
                  {b.featured && (
                    <span className="px-2.5 py-1 bg-[#f5f5f5] text-[#0a0a0a] font-semibold">FEATURED</span>
                  )}
                  <span>{b.date}</span>
                  <span>· {b.read}</span>
                </div>
                <div className="mt-10 max-[640px]:mt-6">
                  <h3 className="text-[clamp(24px,3vw,36px)] font-bold tracking-[-0.02em] leading-[1.1]">{b.title}</h3>
                  {b.excerpt && (
                    <p className="text-[15px] text-[#a3a3a3] leading-[1.6] mt-4 max-w-[440px]">{b.excerpt}</p>
                  )}
                  <span className="inline-block mt-6 font-mono text-[13px] text-[#f5f5f5]">READ ARTICLE →</span>
                </div>
              </div>
              <div className="relative bg-[#141414] min-h-[240px] flex items-center justify-center overflow-hidden">
                {b.cover ? (
                  <Image
                    src={b.cover}
                    alt={b.title}
                    fill
                    sizes="(max-width: 720px) 100vw, 45vw"
                    style={{ objectFit: "cover" }}
                    className="opacity-70"
                  />
                ) : null}
                <span className="relative font-mono text-[13px] text-[#525252]">{b.cat}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {total > 1 && (
        <div className="flex items-center justify-between mt-6">
          <div className="flex gap-2">
            {posts.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Slide ${i + 1}`}
                className="h-[2px] w-6 cursor-pointer"
                style={{ background: i === index ? "#f5f5f5" : "rgba(255,255,255,0.2)" }}
              />
            ))}
          </div>
          <div className="flex gap-2 font-mono text-[12px]">
            <button
              onClick={() => go(-1)}
              aria-label="Previous post"
              className="px-3 py-2 border border-white/20 text-[#f5f5f5] cursor-pointer hover-outline"
            >
              ←
            </button>
            <button
              onClick={() => go(1)}
              aria-label="Next post"
              className="px-3 py-2 border border-white/20 text-[#f5f5f5] cursor-pointer hover-outline"
            >
              →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
