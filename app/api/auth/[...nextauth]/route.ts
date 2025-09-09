// app/api/auth/[...nextauth]/route.ts
import { handlers } from "@/app/auth";
export const { GET, POST } = handlers;

// Prisma требует nodejs runtime (не edge) Однако для auth нужно edge runtime, и я добавил Prisma accelerate
export const runtime = "edge";

// (необязательно) отключить кеширование роутов в dev
// export const dynamic = "force-dynamic";
