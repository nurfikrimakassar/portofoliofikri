import { PortfolioData } from "./types";

export const defaultData: PortfolioData = {
  profile: {
    name: "NURFIKRI",
    tagline:
      "Mahasiswa Teknik Informatika Universitas Hasanuddin. Membangun produk web, sistem automation, dan identitas visual — di persimpangan design, automation, dan tech.",
    location: "Makassar, Indonesia",
    study: "Teknik Informatika · Unhas",
    status: "Open for projects",
    whatsapp: "6281234567890",
    email: "soon@fikri.id",
    instagram: "@fikri",
    instagramUrl: "https://instagram.com/fikri",
    linkedin: "in/fikri",
    linkedinUrl: "https://linkedin.com/in/fikri",
    github: "@fikri",
    githubUrl: "https://github.com/fikri",
    tiktok: "@fikri",
    tiktokUrl: "https://tiktok.com/@fikri",
    roles: [
      "designer",
      "automation engineer",
      "tech builder",
      "graphic designer",
      "web developer",
    ],
  },
  stats: { roles: "5", projects: "20+", automations: "∞", products: "3" },
  tools: [
    "Next.js",
    "React",
    "TypeScript",
    "Tailwind",
    "Node.js",
    "Figma",
    "Notion",
    "Apps Script",
    "Zapier",
    "Make",
    "Adobe Suite",
    "Git",
  ],
  experience: [
    { period: "2024 — NOW", role: "Web Developer", org: "Freelance · Client Projects", tag: "DEV" },
    { period: "2023 — 2024", role: "Product & Growth", org: "Early-stage Startup", tag: "GROWTH" },
    { period: "2023 — NOW", role: "Graphic Designer", org: "Freelance · Brand & Social", tag: "DESIGN" },
    { period: "2022 — NOW", role: "Math Tutor", org: "Private & Group", tag: "TEACH" },
    { period: "2022 — 2023", role: "Campus Journalist", org: "Pers Mahasiswa Unhas", tag: "WRITE" },
  ],
  webWorks: [
    { id: "w1", idx: "W01", title: "Datacraft Dashboard", cat: "Web App", year: "2024", desc: "Dashboard analitik internal dengan visualisasi real-time." },
    { id: "w2", idx: "W02", title: "Growth Landing System", cat: "Marketing Site", year: "2024", desc: "Sistem landing page modular untuk eksperimen growth." },
    { id: "w3", idx: "W03", title: "Booking Platform", cat: "Full-stack", year: "2023", desc: "Platform reservasi dengan pembayaran terintegrasi." },
    { id: "w4", idx: "W04", title: "Campus Media Portal", cat: "CMS", year: "2023", desc: "Portal berita kampus dengan editorial workflow." },
  ],
  graphicWorks: [
    { id: "g1", title: "Brand Identity — Kopi Lokal", cat: "Branding" },
    { id: "g2", title: "Editorial Layout Series", cat: "Print" },
    { id: "g3", title: "Social Campaign Kit", cat: "Social" },
    { id: "g4", title: "Event Poster Series", cat: "Poster" },
    { id: "g5", title: "Logo Exploration", cat: "Logo" },
    { id: "g6", title: "Packaging Mockups", cat: "Packaging" },
  ],
  products: [
    { idx: "P01", title: "Notion Automation OS", price: "Rp 149K", desc: "Sistem operasi personal di Notion dengan automation bawaan untuk task, habit, dan keuangan.", stat: "1,200+ sold", tags: ["Notion", "Automation"] },
    { idx: "P02", title: "Invoice Auto-Generator", price: "Rp 99K", desc: "Template Google Sheets + Apps Script yang membuat & mengirim invoice otomatis.", stat: "640+ sold", tags: ["Sheets", "Apps Script"] },
    { idx: "P03", title: "Content Pipeline Kit", price: "Rp 129K", desc: "Workflow dari ide → draft → publish lintas platform, terhubung otomatis.", stat: "New", tags: ["Zapier", "Notion"] },
  ],
  automation: [
    { id: "a1", idx: "A01", title: "Invoice Auto-Pipeline", stack: "Sheets · Apps Script", problem: "Bikin & kirim invoice manual tiap minggu.", result: "3 jam/minggu hemat" },
    { id: "a2", idx: "A02", title: "Lead Router", stack: "Make · WhatsApp API", problem: "Lead masuk tercecer di banyak channel.", result: "0 lead terlewat" },
    { id: "a3", idx: "A03", title: "Content Publisher", stack: "Notion · Zapier", problem: "Posting lintas platform satu-satu.", result: "1-klik publish" },
  ],
  blog: {
    featuredId: "feat",
    posts: [
      { id: "feat", date: "2024.11", read: "6 min", cat: "// AUTOMATION", title: "Cara aku otomasi invoicing dengan Apps Script", excerpt: "Studi kasus lengkap: dari proses manual tiap minggu jadi sistem yang jalan sendiri — termasuk kode, jebakan, dan hasilnya." },
      { id: "bp1", date: "2024.09", title: "Sistem desain monokrom untuk portofolio", read: "8 min", cat: "Design" },
      { id: "bp2", date: "2024.07", title: "Dari journalist ke product: skill yang nyangkut", read: "5 min", cat: "Career" },
      { id: "bp3", date: "2024.05", title: "Membangun growth loop pertama tanpa budget", read: "7 min", cat: "Growth" },
      { id: "bp4", date: "2024.03", title: "5 automation kecil yang menghemat jam kerjaku", read: "4 min", cat: "Automation" },
      { id: "bp5", date: "2024.01", title: "Kenapa setiap mahasiswa TI perlu jualan produk digital", read: "6 min", cat: "Opinion" },
    ],
  },
  detail: {
    project: {
      w1: {
        link: "#",
        linkLabel: "LIHAT LIVE SITE",
        meta: [
          { k: "ROLE", v: "Design & Development" },
          { k: "YEAR", v: "2024" },
          { k: "STACK", v: "Next.js · React" },
        ],
        body: [
          { id: "bk-1", type: "heading", text: "Konteks" },
          { id: "bk-2", type: "para", text: "Project ini berangkat dari kebutuhan nyata: sebuah produk web yang harus cepat, rapi, dan gampang dikembangkan. Aku menanganinya dari desain hingga implementasi." },
          { id: "bk-3", type: "heading", text: "Pendekatan" },
          { id: "bk-4", type: "para", text: "Aku menyusun arsitektur komponen yang modular, memisahkan data dari tampilan, dan memastikan setiap layar konsisten di desktop maupun mobile. Performa dan keterbacaan kode jadi prioritas." },
          { id: "bk-5", type: "heading", text: "Hasil" },
          { id: "bk-6", type: "para", text: "Produk akhir yang stabil, mudah dirawat, dan siap tumbuh. Ganti teks & gambar ini lewat Admin → tab DETAIL → bagian Web Project." },
        ],
      },
    },
    graphic: {
      g1: {
        desc: "Identitas visual untuk kedai kopi lokal: logo, palet monokrom, sistem kemasan, dan materi sosial yang konsisten.",
        link: "#",
        linkLabel: "LIHAT PORTO LENGKAP",
        imageNote:
          "Penjelasan singkat tentang gambar-gambar di bawah: konsep visual, proses, dan keputusan desain yang diambil. Ganti teks ini dengan cerita di balik karyamu — apa masalahnya, pendekatan visualnya, dan hasil akhirnya.",
        gallery: [
          { id: "gg-1", cap: "Logo & wordmark" },
          { id: "gg-2", cap: "Palet & tipografi" },
          { id: "gg-3", cap: "Kemasan / aplikasi" },
          { id: "gg-4", cap: "Materi sosial" },
          { id: "gg-5", cap: "Mockup akhir" },
        ],
      },
    },
    cs: {
      a1: {
        summary:
          "Mengubah proses invoicing manual mingguan menjadi sistem terjadwal yang membuat, mengubah ke PDF, dan mengirim invoice tanpa sentuhan tangan.",
        meta: [
          { k: "KLIEN", v: "Internal / Freelance" },
          { k: "PERAN", v: "Automation Engineer" },
          { k: "TAHUN", v: "2024" },
          { k: "STACK", v: "Sheets · Apps Script" },
        ],
        results: [
          { num: "3 jam", label: "DIHEMAT / MINGGU" },
          { num: "0", label: "SALAH KETIK SEJAK RILIS" },
          { num: "1×", label: "KLIK UNTUK SELURUH ALUR" },
        ],
        body: [
          { id: "bk-1", type: "heading", text: "Konteks" },
          { id: "bk-2", type: "para", text: "Setiap minggu, invoice dibuat satu per satu dari template — rawan salah angka dan memakan waktu. Tujuannya: menghilangkan langkah manual sepenuhnya tanpa mengganti alat yang sudah dipakai tim." },
          { id: "cs-img-top", type: "image", cap: "Sebelum: alur manual." },
          { id: "bk-3", type: "heading", text: "Pendekatan" },
          { id: "bk-4", type: "para", text: "Seluruh data klien dipusatkan di Google Sheet. Sebuah script membaca baris yang ditandai, menyusun dokumen dari template, mengonversinya ke PDF, lalu mengirim email berlampiran — dijalankan oleh pemicu terjadwal." },
          { id: "cs-img-midA", type: "image", cap: "Sheet sumber data." },
          { id: "cs-img-midB", type: "image", cap: "Script & trigger." },
          { id: "bk-5", type: "heading", text: "Hasil Akhir" },
          { id: "bk-6", type: "para", text: "Yang awalnya tujuh langkah manual kini jadi satu kolom centang, dan sekitar tiga jam per minggu kembali ke tanganku." },
          { id: "cs-img-bottom", type: "image", cap: "Sesudah: invoice terkirim otomatis." },
        ],
      },
    },
    blog: {
      feat: {
        body: [
          { id: "bk-1", type: "para", text: "Sebagai freelancer, invoicing adalah pekerjaan yang berulang dan rawan salah. Setiap klien, setiap proyek, format yang sama — tapi tetap harus diketik ulang. Aku sadar ini kandidat sempurna untuk diotomasi." },
          { id: "bk-2", type: "heading", text: "Masalahnya" },
          { id: "bk-3", type: "para", text: "Proses lama: buka template, ganti nama klien, hitung total, ekspor PDF, lampirkan ke email, kirim. Tujuh langkah, dikali jumlah klien, dikali setiap minggu. Belum termasuk risiko salah angka." },
          { id: "bk-4", type: "quote", text: "Kalau sebuah pekerjaan punya pola yang sama persis setiap kali, ia tidak seharusnya dikerjakan dengan tangan." },
          { id: "bk-5", type: "heading", text: "Pendekatan" },
          { id: "bk-6", type: "para", text: "Aku menaruh seluruh data klien di satu Google Sheet. Sebuah script Apps Script membaca baris yang ditandai 'kirim', menyusun dokumen dari template, mengubahnya jadi PDF, lalu mengirim email beserta lampiran — semua dengan satu pemicu terjadwal." },
          { id: "bk-7", type: "para", text: "Yang awalnya tujuh langkah manual kini jadi satu kolom centang. Sisanya berjalan otomatis tiap Senin pagi sebelum aku bangun." },
          { id: "bk-8", type: "heading", text: "Hasilnya" },
          { id: "bk-9", type: "para", text: "Sekitar tiga jam per minggu kembali ke tanganku, dan nol kesalahan ketik sejak sistem ini berjalan. Lebih penting lagi: pola berpikirnya menular — sekarang aku otomatis bertanya 'ini bisa diotomasi nggak?' untuk hampir setiap tugas berulang." },
        ],
      },
    },
  },
};
