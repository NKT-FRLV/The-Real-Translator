import { Tone } from "../types/types";

export const toneStyle = {
	natural: 'natural',
	intellectual: 'intellectual',
	street: 'street',
} as const satisfies Record<Tone, Tone>;

// Детальные описания стилей для ИИ
// export const toneDescriptions = {
// 	natural: 'normal style, neutral and understandable',
// 	intellectual: 'intellectual style with more complex vocabulary, formal constructions and academic approach',
// 	street: 'street slang, slang, conversational expressions, youth language, informal abbreviations'
// } as const;