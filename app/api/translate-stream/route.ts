// app/api/translate-stream/route.ts
import { NextRequest } from "next/server";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText, UIMessage, convertToModelMessages } from 'ai';
import { LanguageShort, Tone } from "@/shared/types/types";
import { isLanguageShort, isTone } from "@/shared/config/translation";
import { createLogger } from "@/shared/utils/logger";

export const runtime = "edge";

// ───────────────────────────────────────────────────────────────────────────────
// OpenRouter provider (только chat, без completion/Responses API)
// ───────────────────────────────────────────────────────────────────────────────
const openrouter = createOpenRouter({
	apiKey: process.env.OPENROUTER_API_KEY,
	// (не обязательно) атрибуция приложения:
	// headers: {
	//   "HTTP-Referer": process.env.OPENROUTER_SITE_URL ?? "",
	//   "X-Title": process.env.OPENROUTER_APP_NAME ?? "translator-app",
	// },
});

// Поддерживаемые модели на OpenRouter (chat-ветка)
const SUPPORTED_MODELS = {
	"gpt-5-nano": "openai/gpt-5-nano",
	"gpt-4o-mini": "openai/gpt-4o-mini",
	"gpt-4o": "openai/gpt-4o",
	"gpt-4.1-mini": "openai/gpt-4.1-mini",
	"gpt-4.1-nano": "openai/gpt-4.1-nano",
	"claude-3-5-sonnet": "anthropic/claude-3.5-sonnet",
	"claude-3-5-haiku": "anthropic/claude-3.5-haiku",
	"llama-3.1-70b": "meta-llama/llama-3.1-70b-instruct",
	"llama-3.1-8b": "meta-llama/llama-3.1-8b-instruct",
	"mistral-large": "mistralai/mistral-large-2407",
} as const;

// Временно используем модель без reasoning для тестирования
const envModel = process.env.TRANSLATION_MODEL || "gpt-4.1-nano"; // Изменено с gpt-5-nano
const MODEL_KEY = (
	Object.keys(SUPPORTED_MODELS) as Array<keyof typeof SUPPORTED_MODELS>
).includes(envModel as keyof typeof SUPPORTED_MODELS)
	? (envModel as keyof typeof SUPPORTED_MODELS)
	: "gpt-4.1-nano"; // Изменено с gpt-5-nano
const MODEL = SUPPORTED_MODELS[MODEL_KEY];

// ───────────────────────────────────────────────────────────────────────────────
// Prompt helpers
// ───────────────────────────────────────────────────────────────────────────────
function getToneInstructions(tone: Tone): string {
	const map: Record<Tone, string> = {
		natural:
			"Use neutral, simple, everyday language. Avoid overly formal or slang expressions.",
		intellectual:
			"Use sophisticated, formal language with richer vocabulary and precise phrasing.",
		poetic: `Translate the following text into chosen language. The translation must be a poem, written in the recognizable style of Alexander Pushkin.
  
  Focus on emulating Pushkin's elegance, clarity, and classical rhythm, often characterized by iambic or trochaic meter. The rhymes should be clear and traditional (e.g., AABB or ABAB schemes), avoiding overly complex or modern structures. The tone should be lyrical and perhaps slightly melancholic or reflective, typical of his descriptive pieces.
  
  Please preserve the original meaning while transforming it into a poetic form that evokes the essence of Pushkin's verse.`,
		street: "Use informal, conversational style with slang where natural, concise phrasing.",
	};
	return map[tone] ?? map.natural;
}

function buildSystem(
	fromLang: LanguageShort,
	toLang: LanguageShort,
	tone: Tone
) {
	return `You are a machine translator that ONLY translates text. Do not explain, do not answer questions.
  
  TRANSLATION TASK:
  - Source language: ${fromLang}
  - Target language: ${toLang}
  - Style: ${getToneInstructions(tone)}
  
  STRICT RULES:
  - Translate ONLY from ${fromLang} to ${toLang}
  - Never provide explanations or extra text
  - Output ONLY the translated text
  - Preserve meaning and natural phrasing for the target language.`;
}

// ───────────────────────────────────────────────────────────────────────────────
// HEAD — для варминга соединения
// ───────────────────────────────────────────────────────────────────────────────
export async function HEAD() {
	const logger = createLogger("API:HEAD");
	logger.debug("Warmup HEAD request received");

	return new Response(null, {
		status: 200,
		headers: { "Cache-Control": "no-cache" },
	});
}

// ───────────────────────────────────────────────────────────────────────────────
// GET — служебная информация
// ───────────────────────────────────────────────────────────────────────────────
export async function GET() {
	const logger = createLogger("API:GET");
	logger.debug("Info request received");

	const response = {
		supportedModels: Object.keys(SUPPORTED_MODELS),
		currentModel: MODEL_KEY,
		provider: "OpenRouter",
		runtime,
	};

	logger.debug("Returning API info", response);

	return new Response(JSON.stringify(response), {
		headers: { "Content-Type": "application/json" },
	});
}

