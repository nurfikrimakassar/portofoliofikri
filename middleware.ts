import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";

const COOKIE = "fikri_admin_session";

function signToken(secret: string): string {
  const ts = Date.now().toString(36);
  const sig = createHmac("sha256", secret).update(ts).digest("hex");
  return `${ts}.${sig}`;
}

export function verifyToken(token: string, secret: string): boolean {
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [ts, sig] = parts;
  const expected = createHmac("sha256", secret).update(ts).digest("hex");
  try {
    return timingSafeEqual(Buffer.from(sig, "hex"), Buffer.from(expected, "hex"));
  } catch {
    return false;
  }
}

export { signToken };

const SECURITY_HEADERS = {
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "X-XSS-Protection": "1; mode=block",
};

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const secret = process.env.SESSION_SECRET || "dev-secret-change-in-prod";

  // Pass-through for login endpoints
  if (pathname === "/admin/login" || pathname === "/api/admin/login") {
    const res = NextResponse.next();
    Object.entries(SECURITY_HEADERS).forEach(([k, v]) => res.headers.set(k, v));
    return res;
  }

  // Protect /admin and /api/admin
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    const token = req.cookies.get(COOKIE)?.value ?? "";
    const valid = verifyToken(token, secret);

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
