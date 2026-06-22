"use client";

import { GraphicWork, PortfolioData, WebWork } from "@/lib/types";
import { Card, Field, GhostButton, PrimaryButton, SectionTitle, TextAreaField } from "../ui";

function slugId(prefix: string, existing: string[]) {
  let n = 1;
  while (existing.includes(`${prefix}${n}`)) n++;
  return `${prefix}${n}`;
}

export default function WorksTab({
  data,
  setData,
}: {
  data: PortfolioData;
  setData: (d: PortfolioData) => void;
}) {
  const web = data.webWorks;
  const graphic = data.graphicWorks;

  function updateWeb(i: number, patch: Partial<WebWork>) {
    const next = web.slice();
    next[i] = { ...next[i], ...patch };
    setData({ ...data, webWorks: next });
  }
  function removeWeb(i: number) {
    setData({ ...data, webWorks: web.filter((_, idx) => idx !== i) });
  }
  function addWeb() {
    const id = slugId("w", web.map((w) => w.id));
    setData({
      ...data,
      webWorks: [
        ...web,
        { id, idx: `W0${web.length + 1}`, title: "Project baru", cat: "Web App", year: "2024", desc: "Deskripsi singkat." },
      ],
    });
  }

  function updateGraphic(i: number, patch: Partial<GraphicWork>) {
    const next = graphic.slice();
    next[i] = { ...next[i], ...patch };
    setData({ ...data, graphicWorks: next });
  }
  function removeGraphic(i: number) {
    setData({ ...data, graphicWorks: graphic.filter((_, idx) => idx !== i) });
  }
  function addGraphic() {
    const id = slugId("g", graphic.map((g) => g.id));
    setData({ ...data, graphicWorks: [...graphic, { id, title: "Karya baru", cat: "Branding" }] });
  }

  return (
    <div className="flex flex-col gap-10 max-w-[760px]">
      <div>
        <SectionTitle>WEB PROJECTS</SectionTitle>
        <div className="flex flex-col gap-4">
          {web.map((w, i) => (
            <Card key={w.id}>
              <div className="font-mono text-[10px] text-[#525252]">id: {w.id}</div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="IDX" value={w.idx} onChange={(v) => updateWeb(i, { idx: v })} />
                <Field label="YEAR" value={w.year} onChange={(v) => updateWeb(i, { year: v })} />
                <Field label="TITLE" value={w.title} onChange={(v) => updateWeb(i, { title: v })} />
                <Field label="CATEGORY" value={w.cat} onChange={(v) => updateWeb(i, { cat: v })} />
              </div>
              <TextAreaField label="DESC" value={w.desc} onChange={(v) => updateWeb(i, { desc: v })} rows={2} />
              <div className="flex justify-end">
                <GhostButton danger onClick={() => removeWeb(i)}>
                  HAPUS
                </GhostButton>
              </div>
            </Card>
          ))}
          <div>
            <PrimaryButton onClick={addWeb}>+ TAMBAH WEB PROJECT</PrimaryButton>
          </div>
        </div>
      </div>

      <div>
        <SectionTitle>GRAPHIC DESIGN</SectionTitle>
        <div className="flex flex-col gap-4">
          {graphic.map((g, i) => (
            <Card key={g.id}>
              <div className="font-mono text-[10px] text-[#525252]">id: {g.id}</div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="TITLE" value={g.title} onChange={(v) => updateGraphic(i, { title: v })} />
                <Field label="CATEGORY" value={g.cat} onChange={(v) => updateGraphic(i, { cat: v })} />
              </div>
              <div className="flex justify-end">
                <GhostButton danger onClick={() => removeGraphic(i)}>
                  HAPUS
                </GhostButton>
              </div>
            </Card>
          ))}
          <div>
            <PrimaryButton onClick={addGraphic}>+ TAMBAH KARYA GRAPHIC</PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
}
