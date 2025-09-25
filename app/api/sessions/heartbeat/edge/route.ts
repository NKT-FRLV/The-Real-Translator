// app/api/sessions/heartbeat/edge/route.ts
export const runtime = "edge";

import { geolocation, ipAddress } from "@vercel/functions";

export async function POST(req: Request) {
	const ip = ipAddress(req) ?? null;
	const {
		city = null,
		country = null,
		countryRegion: region = null,
	} = geolocation(req) ?? {};

	const cookie = req.headers.get("cookie") ?? "";
	const ua = req.headers.get("user-agent") ?? "";
	try {
		await fetch(new URL("/api/sessions/heartbeat/write", req.url), {
			method: "POST",
			headers: {
				"content-type": "application/json",
				// 👇 кидаю куки с Token, что бы определить сессию к которой применятся данные по положению и IP
				cookie,

				// не обязательно, но пусть
				"user-agent": ua,
			},
			cache: "no-store",
			body: JSON.stringify({ ip, city, country, region, ua }),
		});
	} catch (error) {
		console.error("Error sending heartbeat:", error);
	}

	// 204 -> без тела
	return new Response(null, { status: 204 });
}
