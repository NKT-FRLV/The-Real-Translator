// Re-export types for presentation layer compatibility
export type { LanguageShort, Tone } from "../config/translation";

// API Response types
export interface TranslationLikeResponse {
  translation: {
    id: string;
    sourceText: string;
    resultText: string;
    sourceLang: string;
    targetLang: string;
    tone: string;
    isLiked: boolean;
    isPinned: boolean;
    createdAt: string;
  };
}

export interface ApiErrorResponse {
  error: string;
}

export interface LikeRequestData {
  liked: boolean;
}