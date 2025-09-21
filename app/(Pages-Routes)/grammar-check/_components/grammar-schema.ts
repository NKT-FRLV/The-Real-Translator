import { z } from "zod";

// Схема для одного изменения в тексте (legacy, для обратной совместимости)
// export const TextChangeSchema = z.object({
//   type: z.enum(["insertion", "deletion", "replacement"]).describe("Type of text change: insertion (text added), deletion (text removed), replacement (text replaced for enhanced one)"),
//   original: z.string().describe("The original part of text that needs to be changed"),
//   corrected: z.string().describe("The corrected part of text that should replace the original, or added text, or nothing if you just deleted it"),
// //   start: z.number().min(0).describe("Exact character position where the change starts in the original text (0-based index)"),
// //   end: z.number().min(0).describe("Exact character position where the change ends in the original text (0-based index)"),
// });

export const RequestGrammarCheckSchema = z.object({
	text: z.string().min(1).describe("The text to check that probably has errors or nonsense parts"),
	style: z.enum([
		"neutral",
		"formal",
		"informal",
		"influencer",
		"pirate",
		"elf",
		"academic",
		"casual",
		"professional",
	]).default("neutral"),
	retry: z.boolean().optional().default(false).describe("If true, check text more acuracy probably you made a mistake with enhancing text"),
});

export const RequestExplinationsSchema = RequestGrammarCheckSchema.extend({
	enhancedText: z.string().min(1).describe("AI Generated enhanced text that reflect the original text with all improvements applied"),
});


// Схема для одной ошибки
export const GrammarErrorSchema = z.object({
  id: z.number().describe("Unique identifier for this error"),
  type: z.enum(["grammar", "spelling", "punctuation", "style", "clarity"]).describe("Type of error: grammar (grammatical mistakes), spelling (misspelled words), punctuation (punctuation issues), style (writing style problems), clarity (unclear or confusing text)"),
  original: z.string().describe("The incorrect text part that was found"),
  corrected: z.string().describe("The corrected version of the text part, or added text, or nothing if you just deleted it"),
  explanation: z.string().describe("Detailed explanation of what was wrong and why it's incorrect"),
  suggestion: z.string().describe("Helpful suggestion on how to avoid this mistake in the future"),
  severity: z.enum(["low", "medium", "high"]).describe("Severity level: low (minor issues), medium (moderate problems), high (important errors that significantly impact readability)"),
//   position: z.object({
//     start: z.number().min(0).describe("Character position where the error starts in the original text"),
//     end: z.number().min(0).describe("Character position where the error ends in the original text"),
//   }).describe("Exact position of the error in the original text"),
});

// Основная схема ответа ИИ
export const GrammarCheckResponseSchema = z.object({
  correctedText: z.string().describe("The complete corrected version of the text with all improvements applied"),
  correctedWithDiffText: z.string().describe("The original text with diff markers showing changes: <del>deleted</del> for removed text, <ins>added</ins> for new text, unchanged text remains normal"),
});

export const ErrorsExplanationsResponseSchema = z.object({
	// changes: z.array(TextChangeSchema).describe("Array of all text changes made, with exact positions in the original text (legacy format)"),
	errors: z.array(GrammarErrorSchema).describe("Array of all errors found with detailed explanations and suggestions"),
});

// Типы для TypeScript
export type GrammarError = z.infer<typeof GrammarErrorSchema>;


export type GrammarCheckResponse = z.infer<typeof GrammarCheckResponseSchema>;
export type ErrorsExplanationsResponse = z.infer<typeof ErrorsExplanationsResponseSchema>;
