// app/api/translate-stream/route.ts - Clean Architecture API Route
import { NextRequest } from "next/server";
import { TranslationController } from "@/interface-adapters/controllers/translation-controller";

export const runtime = "edge"; // ⚡ Faster cold start

// Создаем экземпляр контроллера
const translationController = new TranslationController();

// ✅ HEAD method for connection warmup
export async function HEAD() {
	return translationController.handleWarmup();
}

// ✅ POST method for streaming translation
export async function POST(req: NextRequest) {
	return translationController.handleStreamTranslation(req);
}
