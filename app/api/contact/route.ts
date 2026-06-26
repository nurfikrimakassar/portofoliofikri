import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: "Request body tidak valid." }, { status: 400 });
    }

    const { name, email, service, message } = body as {
      name?: string;
      email?: string;
      service?: string;
      message?: string;
    };

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Nama, email, dan pesan wajib diisi." }, { status: 400 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const result = await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: "nurfikrimustapa@gmail.com",
      replyTo: email,
      subject: `[Project] ${service || "Umum"} — dari ${name}`,
      text: [`Dari: ${name}`, `Email: ${email}`, `Layanan: ${service || "—"}`, "", message].join(
        "\n"
      ),
    });

    if (result.error) {
      return NextResponse.json({ error: result.error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Gagal mengirim email.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
