"use client";

import { BlogPost, PortfolioData } from "@/lib/types";
import { Card, Field, GhostButton, PrimaryButton, SectionTitle, TextAreaField } from "../ui";

function slugId(existing: string[]) {
  let n = 1;
  while (existing.includes(`bp${n}`)) n++;
  return `bp${n}`;
}

export default function BlogTab({
  data,
  setData,
}: {
  data: PortfolioData;
  setData: (d: PortfolioData) => void;
}) {
  const posts = data.blog.posts;
  const featuredId = data.blog.featuredId;

  function update(i: number, patch: Partial<BlogPost>) {
    const next = posts.slice();
    next[i] = { ...next[i], ...patch };
    setData({ ...data, blog: { ...data.blog, posts: next } });
  }
  function remove(i: number) {
    const removedId = posts[i].id;
    const next = posts.filter((_, idx) => idx !== i);
    setData({
      ...data,
      blog: {
        featuredId: featuredId === removedId ? next[0]?.id || "" : featuredId,
        posts: next,
      },
    });
  }
  function add() {
    const id = slugId(posts.map((p) => p.id));
    setData({
      ...data,
      blog: {
        ...data.blog,
        posts: [...posts, { id, date: "2025.01", read: "5 min", cat: "Notes", title: "Judul baru", excerpt: "" }],
      },
    });
  }
  function setFeatured(id: string) {
    setData({ ...data, blog: { ...data.blog, featuredId: id } });
  }

  return (
    <div className="flex flex-col gap-4 max-w-[760px]">
      <SectionTitle>BLOG POSTS</SectionTitle>
      {posts.map((p, i) => (
        <Card key={p.id}>
          <div className="flex items-center justify-between">
            <div className="font-mono text-[10px] text-[#525252]">id: {p.id}</div>
            <button
              type="button"
              onClick={() => setFeatured(p.id)}
              className="font-mono text-[11px] px-2.5 py-1.5 border"
              style={{
                borderColor: featuredId === p.id ? "#f5f5f5" : "rgba(255,255,255,0.18)",
                background: featuredId === p.id ? "#f5f5f5" : "transparent",
                color: featuredId === p.id ? "#0a0a0a" : "#a3a3a3",
              }}
            >
              ★ {featuredId === p.id ? "FEATURED" : "JADIKAN FEATURED"}
            </button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Field label="DATE" value={p.date} onChange={(v) => update(i, { date: v })} />
            <Field label="READ" value={p.read} onChange={(v) => update(i, { read: v })} />
            <Field label="CATEGORY" value={p.cat} onChange={(v) => update(i, { cat: v })} />
          </div>
          <Field label="TITLE" value={p.title} onChange={(v) => update(i, { title: v })} />
          <TextAreaField label="EXCERPT" value={p.excerpt || ""} onChange={(v) => update(i, { excerpt: v })} rows={2} />
          <div className="flex justify-end">
            <GhostButton danger onClick={() => remove(i)}>
              HAPUS
            </GhostButton>
          </div>
        </Card>
      ))}
      <div>
        <PrimaryButton onClick={add}>+ TAMBAH POST</PrimaryButton>
      </div>
    </div>
  );
}
