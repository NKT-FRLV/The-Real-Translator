// app/api/sessions/heartbeat/edge/route.ts
export const runtime = "edge";

import { geolocation, ipAddress } from "@vercel/functions";

export async function POST(req: Request) {
  const ip = ipAddress(req);
  const { city, country, region } = geolocation(req);

  // просто перекидываем данные на Node-роут, который пишет в БД
  await fetch(new URL("/api/sessions/heartbeat/write", req.url), {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ ip, city, country, region }),
  });

  return new Response(JSON.stringify({ ok: true }), { headers: { "content-type": "application/json" } });
}
