-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('USER', 'ADMIN');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "role" "public"."Role" NOT NULL DEFAULT 'USER',
    "passwordHash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserSettings" (
    "userId" TEXT NOT NULL,
    "uiLanguage" TEXT,
    "defaultSourceLang" TEXT,
    "defaultTargetLang" TEXT,
    "preferredLLM" TEXT NOT NULL DEFAULT 'kimi-k2:free',
    "reviewDailyTarget" INTEGER,
    "notificationsEnabled" BOOLEAN NOT NULL DEFAULT false,
    "timezone" TEXT,

    CONSTRAINT "UserSettings_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "public"."Translation" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "sessionId" VARCHAR(64),
    "sourceLang" TEXT NOT NULL,
    "targetLang" TEXT NOT NULL,
    "sourceText" TEXT NOT NULL,
    "resultText" TEXT NOT NULL,
    "tone" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "isLiked" BOOLEAN NOT NULL DEFAULT false,
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "nextReviewAt" TIMESTAMP(3),
    "reviewIntervalDays" INTEGER,
    "ease" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Translation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Subscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "plan" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "currentPeriodEnd" TIMESTAMP(3) NOT NULL,
    "meta" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UsageMonthly" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "sessionId" VARCHAR(64),
    "period" TEXT NOT NULL,
    "charsUsed" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "UsageMonthly_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE INDEX "Translation_userId_createdAt_idx" ON "public"."Translation"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Translation_sessionId_createdAt_idx" ON "public"."Translation"("sessionId", "createdAt");

-- CreateIndex
CREATE INDEX "Translation_userId_nextReviewAt_idx" ON "public"."Translation"("userId", "nextReviewAt");

-- CreateIndex
CREATE INDEX "Translation_sessionId_nextReviewAt_idx" ON "public"."Translation"("sessionId", "nextReviewAt");

-- CreateIndex
CREATE INDEX "Translation_userId_isPinned_createdAt_idx" ON "public"."Translation"("userId", "isPinned", "createdAt");

-- CreateIndex
CREATE INDEX "Subscription_userId_status_idx" ON "public"."Subscription"("userId", "status");

-- CreateIndex
CREATE INDEX "UsageMonthly_sessionId_period_idx" ON "public"."UsageMonthly"("sessionId", "period");

-- CreateIndex
CREATE UNIQUE INDEX "UsageMonthly_userId_period_key" ON "public"."UsageMonthly"("userId", "period");

-- AddForeignKey
ALTER TABLE "public"."UserSettings" ADD CONSTRAINT "UserSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Translation" ADD CONSTRAINT "Translation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UsageMonthly" ADD CONSTRAINT "UsageMonthly_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
