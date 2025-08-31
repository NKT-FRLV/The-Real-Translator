// app/api/sessions/heartbeat/edge/route.ts
export const runtime = "edge";

import { geolocation, ipAddress } from "@vercel/functions";

export async function POST(req: Request) {
  const ip = ipAddress(req) ?? null;
  const { city = null, country = null, region = null } = geolocation(req) ?? {};

  const cookie = req.headers.get("cookie") ?? "";
  const ua = req.headers.get("user-agent") ?? "";

  await fetch(new URL("/api/sessions/heartbeat/write", req.url), {
    method: "POST",
    headers: {
      "content-type": "application/json",
      // 👇 важно: прокидываем куки, иначе Node-роут не найдёт токен
      cookie,
      // не обязательно, но пусть Node-роут видит оригинальный UA
      "user-agent": ua,
    },
    cache: "no-store",
    body: JSON.stringify({ ip, city, country, region, ua }),
  });

  // 204 -> без тела
  return new Response(null, { status: 204 });
}
