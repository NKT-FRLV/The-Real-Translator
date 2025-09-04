import { auth } from "@/app/auth";
import { prisma } from "@/app/prismaClient/prisma";
import {UserTranslationSettings} from "@/shared/types/settings"



export async function getUserSettingsData(): Promise<UserTranslationSettings> {
  const session = await auth();
  
  if (!session?.user?.id) {
    // Возвращаем дефолтные настройки для неавторизованных пользователей
    return {
      defaultSourceLang: "ru",
      defaultTargetLang: "en",
      translationStyle: "neutral",
    };
  }

  // Get or create user settings
  let userSettings = await prisma.userSettings.findUnique({
    where: {
      userId: session.user.id,
    },
  });

  // If no settings exist, create default ones
  if (!userSettings) {
    userSettings = await prisma.userSettings.create({
      data: {
        userId: session.user.id,
        defaultSourceLang: "ru",
        defaultTargetLang: "en",
        translationStyle: "neutral",
        preferredLLM: "kimi-k2:free",
        notificationsEnabled: false,
      },
    });
  }

  return {
    defaultSourceLang: (userSettings as UserTranslationSettings).defaultSourceLang || "ru",
    defaultTargetLang: (userSettings as UserTranslationSettings).defaultTargetLang || "en",
    translationStyle: (userSettings as UserTranslationSettings).translationStyle || "neutral",
    uiLanguage: userSettings.uiLanguage || undefined,
    preferredLLM: userSettings.preferredLLM || undefined,
    reviewDailyTarget: userSettings.reviewDailyTarget || undefined,
    notificationsEnabled: userSettings.notificationsEnabled || undefined,
    timezone: userSettings.timezone || undefined,
  };
}
