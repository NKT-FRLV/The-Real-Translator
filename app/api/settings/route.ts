import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/auth";
import { prisma } from "@/app/prismaClient/prisma";

// GET - Load user settings
export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
          defaultSourceLang: "en",
          defaultTargetLang: "ru",
		  translationStyle: "natural",
          preferredLLM: "kimi-k2:free",
          notificationsEnabled: false,
        },
      });
    }

    // Return settings (mapping to our store format)
    return NextResponse.json({
      defaultSourceLang: userSettings.defaultSourceLang || "auto",
      defaultTargetLang: userSettings.defaultTargetLang || "en",
	  translationStyle: userSettings.translationStyle || "natural",
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
        defaultSourceLang: defaultSourceLang === "auto" ? null : defaultSourceLang,
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
        defaultSourceLang: defaultSourceLang === "auto" ? null : defaultSourceLang,
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
        defaultSourceLang: userSettings.defaultSourceLang || "auto",
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

