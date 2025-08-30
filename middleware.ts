// middleware.ts
import { auth } from "@/app/auth";
import { prisma } from "@/app/prismaClient/prisma";
import { NextResponse } from "next/server";

export default async function middleware(req: Request) {
  const session = await auth();
  const url = new URL(req.url);

  console.log("middleware check", url.pathname);


  if (url.pathname.startsWith("/app")) {
    if (!session?.user?.id) {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  if (url.pathname.startsWith("/admin")) {
    if (!session?.user?.id) {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (!user || user.role.toLowerCase() !== "admin") {
      url.pathname = "/403";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = { matcher: [ '/api/:path*', '/profile:path*'] };
