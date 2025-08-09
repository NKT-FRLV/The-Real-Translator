// app/api/translate-stream/route.ts - Simplified streaming API (Edge)
import { NextRequest } from "next/server";
import { LanguageShort, Tone } from "@/shared/types/types";
import { isLanguageShort, isTone } from "@/shared/config/translation";
import { translateEventsStream } from "@/app/services/openAI-stream";
import { runStreamingOrchestrator, sse } from "@/app/utils/stream";

export const runtime = "edge";

// Types sourced from shared/config. Local duplication removed.

const allowedModels = new Set([
	"gpt-5-nano",
	"gpt-4.1-nano",
	"gpt-4o-mini",
	"gpt-4o",
	"gpt-4.1",
]);

const envModel = process.env.OPENAI_MODEL;
const MODEL =
	envModel && allowedModels.has(envModel) ? envModel : "gpt-4.1-nano";

function getToneInstructions(tone: Tone): string {
	const map: Record<Tone, string> = {
		natural:
			"Use neutral, simple, everyday language. Avoid overly formal or slang expressions.",
		intellectual:
			"Use sophisticated, formal language with richer vocabulary and precise phrasing.",
		poetic: `Translate the following text into chosen language. The translation must be a poem, written in the recognizable style of Alexander Pushkin.


Focus on emulating Pushkin's elegance, clarity, and classical rhythm, often characterized by iambic or trochaic meter. The rhymes should be clear and traditional (e.g., AABB or ABAB schemes), avoiding overly complex or modern structures. The tone should be lyrical and perhaps slightly melancholic or reflective, typical of his descriptive pieces.


Please preserve the original meaning while transforming it into a poetic form that evokes the essence of Pushkin's verse.

## EXAMPLE:
# Original text in Russian: Я иду по улице и вижу старый дом, в окне горит свет, и кажется, что кто-то ждет.

- Translation to English: Along the street my path I keep,
And there a mansion, old and deep,
With window lit, a gleam so faint,
As if some soul awaits, a saint.
- Translation to Spanish: Por la calle mi paso llevo yo,
Y un viejo hogar allí contemplo,
Con luz que en su ventana se encendió,
Cual si alguien la espera en su templo.
`,
		street: "Use informal, conversational style with slang where natural, concise phrasing.",
	};
	return map[tone] ?? map.natural;
}

function buildInstructions(
	fromLang: LanguageShort,
	toLang: LanguageShort,
	tone: Tone
): string {
	return `You are a machine translator that ONLY translates text. Do not explain, do not answer questions.

TRANSLATION TASK:
- Source language: ${fromLang}
- Target language: ${toLang}
- Style: ${getToneInstructions(tone)}

STRICT RULES:
- Translate ONLY from ${fromLang} to ${toLang}
- Never provide explanations or extra text
- Output ONLY the translated text
`;
}

// SSE helpers and metric calculation are provided by utils/stream

export async function HEAD() {
	return new Response(null, {
		status: 200,
		headers: {
			"Content-Type": "text/event-stream",
			"Cache-Control": "no-cache",
		},
	});
}

export async function POST(req: NextRequest) {
	try {
		const raw = await req.json();
		// Narrow unknown shape into a typed object without `as`.
		const text = typeof raw?.text === "string" ? raw.text : "";
		const fromLang = isLanguageShort(raw?.fromLang)
			? raw.fromLang
			: undefined;
		const toLang = isLanguageShort(raw?.toLang) ? raw.toLang : undefined;
		const tone: Tone = isTone(raw?.tone) ? raw.tone : "natural";

		if (!text.trim()) {
			return new Response(JSON.stringify({ error: "Text is required" }), {
				status: 400,
				headers: { "Content-Type": "application/json" },
			});
		}
		if (!fromLang || !toLang) {
			return new Response(
				JSON.stringify({ error: "Languages are required" }),
				{
					status: 400,
					headers: { "Content-Type": "application/json" },
				}
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

		const instructions = buildInstructions(fromLang, toLang, tone);

		const abortController = new AbortController();
		req.signal?.addEventListener("abort", () => abortController.abort());

		const stream = new ReadableStream<Uint8Array>({
			start: async (controller) => {
				try {
					const source = translateEventsStream({
						model: MODEL,
						instructions,
						input: text,
						signal: abortController.signal,
						temperature: 0,
						topP: 1,
						maxOutputTokens: 1000,
					});

					await runStreamingOrchestrator(source, {
						signal: abortController.signal,
						metricsHooks: {
							onFirstToken: ({ ttft }) => {
								controller.enqueue(sse({ metrics: { ttft } }));
							},
						},
						onDelta: (chunk) => {
							controller.enqueue(sse({ d: chunk }));
						},
						onError: (message) => {
							controller.enqueue(sse({ error: message }));
						},
						onCompleted: (metrics) => {
							controller.enqueue(
								sse({ completed: true, metrics })
							);
						},
					});
				} catch (error) {
					const isAbort =
						abortController.signal.aborted ||
						(error instanceof Error && error.name === "AbortError");
					if (!isAbort) {
						const message =
							error instanceof Error
								? error.message
								: "Unknown error";
						controller.enqueue(sse({ error: message }));
					}
				} finally {
					try {
						controller.close();
					} catch {}
				}
			},
		});

		return new Response(stream, {
			headers: {
				"Content-Type": "text/event-stream",
				"Cache-Control": "no-cache, no-transform",
				Connection: "keep-alive",
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Headers": "Cache-Control",
				"X-Accel-Buffering": "no",
			},
		});
	} catch (error) {
		return new Response(
			JSON.stringify({
				error:
					error instanceof Error
						? error.message
						: "Request processing failed",
			}),
			{ status: 400, headers: { "Content-Type": "application/json" } }
		);
	}
}
