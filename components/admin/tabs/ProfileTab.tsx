"use client";

import { PortfolioData } from "@/lib/types";
import { Field, TextAreaField, SectionTitle } from "../ui";

export default function ProfileTab({
  data,
  setData,
}: {
  data: PortfolioData;
  setData: (d: PortfolioData) => void;
}) {
  const P = data.profile;
  const ST = data.stats;

  function update(patch: Partial<typeof P>) {
    setData({ ...data, profile: { ...P, ...patch } });
  }
  function updateStats(patch: Partial<typeof ST>) {
    setData({ ...data, stats: { ...ST, ...patch } });
  }

  return (
    <div className="flex flex-col gap-8 max-w-[640px]">
      <SectionTitle>PROFIL</SectionTitle>
      <div className="grid grid-cols-2 gap-4">
        <Field label="NAMA" value={P.name} onChange={(v) => update({ name: v })} />
        <Field label="STATUS" value={P.status} onChange={(v) => update({ status: v })} />
        <Field label="LOKASI" value={P.location} onChange={(v) => update({ location: v })} />
        <Field label="STUDI" value={P.study} onChange={(v) => update({ study: v })} />
      </div>
      <TextAreaField label="TAGLINE" value={P.tagline} onChange={(v) => update({ tagline: v })} rows={3} />
      <Field
        label="ROLES (pisahkan dengan koma — untuk animasi mengetik)"
        value={P.roles.join(", ")}
        onChange={(v) =>
          update({ roles: v.split(",").map((s) => s.trim()).filter(Boolean) })
        }
      />

      <SectionTitle>STATISTIK (section About)</SectionTitle>
      <div className="grid grid-cols-4 gap-4">
        <Field label="PERAN" value={ST.roles} onChange={(v) => updateStats({ roles: v })} />
        <Field label="PROYEK" value={ST.projects} onChange={(v) => updateStats({ projects: v })} />
        <Field label="AUTOMASI" value={ST.automations} onChange={(v) => updateStats({ automations: v })} />
        <Field label="PRODUK" value={ST.products} onChange={(v) => updateStats({ products: v })} />
      </div>

      <SectionTitle>KONTAK</SectionTitle>
      <div className="grid grid-cols-2 gap-4">
        <Field label="WHATSAPP (62xxxxxxxxxx)" value={P.whatsapp} onChange={(v) => update({ whatsapp: v })} />
        <Field label="EMAIL" value={P.email} onChange={(v) => update({ email: v })} />
      </div>

      <SectionTitle>SOSIAL MEDIA</SectionTitle>
      <div className="grid grid-cols-2 gap-4">
        <Field label="INSTAGRAM HANDLE" value={P.instagram} onChange={(v) => update({ instagram: v })} />
        <Field label="INSTAGRAM URL" value={P.instagramUrl} onChange={(v) => update({ instagramUrl: v })} />
        <Field label="LINKEDIN HANDLE" value={P.linkedin} onChange={(v) => update({ linkedin: v })} />
        <Field label="LINKEDIN URL" value={P.linkedinUrl} onChange={(v) => update({ linkedinUrl: v })} />
        <Field label="GITHUB HANDLE" value={P.github} onChange={(v) => update({ github: v })} />
        <Field label="GITHUB URL" value={P.githubUrl} onChange={(v) => update({ githubUrl: v })} />
        <Field label="TIKTOK HANDLE" value={P.tiktok} onChange={(v) => update({ tiktok: v })} />
        <Field label="TIKTOK URL" value={P.tiktokUrl} onChange={(v) => update({ tiktokUrl: v })} />
      </div>

      <SectionTitle>STACK &amp; TOOLS (ticker, pisahkan dengan koma)</SectionTitle>
      <TextAreaField
        label="TOOLS"
        value={data.tools.join(", ")}
        onChange={(v) => setData({ ...data, tools: v.split(",").map((s) => s.trim()).filter(Boolean) })}
        rows={2}
      />
    </div>
  );
}
