// Re-export for presentation layer compatibility
export { toneStyle } from "../config/translation";
import { Tone } from "../types/types";

// Детальные описания стилей для ИИ
// export const toneDescriptions = {
// 	natural: 'normal style, neutral and understandable',
// 	intellectual: 'intellectual style with more complex vocabulary, formal constructions and academic approach',
// 	street: 'street slang, slang, conversational expressions, youth language, informal abbreviations'
// } as const;

export type ToneDescriptionList<T> = {
	name: string;
	tone: T;
	new: boolean;
	description: string;
	warning?: string;
	detailedDescription: string;
	image?: string;
};

export type ToneDescription = ToneDescriptionList<Tone>;

// Enforce full coverage of all Tone variants via mapped type
export type ToneDescriptionMap = { [K in Tone]: ToneDescriptionList<K> };

export const toneDescriptionsMap = {
    neutral: {
        name: "Neutral",
        tone: "neutral",
        new: false,
        description: "Standard, professional translation",
        detailedDescription: "This style provides clean, neutral translations that feel native to the target language. Perfect for business communications, professional documents, and everyday conversations. The AI maintains clarity while preserving the original meaning without unnecessary complexity.",
    },
    formal: {
        name: "Formal",
        tone: "formal",
        new: false,
        description: "Academic or formal talk tone",
        detailedDescription: "Elevates your text with sophisticated vocabulary and formal constructions. Ideal for academic papers, research documents, and professional presentations. This style employs complex sentence structures and precise terminology to create an authoritative, scholarly tone.",
    },
    poetic: {
        name: "Poetic",
        tone: "poetic",
        new: true,
        description: "Recognizable style of Russian poet Alexander Pushkin",
		warning: "This style already works, but it’s pretty hit-or-miss with current AI model, because i still use a free model 'Moonshot - kimi/k2'. Later on, when I add a paid subscription, the beefier AI models will be able to turn any text into real, living poetry.",
        detailedDescription: "Transform your text into beautiful, rhythmic prose reminiscent of classical Russian poetry. This unique style captures the elegance and emotional depth of Pushkin's literary mastery, adding artistic flair and cultural richness to your translations.",
        image: "pushkin.png",
    },
    informal: {
        name: "Informal",
        tone: "informal",
        new: false,
        description: "Casual expressions and local slang, informal talk tone",
        detailedDescription: "Brings your text to life with authentic informal language and colloquialisms. Perfect for social media, casual conversations, and creative content. This style uses contemporary slang, informal abbreviations, and conversational expressions that resonate with younger audiences.",
        image: "bidlo.png",
    },
} as const satisfies ToneDescriptionMap;

export const toneDescriptions: ToneDescription[] = Object.values(
    toneDescriptionsMap
);
