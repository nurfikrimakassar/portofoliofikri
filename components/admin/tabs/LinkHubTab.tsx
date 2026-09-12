"use client";

import { Dispatch, SetStateAction } from "react";
import { LinkHubGroup, LinkHubLink, PortfolioData } from "@/lib/types";
import { Card, Field, GhostButton, PrimaryButton, SectionTitle, TextAreaField } from "../ui";

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
  function updateGroupTitle(gi: number, title: string) {
    updateGroups((prev) => {
      const next = prev.slice();
      next[gi] = { ...next[gi], title };
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
        Satu halaman yang isinya kumpulan link — cocok dipakai kalau cuma boleh kasih satu link (misalnya form
        pendaftaran). Style-nya ngikut situs utama, tapi halamannya sendiri berdiri sendiri di subdomain{" "}
        <span className="text-[#a3a3a3]">portofolio.nurfikri.com</span>.
      </p>

      <Field label="HEADLINE" value={hub.headline} onChange={(v) => update({ headline: v })} />
      <TextAreaField label="DESKRIPSI SINGKAT" value={hub.description} onChange={(v) => update({ description: v })} rows={3} />

      <div className="flex flex-col gap-4">
        {hub.groups.map((g, gi) => (
          <Card key={g.id}>
            <div className="flex items-end gap-2">
              <Field label="NAMA GROUP (mis. Happy Kamper, Anak Teknik Indo)" value={g.title} onChange={(v) => updateGroupTitle(gi, v)} />
              <GhostButton danger onClick={() => removeGroup(gi)}>
                HAPUS GROUP
              </GhostButton>
            </div>

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
