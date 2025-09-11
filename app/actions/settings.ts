"use server";

import { auth } from "@/app/auth";
import { prisma } from "@/app/prismaClient/prisma";
import { revalidatePath } from "next/cache";
import { isLanguageShort, isTone } from "@/shared/config/translation";

export async function saveSettingsAction(formData: FormData) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    // Extract form data
    const defaultSourceLang = formData.get("defaultSourceLang");
    const defaultTargetLang = formData.get("defaultTargetLang");
    const translationStyle = formData.get("translationStyle");

    // Type guards for safety
    if (!defaultSourceLang || typeof defaultSourceLang !== "string") {
      throw new Error("Source language is required");
    }
    
    if (!defaultTargetLang || typeof defaultTargetLang !== "string") {
      throw new Error("Target language is required");
    }
    
    if (!translationStyle || typeof translationStyle !== "string") {
      throw new Error("Translation style is required");
    }

    // Validate form data
    if (!isLanguageShort(defaultSourceLang)) {
      throw new Error("Invalid source language");
    }
    
    if (!isLanguageShort(defaultTargetLang)) {
      throw new Error("Invalid target language");
    }
    
    if (!isTone(translationStyle)) {
      throw new Error("Invalid translation style");
    }

    // Update or create user settings in database
    await prisma.userSettings.upsert({
      where: {
        userId: session.user.id,
      },
      update: {
        defaultSourceLang,
        defaultTargetLang,
        translationStyle,
      },
      create: {
        userId: session.user.id,
        defaultSourceLang,
        defaultTargetLang,
        translationStyle,
        preferredLLM: "kimi-k2:free",
        notificationsEnabled: false,
      },
    });

    // Revalidate the settings page to show updated data
    revalidatePath("/profile");
    
    return { success: true, message: "Settings saved successfully" };
  } catch (error) {
    console.error("Error saving settings:", error);
    return { success: false, message: "Failed to save settings" };
  }
}