// ───────────────────────────────────────────────────────────────────────────────
// POST — основной стриминг перевода
// ───────────────────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
	// TODO: remove logger after testing
	const logger = createLogger("API:POST", undefined, true);

	try {
		logger.info("Translation request received", {
			method: req.method,
			url: req.url,
			headers: {
				"content-type": req.headers.get("content-type"),
				"user-agent": req.headers.get("user-agent")?.substring(0, 100),
			},
		});

		const raw = await req.json();
		
		console.log('raw', raw);

		logger.debug("Request body parsed", { bodyKeys: Object.keys(raw) });

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

		logger.info("Request parameters extracted", {
			textLength: text.length,
			textPreview:
				text.substring(0, 100) + (text.length > 100 ? "..." : ""),
			fromLang,
			toLang,
			tone,
		});

		if (!text.trim()) {
			logger.warn("Request rejected - empty text");
			return new Response(JSON.stringify({ error: "Text is required" }), {
				status: 400,
				headers: { "Content-Type": "application/json" },
			});
		}
		if (!fromLang || !toLang) {
			logger.warn("Request rejected - missing languages", {
				fromLang,
				toLang,
			});
			return new Response(
				JSON.stringify({ error: "Languages are required" }),
				{ status: 400, headers: { "Content-Type": "application/json" } }
			);
		}
		if (fromLang === toLang) {
			logger.warn("Request rejected - same languages", {
				language: fromLang,
			});
			return new Response(
				JSON.stringify({
					error: "Source and target languages cannot be the same",
				}),
				{ status: 400, headers: { "Content-Type": "application/json" } }
			);
		}

		const system = buildSystem(fromLang, toLang, tone);
		logger.debug("System prompt built", {
			systemPromptLength: system.length,
		});

		logger.info("Initializing OpenRouter stream", {
			model: MODEL,
			modelKey: MODEL_KEY,
			temperature: 0,
			topP: 1,
			maxOutputTokens: MODEL.includes("gpt-5") ? 3072 : 1000,
			hasAbortSignal: !!req.signal,
			signalAborted: req.signal?.aborted,
			hasApiKey: !!process.env.OPENROUTER_API_KEY,
			apiKeyPreview: process.env.OPENROUTER_API_KEY
				? `${process.env.OPENROUTER_API_KEY.substring(0, 8)}...`
				: "missing",
		});

		// Проверим сигнал аборта перед стартом
		if (req.signal?.aborted) {
			logger.warn("Request already aborted before OpenRouter call");
			return new Response(null, { status: 204 });
		}

		// Chat-модель через OpenRouter + корректный text stream для useCompletion
		const result = streamText({
			model: openrouter.chat(MODEL),
			system,
			messages: [{ role: "user", content: text }],
			temperature: 0,
			topP: 1,
			// Можно дать чуть больше для длинных кусков
			maxOutputTokens: MODEL.includes("gpt-5") ? 3072 : 1000,
			abortSignal: req.signal,
			onChunk: ({ chunk }) => {
				logger.debug("Received chunk from OpenRouter", {
					chunkType: chunk.type,
					hasText: "text" in chunk && !!chunk.text,
					textLength: "text" in chunk ? chunk.text?.length : 0,
					textPreview:
						"text" in chunk
							? chunk.text?.substring(0, 50)
							: "no text",
				});

				// Логируем только text-delta chunks которые должны попасть на фронт
				if (
					chunk.type === "text-delta" &&
					"text" in chunk &&
					chunk.text
				) {
					logger.info("Text chunk being sent to client", {
						textLength: chunk.text.length,
						textPreview: chunk.text.substring(0, 100),
					});
				}
			},
			onFinish: ({ text, usage }) => {
				logger.success("OpenRouter stream finished", {
					totalLength: text.length,
					textPreview:
						text.substring(0, 100) +
						(text.length > 100 ? "..." : ""),
					usage,
				});
			},
			onError: (error) => {
				logger.error("OpenRouter stream error", error);
			},
		});

		logger.streamStart({ openRouterModel: MODEL });

		// Используем toTextStreamResponse для совместимости с useCompletion и streamProtocol: "text"
		const response = result.toTextStreamResponse({
			headers: {
				"Cache-Control": "no-cache, no-transform",
				"X-Accel-Buffering": "no",
			},
		});

		logger.success("Stream response created successfully", {
			responseStatus: response.status,
			responseHeaders: Object.fromEntries(response.headers.entries()),
		});

		// Тот самый response который мы возвращаем в useCompletion
		return response;


	} catch (error: unknown) {
		// abort — нормальный сценарий
		if (
			req.signal?.aborted ||
			(error instanceof Error && error.name === "AbortError")
		) {
			logger.streamAbort(error);
			logger.info("Request aborted (normal scenario)", {
				signalAborted: req.signal?.aborted,
				errorName: error instanceof Error ? error.name : "unknown",
				errorMessage:
					error instanceof Error ? error.message : String(error),
			});
			return new Response(null, { status: 204 });
		}

		// Проверим тип ошибки для более детального логирования
		if (error instanceof Error) {
			if (error.message.includes("ECONNRESET")) {
				logger.error("Connection reset by OpenRouter", error, {
					errorCode: "ECONNRESET",
					possibleCause:
						"Network connection issue or OpenRouter timeout",
				});
			} else if (error.message.includes("fetch")) {
				logger.error("Fetch error to OpenRouter", error, {
					possibleCause: "Network or OpenRouter API issue",
				});
			} else {
				logger.error("Unknown translation error", error);
			}
		} else {
			logger.error("Non-Error exception in translation", error);
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
