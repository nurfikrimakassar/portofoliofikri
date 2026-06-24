export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import GridBackground from "@/components/GridBackground";
import ImageSlot from "@/components/ImageSlot";
import BlockBody from "@/components/BlockBody";
import { getData } from "@/lib/data";

export async function generateStaticParams() {
  const S = await getData();
  return S.blog.posts.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const S = await getData();
  const post = S.blog.posts.find((p) => p.id === id);
  if (!post) return {};
  const D = S.detail.blog[id] || {};
  const desc = post.excerpt || D.body?.find((b) => b.type === "para")?.text?.slice(0, 160) || "";
  return {
    title: post.title,
    description: desc,
    openGraph: {
      title: post.title,
      description: desc,
      type: "article",
      images: D.cover ? [{ url: D.cover }] : [],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const S = await getData();
  const post = S.blog.posts.find((p) => p.id === id);
  if (!post) notFound();
  const DB = S.detail.blog[id] || {};

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-[#f5f5f5] font-sans overflow-x-hidden">
      <GridBackground />
      <Nav active="/blog" />

      <header className="relative z-10 max-w-[760px] mx-auto px-8 pt-[132px] max-[640px]:px-6 max-[640px]:pt-[104px]">
        <Link href="/blog" className="font-mono text-[12.5px] text-[#737373] no-underline hover-link">
          ← ~/fikri / blog
        </Link>
        <div className="flex flex-wrap gap-3 items-center my-7 font-mono text-xs text-[#737373]">
          <span className="px-[11px] py-[5px] border border-white/18 text-[#d4d4d4]">{post.cat.replace(/^\/\/\s*/, "")}</span>
          <span>{post.date}</span>
          <span className="text-[#404040]">·</span>
          <span>{post.read}</span>
        </div>
        <h1 className="text-[clamp(32px,5vw,56px)] font-bold tracking-[-0.03em] leading-[1.05]">{post.title}</h1>
        <p className="text-[clamp(17px,2vw,21px)] leading-[1.55] text-[#a3a3a3] mt-6">{post.excerpt}</p>
      </header>

      <div className="relative z-10 max-w-[760px] mx-auto px-8 max-[640px]:px-6">
        <ImageSlot
          url={DB.cover}
          alt={`Cover ${post.title}`}
          placeholder="Gambar sampul · 1600×900 (16:9)"
          className="block w-full aspect-video my-10"
        />
        <article className="flex flex-col gap-6 text-[17.5px] leading-[1.75] text-[#d4d4d4] pb-16">
          <BlockBody body={DB.body || []} />
        </article>
      </div>

      <footer className="relative z-10 max-w-[760px] mx-auto px-8 pb-10 max-[640px]:px-6">
        <div className="flex justify-between items-center flex-wrap gap-4 font-mono text-xs text-[#525252] pt-6 border-t border-white/10">
          <Link href="/blog" className="text-[#a3a3a3] no-underline hover-link">
            ← SEMUA TULISAN
          </Link>
          <Link href="/contact" className="text-[#a3a3a3] no-underline hover-link">
            DISKUSI PROJECT →
          </Link>
        </div>
      </footer>
    </div>
  );
}
