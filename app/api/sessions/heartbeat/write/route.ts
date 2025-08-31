// app/api/sessions/heartbeat/write/route.ts
import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { prisma } from "@/app/prismaClient/prisma";
import { UAParser } from "ua-parser-js";

// Prevent this route from being executed during build time
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const token =
    cookieStore.get("__Secure-authjs.session-token")?.value ??
    cookieStore.get("authjs.session-token")?.value;
  if (!token) return NextResponse.json({ ok: false }, { status: 204 });

  const { ip, city, country, region } = await req.json().catch(() => ({}));
  const h = await headers();
  const ua = h.get("user-agent") ?? "";
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

  await prisma.session.update({
    where: { sessionToken: token },
    data: {
      lastSeenAt: new Date(),
      ...(ua && ua !== row?.userAgent ? { userAgent: ua } : {}),
      ...(device && device !== row?.device ? { device } : {}),
      ...(ip && ip !== row?.ip ? { ip } : {}),
      // гео пишем либо впервые, либо если ip сменился
      ...((ip && ip !== row?.ip) || (!row?.country && country)
        ? { country: country ?? null, region: region ?? null, city: city ?? null }
        : {}),
    },
  });

  return NextResponse.json({ ok: true });
}