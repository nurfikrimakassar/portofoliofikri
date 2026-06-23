import { NextRequest, NextResponse } from "next/server";

const COOKIE = "fikri_admin_session";

async function getKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

function toHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function fromHex(hex: string): Uint8Array<ArrayBuffer> {
  const bytes = hex.match(/.{1,2}/g);
  if (!bytes) return new Uint8Array(0);
  const result = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) result[i] = parseInt(bytes[i], 16);
  return result;
}

export async function signToken(secret: string): Promise<string> {
  const ts = Date.now().toString(36);
  const key = await getKey(secret);
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(ts));
  return `${ts}.${toHex(sig)}`;
}

export async function verifyToken(token: string, secret: string): Promise<boolean> {
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [ts, sigHex] = parts;
  try {
    const key = await getKey(secret);
    const sigBytes = fromHex(sigHex);
    if (sigBytes.length === 0) return false;
    return await crypto.subtle.verify("HMAC", key, sigBytes, new TextEncoder().encode(ts));
  } catch {
    return false;
  }
}

const SECURITY_HEADERS = {
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "X-XSS-Protection": "1; mode=block",
};

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const secret = process.env.SESSION_SECRET || "dev-secret-change-in-prod";

  if (pathname === "/admin/login" || pathname === "/api/admin/login") {
    const res = NextResponse.next();
    Object.entries(SECURITY_HEADERS).forEach(([k, v]) => res.headers.set(k, v));
    return res;
  }

  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    const token = req.cookies.get(COOKIE)?.value ?? "";
    const valid = await verifyToken(token, secret);

    if (!valid) {
      if (pathname.startsWith("/api/admin")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
  }

  const res = NextResponse.next();
  Object.entries(SECURITY_HEADERS).forEach(([k, v]) => res.headers.set(k, v));
  return res;
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
