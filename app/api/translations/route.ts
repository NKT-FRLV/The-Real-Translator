// app/api/translations/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/auth";
import { prisma } from "@/app/prismaClient/prisma";
import { isLanguageShort, isTone } from "@/shared/config/translation";
import { Tone, LanguageShort } from "@/shared/types/types";

export const runtime = "nodejs";

// POST - создание нового перевода
export async function POST(req: NextRequest) {
  try {
	const [session, body] = await Promise.all([
		auth(),
		req.json(),
	]);


    const {
      sourceText,
      resultText,
      sourceLang,
      targetLang,
      tone,
      model = "default",
      sessionId,
    } = body;

    // Валидация входных данных
    if (!sourceText?.trim() || !resultText?.trim()) {
      return NextResponse.json(
        { error: "Source text and result text are required" },
        { status: 400 }
      );
    }

    if (!isLanguageShort(sourceLang) || !isLanguageShort(targetLang)) {
      return NextResponse.json(
        { error: "Valid source and target languages are required" },
        { status: 400 }
      );
    }

    if (!isTone(tone)) {
      return NextResponse.json(
        { error: "Valid tone is required" },
        { status: 400 }
      );
    }

    // Создаем перевод в базе данных
    const translation = await prisma.translation.create({
      data: {
        sourceText: sourceText.trim(),
        resultText: resultText.trim(),
        sourceLang: sourceLang,
        targetLang: targetLang,
        tone: tone,
        model,
        userId: session?.user?.id || null,
        sessionId: !session?.user?.id ? sessionId : null,
        isLiked: false,
        isPinned: false,
      },
      select: {
        id: true,
        sourceText: true,
        resultText: true,
        sourceLang: true,
        targetLang: true,
        tone: true,
        model: true,
        isLiked: true,
        isPinned: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ translation }, { status: 201 });
  } catch (error) {
    console.error("Error creating translation:", error);
    return NextResponse.json(
      { error: "Failed to save translation" },
      { status: 500 }
    );
  }
}

// GET - получение переводов пользователя
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const { searchParams } = new URL(req.url);
    
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const likedOnly = searchParams.get("liked") === "true";
    
    const skip = (page - 1) * limit;

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const where = {
      userId: session.user.id,
      deletedAt: null,
      ...(likedOnly && { isLiked: true }),
    };

    const [translations, total] = await Promise.all([
      prisma.translation.findMany({
        where,
        select: {
          id: true,
          sourceText: true,
          resultText: true,
          sourceLang: true,
          targetLang: true,
          tone: true,
          model: true,
          isLiked: true,
          isPinned: true,
          createdAt: true,
        },
        orderBy: [
          { isPinned: "desc" },
          { createdAt: "desc" },
        ],
        skip,
        take: limit,
      }),
      prisma.translation.count({ where }),
    ]);

    return NextResponse.json({
      translations,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching translations:", error);
    return NextResponse.json(
      { error: "Failed to fetch translations" },
      { status: 500 }
    );
  }
}
