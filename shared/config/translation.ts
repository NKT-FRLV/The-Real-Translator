// shared/config/translation.ts
// Single source of truth for translation-related constants, types, and guards

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
  },
} as const;

export type LanguageShort = keyof typeof languages;

export const toneStyle = {
  natural: "natural",
  intellectual: "intellectual",
  street: "street",
} as const;

export type Tone = (typeof toneStyle)[keyof typeof toneStyle];

export const LANGUAGE_CODES = Object.keys(languages) as LanguageShort[];
export const TONES = Object.keys(toneStyle) as Tone[];

export function isLanguageShort(value: unknown): value is LanguageShort {
  return typeof value === "string" && (value as string) in languages;
}

export function isTone(value: unknown): value is Tone {
  return typeof value === "string" && (value as string) in toneStyle;
}


