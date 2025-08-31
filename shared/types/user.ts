import type { Session } from "@prisma/client";

export type TUserRole = "ADMIN" | "USER" | "GUEST";

export interface MinimalUser {
	id: string;
    role?: TUserRole;
    name?: string | null;
    email?: string | null;
    image?: string | null;
}

// API Response types


// // Utility type для извлечения типа из Prisma запроса
// export type PrismaSelect<T, K extends keyof T> = Pick<T, K>;

// // Пример использования для Session с select
// export type SessionWithSelect = PrismaSelect<Session, 'id' | 'sessionToken' | 'expires' | 'createdAt'>;

export type SessionDTO = {
	id: string;
	createdAt: string;
	expires: string;
	lastSeenAt: string;
	ip?: string | null;
	userAgent?: string | null;
	device?: string | null;
	country?: string | null;
	region?: string | null;
	city?: string | null;
	current: boolean;
};

export type SessionsResponse = {
	userId: string;
	currentSession: SessionDTO | null;
	restSessions: SessionDTO[];
};

  
export type ApiErrorResponse = { error: string };

