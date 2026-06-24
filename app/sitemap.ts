import { getData } from "@/lib/data";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://portofoliofikri-ebon.vercel.app";

export default async function sitemap() {
  const S = await getData();

  const staticRoutes = ["/", "/work", "/blog", "/products", "/contact"].map((path) => ({
    url: `${BASE}${path}`,
    changeFrequency: "weekly" as const,
    priority: path === "/" ? 1 : 0.8,
  }));

  const workRoutes = S.webWorks.map((w) => ({
    url: `${BASE}/work/${w.id}`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const graphicRoutes = S.graphicWorks.map((g) => ({
    url: `${BASE}/graphic/${g.id}`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const blogRoutes = S.blog.posts.map((p) => ({
    url: `${BASE}/blog/${p.id}`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const productRoutes = S.products.map((p) => ({
    url: `${BASE}/products/digital/${p.idx.toLowerCase()}`,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const csRoutes = S.automation.map((a) => ({
    url: `${BASE}/products/${a.id}`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...workRoutes, ...graphicRoutes, ...blogRoutes, ...productRoutes, ...csRoutes];
}
