// auth.ts (в корне или src/auth.ts)
import "server-only";

export const runtime = "edge";

import NextAuth, { type NextAuthConfig } from "next-auth";
import { headers } from "next/headers";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/app/prismaClient/prisma"; // может стоит добавить адаптера для edge runtime
import { TUserRole } from "@/shared/types/user";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
// import Yandex from "next-auth/providers/yandex"

const requireEnv = (k: string) => {
	const v = process.env[k];
	if (!v) throw new Error(`Missing environment variable: ${k}`);
	return v;
};

// Расширяем типы NextAuth для того, чтобы использовать в адаптере
declare module "next-auth" {
	interface User {
		role?: TUserRole;
	}

	interface Session {
		user: {
			id: string;
			role?: TUserRole;
			name?: string | null;
			email?: string | null;
			image?: string | null;
		};
	}
}

export const authConfig: NextAuthConfig = {
	trustHost: true,

	adapter: PrismaAdapter(prisma),
	session: {
		strategy: "database",
		maxAge: 60 * 60 * 24 * 30, // 30 дней актуальности сессии
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
		// Yandex({
		// 	clientId: requireEnv("YANDEX_ID"),
		// 	clientSecret: requireEnv("YANDEX_SECRET"),
		// }),
	],
	events: {
		async signIn({ user }) {
			// best-effort метка устройства/IP при входе для того, чтобы использовать в адаптере
			try {
				const h = await headers(); // сработает в контексте запроса
				const ua = h.get("user-agent") ?? null;
				const ip =
					(h.get("x-forwarded-for") ?? "").split(",")[0].trim() ||
					h.get("x-real-ip") ||
					null;

				await prisma.session.updateMany({
					// хак: зацепляем “свежесозданные” сессии за последние 5 минут
					where: {
						userId: user.id,
						createdAt: {
							gte: new Date(Date.now() - 5 * 60 * 1000),
						},
					},
					data: { userAgent: ua, ip },
				});
			} catch (e) {
				// вне запроса headers() бросит — это ок, пропускаем
				console.warn("signIn event enrich skipped:", e);
			}
		},
	},
	callbacks: {
		// При стратегии "database" коллбек вызывается при чтении сессии.
		// Гарантируем, что session.user содержит id/role без кастов.
		async session({ session, user }) {
			// при strategy: "database" сюда приходит `user` уже из адаптера
			if (session.user && user) {
			  // гарантируем id/role в session.user без доп. походов в БД
			  // (убедись, что в User есть поле `role` и оно возвращается адаптером)
			  session.user.id = user.id;
			  session.user.role = user.role ?? undefined;
			}
			return session;
		},
	},
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
