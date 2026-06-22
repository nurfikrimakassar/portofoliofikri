"use client";

import { useState } from "react";
import { PortfolioData } from "@/lib/types";
import { Field, ImageUploadField, SectionTitle, TextAreaField } from "../ui";
import BlockEditor from "../BlockEditor";
import { GalleryEditor, MetaEditor } from "../MetaAndGallery";

type Kind = "project" | "blog" | "cs" | "graphic";

const KIND_LABEL: Record<Kind, string> = {
  project: "Web Project",
  blog: "Blog Post",
  cs: "Case Study (Automation)",
  graphic: "Graphic Design",
};

export default function DetailTab({
  data,
  setData,
}: {
  data: PortfolioData;
  setData: (d: PortfolioData) => void;
}) {
  const [kind, setKind] = useState<Kind>("project");

  const options =
    kind === "project"
      ? data.webWorks.map((w) => ({ id: w.id, label: `${w.idx} · ${w.title}` }))
      : kind === "blog"
      ? data.blog.posts.map((p) => ({ id: p.id, label: p.title }))
      : kind === "cs"
      ? data.automation.map((a) => ({ id: a.id, label: `${a.idx} · ${a.title}` }))
      : data.graphicWorks.map((g) => ({ id: g.id, label: g.title }));

  const [itemId, setItemId] = useState(options[0]?.id || "");
  const currentId = options.find((o) => o.id === itemId) ? itemId : options[0]?.id || "";

  function switchKind(k: Kind) {
    setKind(k);
    setItemId("");
  }

  return (
    <div className="flex flex-col gap-6 max-w-[760px]">
      <SectionTitle>DETAIL (PARAGRAF &amp; GAMBAR)</SectionTitle>
      <div className="flex gap-2 flex-wrap">
        {(Object.keys(KIND_LABEL) as Kind[]).map((k) => (
          <button
            key={k}
            onClick={() => switchKind(k)}
            className="font-mono text-[11px] px-3 py-2 border"
            style={{
              borderColor: kind === k ? "#f5f5f5" : "rgba(255,255,255,0.18)",
              background: kind === k ? "#f5f5f5" : "transparent",
              color: kind === k ? "#0a0a0a" : "#a3a3a3",
            }}
          >
            {KIND_LABEL[k]}
          </button>
        ))}
      </div>

      {options.length === 0 ? (
        <div className="font-mono text-sm text-[#737373]">Belum ada item untuk tipe ini.</div>
      ) : (
        <>
          <label className="flex flex-col gap-1.5 max-w-[420px]">
            <span className="font-mono text-[11px] tracking-[0.08em] text-[#737373]">PILIH ITEM</span>
            <select
              value={currentId}
              onChange={(e) => setItemId(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/14 text-[#f5f5f5] text-sm px-3.5 py-2.5 outline-none"
            >
              {options.map((o) => (
                <option key={o.id} value={o.id} className="bg-[#0a0a0a]">
                  {o.label}
                </option>
              ))}
            </select>
          </label>

          {kind === "project" && currentId && (
            <ProjectDetailEditor data={data} setData={setData} id={currentId} />
          )}
          {kind === "blog" && currentId && <BlogDetailEditor data={data} setData={setData} id={currentId} />}
          {kind === "cs" && currentId && <CsDetailEditor data={data} setData={setData} id={currentId} />}
          {kind === "graphic" && currentId && <GraphicDetailEditor data={data} setData={setData} id={currentId} />}
        </>
      )}
    </div>
  );
}

function ProjectDetailEditor({
  data,
  setData,
  id,
}: {
  data: PortfolioData;
  setData: (d: PortfolioData) => void;
  id: string;
}) {
  const detail = data.detail.project[id] || {};
  function update(patch: typeof detail) {
    setData({ ...data, detail: { ...data.detail, project: { ...data.detail.project, [id]: { ...detail, ...patch } } } });
  }

  return (
    <div className="flex flex-col gap-5 border-t border-white/10 pt-6">
      <ImageUploadField label="COVER" url={detail.cover} onChange={(url) => update({ cover: url })} />
      <div className="grid grid-cols-2 gap-3">
        <Field label="LINK LIVE SITE" value={detail.link || ""} onChange={(v) => update({ link: v })} />
        <Field label="LABEL TOMBOL" value={detail.linkLabel || ""} onChange={(v) => update({ linkLabel: v })} />
      </div>
      <div>
        <span className="font-mono text-[11px] tracking-[0.08em] text-[#737373] block mb-2">META (ROLE/YEAR/STACK)</span>
        <MetaEditor meta={detail.meta || []} onChange={(meta) => update({ meta })} />
      </div>
      <div>
        <span className="font-mono text-[11px] tracking-[0.08em] text-[#737373] block mb-2">BODY</span>
        <BlockEditor blocks={detail.body || []} onChange={(body) => update({ body })} />
      </div>
    </div>
  );
}

function BlogDetailEditor({
  data,
  setData,
  id,
}: {
  data: PortfolioData;
  setData: (d: PortfolioData) => void;
  id: string;
}) {
  const detail = data.detail.blog[id] || {};
  function update(patch: typeof detail) {
    setData({ ...data, detail: { ...data.detail, blog: { ...data.detail.blog, [id]: { ...detail, ...patch } } } });
  }

  return (
    <div className="flex flex-col gap-5 border-t border-white/10 pt-6">
      <ImageUploadField label="COVER" url={detail.cover} onChange={(url) => update({ cover: url })} />
      <div>
        <span className="font-mono text-[11px] tracking-[0.08em] text-[#737373] block mb-2">BODY</span>
        <BlockEditor blocks={detail.body || []} onChange={(body) => update({ body })} />
      </div>
    </div>
  );
}

function CsDetailEditor({
  data,
  setData,
  id,
}: {
  data: PortfolioData;
  setData: (d: PortfolioData) => void;
  id: string;
}) {
  const detail = data.detail.cs[id] || {};
  function update(patch: typeof detail) {
    setData({ ...data, detail: { ...data.detail, cs: { ...data.detail.cs, [id]: { ...detail, ...patch } } } });
  }

  return (
    <div className="flex flex-col gap-5 border-t border-white/10 pt-6">
      <TextAreaField label="SUMMARY" value={detail.summary || ""} onChange={(v) => update({ summary: v })} rows={3} />
      <div>
        <span className="font-mono text-[11px] tracking-[0.08em] text-[#737373] block mb-2">META (KLIEN/PERAN/TAHUN/STACK)</span>
        <MetaEditor meta={detail.meta || []} onChange={(meta) => update({ meta })} />
      </div>
      <div>
        <span className="font-mono text-[11px] tracking-[0.08em] text-[#737373] block mb-2">HASIL (3 ANGKA)</span>
        {(detail.results || []).map((r, i) => (
          <div key={i} className="flex items-end gap-2 mb-2">
            <Field
              label="NUM"
              value={r.num}
              onChange={(v) => {
                const next = (detail.results || []).slice();
                next[i] = { ...next[i], num: v };
                update({ results: next });
              }}
            />
            <Field
              label="LABEL"
              value={r.label}
              onChange={(v) => {
                const next = (detail.results || []).slice();
                next[i] = { ...next[i], label: v };
                update({ results: next });
              }}
            />
          </div>
        ))}
      </div>
      <div>
        <span className="font-mono text-[11px] tracking-[0.08em] text-[#737373] block mb-2">BODY</span>
        <BlockEditor blocks={detail.body || []} onChange={(body) => update({ body })} />
      </div>
    </div>
  );
}

function GraphicDetailEditor({
  data,
  setData,
  id,
}: {
  data: PortfolioData;
  setData: (d: PortfolioData) => void;
  id: string;
}) {
  const detail = data.detail.graphic[id] || {};
  function update(patch: typeof detail) {
    setData({ ...data, detail: { ...data.detail, graphic: { ...data.detail.graphic, [id]: { ...detail, ...patch } } } });
  }

  return (
    <div className="flex flex-col gap-5 border-t border-white/10 pt-6">
      <ImageUploadField label="COVER (ratio bebas)" url={detail.cover} onChange={(url) => update({ cover: url })} />
      <TextAreaField label="DESKRIPSI" value={detail.desc || ""} onChange={(v) => update({ desc: v })} rows={3} />
      <div className="grid grid-cols-2 gap-3">
        <Field label="LINK PORTO" value={detail.link || ""} onChange={(v) => update({ link: v })} />
        <Field label="LABEL TOMBOL" value={detail.linkLabel || ""} onChange={(v) => update({ linkLabel: v })} />
      </div>
      <TextAreaField label="TENTANG KARYA (imageNote)" value={detail.imageNote || ""} onChange={(v) => update({ imageNote: v })} rows={3} />
      <div>
        <span className="font-mono text-[11px] tracking-[0.08em] text-[#737373] block mb-2">GALERI</span>
        <GalleryEditor gallery={detail.gallery || []} onChange={(gallery) => update({ gallery })} />
      </div>
    </div>
  );
}
