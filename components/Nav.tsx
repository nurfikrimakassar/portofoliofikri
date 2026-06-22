"use client";

import Link from "next/link";
import { useState } from "react";

const LINKS = [
  { href: "/", label: "01_home" },
  { href: "/work", label: "02_work" },
  { href: "/products", label: "03_products" },
  { href: "/blog", label: "04_blog" },
];

export default function Nav({
  theme = "dark",
  active,
}: {
  theme?: "dark" | "light";
  active?: string;
}) {
  const [open, setOpen] = useState(false);
  const isLight = theme === "light";

  const navBg = isLight ? "rgba(245,245,245,0.7)" : "rgba(10,10,10,0.6)";
  const borderColor = isLight ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.08)";
  const ink = isLight ? "#0a0a0a" : "#f5f5f5";
  const muted = isLight ? "#737373" : "#a3a3a3";
  const mutedHex = isLight ? "#525252" : "#a3a3a3";

  return (
    <>
      <nav
        data-r="nav"
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-[18px] backdrop-blur-[10px] border-b max-[640px]:px-[18px] max-[640px]:py-3.5"
        style={{ background: navBg, borderColor }}
      >
        <Link href="/" className="flex items-center gap-2.5 no-underline" style={{ color: ink }}>
          <span
            className="inline-flex items-center justify-center w-[30px] h-[30px] border font-mono font-bold text-sm"
            style={{ borderColor: isLight ? "rgba(0,0,0,0.25)" : "rgba(255,255,255,0.25)" }}
          >
            F
          </span>
          <span className="font-mono text-[13px] tracking-[0.08em]" style={{ color: mutedHex }}>
            ~/fikri
          </span>
        </Link>

        <div className="hidden xs:flex items-center gap-7 font-mono text-[12.5px] tracking-[0.06em]">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="no-underline transition-colors"
              style={{ color: active === l.href ? ink : muted }}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="no-underline px-4 py-2 border"
            style={
              active === "/contact"
                ? { background: ink, color: isLight ? "#f5f5f5" : "#0a0a0a", borderColor: ink }
                : { borderColor: isLight ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.25)", color: ink }
            }
          >
            contact
          </Link>
        </div>

        <button
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
          className="flex xs:hidden flex-col gap-[5px] w-[42px] h-[38px] items-center justify-center bg-transparent border cursor-pointer p-0"
          style={{ borderColor: isLight ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.25)" }}
        >
          <span className="w-[18px] h-[1.5px]" style={{ background: ink }}></span>
          <span className="w-[18px] h-[1.5px]" style={{ background: ink }}></span>
          <span className="w-[18px] h-[1.5px]" style={{ background: ink }}></span>
        </button>
      </nav>

      {open && (
        <div
          className="fixed top-[58px] left-0 right-0 z-[49] backdrop-blur-[10px] border-b flex flex-col px-5 pt-1.5 pb-4 font-mono"
          style={{
            background: isLight ? "rgba(245,245,245,0.98)" : "rgba(10,10,10,0.97)",
            borderColor: isLight ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.1)",
          }}
        >
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="py-4 px-0.5 no-underline border-b text-sm tracking-[0.06em]"
              style={{
                color: active === l.href ? ink : muted,
                borderColor: isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.08)",
              }}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="mt-3 p-3.5 text-center no-underline text-[13px] font-semibold tracking-[0.06em]"
            style={{ background: ink, color: isLight ? "#f5f5f5" : "#0a0a0a" }}
          >
            contact →
          </Link>
        </div>
      )}
    </>
  );
}
