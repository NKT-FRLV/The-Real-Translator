// auth.ts (в корне или src/auth.ts)
import "server-only";

import NextAuth, { type NextAuthConfig } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/app/prismaClient/prisma"; // если у тебя так
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

const requireEnv = (k: string) => {
	const v = process.env[k];
	if (!v) throw new Error(`Missing environment variable: ${k}`);
	return v;
};

export const authConfig: NextAuthConfig = {
	trustHost: true,

	adapter: PrismaAdapter(prisma),
	session: {
		strategy: "database",
		maxAge: 60 * 60 * 24 * 30, // 30 дней
		updateAge: 60 * 60 * 24, // продление раз в сутки
	},
	providers: [
		GitHub({
			clientId: requireEnv("GITHUB_ID"),
			clientSecret: requireEnv("GITHUB_SECRET"),
			authorization: { params: { scope: "read:user user:email" } },
		}),
		Google({
			clientId: requireEnv("GOOGLE_ID"),
			clientSecret: requireEnv("GOOGLE_SECRET"),
		}),
	],
	callbacks: {
		// При стратегии "database" коллбек вызывается при чтении сессии.
		// Гарантируем, что session.user содержит id/role без кастов.
		async session({ session, user }) {
			if (!session.user) return session;

			// 1) Пытаемся обогатить по email (самый надёжный путь)
			if (typeof session.user.email === "string") {
				const found = await prisma.user.findUnique({
					where: { email: session.user.email },
					select: { id: true, role: true },
				});
				if (found) {
					session.user.id = found.id;
					return session;
				}
			}

			// 2) Фоллбэк: если email недоступен, но коллбек дал user (обычно при первом запросе)
			if (user) {
				const foundById = await prisma.user.findUnique({
					where: { id: user.id },
					select: { id: true, role: true },
				});
				if (foundById) {
					session.user.id = foundById.id;
				}
			}

			return session;
		},
	},
};

export const {
	handlers,
	auth,
	signIn,
	signOut,
  } = NextAuth(authConfig);
