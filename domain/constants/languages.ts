// Domain Constants - константы языков
export const languages = {
	en: {
		label: "English",
		code: "en",
	},
	ru: {
		label: "Russian", 
		code: "ru",
	},
	es: {
		label: "Spanish",
		code: "es",
	},
	fr: {
		label: "French",
		code: "fr",
	},
	de: {
		label: "German",
		code: "de",
	}
} as const;

export type LanguageShort = keyof typeof languages; 
export type LanguageLabels = (typeof languages)[keyof typeof languages]["label"];

