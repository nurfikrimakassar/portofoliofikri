const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://portofoliofikri-ebon.vercel.app";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api/", "/link-hub"],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  };
}
