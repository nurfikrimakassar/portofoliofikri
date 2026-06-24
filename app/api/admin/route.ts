import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getData, saveData } from "@/lib/data";

export async function GET() {
  const data = await getData();
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  await saveData(data);
  revalidatePath("/");
  revalidatePath("/work");
  revalidatePath("/blog");
  revalidatePath("/products");
  revalidatePath("/work/[id]", "page");
  revalidatePath("/graphic/[id]", "page");
  revalidatePath("/blog/[id]", "page");
  revalidatePath("/products/[id]", "page");
  revalidatePath("/products/digital/[idx]", "page");
  return NextResponse.json({ ok: true });
}
