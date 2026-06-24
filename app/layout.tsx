import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://portofoliofikri-ebon.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Fikri — Web, Automation & Graphic Design",
    template: "%s — Fikri",
  },
  description:
    "Mahasiswa Teknik Informatika Universitas Hasanuddin, Makassar. Membangun produk web, sistem automation, dan identitas visual.",
  keywords: ["web developer", "automation", "graphic design", "Makassar", "Fikri", "portfolio", "Notion template"],
  authors: [{ name: "Nurfikri" }],
  creator: "Nurfikri",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: BASE_URL,
    siteName: "Fikri — Portfolio",
    title: "Fikri — Web, Automation & Graphic Design",
    description:
      "Mahasiswa Teknik Informatika Universitas Hasanuddin, Makassar. Membangun produk web, sistem automation, dan identitas visual.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fikri — Web, Automation & Graphic Design",
    description:
      "Mahasiswa Teknik Informatika Universitas Hasanuddin, Makassar. Membangun produk web, sistem automation, dan identitas visual.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  verification: {
    google: "nWfSBDrKC_wMLUYAxFQh9E9tGQ2ICQH1YpYXGSrVLiA",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
