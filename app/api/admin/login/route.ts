import { NextRequest, NextResponse } from "next/server";
import { signToken } from "@/proxy";

const COOKIE = "fikri_admin_session";

export async function POST(req: NextRequest) {
  const { password } = await req.json().catch(() => ({ password: "" }));
  const expected = process.env.ADMIN_PASSWORD || "admin123";

  if (password !== expected) {
    return NextResponse.json({ error: "Password salah." }, { status: 401 });
  }

  const secret = process.env.SESSION_SECRET || "dev-secret-change-in-prod";
  const token = await signToken(secret);

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 jam
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(COOKIE);
  return res;
}
