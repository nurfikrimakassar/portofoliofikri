"use client";

import { Dispatch, SetStateAction } from "react";
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
  setData: Dispatch<SetStateAction<PortfolioData>>;
}) {
  const posts = data.blog.posts;
  const featuredId = data.blog.featuredId;

  function update(i: number, patch: Partial<BlogPost>) {
    setData((prev) => {
      const next = prev.blog.posts.slice();
      next[i] = { ...next[i], ...patch };
      return { ...prev, blog: { ...prev.blog, posts: next } };
    });
  }
  function remove(i: number) {
    setData((prev) => {
      const removedId = prev.blog.posts[i].id;
      const next = prev.blog.posts.filter((_, idx) => idx !== i);
      return {
        ...prev,
        blog: {
          featuredId: prev.blog.featuredId === removedId ? next[0]?.id || "" : prev.blog.featuredId,
          posts: next,
        },
      };
    });
  }
  function add() {
    setData((prev) => {
      const id = slugId(prev.blog.posts.map((p) => p.id));
      return {
        ...prev,
        blog: {
          ...prev.blog,
          posts: [...prev.blog.posts, { id, date: "2025.01", read: "5 min", cat: "Notes", title: "Judul baru", excerpt: "" }],
        },
      };
    });
  }
  function setFeatured(id: string) {
    setData((prev) => ({ ...prev, blog: { ...prev.blog, featuredId: id } }));
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
