"use client";

import { useState } from "react";
import { GalleryImage, GalleryRow, GraphicContentBlock, MetaPair } from "@/lib/types";
import { Field, GhostButton, ImageUploadField, PrimaryButton, TextAreaField } from "./ui";

export function MetaEditor({ meta, onChange }: { meta: MetaPair[]; onChange: (m: MetaPair[]) => void }) {
  function update(i: number, patch: Partial<MetaPair>) {
    const next = meta.slice();
    next[i] = { ...next[i], ...patch };
    onChange(next);
  }
  function remove(i: number) {
    onChange(meta.filter((_, idx) => idx !== i));
  }
  function add() {
    onChange([...meta, { k: "LABEL", v: "Nilai" }]);
  }

  return (
    <div className="flex flex-col gap-2">
      {meta.map((m, i) => (
        <div key={i} className="flex items-end gap-2">
          <Field label="KEY" value={m.k} onChange={(v) => update(i, { k: v })} />
          <Field label="VALUE" value={m.v} onChange={(v) => update(i, { v })} />
          <GhostButton danger onClick={() => remove(i)}>
            X
          </GhostButton>
        </div>
      ))}
      <div>
        <GhostButton onClick={add}>+ META</GhostButton>
      </div>
    </div>
  );
}

export function PhotoStripEditor({
  photos,
  onChange,
}: {
  photos: string[];
  /** Always given the freshest photo list — see BlockEditor's onChange for why. */
  onChange: (updater: (prev: string[]) => string[]) => void;
}) {
  function update(i: number, url: string) {
    onChange((prev) => {
      const next = prev.slice();
      next[i] = url;
      return next;
    });
  }
  function remove(i: number) {
    onChange((prev) => prev.filter((_, idx) => idx !== i));
  }
  function add() {
    onChange((prev) => [...prev, ""]);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-4 gap-3 max-[720px]:grid-cols-2">
        {photos.map((url, i) => (
          <div key={i} className="border border-white/12 bg-white/[0.02] p-3 flex flex-col gap-2">
            <ImageUploadField label={`FOTO ${i + 1}`} url={url} onChange={(u) => update(i, u)} />
            <GhostButton danger onClick={() => remove(i)}>
              HAPUS
            </GhostButton>
          </div>
        ))}
      </div>
      <div>
        <PrimaryButton onClick={add}>+ TAMBAH FOTO</PrimaryButton>
      </div>
    </div>
  );
}

export type GalleryItem = { id: string; cap: string; url?: string; href?: string };

let counter = 0;
function newId() {
  counter += 1;
  return `gg-${Date.now()}-${counter}`;
}

export function GalleryEditor({
  gallery,
  onChange,
}: {
  gallery: GalleryItem[];
  onChange: (g: GalleryItem[]) => void;
}) {
  function update(i: number, patch: Partial<GalleryItem>) {
    const next = gallery.slice();
    next[i] = { ...next[i], ...patch };
    onChange(next);
  }
  function remove(i: number) {
    onChange(gallery.filter((_, idx) => idx !== i));
  }
  function add() {
    onChange([...gallery, { id: newId(), cap: "Keterangan" }]);
  }

  return (
    <div className="flex flex-col gap-3">
      {gallery.map((g, i) => (
        <div key={g.id} className="border border-white/12 bg-white/[0.02] p-4 flex flex-col gap-3">
          <ImageUploadField label={`GAMBAR ${i + 1}`} url={g.url} onChange={(url) => update(i, { url })} />
          <Field label="CAPTION" value={g.cap} onChange={(v) => update(i, { cap: v })} />
          <Field
            label="LINK INSTAGRAM (opsional — gambar jadi bisa diklik)"
            value={g.href || ""}
            onChange={(v) => update(i, { href: v })}
          />
          <div className="flex justify-end">
            <GhostButton danger onClick={() => remove(i)}>
              HAPUS
            </GhostButton>
          </div>
        </div>
      ))}
      <div>
        <PrimaryButton onClick={add}>+ TAMBAH GAMBAR GALERI</PrimaryButton>
      </div>
    </div>
  );
}

// ─── Row-based gallery: pick photos-per-row up front, all shown at the same height ──

let rowCounter = 0;
function newRowId() {
  rowCounter += 1;
  return `row-${Date.now()}-${rowCounter}`;
}

