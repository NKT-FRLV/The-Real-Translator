import { NextRequest } from "next/server";
import { generateObject } from "ai";
import { openrouter } from "@/app/services/openRouter";
import { EditingStyle } from "@/app/(Pages-Routes)/grammar-check/_components/StyleSelector";
import {
	RequestExplinationsSchema,
	ErrorsExplanationsResponseSchema,
} from "@/app/(Pages-Routes)/grammar-check/_components/grammar-schema";

export const runtime = "edge";
const envModel = process.env.GRAMMAR_ERRORS_EXPLAIN_MODEL || "openai/gpt-4o-mini";

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

		const parsed = RequestExplinationsSchema.safeParse(raw);
		const { data, success } = parsed;

		if (!success) {
			console.error("Schema error:", parsed.error);
			return new Response(
				JSON.stringify({ error: parsed.error.message }),
				{ status: 400, headers: { "Content-Type": "application/json" } }
			);
		}
		// console.log("--------------------------------");
		// console.log(data.style);
		// console.log(data.text);
		// console.log(data.enhancedText);
		// console.log("--------------------------------");

		// Проверим сигнал аборта перед тяжелыми операциями
		if (req.signal?.aborted) {
			return new Response(null, { status: 204 });
		}

		const system = buildGrammarSystem(data.style);

		// Создаем user prompt с исходным и улучшенным текстом
		const userPrompt = `Please analyze the following text improvements and explain each error that was corrected:

ORIGINAL TEXT (with potential errors by user):
"${data.text}"

ENHANCED TEXT (corrected, perfect version by AI):
"${data.enhancedText}"

Analyze every change made between the original and enhanced text. For each improvement, provide a detailed explanation of what was wrong, why it needed correction, and how to avoid similar mistakes in the future, respond in the same language as the original text.`;

		// Грамматическая проверка через OpenRouter с валидацией
		const result = await generateObject({
			model: openrouter.chat(envModel),
			system,
			prompt: userPrompt,
			schema: ErrorsExplanationsResponseSchema,
			temperature: 0.3,
			topP: 0.9,
			maxOutputTokens: 2000,
			abortSignal: req.signal,
		});

		// Логируем результат для отладки
		// console.log(
		// 	"Grammar check result:",
		// 	JSON.stringify(result.object, null, 2)
		// );

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
		// console.error("Error details:", {
		// 	name: error instanceof Error ? error.name : "Unknown",
		// 	message: error instanceof Error ? error.message : "Unknown error",
		// 	stack: error instanceof Error ? error.stack : undefined,
		// });

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
		neutral: `The enhanced text represents balanced, professional communication. When explaining errors, focus on why the original text didn't achieve this clarity and correctness.`,

		formal: `The enhanced text uses sophisticated, academic language. When explaining errors, describe why the original text wasn't formal enough for scholarly communication and what formal elements were missing.`,

		informal: `The enhanced text uses casual, conversational language. When explaining errors, describe why the original text was too formal or stiff for casual communication and what informal elements were needed.`,

		influencer: `The enhanced text uses trendy, engaging language with modern expressions. When explaining errors, describe why the original text lacked current, relatable language and social media-friendly expressions.`,

		pirate: `The enhanced text uses pirate-themed language with nautical expressions and adventurous tone. When explaining errors, describe why the original text didn't match this maritime, adventurous style and what pirate elements were missing.`,

		elf: `The enhanced text uses elegant, mystical language with poetic expressions. When explaining errors, describe why the original text lacked this enchanting, refined quality and what mystical elements were needed.`,

		academic: `The enhanced text uses scholarly, precise language suitable for research. When explaining errors, describe why the original text wasn't academic enough and what scholarly elements were missing.`,

		casual: `The enhanced text uses relaxed, friendly language for everyday communication. When explaining errors, describe why the original text was too formal and what casual elements were needed.`,

		professional: `The enhanced text uses business-appropriate language suitable for workplace communication. When explaining errors, describe why the original text wasn't professional enough and what business elements were missing.`,
	};
	return map[style] ?? map.neutral;
};

const buildGrammarSystem = (style: EditingStyle): string => {
	return `You are an expert grammar and language analysis assistant. Your task is to analyze the differences between an original text (with errors) and an enhanced/corrected version, then provide detailed explanations for each improvement made.

STYLE: ${style}
${getStyleInstructions(style)}

YOUR TASK:
You will receive:
1. Original text (with potential errors)
2. Enhanced text (AI-corrected version)

You must analyze EVERY change made between the original and enhanced text, and provide detailed explanations for each improvement.

REQUIRED OUTPUT FORMAT:
Return an array of error objects, where each object contains:
- id: Unique number for each error
- type: Category of error (grammar, spelling, punctuation, style, clarity)
- original: The incorrect text that was found
- corrected: The corrected version (or empty string if just deleted)
- explanation: Detailed explanation of what was wrong and why
- suggestion: Helpful advice on how to avoid this mistake
- severity: How important this error is (low, medium, high)

ANALYSIS GUIDELINES:
1. Compare the original text with the enhanced text character by character
2. Identify every change, addition, deletion, or modification
3. For each change, determine:
   - What type of error it was
   - Why it needed correction
   - How the correction improves the text
   - What the user can learn from this

EXAMPLES OF ERROR TYPES:
- grammar: Subject-verb disagreement, wrong tense, incorrect word order
- spelling: Misspelled words, typos
- punctuation: Missing commas, wrong quotation marks, incorrect apostrophes
- style: Wordy phrases, passive voice, informal language in formal context
- clarity: Unclear sentences, ambiguous pronouns, confusing structure

STYLE CONSIDERATIONS:
The Enhanced Text represents the IDEAL version that should be achieved. When explaining errors, consider the style context but use clear, professional language in your explanations:

- ${
		style === "pirate"
			? "Understand that the enhanced text uses pirate-themed language and nautical expressions. Explain why the original text didn't match this adventurous, maritime style."
			: ""
	}
- ${
		style === "elf"
			? "Recognize that the enhanced text uses elegant, mystical language with poetic expressions. Explain why the original text lacked this enchanting, refined quality."
			: ""
	}
- ${
		style === "formal"
			? "Note that the enhanced text uses sophisticated, academic language. Explain why the original text wasn't formal enough for scholarly communication."
			: ""
	}
- ${
		style === "casual"
			? "Understand that the enhanced text uses relaxed, friendly language. Explain why the original text was too formal or stiff for casual communication."
			: ""
	}
- ${
		style === "neutral"
			? "The enhanced text represents balanced, professional communication. Explain why the original text didn't achieve this clarity and correctness."
			: ""
	}

Always explain errors in clear, educational language that helps the user understand what went wrong and how to improve his speech in this case.

Be thorough but concise. Help the user understand not just what was wrong, but why it was wrong and how to avoid similar mistakes in the future.`;
};
