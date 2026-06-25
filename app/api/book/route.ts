import { NextRequest, NextResponse } from "next/server";
import { createSign } from "crypto";

async function getAccessToken(credentials: {
  client_email: string;
  private_key: string;
}): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = Buffer.from(JSON.stringify({ alg: "RS256", typ: "JWT" })).toString("base64url");
  const payload = Buffer.from(
    JSON.stringify({
      iss: credentials.client_email,
      scope: "https://www.googleapis.com/auth/calendar.events",
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
    })
  ).toString("base64url");

  const sign = createSign("RSA-SHA256");
  sign.update(`${header}.${payload}`);
  const sig = sign.sign(credentials.private_key, "base64url");

  const jwt = `${header}.${payload}.${sig}`;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });

  const json = (await res.json()) as { access_token?: string };
  if (!json.access_token) throw new Error("Gagal mendapat access token");
  return json.access_token;
}

export async function POST(req: NextRequest) {
  const { name, email, date, time } = await req.json();

  if (!name || !email || !date || !time) {
    return NextResponse.json({ error: "Nama, email, tanggal & jam wajib diisi." }, { status: 400 });
  }

  try {
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON!);
    const calendarId = process.env.GOOGLE_CALENDAR_ID!;
    const token = await getAccessToken(credentials);

    const startISO = `${date}T${time}:00+08:00`;
    const endISO = new Date(new Date(startISO).getTime() + 15 * 60 * 1000).toISOString();

    const res = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          summary: `📞 Book a Call — ${name}`,
          description: `Booking dari portfolio\n\nNama: ${name}\nEmail: ${email}`,
          start: { dateTime: startISO, timeZone: "Asia/Makassar" },
          end: { dateTime: endISO, timeZone: "Asia/Makassar" },
          attendees: [{ email }],
        }),
      }
    );

    if (!res.ok) {
      const err = await res.json() as { error?: { message?: string; status?: string } };
      const msg = err?.error?.message || err?.error?.status || "Calendar API error";
      return NextResponse.json({ error: msg }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Terjadi kesalahan.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
