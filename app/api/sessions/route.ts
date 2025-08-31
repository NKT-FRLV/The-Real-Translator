// app/api/sessions/route.ts

// export const dynamic = "force-dynamic";
// export const revalidate = 0;

import { NextResponse } from "next/server";
import { auth } from "@/app/auth";
import { prisma } from "@/app/prismaClient/prisma";
// import type { Session as PrismaSession } from "@prisma/client";
import { cookies } from "next/headers";
import { SessionsResponse, SessionDTO } from "@/shared/types/user"
 

export async function GET(): Promise<
	NextResponse<SessionsResponse | { error: string }>
> {
	try {
		const session = await auth();

		if (!session?.user?.id) {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 }
			);
		}

		// Получаем sessionToken из cookies
		const cookieStore = await cookies();

		const sessionToken =
			cookieStore.get("__Secure-authjs.session-token")?.value ||
			cookieStore.get("authjs.session-token")?.value;

		if (!sessionToken) {
			return NextResponse.json(
				{ error: "Session token not found" },
				{ status: 404 }
			);
		}

		const userId = session.user.id;

		const rows = await prisma.session.findMany({
			where: { userId: userId, expires: { gt: new Date() } },
			orderBy: { lastSeenAt: "desc" },
			select: {
				id: true,
				createdAt: true,
				expires: true,
				lastSeenAt: true,
				ip: true,
				userAgent: true,
				device: true,
				country: true,
				region: true,
				city: true,
				sessionToken: true, // только для сравнения, потом дропаем
			},
		});

		const mapFn = (r: (typeof rows)[number]): SessionDTO => ({
			id: r.id,
			createdAt: r.createdAt.toISOString(),
			expires: r.expires.toISOString(),
			lastSeenAt: r.lastSeenAt.toISOString(),
			ip: r.ip,
			userAgent: r.userAgent,
			device: r.device,
			country: r.country,
			region: r.region,
			city: r.city,
			current: sessionToken ? r.sessionToken === sessionToken : false,
		});

		const mapped = rows.map(mapFn);
		const currentSession = mapped.find((x) => x.current) ?? null;
		const restSessions = mapped.filter((x) => !x.current);

		const payload: SessionsResponse = {
			userId: session.user.id,
			currentSession,
			restSessions,
		};

		return NextResponse.json(payload);
	} catch (error: unknown) {
		console.error("Error loading sessions:", error);
		return NextResponse.json(
			{ error: "Failed to load sessions" },
			{ status: 500 }
		);
	}
}


export async function DELETE(req: Request) {
	try {
	  const session = await auth();
	  if (!session?.user?.id) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	  }
  
	  const body = await req.json().catch(() => ({}));
	  const { sessionId, all } = body as { sessionId?: string; all?: boolean };
  
	  if (all) {
		await prisma.session.deleteMany({ where: { userId: session.user.id } });
		return NextResponse.json({ ok: true });
	  }
  
	  if (!sessionId) {
		return NextResponse.json({ error: "sessionId required" }, { status: 400 });
	  }
  
	  await prisma.session.deleteMany({
		where: { id: sessionId, userId: session.user.id },
	  });
  
	  return NextResponse.json({ ok: true });
	} catch (err) {
	  console.error("Error terminating session:", err);
	  return NextResponse.json({ error: "Failed to terminate session" }, { status: 500 });
	}
  }