"use client";

import { MetaPair } from "@/lib/types";
import { Field, GhostButton, ImageUploadField, PrimaryButton } from "./ui";

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

export type GalleryItem = { id: string; cap: string; url?: string };

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
