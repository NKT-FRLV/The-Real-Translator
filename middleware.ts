// middleware.ts
import { auth } from "@/app/auth";
// import { prisma } from "@/app/prismaClient/prisma";
import { NextResponse } from "next/server";

export default async function middleware(req: Request) {
	const session = await auth();
	const user = session?.user;
	const url = new URL(req.url);
	const baseUrl = url.origin


	if (!user || user.role?.toLowerCase() !== "admin") {
		return NextResponse.redirect(`${baseUrl}/login`);
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		// '/api/:path*',
		"/profile/:path*",
	],
};
