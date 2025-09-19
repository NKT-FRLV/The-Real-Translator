import { z } from "zod";

// Схема для одного изменения в тексте (legacy, для обратной совместимости)
export const TextChangeSchema = z.object({
  type: z.enum(["insertion", "deletion", "replacement"]).describe("Type of text change: insertion (text added), deletion (text removed), replacement (text replaced)"),
  original: z.string().describe("The original text that needs to be changed"),
  corrected: z.string().describe("The corrected text that should replace the original"),
  start: z.number().min(0).describe("Exact character position where the change starts in the original text (0-based index)"),
  end: z.number().min(0).describe("Exact character position where the change ends in the original text (0-based index)"),
});


// Схема для одной ошибки
export const GrammarErrorSchema = z.object({
  id: z.string().describe("Unique identifier for this error"),
  type: z.enum(["grammar", "spelling", "punctuation", "style", "clarity"]).describe("Type of error: grammar (grammatical mistakes), spelling (misspelled words), punctuation (punctuation issues), style (writing style problems), clarity (unclear or confusing text)"),
  original: z.string().describe("The incorrect text that was found"),
  corrected: z.string().describe("The corrected version of the text"),
  explanation: z.string().describe("Detailed explanation of what was wrong and why it's incorrect"),
  suggestion: z.string().describe("Helpful suggestion on how to avoid this mistake in the future"),
  severity: z.enum(["low", "medium", "high"]).describe("Severity level: low (minor issues), medium (moderate problems), high (important errors that significantly impact readability)"),
  position: z.object({
    start: z.number().min(0).describe("Character position where the error starts in the original text"),
    end: z.number().min(0).describe("Character position where the error ends in the original text"),
  }).describe("Exact position of the error in the original text"),
});

// Основная схема ответа ИИ
export const GrammarCheckResponseSchema = z.object({
  correctedText: z.string().describe("The complete corrected version of the text with all improvements applied"),
  correctedWithDiffText: z.string().describe("The original text with diff markers showing changes: -deleted- for removed text, +added+ for new text, unchanged text remains normal"),
  changes: z.array(TextChangeSchema).describe("Array of all text changes made, with exact positions in the original text (legacy format)"),
  errors: z.array(GrammarErrorSchema).describe("Array of all errors found with detailed explanations and suggestions"),
});

// Типы для TypeScript
export type TextChange = z.infer<typeof TextChangeSchema>;
export type GrammarError = z.infer<typeof GrammarErrorSchema>;
export type GrammarCheckResponse = z.infer<typeof GrammarCheckResponseSchema>;
