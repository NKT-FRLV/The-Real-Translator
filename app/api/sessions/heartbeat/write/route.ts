// app/api/sessions/heartbeat/write/route.ts
import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { prisma } from "@/app/prismaClient/prisma";
import { UAParser } from "ua-parser-js";

// Prevent this route from being executed during build time
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST() {
  const cookieStore = await cookies();
  const token =
    cookieStore.get("__Secure-authjs.session-token")?.value ??
    cookieStore.get("authjs.session-token")?.value;
  if (!token) return new Response(null, { status: 204 });

  const h = await headers();
  const ua = h.get("user-agent") ?? "";
  
  // читаем гео данные из заголовков
  const ip = h.get("x-geo-ip") || null;
  const city = h.get("x-geo-city") || null;
  const country = h.get("x-geo-country") || null;
  const region = h.get("x-geo-region") || null;
  
  console.log("Write route - Received geo data from headers:", { ip, city, country, region });
  const parsed = UAParser(ua);
  const device = [
    parsed.device.type ? parsed.device.type[0].toUpperCase() + parsed.device.type.slice(1) : "Desktop",
    parsed.browser.name && `${parsed.browser.name} ${parsed.browser.version ?? ""}`.trim(),
    parsed.os.name && `${parsed.os.name} ${parsed.os.version ?? ""}`.trim(),
  ].filter(Boolean).join(" • ");

  // обновляем только то, что реально изменилось
  const row = await prisma.session.findUnique({
    where: { sessionToken: token },
    select: { id: true, ip: true, country: true, region: true, city: true, userAgent: true, device: true },
  });

  const updateData = {
    lastSeenAt: new Date(),
    ...(ua && ua !== row?.userAgent ? { userAgent: ua } : {}),
    ...(device && device !== row?.device ? { device } : {}),
    ...(ip && ip !== row?.ip ? { ip } : {}),
    // гео пишем либо впервые, либо если ip сменился
    ...((ip && ip !== row?.ip) || (!row?.country && country)
      ? { country: country ?? null, region: region ?? null, city: city ?? null }
      : {}),
  };

  console.log("Write route - Update data:", updateData);
  console.log("Write route - Current row:", row);

  await prisma.session.update({
    where: { sessionToken: token },
    data: updateData,
  });

  return NextResponse.json({ ok: true });
}