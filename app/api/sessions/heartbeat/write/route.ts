// app/api/sessions/heartbeat/write/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// import { cookies } from "next/headers";
import { prisma } from "@/app/prismaClient/prisma";
import { UAParser } from "ua-parser-js";
import { auth } from "@/app/auth";

export async function POST(req: Request) {
//   const cookieStore = await cookies();
//   const token =
//     cookieStore.get("__Secure-authjs.session-token")?.value ??
//     cookieStore.get("authjs.session-token")?.value ??
//     null;
const session = await auth();
const token = session?.user?.id;

  if (!session) {
    // ⛔️ без тела на 204
    return new Response(null, { status: 204 });
  }

  const { ip = null, city = null, country = null, region = null, ua = "" } =
    (await req.json().catch(() => ({}))) as {
      ip?: string | null;
      city?: string | null;
      country?: string | null;
      region?: string | null;
      ua?: string;
    };

  const parsed = UAParser(ua || "");
  const device = [
    parsed.device.type
      ? parsed.device.type[0].toUpperCase() + parsed.device.type.slice(1)
      : "Desktop",
    parsed.browser.name &&
      `${parsed.browser.name} ${parsed.browser.version ?? ""}`.trim(),
    parsed.os.name && `${parsed.os.name} ${parsed.os.version ?? ""}`.trim(),
  ]
    .filter(Boolean)
    .join(" • ");

  const row = await prisma.session.findUnique({
    where: { sessionToken: token },
    select: {
      id: true,
      ip: true,
      userAgent: true,
      device: true,
      country: true,
      region: true,
      city: true,
    },
  });

  // пишем только то, что изменилось (чтобы не долбить БД)
  await prisma.session.update({
    where: { sessionToken: token },
    data: {
      lastSeenAt: new Date(),
      ...(ua && ua !== row?.userAgent ? { userAgent: ua } : {}),
      ...(device && device !== row?.device ? { device } : {}),
      ...(ip && ip !== row?.ip ? { ip } : {}),
      ...(((ip && ip !== row?.ip) || (!row?.country && country))
        ? { country: country ?? null, region: region ?? null, city: city ?? null }
        : {}),
    },
  });

  // экономим сеть — тоже 204 без тела
  return new Response(null, { status: 204 });
}