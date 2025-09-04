import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/auth";
import { prisma } from "@/app/prismaClient/prisma";
import { getUserSettingsData } from "@/app/services/settingsService";

// GET - Load user settings
export async function GET() {
  try {
    const userSettings = await getUserSettingsData();
    
    // Return settings (mapping to our store format)
    return NextResponse.json({
      defaultSourceLang: userSettings.defaultSourceLang,
      defaultTargetLang: userSettings.defaultTargetLang,
      translationStyle: userSettings.translationStyle,
      uiLanguage: userSettings.uiLanguage,
      preferredLLM: userSettings.preferredLLM,
      reviewDailyTarget: userSettings.reviewDailyTarget,
      notificationsEnabled: userSettings.notificationsEnabled,
      timezone: userSettings.timezone,
    });
  } catch (error) {
    console.error("Error loading settings:", error);
    return NextResponse.json(
      { error: "Failed to load settings" },
      { status: 500 }
    );
  }
}

// POST - Save user settings
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    
    // Validate the incoming data
    const {
      defaultSourceLang,
      defaultTargetLang,
	  translationStyle,
      uiLanguage,
      preferredLLM,
      reviewDailyTarget,
      notificationsEnabled,
      timezone,
    } = body;

    // Note: translationStyle, emailNotifications, translationReminders
    // are stored in the client store but not yet in DB schema

    // Update or create user settings
    const userSettings = await prisma.userSettings.upsert({
      where: {
        userId: session.user.id,
      },
      update: {
        defaultSourceLang,
        defaultTargetLang,
		translationStyle,
        uiLanguage,
        preferredLLM: preferredLLM || "kimi-k2:free",
        reviewDailyTarget,
        notificationsEnabled: notificationsEnabled || false,
        timezone,
      },
      create: {
        userId: session.user.id,
        defaultSourceLang,
        defaultTargetLang,
		translationStyle,
        uiLanguage,
        preferredLLM: preferredLLM || "kimi-k2:free",
        reviewDailyTarget,
        notificationsEnabled: notificationsEnabled || false,
        timezone,
      },
    });

    return NextResponse.json({
      success: true,
      settings: {
        defaultSourceLang: userSettings.defaultSourceLang,
        defaultTargetLang: userSettings.defaultTargetLang,
		translationStyle: userSettings.translationStyle,
        uiLanguage: userSettings.uiLanguage,
        preferredLLM: userSettings.preferredLLM,
        reviewDailyTarget: userSettings.reviewDailyTarget,
        notificationsEnabled: userSettings.notificationsEnabled,
        timezone: userSettings.timezone,
      },
    });
  } catch (error) {
    console.error("Error saving settings:", error);
    return NextResponse.json(
      { error: "Failed to save settings" },
      { status: 500 }
    );
  }
}

