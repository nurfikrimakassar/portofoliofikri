import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
import sharp from "sharp";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const ALLOWED = new Set(["image/png", "image/jpeg", "image/webp", "image/gif", "image/svg+xml"]);

const SLOT_PRESETS = {
  cover: { width: 1600, height: 900, quality: 80, maxKB: 300 },
  hero:  { width: 1600, height: 900, quality: 80, maxKB: 300 },
  gallery: { width: 1200, height: 800, quality: 78, maxKB: 200 },
  profile: { width: 800,  height: 800, quality: 82, maxKB: 100 },
  default: { width: 1600, height: 900, quality: 80, maxKB: 300 },
} as const;

type Slot = keyof typeof SLOT_PRESETS;

function r2Client() {
  return new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  });
}

async function compress(buf: Buffer, slot: Slot): Promise<Buffer> {
  const { width, height, quality } = SLOT_PRESETS[slot];
  return sharp(buf)
    .resize({ width, height, fit: "inside", withoutEnlargement: true })
    .webp({ quality })
    .toBuffer();
}

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const file = form.get("file");
  const slot = ((form.get("slot") as string) || "default") as Slot;
  const preset = SLOT_PRESETS[slot] ?? SLOT_PRESETS.default;

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }
  if (!ALLOWED.has(file.type)) {
    return NextResponse.json({ error: "Tipe file tidak didukung." }, { status: 400 });
  }
  if (file.size > 20 * 1024 * 1024) {
    return NextResponse.json({ error: "File maksimal 20MB." }, { status: 400 });
  }

  const raw = Buffer.from(await file.arrayBuffer());

  // SVG: no compression, passthrough
  const isSvg = file.type === "image/svg+xml";
  const outBuf = isSvg ? raw : await compress(raw, slot);
  const outExt = isSvg ? "svg" : "webp";
  const name = `${crypto.randomUUID()}.${outExt}`;

  if (!isSvg) {
    const kb = Math.round(outBuf.length / 1024);
    if (kb > preset.maxKB * 3) {
      return NextResponse.json(
        { error: `Gambar terlalu besar setelah kompresi (${kb}KB). Coba gambar yang lebih kecil.` },
        { status: 400 }
      );
    }
  }

  // Upload to R2 if configured, otherwise save to disk
  if (process.env.R2_ACCOUNT_ID) {
    await r2Client().send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET,
        Key: name,
        Body: outBuf,
        ContentType: isSvg ? "image/svg+xml" : "image/webp",
        CacheControl: "public, max-age=31536000, immutable",
      })
    );
    return NextResponse.json({ url: `${process.env.R2_PUBLIC_URL}/${name}` });
  }

  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  await fs.writeFile(path.join(UPLOAD_DIR, name), outBuf);
  return NextResponse.json({ url: `/uploads/${name}` });
}
