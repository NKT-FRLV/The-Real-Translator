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
};

export type ToneDescription = ToneDescriptionList<Tone>;

// Enforce full coverage of all Tone variants via mapped type
export type ToneDescriptionMap = { [K in Tone]: ToneDescriptionList<K> };

const toneDescriptionsMap = {
    natural: {
        name: "Natural",
        tone: "natural",
        new: false,
        description: "Standard, professional translation",
    },
    intellectual: {
        name: "Intelligent",
        tone: "intellectual",
        new: false,
        description: "Academic or formal talk tone",
    },
    poetic: {
        name: "Poetic",
        tone: "poetic",
        new: true,
        description:
            "Poetic translation, written in the recognizable style of Russian poet Alexander Pushkin",
    },
    street: {
        name: "Street Slang",
        tone: "street",
        new: false,
        description: "Casual expressions and local slang, informal talk tone",
    },
} as const satisfies ToneDescriptionMap;

export const toneDescriptions: ToneDescription[] = Object.values(
    toneDescriptionsMap
);
