import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const { name, email, service, message } = await req.json();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Nama, email, dan pesan wajib diisi." }, { status: 400 });
  }

  try {
    await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: "nurfikrimustapa@gmail.com",
      replyTo: email,
      subject: `[Project] ${service || "Umum"} — dari ${name}`,
      text: [
        `Dari: ${name}`,
        `Email: ${email}`,
        `Layanan: ${service || "—"}`,
        "",
        message,
      ].join("\n"),
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Gagal mengirim email. Coba lagi." }, { status: 500 });
  }
}
