-- DropIndex
DROP INDEX "public"."Session_userId_idx";

-- AlterTable
ALTER TABLE "public"."Session" ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" VARCHAR(2),
ADD COLUMN     "device" TEXT,
ADD COLUMN     "ip" VARCHAR(45),
ADD COLUMN     "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "region" TEXT,
ADD COLUMN     "userAgent" TEXT;

-- CreateIndex
CREATE INDEX "Session_userId_expires_idx" ON "public"."Session"("userId", "expires");

-- CreateIndex
CREATE INDEX "Session_userId_lastSeenAt_idx" ON "public"."Session"("userId", "lastSeenAt");
