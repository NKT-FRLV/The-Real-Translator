// app/api/sessions/heartbeat/edge/route.ts
export const runtime = "edge";

import { geolocation, ipAddress } from "@vercel/functions";

export async function POST(req: Request) {
  const ip = ipAddress(req);
  const { city, country, region } = geolocation(req);

  console.log("Edge heartbeat - Geo data:", { ip, city, country, region });

  // передаем данные через заголовки, так как Edge может не поддерживать внутренние fetch
  const response = await fetch(new URL("/api/sessions/heartbeat/write", req.url), {
    method: "POST",
    headers: { 
      "content-type": "application/json",
      "x-geo-ip": ip || "",
      "x-geo-city": city || "",
      "x-geo-country": country || "",
      "x-geo-region": region || "",
    },
    body: JSON.stringify({}),
  });

  console.log("Write route response status:", response.status);

  return new Response(JSON.stringify({ ok: true }), { headers: { "content-type": "application/json" } });
}
