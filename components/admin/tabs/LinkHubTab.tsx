"use client";

import { Dispatch, SetStateAction } from "react";
import { LinkHubGroup, LinkHubLink, PortfolioData } from "@/lib/types";
import { groupSlug } from "@/lib/linkHub";
import { Card, Field, GhostButton, ImageUploadField, PrimaryButton, SectionTitle, TextAreaField } from "../ui";

let counter = 0;
function newId(prefix: string) {
  counter += 1;
  return `${prefix}-${Date.now()}-${counter}`;
}

export default function LinkHubTab({
  data,
  setData,
}: {
  data: PortfolioData;
  setData: Dispatch<SetStateAction<PortfolioData>>;
}) {
  const hub = data.linkHub;

  function update(patch: Partial<typeof hub>) {
    setData((prev) => ({ ...prev, linkHub: { ...prev.linkHub, ...patch } }));
  }
  function updateGroups(updater: (prev: LinkHubGroup[]) => LinkHubGroup[]) {
    setData((prev) => ({ ...prev, linkHub: { ...prev.linkHub, groups: updater(prev.linkHub.groups) } }));
  }

  function addGroup() {
    updateGroups((prev) => [...prev, { id: newId("grp"), title: "Nama tempat / project", links: [] }]);
  }
  function removeGroup(gi: number) {
    updateGroups((prev) => prev.filter((_, i) => i !== gi));
  }
  function updateGroupField(gi: number, patch: Partial<LinkHubGroup>) {
    updateGroups((prev) => {
      const next = prev.slice();
      next[gi] = { ...next[gi], ...patch };
      return next;
    });
  }
  function addLink(gi: number) {
    updateGroups((prev) => {
      const next = prev.slice();
      next[gi] = { ...next[gi], links: [...next[gi].links, { id: newId("lnk"), label: "", url: "" }] };
      return next;
    });
  }
  function updateLink(gi: number, li: number, patch: Partial<LinkHubLink>) {
    updateGroups((prev) => {
      const next = prev.slice();
      const links = next[gi].links.slice();
      links[li] = { ...links[li], ...patch };
      next[gi] = { ...next[gi], links };
      return next;
    });
  }
  function removeLink(gi: number, li: number) {
    updateGroups((prev) => {
      const next = prev.slice();
      next[gi] = { ...next[gi], links: next[gi].links.filter((_, i) => i !== li) };
      return next;
    });
  }

  return (
    <div className="flex flex-col gap-8 max-w-[720px]">
      <SectionTitle>LINK HUB (portofolio.nurfikri.com)</SectionTitle>
      <p className="font-mono text-[11px] leading-[1.6] text-[#737373] -mt-4">
        Halaman utama (portofolio.nurfikri.com) nampilin tiap group sebagai satu baris — judul, tipe, lokasi, intro
        singkat, dan tombol VISIT LINK. Klik VISIT LINK buka halaman khusus group itu
        (portofolio.nurfikri.com/&lt;slug&gt;) yang isinya link-link di dalamnya. Jadi tetap 1 link yang kamu kasih
        keluar, tapi rapi per konteks.
      </p>

      <Field label="HEADLINE" value={hub.headline} onChange={(v) => update({ headline: v })} />
      <TextAreaField label="DESKRIPSI SINGKAT" value={hub.description} onChange={(v) => update({ description: v })} rows={3} />

      <div className="flex flex-col gap-4">
        {hub.groups.map((g, gi) => (
          <Card key={g.id}>
            <div className="flex items-end gap-2">
              <Field
                label="NAMA GROUP (mis. Happy Kamper, Anak Teknik Indo)"
                value={g.title}
                onChange={(v) => updateGroupField(gi, { title: v })}
              />
              <GhostButton danger onClick={() => removeGroup(gi)}>
                HAPUS GROUP
              </GhostButton>
            </div>
            <div className="font-mono text-[11px] text-[#525252] -mt-2">
              URL: portofolio.nurfikri.com/<span className="text-[#a3a3a3]">{groupSlug(hub.groups, gi)}</span>{" "}
              (otomatis ngikutin nama group)
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="ROLE (mis. Frontend Developer)" value={g.role || ""} onChange={(v) => updateGroupField(gi, { role: v })} />
              <Field label="TIPE (Part-time, Internship, Full-time, dll)" value={g.type || ""} onChange={(v) => updateGroupField(gi, { type: v })} />
              <Field label="LOKASI" value={g.location || ""} onChange={(v) => updateGroupField(gi, { location: v })} />
              <Field label="LAMA BEKERJA (mis. 6 bulan, 2023 — sekarang)" value={g.duration || ""} onChange={(v) => updateGroupField(gi, { duration: v })} />
            </div>
            <TextAreaField
              label="INTRO SINGKAT (1-2 kalimat)"
              value={g.intro || ""}
              onChange={(v) => updateGroupField(gi, { intro: v })}
              rows={2}
            />
            <ImageUploadField
              label="GAMBAR (opsional — lebar penuh di halaman detail, tinggi ikut rasio asli)"
              url={g.cover}
              onChange={(url) => updateGroupField(gi, { cover: url })}
            />

            <div className="flex flex-col gap-2">
              {g.links.map((l, li) => (
                <div key={l.id} className="flex items-end gap-2">
                  <Field label="LABEL" value={l.label} onChange={(v) => updateLink(gi, li, { label: v })} />
                  <Field label="URL" value={l.url} onChange={(v) => updateLink(gi, li, { url: v })} />
                  <GhostButton danger onClick={() => removeLink(gi, li)}>
                    X
                  </GhostButton>
                </div>
              ))}
            </div>
            <div>
              <GhostButton onClick={() => addLink(gi)}>+ LINK</GhostButton>
            </div>
          </Card>
        ))}
        <div>
          <PrimaryButton onClick={addGroup}>+ TAMBAH GROUP</PrimaryButton>
        </div>
      </div>
    </div>
  );
}
