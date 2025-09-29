// import { PrismaClient } from "@prisma/client";
// const prisma = new PrismaClient();

// const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "");

// async function main() {
//   await prisma.user.upsert({
//     where: { email: ADMIN_EMAIL },
//     update: { role: "ADMIN" },
//     create: { email: ADMIN_EMAIL, role: "ADMIN" }
//   });
//   console.log("Admin seeded:", ADMIN_EMAIL);
// }
// main().finally(() => prisma.$disconnect());
