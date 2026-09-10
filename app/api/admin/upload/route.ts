import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
import { put } from "@vercel/blob";

export const runtime = "nodejs";
export const maxDuration = 60;

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const ALLOWED = new Set(["image/png", "image/jpeg", "image/webp", "image/gif", "image/svg+xml"]);
const EXT: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
};

// Compress with sharp when it's available; if the native binary is missing
// (can happen on serverless), fall back to the original bytes.
async function prepare(
  buf: Buffer,
  type: string,
): Promise<{ body: Buffer; contentType: string; ext: string }> {
  if (type === "image/svg+xml" || type === "image/gif") {
    return { body: buf, contentType: type, ext: EXT[type] };
  }
  try {
    const { default: sharp } = await import("sharp");
    const out = await sharp(buf).resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 80 }).toBuffer();
    return { body: out, contentType: "image/webp", ext: "webp" };
  } catch {
    return { body: buf, contentType: type, ext: EXT[type] || "bin" };
  }
}

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }
    if (!ALLOWED.has(file.type)) {
      return NextResponse.json({ error: `Tipe file tidak didukung: ${file.type || "unknown"}` }, { status: 400 });
    }
    if (file.size > 20 * 1024 * 1024) {
      return NextResponse.json({ error: "File maksimal 20MB." }, { status: 400 });
    }

    const raw = Buffer.from(new Uint8Array(await file.arrayBuffer()));
    const { body, contentType, ext } = await prepare(raw, file.type);
    const name = `${crypto.randomUUID()}.${ext}`;

    // Vercel Blob (primary)
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (token) {
      try {
        const blob = await put(name, new Blob([Uint8Array.from(body)], { type: contentType }), {
          access: "public",
          token,
        });
        return NextResponse.json({ url: blob.url });
      } catch (e) {
        const m = e instanceof Error ? e.message : String(e);
        return NextResponse.json({ error: `Vercel Blob menolak upload: ${m}` }, { status: 502 });
      }
    }

    // No token: on Vercel the filesystem is read-only, so say so plainly
    if (process.env.VERCEL) {
      return NextResponse.json(
        {
          error:
            "BLOB_READ_WRITE_TOKEN belum ada di environment Vercel. Buka project → Storage → connect Blob store, lalu redeploy.",
        },
        { status: 500 },
      );
    }

    // Local dev fallback
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    await fs.writeFile(path.join(UPLOAD_DIR, name), body);
    return NextResponse.json({ url: `/uploads/${name}` });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: `Upload gagal: ${msg}` }, { status: 500 });
  }
}
