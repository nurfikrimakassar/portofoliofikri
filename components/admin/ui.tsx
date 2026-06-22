"use client";

import { useRef, useState } from "react";

export function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-mono text-[11px] tracking-[0.08em] text-[#737373]">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white/[0.03] border border-white/14 text-[#f5f5f5] text-sm px-3.5 py-2.5 outline-none focus:border-white/50"
      />
    </label>
  );
}

export function TextAreaField({
  label,
  value,
  onChange,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-mono text-[11px] tracking-[0.08em] text-[#737373]">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full bg-white/[0.03] border border-white/14 text-[#f5f5f5] text-sm px-3.5 py-2.5 outline-none resize-y focus:border-white/50"
      />
    </label>
  );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-mono text-[11.5px] tracking-[0.15em] text-[#737373] mt-9 mb-3 first:mt-0">
      {children}
    </div>
  );
}

export function GhostButton({
  children,
  onClick,
  danger,
}: {
  children: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="font-mono text-[11px] px-2.5 py-1.5 border whitespace-nowrap"
      style={{
        borderColor: danger ? "rgba(248,113,113,0.4)" : "rgba(255,255,255,0.18)",
        color: danger ? "#f87171" : "#a3a3a3",
      }}
    >
      {children}
    </button>
  );
}

export function PrimaryButton({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type={onClick ? "button" : "submit"}
      onClick={onClick}
      disabled={disabled}
      className="px-6 py-3 bg-[#f5f5f5] text-[#0a0a0a] font-mono text-[12.5px] font-semibold tracking-[0.04em] disabled:opacity-50"
    >
      {children}
    </button>
  );
}

export function Card({ children }: { children: React.ReactNode }) {
  return <div className="border border-white/12 bg-white/[0.02] p-5 flex flex-col gap-3">{children}</div>;
}

export function ImageUploadField({
  label,
  url,
  onChange,
}: {
  label: string;
  url?: string;
  onChange: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(file: File) {
    setBusy(true);
    setError("");
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: form });
    setBusy(false);
    if (res.ok) {
      const data = await res.json();
      onChange(data.url);
    } else {
      const data = await res.json().catch(() => ({ error: "Upload gagal." }));
      setError(data.error || "Upload gagal.");
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <span className="font-mono text-[11px] tracking-[0.08em] text-[#737373]">{label}</span>
      <div className="flex items-center gap-3">
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt={label} className="w-20 h-20 object-cover border border-white/14" />
        ) : (
          <div className="w-20 h-20 border border-dashed border-white/15 flex items-center justify-center font-mono text-[10px] text-[#525252] text-center px-1">
            no image
          </div>
        )}
        <div className="flex flex-col gap-2">
          <GhostButton onClick={() => inputRef.current?.click()}>{busy ? "UPLOADING..." : "UPLOAD"}</GhostButton>
          {url && <GhostButton onClick={() => onChange("")}>HAPUS</GhostButton>}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
            e.target.value = "";
          }}
        />
      </div>
      {error && <span className="text-[11px] text-[#f87171] font-mono">{error}</span>}
    </div>
  );
}
