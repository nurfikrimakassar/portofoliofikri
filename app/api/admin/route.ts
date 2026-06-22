import { NextRequest, NextResponse } from "next/server";
import { getData, saveData } from "@/lib/data";

export async function GET() {
  const data = await getData();
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  await saveData(data);
  return NextResponse.json({ ok: true });
}
