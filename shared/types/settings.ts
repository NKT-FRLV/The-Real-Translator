import { LanguageShort, Tone } from "../config/translation";

export type SpeechMode = "browser" | "whisper";

export interface UserTranslationSettings {
	defaultSourceLang: LanguageShort;
	defaultTargetLang: LanguageShort;
	translationStyle: Tone;
	speechRecognitionMode?: SpeechMode; // Optional for backward compatibility
	uiLanguage?: string;
	preferredLLM?: string;
	reviewDailyTarget?: number;
	notificationsEnabled?: boolean;
	timezone?: string;
  }