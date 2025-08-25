// app/api/translations/[id]/like/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/auth";
import { prisma } from "@/app/prismaClient/prisma";

export const runtime = "nodejs";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// POST - лайк/дизлайк перевода
export async function POST(
  req: NextRequest,
  { params }: RouteParams
) {
  try {
	const [session, body] = await Promise.all([auth(), req.json()]);
    const { id } = await params;
    const { liked } = body;

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    if (typeof liked !== "boolean") {
      return NextResponse.json(
        { error: "Liked status must be a boolean" },
        { status: 400 }
      );
    }

    // Проверяем, что перевод существует и принадлежит пользователю
    const existingTranslation = await prisma.translation.findFirst({
      where: {
        id,
        userId: session.user.id,
        deletedAt: null,
      },
      select: { id: true, isLiked: true },
    });

    if (!existingTranslation) {
      return NextResponse.json(
        { error: "Translation not found" },
        { status: 404 }
      );
    }

    // Обновляем статус лайка
    const updatedTranslation = await prisma.translation.update({
      where: { id },
      data: { isLiked: liked },
      select: {
        id: true,
        sourceText: true,
        resultText: true,
        sourceLang: true,
        targetLang: true,
        tone: true,
        isLiked: true,
        isPinned: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ translation: updatedTranslation });
  } catch (error) {
    console.error("Error updating translation like:", error);
    return NextResponse.json(
      { error: "Failed to update translation" },
      { status: 500 }
    );
  }
}
