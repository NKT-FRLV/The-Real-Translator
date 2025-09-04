import { LanguageShort, Tone } from "../config/translation";

export interface UserTranslationSettings {
	defaultSourceLang: LanguageShort;
	defaultTargetLang: LanguageShort;
	translationStyle: Tone;
	uiLanguage?: string;
	preferredLLM?: string;
	reviewDailyTarget?: number;
	notificationsEnabled?: boolean;
	timezone?: string;
  }