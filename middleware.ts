// middleware.ts
import { auth } from "@/app/auth";
import { NextResponse } from "next/server";

export default async function middleware(req: Request) {
	const session = await auth();
	const user = session?.user;
	const url = new URL(req.url);
	const baseUrl = url.origin;

	// Для API routes возвращаем JSON ошибки вместо редиректов
	if (url.pathname.startsWith("/api/")) {
		if (!user || user.role?.toLowerCase() !== "admin") {
			return NextResponse.json(
				{
					error: "Authentication required",
					code: "AUTH_REQUIRED",
					message: "Please log in to access this feature",
					redirectUrl: "/login"
				},
				{ status: 401 }
			);
		}
		return NextResponse.next();
	}

	// Для обычных страниц используем редиректы
	if (!user || user.role?.toLowerCase() !== "admin") {
		return NextResponse.redirect(`${baseUrl}/login`);
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		"/profile/:path*",
		"/api/grammar/explain/:path*",
	],
};
