import { NextResponse } from "next/server";
import { getData } from "@/lib/data";

export async function GET() {
  await getData();
  return NextResponse.json({ ok: true, time: new Date().toISOString() });
}
