// app/api/translations/liked/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/auth";
import { prisma } from "@/app/prismaClient/prisma";

export const runtime = "nodejs";

// GET - получение всех понравившихся переводов пользователя
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const { searchParams } = new URL(req.url);
    
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    
    const skip = (page - 1) * limit;

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const where = {
      userId: session.user.id,
      isLiked: true,
      deletedAt: null,
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
    console.error("Error fetching liked translations:", error);
    return NextResponse.json(
      { error: "Failed to fetch liked translations" },
      { status: 500 }
    );
  }
}
