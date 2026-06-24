"use client";

import { Automation, PortfolioData, Product } from "@/lib/types";
import { Card, Field, GhostButton, ImageUploadField, PrimaryButton, SectionTitle, TextAreaField } from "../ui";

function slugId(prefix: string, existing: string[]) {
  let n = 1;
  while (existing.includes(`${prefix}${n}`)) n++;
  return `${prefix}${n}`;
}

export default function ProductsTab({
  data,
  setData,
}: {
  data: PortfolioData;
  setData: (d: PortfolioData) => void;
}) {
  const products = data.products;
  const automation = data.automation;

  function updateProduct(i: number, patch: Partial<Product>) {
    const next = products.slice();
    next[i] = { ...next[i], ...patch };
    setData({ ...data, products: next });
  }
  function removeProduct(i: number) {
    setData({ ...data, products: products.filter((_, idx) => idx !== i) });
  }
  function addProduct() {
    setData({
      ...data,
      products: [
        ...products,
        { idx: `P0${products.length + 1}`, title: "Produk baru", price: "Rp 0", desc: "Deskripsi produk.", stat: "New", tags: [] },
      ],
    });
  }

  function updateAuto(i: number, patch: Partial<Automation>) {
    const next = automation.slice();
    next[i] = { ...next[i], ...patch };
    setData({ ...data, automation: next });
  }
  function removeAuto(i: number) {
    setData({ ...data, automation: automation.filter((_, idx) => idx !== i) });
  }
  function addAuto() {
    const id = slugId("a", automation.map((a) => a.id));
    setData({
      ...data,
      automation: [
        ...automation,
        { id, idx: `A0${automation.length + 1}`, title: "Automation baru", stack: "Stack", problem: "Problem.", result: "Hasil." },
      ],
    });
  }

  return (
    <div className="flex flex-col gap-10 max-w-[760px]">
      <div>
        <SectionTitle>DIGITAL PRODUCTS</SectionTitle>
        <div className="flex flex-col gap-4">
          {products.map((p, i) => (
            <Card key={i}>
              <div className="grid grid-cols-3 gap-3">
                <Field label="IDX" value={p.idx} onChange={(v) => updateProduct(i, { idx: v })} />
                <Field label="PRICE" value={p.price} onChange={(v) => updateProduct(i, { price: v })} />
                <Field label="STAT" value={p.stat} onChange={(v) => updateProduct(i, { stat: v })} />
              </div>
              <Field label="TITLE" value={p.title} onChange={(v) => updateProduct(i, { title: v })} />
              <TextAreaField label="DESC" value={p.desc} onChange={(v) => updateProduct(i, { desc: v })} rows={2} />
              <Field
                label="TAGS (pisahkan dengan koma)"
                value={p.tags.join(", ")}
                onChange={(v) => updateProduct(i, { tags: v.split(",").map((s) => s.trim()).filter(Boolean) })}
              />
              <ImageUploadField label="GAMBAR PRODUK" url={p.image} onChange={(url) => updateProduct(i, { image: url })} />
              <div className="grid grid-cols-[2fr_1fr] gap-3">
                <Field label="LINK BELI (Lynk / Gumroad / dll)" value={p.buyLink || ""} onChange={(v) => updateProduct(i, { buyLink: v })} />
                <Field label="LABEL TOMBOL" value={p.linkLabel || ""} onChange={(v) => updateProduct(i, { linkLabel: v })} />
              </div>
              <div className="flex justify-end">
                <GhostButton danger onClick={() => removeProduct(i)}>
                  HAPUS
                </GhostButton>
              </div>
            </Card>
          ))}
          <div>
            <PrimaryButton onClick={addProduct}>+ TAMBAH PRODUK</PrimaryButton>
          </div>
        </div>
      </div>

      <div>
        <SectionTitle>AUTOMATION (CASE STUDY)</SectionTitle>
        <div className="flex flex-col gap-4">
          {automation.map((a, i) => (
            <Card key={a.id}>
              <div className="font-mono text-[10px] text-[#525252]">id: {a.id}</div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="IDX" value={a.idx} onChange={(v) => updateAuto(i, { idx: v })} />
                <Field label="STACK" value={a.stack} onChange={(v) => updateAuto(i, { stack: v })} />
              </div>
              <Field label="TITLE" value={a.title} onChange={(v) => updateAuto(i, { title: v })} />
              <Field label="PROBLEM" value={a.problem} onChange={(v) => updateAuto(i, { problem: v })} />
              <Field label="RESULT" value={a.result} onChange={(v) => updateAuto(i, { result: v })} />
              <div className="flex justify-end">
                <GhostButton danger onClick={() => removeAuto(i)}>
                  HAPUS
                </GhostButton>
              </div>
            </Card>
          ))}
          <div>
            <PrimaryButton onClick={addAuto}>+ TAMBAH AUTOMATION</PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
}
