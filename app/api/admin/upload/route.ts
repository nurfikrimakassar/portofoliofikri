import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
import sharp from "sharp";
import { put } from "@vercel/blob";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const ALLOWED = new Set(["image/png", "image/jpeg", "image/webp", "image/gif", "image/svg+xml"]);

async function compress(buf: Buffer): Promise<Buffer> {
  return sharp(buf)
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();
}

function r2Client(): S3Client | null {
  const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY } = process.env;
  if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) return null;
  return new S3Client({
    region: "auto",
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY },
  });
}

export async function POST(req: NextRequest) {
  try {
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
    const contentType = isSvg ? "image/svg+xml" : "image/webp";
    const name = `${crypto.randomUUID()}.${outExt}`;

    // 1) Cloudflare R2 (S3-compatible) — primary
    const s3 = r2Client();
    if (s3 && process.env.R2_BUCKET && process.env.R2_PUBLIC_URL) {
      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.R2_BUCKET,
          Key: name,
          Body: outBuf,
          ContentType: contentType,
          CacheControl: "public, max-age=31536000, immutable",
        }),
      );
      const base = process.env.R2_PUBLIC_URL.replace(/\/+$/, "");
      return NextResponse.json({ url: `${base}/${name}` });
    }

    // 2) Vercel Blob
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (token) {
      const blobData = new Blob([Uint8Array.from(outBuf)], { type: contentType });
      const blob = await put(name, blobData, { access: "public", token });
      return NextResponse.json({ url: blob.url });
    }

    // 3) Local dev fallback: public/uploads/ (read-only on Vercel — dev only)
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    await fs.writeFile(path.join(UPLOAD_DIR, name), outBuf);
    return NextResponse.json({ url: `/uploads/${name}` });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: `Upload gagal: ${msg}` }, { status: 500 });
  }
}
