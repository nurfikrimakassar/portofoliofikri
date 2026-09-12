import Link from "next/link";
import Image from "next/image";
import Nav from "@/components/Nav";
import GridBackground from "@/components/GridBackground";
import { PaginatedBlog } from "@/components/PaginatedList";
import { getData } from "@/lib/data";

export const metadata = { title: "Blog — Fikri" };

export default async function BlogPage() {
  const S = await getData();
  const featured = S.blog.posts.find((p) => p.id === S.blog.featuredId) || S.blog.posts[0];
  const rest = S.blog.posts.filter((p) => p.id !== featured?.id);

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-[#f5f5f5] font-sans overflow-x-hidden">
      <GridBackground />
      <Nav active="/blog" />

      <header className="relative z-10 max-w-[1180px] mx-auto px-8 pt-36 pb-12 max-[640px]:px-5 max-[640px]:pt-28">
        <div className="font-mono text-[12px] text-[#525252] mb-6">
          ~/fikri <span className="text-[#3a3a3a]">/</span> <span className="text-[#a3a3a3]">blog</span>
        </div>
        <h1 className="text-[clamp(44px,7vw,88px)] font-bold tracking-[-0.035em] leading-[0.98]">
          WRITING
          <br />
          &amp; NOTES
        </h1>
        <p className="max-w-[560px] text-[16px] leading-[1.65] text-[#a3a3a3] mt-7">
          Notes on automation, design, and the career path so far — case studies and the things I picked up along the way.
        </p>
      </header>

      <section className="relative z-10 max-w-[1180px] mx-auto px-8 py-12 max-[640px]:px-5">
        {featured && (
          <Link
            href={`/blog/${featured.id}`}
            className="grid grid-cols-[1.1fr_1fr] border border-white/10 no-underline text-[#f5f5f5] mb-12 overflow-hidden hover-card-dark max-[640px]:grid-cols-1"
          >
            <div className="p-10 flex flex-col justify-between max-[640px]:p-6">
              <div className="flex gap-2.5 items-center font-mono text-[11.5px] text-[#737373]">
                <span className="px-2.5 py-1 bg-[#f5f5f5] text-[#0a0a0a] font-semibold">FEATURED</span>
                <span>{featured.date}</span>
                <span>· {featured.read}</span>
              </div>
              <div className="mt-10">
                <h3 className="text-[clamp(26px,3.2vw,40px)] font-bold tracking-[-0.02em] leading-[1.1]">{featured.title}</h3>
                <p className="text-[15px] text-[#a3a3a3] leading-[1.6] mt-4 max-w-[440px]">{featured.excerpt}</p>
                <span className="inline-block mt-6 font-mono text-[13px] text-[#f5f5f5]">READ ARTICLE →</span>
              </div>
            </div>
            <div className="relative bg-[#141414] min-h-[280px] flex items-center justify-center overflow-hidden">
              {S.detail.blog[featured.id]?.cover ? (
                <Image
                  src={S.detail.blog[featured.id].cover!}
                  alt={featured.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  style={{ objectFit: "cover" }}
                  className="opacity-70"
                />
              ) : (
                <span className="relative font-mono text-[13px] text-[#525252]">{featured.cat}</span>
              )}
            </div>
          </Link>
        )}

        <div className="flex items-baseline gap-4 mb-2 font-mono">
          <span className="text-[12px] tracking-[0.2em] text-[#737373]">{`// ALL POSTS`}</span>
          <div className="flex-1 h-px bg-white/[0.07]" />
          <span className="text-[11px] text-[#525252]">{String(rest.length).padStart(2, "0")} posts</span>
        </div>
        <PaginatedBlog items={rest} perPage={10} />
      </section>

      <footer className="relative z-10 max-w-[1180px] mx-auto px-8 pt-16 pb-10 max-[640px]:px-5">
        <div className="flex justify-between items-center flex-wrap gap-4 font-mono text-[11px] text-[#525252] pt-7 border-t border-white/[0.07]">
          <span>© 2024 FIKRI · MAKASSAR, ID</span>
          <Link href="/" className="text-[#a3a3a3] no-underline hover-link">
            ← BACK HOME
          </Link>
        </div>
      </footer>
    </div>
  );
}
