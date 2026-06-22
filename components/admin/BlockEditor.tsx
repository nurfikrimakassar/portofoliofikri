"use client";

import { Block } from "@/lib/types";
import { Field, GhostButton, ImageUploadField, TextAreaField } from "./ui";

let counter = 0;
function newId(prefix: string) {
  counter += 1;
  return `${prefix}-${Date.now()}-${counter}`;
}

export default function BlockEditor({
  blocks,
  onChange,
}: {
  blocks: Block[];
  onChange: (blocks: Block[]) => void;
}) {
  function update(i: number, patch: Partial<Block>) {
    const next = blocks.slice();
    next[i] = { ...next[i], ...patch };
    onChange(next);
  }
  function remove(i: number) {
    onChange(blocks.filter((_, idx) => idx !== i));
  }
  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= blocks.length) return;
    const next = blocks.slice();
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  }
  function add(type: Block["type"]) {
    onChange([...blocks, { id: newId("bk"), type, text: type === "image" ? undefined : "" }]);
  }

  return (
    <div className="flex flex-col gap-3">
      {blocks.map((blk, i) => (
        <div key={blk.id} className="border border-white/12 bg-white/[0.02] p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] tracking-[0.1em] text-[#525252] uppercase">{blk.type}</span>
            <div className="flex gap-1.5">
              <GhostButton onClick={() => move(i, -1)}>↑</GhostButton>
              <GhostButton onClick={() => move(i, 1)}>↓</GhostButton>
              <GhostButton danger onClick={() => remove(i)}>
                HAPUS
              </GhostButton>
            </div>
          </div>

          {blk.type === "image" ? (
            <>
              <ImageUploadField label="GAMBAR" url={blk.url} onChange={(url) => update(i, { url })} />
              <Field label="CAPTION" value={blk.cap || ""} onChange={(v) => update(i, { cap: v })} />
            </>
          ) : (
            <TextAreaField
              label={blk.type === "heading" ? "TEKS HEADING" : blk.type === "quote" ? "TEKS QUOTE" : "TEKS PARAGRAF"}
              value={blk.text || ""}
              onChange={(v) => update(i, { text: v })}
              rows={blk.type === "para" ? 3 : 2}
            />
          )}
        </div>
      ))}

      <div className="flex gap-2 flex-wrap">
        <GhostButton onClick={() => add("para")}>+ PARAGRAF</GhostButton>
        <GhostButton onClick={() => add("heading")}>+ HEADING</GhostButton>
        <GhostButton onClick={() => add("quote")}>+ QUOTE</GhostButton>
        <GhostButton onClick={() => add("image")}>+ GAMBAR</GhostButton>
      </div>
    </div>
  );
}
