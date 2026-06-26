
import Link from "next/link";
import Image from "next/image";
import Nav from "@/components/Nav";
import GridBackground from "@/components/GridBackground";
import Pagination from "@/components/Pagination";
import { getData } from "@/lib/data";

export const metadata = { title: "Blog — Fikri" };

const PER_PAGE = 10;

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const S = await getData();
  const sp = await searchParams;

  const raw: Record<string, string> = {};
  for (const [k, v] of Object.entries(sp)) {
    if (typeof v === "string") raw[k] = v;
  }

  const featured = S.blog.posts.find((p) => p.id === S.blog.featuredId) || S.blog.posts[0];
  const rest = S.blog.posts.filter((p) => p.id !== featured?.id);

  const page = Math.max(1, parseInt((sp.page as string) || "1", 10));
  const totalPages = Math.ceil(rest.length / PER_PAGE);
  const postSlice = rest.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-[#f5f5f5] font-sans overflow-x-hidden">
      <GridBackground />
      <Nav active="/blog" />

      <header className="relative z-10 max-w-[1280px] mx-auto px-8 pt-[140px] pb-10 max-[640px]:px-5 max-[640px]:pt-[104px]">
        <div className="font-mono text-[12.5px] text-[#525252] mb-5">
          ~/fikri <span className="text-[#404040]">/</span> <span className="text-[#a3a3a3]">blog</span>
        </div>
        <h1 className="text-[clamp(44px,7vw,88px)] font-bold tracking-[-0.03em] leading-[0.95]">
          WRITING
          <br />
          &amp; NOTES
        </h1>
        <p className="max-w-[560px] text-base leading-[1.6] text-[#a3a3a3] mt-6">
          Catatan soal automation, desain, dan perjalanan karier. Studi kasus dan hal-hal yang kupelajari sambil jalan.
        </p>
      </header>

      <section className="relative z-10 max-w-[1280px] mx-auto px-8 py-10 max-[640px]:px-5">
        {featured && page === 1 && (
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
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(255,255,255,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.05) 1px,transparent 1px)",
                    backgroundSize: "28px 28px",
                  }}
                />
              )}
              <span className="relative font-mono text-[13px] text-[#525252]">{featured.cat}</span>
            </div>
          </Link>
        )}

        <div className="flex items-baseline gap-3.5 mb-2 font-mono">
          <span className="text-[13px] tracking-[0.15em] text-[#737373]">{`// ALL POSTS`}</span>
          <div className="flex-1 h-px bg-white/8" />
          <span className="text-[11.5px] text-[#525252]">{rest.length} posts</span>
        </div>
        {postSlice.map((b) => (
          <Link
            key={b.id}
            href={`/blog/${b.id}`}
            data-r="blogrow"
            className="hover-row grid grid-cols-[120px_1fr_auto_auto] gap-7 items-center py-[26px] px-4 border-t border-white/10 no-underline text-[#f5f5f5] max-[640px]:grid-cols-1 max-[640px]:gap-1.5"
          >
            <span className="font-mono text-[13px] text-[#525252]">{b.date}</span>
            <span className="text-[clamp(18px,2vw,24px)] font-medium tracking-[-0.01em]">{b.title}</span>
            <span className="font-mono text-[11px] text-[#737373] border border-white/14 px-2.5 py-1.5 w-fit">{b.cat}</span>
            <span className="font-mono text-xs text-[#525252]">{b.read}</span>
          </Link>
        ))}
        <div className="border-t border-white/10" />
        <Pagination
          page={page}
          totalPages={totalPages}
          paramName="page"
          currentParams={raw}
          basePath="/blog"
        />
      </section>

      <footer className="relative z-10 max-w-[1280px] mx-auto px-8 pt-[60px] pb-10 max-[640px]:px-5">
        <div className="flex justify-between items-center flex-wrap gap-4 font-mono text-xs text-[#525252] pt-6 border-t border-white/8">
          <span>© 2024 FIKRI · MAKASSAR, ID</span>
          <Link href="/" className="text-[#a3a3a3] no-underline hover-link">
            ← BACK HOME
          </Link>
        </div>
      </footer>
    </div>
  );
}
