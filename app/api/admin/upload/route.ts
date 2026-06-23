import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
import sharp from "sharp";
import { put } from "@vercel/blob";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const ALLOWED = new Set(["image/png", "image/jpeg", "image/webp", "image/gif", "image/svg+xml"]);

async function compress(buf: Buffer): Promise<Buffer> {
  return sharp(buf)
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();
}

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const file = form.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }
  if (!ALLOWED.has(file.type)) {
    return NextResponse.json({ error: "Tipe file tidak didukung." }, { status: 400 });
  }
  if (file.size > 20 * 1024 * 1024) {
    return NextResponse.json({ error: "File maksimal 20MB." }, { status: 400 });
  }

  const raw = Buffer.from(new Uint8Array(await file.arrayBuffer()));
  const isSvg = file.type === "image/svg+xml";
  const outBuf = isSvg ? raw : await compress(raw);
  const outExt = isSvg ? "svg" : "webp";
  const name = `${crypto.randomUUID()}.${outExt}`;

  const token = process.env.BLOB_READ_WRITE_TOKEN;

  if (token) {
    try {
      const blobData = new Blob([Uint8Array.from(outBuf)], {
        type: isSvg ? "image/svg+xml" : "image/webp",
      });
      const blob = await put(name, blobData, { access: "public", token });
      return NextResponse.json({ url: blob.url });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return NextResponse.json({ error: `Blob upload gagal: ${msg}` }, { status: 500 });
    }
  }

  // Fallback: simpan ke public/uploads/ (dev lokal)
  try {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    await fs.writeFile(path.join(UPLOAD_DIR, name), outBuf);
    return NextResponse.json({ url: `/uploads/${name}` });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: `Filesystem upload gagal: ${msg}` }, { status: 500 });
  }
}
