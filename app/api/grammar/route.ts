import { NextRequest } from "next/server";
import { generateObject } from "ai";
import { openrouter } from "@/app/services/openRouter";
import { EditingStyle } from "@/app/(Pages-Routes)/grammar-check/_components/StyleSelector";
import { GrammarCheckResponseSchema, RequestGrammarCheckSchema } from "@/app/(Pages-Routes)/grammar-check/_components/grammar-schema";


export const runtime = "edge";
const envModel = process.env.GRAMMAR_MODEL || "openai/gpt-4o-mini";

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
// POST — грамматическая проверка с ИИ
// ───────────────────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
	try {
		// Проверим сигнал аборта в самом начале
		if (req.signal?.aborted) {
			return new Response(null, { status: 204 });
		}

		const raw = await req.json();
		// const text = raw?.text || "";
		// const style: EditingStyle = raw?.style || "neutral";

		
		const parsed = RequestGrammarCheckSchema.safeParse(raw);
		const { data, success } = parsed;

		if (!success) {
			console.error("Schema error:", parsed.error);
			return new Response(
				JSON.stringify({ error: parsed.error.message }),
				{ status: 400, headers: { "Content-Type": "application/json" } }
			);
		}
		// console.log('--------------------------------');
		// console.log(data.style);
		// console.log(data.text);
		// console.log(data.retry);
		// console.log('--------------------------------');

		// Проверим сигнал аборта перед тяжелыми операциями
		if (req.signal?.aborted) {
			return new Response(null, { status: 204 });
		}

		const system = buildGrammarSystem(data.style, data.retry);


		// Грамматическая проверка через OpenRouter с валидацией
		const result = await generateObject({
			model: openrouter.chat(envModel),
			system,
			// messages: [{ role: "user", content: data.text }],
			prompt: data.text,
			schema: GrammarCheckResponseSchema,
			temperature: 0.3,
			topP: 0.9,
			maxOutputTokens: 2000,
			abortSignal: req.signal,
		});

		// Логируем результат для отладки
		console.log(
			"Grammar check result:",
			JSON.stringify(result.object, null, 2)
		);

		// Возвращаем валидированный JSON ответ
		return new Response(JSON.stringify(result.object), {
			headers: {
				"Content-Type": "application/json",
				"Cache-Control": "no-cache",
			},
		});
	} catch (error: unknown) {
		// abort — нормальный сценарий
		if (
			req.signal?.aborted ||
			(error instanceof Error && error.name === "AbortError")
		) {
			return new Response(null, { status: 204 });
		}

		// Логируем ошибку для отладки
		console.error("Grammar check API error:", error);
		console.error("Error details:", {
			name: error instanceof Error ? error.name : "Unknown",
			message: error instanceof Error ? error.message : "Unknown error",
			stack: error instanceof Error ? error.stack : undefined,
		});

		return new Response(
			JSON.stringify({
				error:
					error instanceof Error
						? error.message
						: "Grammar check failed",
			}),
			{ status: 500, headers: { "Content-Type": "application/json" } }
		);
	}
}

// ───────────────────────────────────────────────────────────────────────────────
// Система промптов для грамматической проверки
// ───────────────────────────────────────────────────────────────────────────────
const getStyleInstructions = (style: EditingStyle): string => {
	const map: Record<EditingStyle, string> = {
		neutral: `Provide balanced, professional grammar corrections with clear explanations. Focus on clarity and correctness without being overly formal or casual, (Could contain simple spelling mistakes, or local idioms or slang).`,

		formal: `Use sophisticated, academic language in your corrections. Provide detailed explanations with formal terminology. Focus on precision and scholarly tone.`,

		informal: `Use casual, conversational language in your corrections. Keep explanations simple and friendly. Focus on natural, everyday language patterns, (Could contain simple spelling mistakes, and more local idioms and slang).`,

		influencer: `Use trendy, engaging language in your corrections. Include modern expressions and social media-friendly explanations. Make it sound current and relatable.`,

		pirate: `Use pirate-themed language in your corrections. Include phrases like "Arrr, matey!" and nautical terms. Make explanations fun and adventurous.`,

		elf: `Use elegant, mystical language in your corrections. Include poetic expressions and magical terminology. Make explanations sound wise and enchanting.`,

		academic: `Use scholarly, precise language in your corrections. Provide detailed explanations with academic terminology. Focus on research-quality writing.`,

		casual: `Use relaxed, friendly language in your corrections. Keep explanations simple and approachable. Focus on natural, everyday communication. (Could contain a bit of local idioms or slang).`,

		professional: `Use business-appropriate language in your corrections. Provide clear, concise explanations suitable for workplace communication.`,
	};
	return map[style] ?? map.neutral;
};

const buildGrammarSystem = (style: EditingStyle, retry: boolean): string => {
	return `You are an expert grammar checker. Fix the text and show changes with markers.
	You are an expert in All language phrasing assistant. When given a user sentence, detect any non-idiomatic or literal wording and replace it with a natural idiom or common phrasing that preserves the original meaning and tone. Return only the corrected sentence. If the input is already natural, return it unchanged.
	First you recognize the language of the text, then you correct the text in the same language.
STYLE: ${style}
${getStyleInstructions(style)}

REQUIRED OUTPUT FORMAT:
1. correctedText: The final corrected text
2. correctedWithDiffText: Show changes with markers:
   - Use <del>text</del> for deleted text
   - Use <ins>text</ins> for added text
   - Keep unchanged text normal
 NOTE: Place deletions (<del>deleted</del>) at the original text position. Place insertions (<ins>added</ins>) at the position where the new text should appear in the final correctedText (insertions may be positioned earlier or later than the original deleted fragments if the correction requires reordering). Keep unchanged text normal.

EXAMPLES:
[
  {
    "userInput": "Helo, im from Amaraka",
    "correctedText": "Hello, I'm from America",
    "correctedWithDiffText": "<del>Helo</del><ins>Hello</ins>, i<ins>'</ins>m from <del>Amaraka</del><ins>America</ins>"
  },
  {
    "userInput": "Dont you dare spleak in this fay with my MOM!!!",
    "correctedText": "Don't you dare speak to my mom that way!",
    "correctedWithDiffText": "<del>Dont</del><ins>Don't</ins> you dare <del>spleak</del><ins>speak</ins> in this <del>fay</del> with my <del>MOM</del><ins>mom</ins> <ins>that way</ins>!!!"
  },
  {
    "userInput": "We can start the meeting after you arrive tomorrow.",
    "correctedText": "After you arrive tomorrow, we can start the meeting.",
    "correctedWithDiffText": "<ins>After you arrive tomorrow,</ins> we can start the meeting <del>after you arrive tomorrow</del>."
  }
]
NOTE: The examples are in English, but it can be in any language.
NOTE: If you not include part of users input text to the "correctedText", you should wrap it in <del>text</del> in "correctedWithDiffText" result.
NOTE: Remove nonsense parts of text , Wrap it in <del>text</del> in "correctedWithDiffText" result.
NOTE: If you add or replace or change part of users input text to the "correctedText" and "correctedWithDiffText", you should wrap it in <ins>text</ins> in "correctedWithDiffText" result.
NOTE: Untouched text should be normal without any markers.
IMPORTANT: Each opening markers should(<del> or <ins>) have a closing markers (</del> or </ins>).



Be aggressive with corrections. Clean up messy text completely.

Style: ${style}
${getStyleInstructions(style)}

${retry ? 'You made a mistake with enhancing text, please check the text more acuracy, take atantion to users language' : ''}`;
};
