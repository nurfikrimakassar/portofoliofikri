"use client";

import { useMemo, useState } from "react";
import { Profile } from "@/lib/types";

const SERVICES = ["Website / Web App", "Automation Workflow", "Graphic / Branding", "Konsultasi", "Lainnya"];
const DOW = ["MIN", "SEN", "SEL", "RAB", "KAM", "JUM", "SAB"];
const MON = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
const TIMES = ["09:00", "10:30", "13:00", "15:00", "16:30"];

function buildDays() {
  const out: { id: string; dow: string; num: number; mon: string; label: string }[] = [];
  let d = new Date();
  let added = 0;
  while (added < 8) {
    d = new Date(d.getTime() + 86400000);
    if (d.getDay() === 0) continue;
    out.push({
      id: d.toISOString().slice(0, 10),
      dow: DOW[d.getDay()],
      num: d.getDate(),
      mon: MON[d.getMonth()],
      label: `${DOW[d.getDay()]} ${d.getDate()} ${MON[d.getMonth()]}`,
    });
    added++;
  }
  return out;
}

export default function ContactClient({ profile }: { profile: Profile }) {
  const [method, setMethod] = useState<"form" | "wa" | "call">("form");
  const [service, setService] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [callDay, setCallDay] = useState("");
  const [callTime, setCallTime] = useState("");

  const days = useMemo(() => buildDays(), []);
  const dayObj = days.find((d) => d.id === callDay);
  const num = (profile.whatsapp || "6281234567890").replace(/[^0-9]/g, "");

  const body = [
    "Halo Fikri,",
    "",
    msg || "Aku mau diskusi project.",
    "",
    `— ${name || "(nama)"} · ${email || "(email)"}`,
  ].join("\n");

  const waLines: string[] = [];
  if (service) waLines.push(`Kebutuhan: ${service}`);
  waLines.push("Halo Fikri, aku mau diskusi project.");
  const waText = waLines.join("\n");

  const ready = Boolean(callDay && callTime);
  const bookText = ready
    ? `Halo Fikri, aku mau book a call: ${dayObj ? dayObj.label : ""} jam ${callTime} WITA.`
    : "";

  const mailLink = `mailto:${profile.email}?subject=${encodeURIComponent(
    `[Project] ${service || "(belum dipilih)"}`
  )}&body=${encodeURIComponent(body)}`;
  const waLink = `https://wa.me/${num}?text=${encodeURIComponent(waText)}`;
  const bookLink = ready ? `https://wa.me/${num}?text=${encodeURIComponent(bookText)}` : "#";

  const tabBtn = (id: "form" | "wa" | "call", label: string) => (
    <button
      onClick={() => setMethod(id)}
      className="flex-1 px-3 py-4 cursor-pointer font-mono text-xs tracking-[0.06em] border-0 border-r border-white/14 last:border-r-0"
      style={{
        background: method === id ? "#f5f5f5" : "transparent",
        color: method === id ? "#0a0a0a" : "#a3a3a3",
      }}
    >
      {label}
    </button>
  );

  const chip = (label: string, selected: string, onClick: (l: string) => void) => (
    <button
      key={label}
      onClick={() => onClick(label)}
      className="font-mono text-xs px-3 py-2 cursor-pointer"
      style={{
        background: label === selected ? "#f5f5f5" : "transparent",
        color: label === selected ? "#0a0a0a" : "#a3a3a3",
        border: `1px solid ${label === selected ? "#f5f5f5" : "rgba(255,255,255,0.18)"}`,
      }}
    >
      {label}
    </button>
  );

  return (
    <>
      <div data-r="switch" className="flex border border-white/14 mb-10 max-[640px]:flex-col">
        {tabBtn("form", "01 · KIRIM PESAN")}
        {tabBtn("wa", "02 · WHATSAPP")}
        {tabBtn("call", "03 · BOOK A CALL")}
      </div>

      {method === "form" && (
        <div data-r="panel" className="grid grid-cols-[1.3fr_1fr] gap-12 items-start max-[980px]:grid-cols-1 max-[980px]:gap-8">
          <div>
            <div className="font-mono text-[11.5px] tracking-[0.12em] text-[#737373] mb-5">KIRIM LEWAT EMAIL</div>
            <div className="flex flex-col gap-4">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama kamu"
                className="w-full bg-white/[0.03] border border-white/14 text-[#f5f5f5] text-sm px-4 py-3.5 outline-none"
              />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email kamu"
                className="w-full bg-white/[0.03] border border-white/14 text-[#f5f5f5] text-sm px-4 py-3.5 outline-none"
              />
              <div className="flex flex-wrap gap-2">{SERVICES.map((s) => chip(s, service, setService))}</div>
              <textarea
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                placeholder="Ceritakan kebutuhanmu..."
                rows={5}
                className="w-full bg-white/[0.03] border border-white/14 text-[#f5f5f5] text-sm px-4 py-3.5 resize-y outline-none"
              />
              <a
                href={mailLink}
                className="inline-flex items-center gap-2.5 px-[26px] py-[15px] bg-[#f5f5f5] text-[#0a0a0a] no-underline font-mono text-[13px] font-semibold tracking-[0.04em] w-fit hover-fill"
              >
                KIRIM EMAIL →
              </a>
            </div>
          </div>
          <div className="border border-white/10 bg-white/[0.02] p-[26px]">
            <div className="font-mono text-[11.5px] tracking-[0.12em] text-[#737373] mb-4">PREVIEW</div>
            <div className="font-mono text-[12.5px] text-[#a3a3a3] leading-[1.7] whitespace-pre-wrap break-words">
              {`To: ${profile.email}\nSubject: [Project] ${service || "(belum dipilih)"}\n\n${body}`}
            </div>
          </div>
        </div>
      )}

      {method === "wa" && (
        <div data-r="panel" className="grid grid-cols-[1.3fr_1fr] gap-12 items-start max-[980px]:grid-cols-1 max-[980px]:gap-8">
          <div>
            <div className="font-mono text-[11.5px] tracking-[0.12em] text-[#737373] mb-4">CHAT LANGSUNG</div>
            <h2 className="text-[clamp(24px,3vw,34px)] font-bold tracking-[-0.02em] mb-4">Respon cepat, tanpa formalitas.</h2>
            <p className="text-[15px] text-[#a3a3a3] leading-[1.6] mb-6">
              Pilih topik biar pesannya langsung terisi, lalu tekan tombol — WhatsApp terbuka dengan draft pesan yang siap kirim.
            </p>
            <div className="flex flex-wrap gap-2 mb-6">{SERVICES.map((s) => chip(s, service, setService))}</div>
            <a
              href={waLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3 px-[30px] py-4 bg-[#f5f5f5] text-[#0a0a0a] no-underline font-mono text-sm font-semibold tracking-[0.04em] hover-fill"
            >
              BUKA WHATSAPP →
            </a>
          </div>
          <div className="border border-white/10 bg-white/[0.02] p-[26px]">
            <div className="font-mono text-[11.5px] tracking-[0.12em] text-[#737373] mb-4">DRAFT PESAN</div>
            <div className="font-mono text-[13px] text-[#d4d4d4] leading-[1.7] whitespace-pre-wrap">{waText}</div>
            <div className="mt-5 pt-4 border-t border-white/8 font-mono text-xs text-[#737373]">+{num}</div>
          </div>
        </div>
      )}

      {method === "call" && (
        <div data-r="panel" className="grid grid-cols-[1.3fr_1fr] gap-12 items-start max-[980px]:grid-cols-1 max-[980px]:gap-8">
          <div>
            <div className="font-mono text-[11.5px] tracking-[0.12em] text-[#737373] mb-4">PILIH JADWAL · 15 MENIT</div>
            <div className="font-mono text-[11px] text-[#525252] mb-3">TANGGAL (WITA)</div>
            <div data-r="slots" className="grid grid-cols-4 gap-2 mb-7 max-[640px]:grid-cols-2">
              {days.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setCallDay(d.id)}
                  className="px-1.5 py-3 cursor-pointer text-center"
                  style={{
                    background: callDay === d.id ? "#f5f5f5" : "transparent",
                    color: callDay === d.id ? "#0a0a0a" : "#d4d4d4",
                    border: `1px solid ${callDay === d.id ? "#f5f5f5" : "rgba(255,255,255,0.14)"}`,
                  }}
                >
                  <span className="block text-[11px] opacity-70">{d.dow}</span>
                  <span className="block text-lg font-bold mt-0.5">{d.num}</span>
                  <span className="block text-[10px] opacity-70">{d.mon}</span>
                </button>
              ))}
            </div>
            <div className="font-mono text-[11px] text-[#525252] mb-3">JAM</div>
            <div data-r="slots" className="grid grid-cols-4 gap-2 max-[640px]:grid-cols-2">
              {TIMES.map((t) => (
                <button
                  key={t}
                  onClick={() => setCallTime(t)}
                  className="px-1.5 py-3 cursor-pointer text-center font-mono text-[13px]"
                  style={{
                    background: callTime === t ? "#f5f5f5" : "transparent",
                    color: callTime === t ? "#0a0a0a" : "#d4d4d4",
                    border: `1px solid ${callTime === t ? "#f5f5f5" : "rgba(255,255,255,0.14)"}`,
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="border border-white/10 bg-white/[0.02] p-[26px]">
            <div className="font-mono text-[11.5px] tracking-[0.12em] text-[#737373] mb-4">RINGKASAN BOOKING</div>
            <div className="flex flex-col gap-3.5 font-mono text-[13px]">
              <div className="flex justify-between">
                <span className="text-[#737373]">Tanggal</span>
                <span className="text-[#f5f5f5]">{dayObj ? dayObj.label : "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#737373]">Jam</span>
                <span className="text-[#f5f5f5]">{callTime || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#737373]">Durasi</span>
                <span className="text-[#f5f5f5]">15 menit</span>
              </div>
            </div>
            <a
              href={bookLink}
              target="_blank"
              rel="noreferrer"
              className="mt-6 flex items-center justify-center gap-2.5 px-[22px] py-[15px] text-[#0a0a0a] no-underline font-mono text-[13px] font-semibold tracking-[0.04em] hover-fill"
              style={{
                background: ready ? "#f5f5f5" : "#525252",
                pointerEvents: ready ? "auto" : "none",
              }}
            >
              {ready ? "KONFIRMASI VIA WHATSAPP →" : "PILIH TANGGAL & JAM"}
            </a>
            <div className="mt-3.5 font-mono text-[11px] text-[#525252] leading-[1.5]">
              Konfirmasi jadwal akan dikirim via WhatsApp.
            </div>
          </div>
        </div>
      )}

      <div className="mt-16 font-mono text-[11.5px] tracking-[0.12em] text-[#737373] mb-4">ATAU TEMUKAN AKU DI</div>
      <div data-r="four" className="grid grid-cols-5 gap-px bg-white/8 border border-white/8 max-[980px]:grid-cols-2">
        <a href={`mailto:${profile.email}`} className="hover-panel bg-[#0a0a0a] p-6 no-underline text-[#f5f5f5]">
          <div className="font-mono text-[11px] text-[#525252] mb-2">EMAIL</div>
          <div className="text-[15px]">{profile.email}</div>
        </a>
        <a href={profile.instagramUrl} target="_blank" rel="noreferrer" className="hover-panel bg-[#0a0a0a] p-6 no-underline text-[#f5f5f5]">
          <div className="font-mono text-[11px] text-[#525252] mb-2">INSTAGRAM</div>
          <div className="text-[15px]">{profile.instagram} ↗</div>
        </a>
        <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" className="hover-panel bg-[#0a0a0a] p-6 no-underline text-[#f5f5f5]">
          <div className="font-mono text-[11px] text-[#525252] mb-2">LINKEDIN</div>
          <div className="text-[15px]">{profile.linkedin} ↗</div>
        </a>
        <a href={profile.githubUrl} target="_blank" rel="noreferrer" className="hover-panel bg-[#0a0a0a] p-6 no-underline text-[#f5f5f5]">
          <div className="font-mono text-[11px] text-[#525252] mb-2">GITHUB</div>
          <div className="text-[15px]">{profile.github} ↗</div>
        </a>
        <a href={profile.tiktokUrl} target="_blank" rel="noreferrer" className="hover-panel bg-[#0a0a0a] p-6 no-underline text-[#f5f5f5]">
          <div className="font-mono text-[11px] text-[#525252] mb-2">TIKTOK</div>
          <div className="text-[15px]">{profile.tiktok} ↗</div>
        </a>
      </div>
    </>
  );
}
