// app/api/auth/[...nextauth]/route.ts
import { handlers } from "@/app/auth";
export const { GET, POST } = handlers;

// Prisma требует nodejs runtime (не edge)
export const runtime = "nodejs";

// (необязательно) отключить кеширование роутов в dev
export const dynamic = "force-dynamic";