export function RowGalleryEditor({
  rows,
  onChange,
}: {
  rows: GalleryRow[];
  /** Always given the freshest rows — see BlockEditor's onChange for why. */
  onChange: (updater: (prev: GalleryRow[]) => GalleryRow[]) => void;
}) {
  const [newCount, setNewCount] = useState(2);

  function addRow() {
    const images = Array.from({ length: newCount }, () => ({ id: newId() }));
    onChange((prev) => [...prev, { id: newRowId(), images }]);
  }
  function removeRow(ri: number) {
    onChange((prev) => prev.filter((_, i) => i !== ri));
  }
  function updateImage(ri: number, ii: number, patch: Partial<GalleryRow["images"][number]>) {
    onChange((prev) => {
      const next = prev.slice();
      const images = next[ri].images.slice();
      images[ii] = { ...images[ii], ...patch };
      next[ri] = { ...next[ri], images };
      return next;
    });
  }
  function addImageToRow(ri: number) {
    onChange((prev) => {
      if (prev[ri].images.length >= 4) return prev;
      const next = prev.slice();
      next[ri] = { ...next[ri], images: [...next[ri].images, { id: newId() }] };
      return next;
    });
  }
  function removeImageFromRow(ri: number, ii: number) {
    onChange((prev) => {
      const images = prev[ri].images.filter((_, i) => i !== ii);
      if (images.length === 0) return prev.filter((_, i) => i !== ri);
      const next = prev.slice();
      next[ri] = { ...next[ri], images };
      return next;
    });
  }

  return (
    <div className="flex flex-col gap-4">
      {rows.map((row, ri) => (
        <div key={row.id} className="border border-white/12 bg-white/[0.02] p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <span className="font-mono text-[11px] tracking-[0.08em] text-[#737373]">
              BARIS {ri + 1} · {row.images.length} foto · tinggi sama
            </span>
            <div className="flex gap-2">
              {row.images.length < 4 && <GhostButton onClick={() => addImageToRow(ri)}>+ FOTO</GhostButton>}
              <GhostButton danger onClick={() => removeRow(ri)}>
                HAPUS BARIS
              </GhostButton>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 max-[560px]:grid-cols-1">
            {row.images.map((img, ii) => (
              <div key={img.id} className="border border-white/10 p-3 flex flex-col gap-2">
                <ImageUploadField label={`FOTO ${ii + 1}`} url={img.url} onChange={(url) => updateImage(ri, ii, { url })} />
                <Field label="CAPTION (opsional)" value={img.cap || ""} onChange={(v) => updateImage(ri, ii, { cap: v })} />
                <Field
                  label="LINK INSTAGRAM (opsional — foto jadi bisa diklik)"
                  value={img.href || ""}
                  onChange={(v) => updateImage(ri, ii, { href: v })}
                />
                <div className="flex justify-end">
                  <GhostButton danger onClick={() => removeImageFromRow(ri, ii)}>
                    HAPUS FOTO
                  </GhostButton>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="flex items-end gap-3 flex-wrap">
        <label className="flex flex-col gap-1.5">
          <span className="font-mono text-[11px] tracking-[0.08em] text-[#737373]">FOTO PER BARIS (maks 4)</span>
          <select
            value={newCount}
            onChange={(e) => setNewCount(Number(e.target.value))}
            className="bg-white/[0.03] border border-white/14 text-[#f5f5f5] text-sm px-3.5 py-2.5 outline-none"
          >
            {[1, 2, 3, 4].map((n) => (
              <option key={n} value={n} className="bg-[#0a0a0a]">
                {n} foto
              </option>
            ))}
          </select>
        </label>
        <PrimaryButton onClick={addRow}>+ TAMBAH BARIS</PrimaryButton>
      </div>
    </div>
  );
}

// ─── Graphic story: an ordered mix of paragraphs and photo-rows, reorderable ──

let contentCounter = 0;
function newContentId() {
  contentCounter += 1;
  return `gc-${Date.now()}-${contentCounter}`;
}

export function GraphicContentEditor({
  content,
  onChange,
}: {
  content: GraphicContentBlock[];
  /** Always given the freshest content list — see BlockEditor's onChange for why. */
  onChange: (updater: (prev: GraphicContentBlock[]) => GraphicContentBlock[]) => void;
}) {
  const [newRowCount, setNewRowCount] = useState(2);

  function move(i: number, dir: -1 | 1) {
    onChange((prev) => {
      const j = i + dir;
      if (j < 0 || j >= prev.length) return prev;
      const next = prev.slice();
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }
  function remove(i: number) {
    onChange((prev) => prev.filter((_, idx) => idx !== i));
  }
  function addText() {
    onChange((prev) => [...prev, { id: newContentId(), type: "text", text: "" }]);
  }
  function addRow() {
    const images: GalleryImage[] = Array.from({ length: newRowCount }, () => ({ id: newId() }));
    onChange((prev) => [...prev, { id: newContentId(), type: "row", images }]);
  }
  function updateText(i: number, text: string) {
    onChange((prev) => {
      const blk = prev[i];
      if (blk.type !== "text") return prev;
      const next = prev.slice();
      next[i] = { ...blk, text };
      return next;
    });
  }
  function updateRowImage(i: number, ii: number, patch: Partial<GalleryImage>) {
    onChange((prev) => {
      const blk = prev[i];
      if (blk.type !== "row") return prev;
      const images = blk.images.slice();
      images[ii] = { ...images[ii], ...patch };
      const next = prev.slice();
      next[i] = { ...blk, images };
      return next;
    });
  }
  function addImageToRow(i: number) {
    onChange((prev) => {
      const blk = prev[i];
      if (blk.type !== "row" || blk.images.length >= 4) return prev;
      const next = prev.slice();
      next[i] = { ...blk, images: [...blk.images, { id: newId() }] };
      return next;
    });
  }
  function removeImageFromRow(i: number, ii: number) {
    onChange((prev) => {
      const blk = prev[i];
      if (blk.type !== "row") return prev;
      const images = blk.images.filter((_, idx) => idx !== ii);
      if (images.length === 0) return prev.filter((_, idx) => idx !== i);
      const next = prev.slice();
      next[i] = { ...blk, images };
      return next;
    });
  }

  return (
    <div className="flex flex-col gap-4">
      {content.map((blk, i) => (
        <div key={blk.id} className="border border-white/12 bg-white/[0.02] p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <span className="font-mono text-[10px] tracking-[0.1em] text-[#525252] uppercase">
              {blk.type === "text" ? "Paragraf" : `Baris foto · ${blk.images.length} foto · tinggi sama`}
            </span>
            <div className="flex gap-1.5">
              <GhostButton onClick={() => move(i, -1)}>↑</GhostButton>
              <GhostButton onClick={() => move(i, 1)}>↓</GhostButton>
              {blk.type === "row" && blk.images.length < 4 && (
                <GhostButton onClick={() => addImageToRow(i)}>+ FOTO</GhostButton>
              )}
              <GhostButton danger onClick={() => remove(i)}>
                HAPUS
              </GhostButton>
            </div>
          </div>

          {blk.type === "text" ? (
            <TextAreaField label="TEKS PARAGRAF" value={blk.text || ""} onChange={(v) => updateText(i, v)} rows={4} />
          ) : (
            <div className="grid grid-cols-2 gap-3 max-[560px]:grid-cols-1">
              {blk.images.map((img, ii) => (
                <div key={img.id} className="border border-white/10 p-3 flex flex-col gap-2">
                  <ImageUploadField label={`FOTO ${ii + 1}`} url={img.url} onChange={(url) => updateRowImage(i, ii, { url })} />
                  <Field label="CAPTION (opsional)" value={img.cap || ""} onChange={(v) => updateRowImage(i, ii, { cap: v })} />
                  <Field
                    label="LINK INSTAGRAM (opsional — foto jadi bisa diklik)"
                    value={img.href || ""}
                    onChange={(v) => updateRowImage(i, ii, { href: v })}
                  />
                  <div className="flex justify-end">
                    <GhostButton danger onClick={() => removeImageFromRow(i, ii)}>
                      HAPUS FOTO
                    </GhostButton>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      <div className="flex items-end gap-3 flex-wrap">
        <GhostButton onClick={addText}>+ PARAGRAF</GhostButton>
        <label className="flex flex-col gap-1.5">
          <span className="font-mono text-[11px] tracking-[0.08em] text-[#737373]">FOTO PER BARIS BARU (maks 4)</span>
          <select
            value={newRowCount}
            onChange={(e) => setNewRowCount(Number(e.target.value))}
            className="bg-white/[0.03] border border-white/14 text-[#f5f5f5] text-sm px-3.5 py-2.5 outline-none"
          >
            {[1, 2, 3, 4].map((n) => (
              <option key={n} value={n} className="bg-[#0a0a0a]">
                {n} foto
              </option>
            ))}
          </select>
        </label>
        <PrimaryButton onClick={addRow}>+ TAMBAH BARIS FOTO</PrimaryButton>
      </div>
    </div>
  );
}
