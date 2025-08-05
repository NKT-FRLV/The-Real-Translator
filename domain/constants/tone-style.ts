// Domain Constants - константы тонов
export const toneStyle = {
	natural: "natural",
	intellectual: "intellectual", 
	street: "street",
} as const;

export type Tone = (typeof toneStyle)[keyof typeof toneStyle]; 