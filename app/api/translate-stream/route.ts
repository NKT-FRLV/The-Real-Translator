// app/api/translate-stream/route.ts
import { NextRequest } from "next/server";
import { streamText } from 'ai';
import { openrouter } from "@/app/services/openRouter";
import { Tone } from "@/shared/types/types";
import { isLanguageShort, isTone } from "@/shared/config/translation";
import { buildSystem } from "@/app/utils/prompt-build";

export const runtime = "edge";

const envModel = process.env.TRANSLATION_MODEL || "openai/gpt-4o-mini";

// ───────────────────────────────────────────────────────────────────────────────
// HEAD — для варминга соединения
// ───────────────────────────────────────────────────────────────────────────────
export async function HEAD() {

	return new Response(null, {
		status: 200,
		headers: { "Cache-Control": "no-cache" },
	});
}

// ───────────────────────────────────────────────────────────────────────────────
// GET — служебная информация
// ───────────────────────────────────────────────────────────────────────────────
// export async function GET() {

// 	const response = {
// 		supportedModels: Object.keys(SUPPORTED_MODELS),
// 		currentModel: MODEL_KEY,
// 		provider: "OpenRouter",
// 		runtime,
// 	};

// 	return new Response(JSON.stringify(response), {
// 		headers: { "Content-Type": "application/json" },
// 	});
// }

// ───────────────────────────────────────────────────────────────────────────────
// POST — основной стриминг перевода
// ───────────────────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {

	try {
		// Проверим сигнал аборта в самом начале
		if (req.signal?.aborted) {
			return new Response(null, { status: 204 });
		}

		const raw = await req.json();
		// console.log('CHOOSED MODEL: ', MODEL)
		// console.log('raw', raw);

		// useCompletion может передавать данные в prompt или в body: {text: 'Hello world', ...rest}
		const text =
			typeof raw?.prompt === "string"
				? raw.prompt
				: typeof raw?.text === "string"
				? raw.text
				: "";

		const fromLang = isLanguageShort(raw?.fromLang)
			? raw.fromLang
			: undefined;

		const toLang = isLanguageShort(raw?.toLang) ? raw.toLang : undefined;

		const tone: Tone = isTone(raw?.tone) ? raw.tone : "neutral";

		// Проверим текст на пустоту
		if (!text.trim()) {
			return new Response(
				JSON.stringify({ error: "Text to translate is required" }),
				{ status: 400, headers: { "Content-Type": "application/json" } }
			);
		}
	
		if (!fromLang || !toLang) {
			return new Response(
				JSON.stringify({ error: "Languages are required" }),
				{ status: 400, headers: { "Content-Type": "application/json" } }
			);
		}
		if (fromLang === toLang) {
			return new Response(
				JSON.stringify({
					error: "Source and target languages cannot be the same",
				}),
				{ status: 400, headers: { "Content-Type": "application/json" } }
			);
		}

		// Проверим сигнал аборта перед тяжелыми операциями
		if (req.signal?.aborted) {
			return new Response(null, { status: 204 });
		}

		const system = buildSystem(fromLang, toLang, tone);

		// Оптимизированные настройки для максимальной скорости с sub-провайдерами
		const speedOptimizedOptions = {
			// Provider routing для автоматического выбора быстрого провайдера
			providerOptions: {
				openrouter: {
					// Автоматический выбор самого быстрого провайдера
					provider: "auto", // Позволяет OpenRouter выбрать самого быстрого провайдера
					// Настройки для максимальной скорости
					timeout: 30000, // 30 секунд таймаут
					retries: 2, // Минимальные повторы
					// Отключаем reasoning для ускорения
					reasoning: { effort: "low", exclude: true },
					// Настройки для быстрого ответа
					stream: true,
					// Приоритет скорости над качеством
					priority: "speed",
					
				}
			},
			// Дополнительные настройки для ускорения
			extraBody: {
				reasoning: { effort: "low", exclude: true },
			}
		};

		// Chat-модель через OpenRouter с оптимизацией скорости
		const result = streamText({
			model: openrouter.chat(envModel, speedOptimizedOptions),
			system,
			messages: [{ role: "user", content: text }],
			// Оптимизированные параметры для скорости
			temperature: 0, // Детерминированный ответ
			topP: 0.9, // Немного снижено для ускорения
			// Минимальные токены для быстрого ответа
			maxOutputTokens: 800, // Снижено для ускорения
			abortSignal: req.signal,
		});

		// Используем toTextStreamResponse для совместимости с useCompletion и streamProtocol: "text"
		const response = result.toTextStreamResponse({
			headers: {
				// Оптимизация кэширования для стриминга
				"Cache-Control": "no-cache, no-store, no-transform",
				"X-Accel-Buffering": "no", // Отключаем буферизацию nginx
				// Дополнительные заголовки для максимальной скорости
				"Connection": "keep-alive",
				"Transfer-Encoding": "chunked",
				// Заголовки для оптимизации стриминга
				"X-Content-Type-Options": "nosniff",
				"X-Frame-Options": "DENY",
				// Настройки для быстрого ответа
				"X-Response-Time": "fast",
				"X-Streaming": "true"
			},
		});

		// Тот самый response который мы возвращаем в useCompletion
		return response;


	} catch (error: unknown) {
		// abort — нормальный сценарий
		if (
			req.signal?.aborted ||
			(error instanceof Error && error.name === "AbortError")
		) {

			return new Response(null, { status: 204 });
		}

		return new Response(
			JSON.stringify({
				error:
					error instanceof Error
						? error.message
						: "Translation failed",
			}),
			{ status: 500, headers: { "Content-Type": "application/json" } }
		);
	}
}
