// app/api/translate-stream/route.ts
import { NextRequest } from "next/server";
import { streamText } from 'ai';
import { openrouter } from "@/app/services/openRouter";
import { Tone } from "@/shared/types/types";
import { isLanguageShort, isTone } from "@/shared/config/translation";
import { MODEL, MODEL_KEY, SUPPORTED_MODELS } from "@/app/services/modelConfig";
import { buildSystem } from "@/app/utils/prompt-build";

export const runtime = "edge";


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
export async function GET() {

	const response = {
		supportedModels: Object.keys(SUPPORTED_MODELS),
		currentModel: MODEL_KEY,
		provider: "OpenRouter",
		runtime,
	};

	return new Response(JSON.stringify(response), {
		headers: { "Content-Type": "application/json" },
	});
}

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

		const tone: Tone = isTone(raw?.tone) ? raw.tone : "natural";

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

		const reasoningOptions = MODEL.includes("gpt-5") ? {
			extraBody: {
			  reasoning: { effort: "low", exclude: true }
			}
		  } : {};

		// Chat-модель через OpenRouter + корректный text stream для useCompletion
		const result = streamText({
			model: openrouter.chat(MODEL, reasoningOptions),
			system,
			messages: [{ role: "user", content: text }],
			temperature: 0,
			topP: 1,
			providerOptions: {
				openrouter: {
				  reasoning: { effort: "low", exclude: true }
				},
			  },
			// Можно дать чуть больше для длинных кусков
			maxOutputTokens: 1000,
			abortSignal: req.signal,
		});

		// Используем toTextStreamResponse для совместимости с useCompletion и streamProtocol: "text"
		const response = result.toTextStreamResponse({
			headers: {
				"Cache-Control": "no-cache, no-transform",
				"X-Accel-Buffering": "no",
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
