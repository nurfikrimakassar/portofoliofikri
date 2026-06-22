# Fikri Portfolio — Next.js

Monokrom personal portfolio: **Home · Work · Graphic · Products · Blog · Contact** + **Admin CMS panel**.

Built with Next.js 16 (App Router), TypeScript, Tailwind CSS 4, and a file-based JSON store (`data/store.json`).

---

## Quickstart

```bash
# 1 — Install dependencies
npm install

# 2 — Set your admin password
cp .env.local .env.local      # already exists; edit ADMIN_PASSWORD
echo "ADMIN_PASSWORD=rahasiaanda" > .env.local

# 3 — Run dev server (Google Fonts loads automatically in dev)
npm run dev
# → http://localhost:3000
```

---

## Routes

| URL | Page |
|---|---|
| `/` | Home — hero, about, work highlights, products, blog |
| `/work` | All web projects + graphic design grid |
| `/work/[id]` | Web project detail (cover + body blocks) |
| `/graphic/[id]` | Graphic design detail (cover + gallery) |
| `/products` | Digital products + automation case studies |
| `/products/[id]` | Automation case study detail |
| `/blog` | Featured post + all posts list |
| `/blog/[id]` | Blog post detail |
| `/contact` | Email form / WhatsApp / Book-a-call |
| `/admin` | CMS panel (protected — login at `/admin/login`) |

---

## Admin CMS

1. Go to `http://localhost:3000/admin/login`
2. Enter the password from `.env.local` (default: **admin123**)
3. Edit any section: **Profil · Experience · Works · Products · Blog · Detail**
4. Click **SIMPAN** — data is written to `data/store.json` (persists across restarts)

**Admin tabs:**
- **PROFIL & KONTAK** — name, tagline, status, roles (typewriter), socials, stats, tools ticker
- **EXPERIENCE** — add/remove timeline rows
- **WORKS** — add/remove web projects and graphic design cards
- **PRODUCTS** — edit digital products (price, tags) and automation case studies
- **BLOG** — manage posts, set featured post (★)
- **DETAIL** — per-item editor: cover upload, body blocks (heading/paragraph/quote/image), meta rows, gallery (graphic)

---

## Data Layer

All content lives in **`data/store.json`** (auto-created from defaults on first run). To swap to a real database:

1. Replace `lib/data.ts` → `getData()` / `saveData()` with Prisma + Postgres calls
2. Keep the same `PortfolioData` TypeScript type in `lib/types.ts` — nothing else needs to change

**Image uploads** in dev are stored in `public/uploads/`. For production, redirect `app/api/admin/upload/route.ts` to Vercel Blob / Supabase Storage / S3 and return the CDN URL instead.

---

## Deployment (Vercel)

```bash
# Push to GitHub, then connect in Vercel dashboard
# Add environment variable: ADMIN_PASSWORD = <your secret>
```

> **Important:** the file-based `data/store.json` store won't persist between Vercel serverless invocations. Migrate to a real DB (Neon / Supabase Postgres via Prisma) before deploying to production. The `getData` / `saveData` interface in `lib/data.ts` is the only thing to change.

---

## Design tokens (quick reference)

| Token | Value |
|---|---|
| Background dark | `#0a0a0a` |
| Text primary | `#f5f5f5` |
| Text muted | `#a3a3a3` |
| Text dim | `#525252` |
| Section light bg | `#f5f5f5` |
| Display font | Space Grotesk (400/600/700) |
| Mono/accent font | JetBrains Mono (400/600/700) |
| Border | `rgba(255,255,255,0.08–0.18)` |
| Animation | gridDrift 14s · blink 1s · marquee 32s |
