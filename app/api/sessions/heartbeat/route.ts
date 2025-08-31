// app/api/sessions/heartbeat/route.ts
// runtime по умолчанию — Node.js (оставляем так)

import { NextResponse } from "next/server";
import { prisma } from "@/app/prismaClient/prisma";
import { cookies, headers } from "next/headers";
import { UAParser } from "ua-parser-js";

// Prevent this route from being executed during build time
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST() {
  // 1) Токен сессии из куки (strategy: "database")

  console.log("HEARTBEAT")
  const cookieStore = await cookies();
  const token =
  cookieStore.get("__Secure-authjs.session-token")?.value ??
  cookieStore.get("authjs.session-token")?.value;

  if (!token) return NextResponse.json({ ok: false }, { status: 204 });

  // 2) Заголовки и IP
  const h = await headers();
  const ua = h.get("user-agent") ?? "";
  const ip =
    (h.get("x-forwarded-for") ?? "")
      .split(",")[0]
      .trim() ||
    h.get("x-real-ip") ||
    null;

  // 3) device-строка из UA
  const parsed = UAParser(ua);
  const device = [
    parsed.device.type
      ? parsed.device.type[0].toUpperCase() + parsed.device.type.slice(1)
      : "Desktop",
    parsed.browser.name && `${parsed.browser.name} ${parsed.browser.version ?? ""}`.trim(),
    parsed.os.name && `${parsed.os.name} ${parsed.os.version ?? ""}`.trim(),
  ]
    .filter(Boolean)
    .join(" • ");

  // 4) Гео по IP (будет null на localhost/частных IP)
  let country: string | null = null;
  let region: string | null = null;
  let city: string | null = null;

  if (ip && ip !== '127.0.0.1' && ip !== 'localhost') {
    try {
      const geoip = await import('geoip-lite');
      const geo = geoip.default.lookup(ip);
      if (geo) {
        country = geo.country ?? null; // ISO-2
        // geo.region — код региона (может быть пустой строкой)
        region = geo.region || null;
        city = geo.city || null;
      }
    } catch (error) {
      // GeoIP lookup failed - continue without geo data
      console.warn('GeoIP lookup failed:', error);
    }
  }

  // 5) Обновляем запись сессии
  await prisma.session.updateMany({
    where: { sessionToken: token },
    data: {
      lastSeenAt: new Date(),
      ip,
      userAgent: ua || null,
      device: device || null,
      country,
      region,
      city,
    },
  });

  return NextResponse.json({ ok: true });
}
