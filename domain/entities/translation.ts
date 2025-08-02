// Domain Entity - основная бизнес-сущность перевода
import { LanguageShort, Tone } from "@/shared/types/types";

export class Translation {
  constructor(
    public readonly id: string,
    public readonly originalText: string,
    public readonly translatedText: string,
    public readonly sourceLanguage: LanguageShort,
    public readonly targetLanguage: LanguageShort,
    public readonly tone: Tone,
    public readonly createdAt: Date,
    public readonly metadata?: TranslationMetadata
  ) {}

  static create(
    originalText: string,
    translatedText: string,
    sourceLanguage: LanguageShort,
    targetLanguage: LanguageShort,
    tone: Tone,
    metadata?: TranslationMetadata
  ): Translation {

	console.log(originalText)
	console.log(translatedText)
	
    return new Translation(
      crypto.randomUUID(),
      originalText,
      translatedText,
      sourceLanguage,
      targetLanguage,
      tone,
      new Date(),
      metadata
    );
  }
}

export interface TranslationMetadata {
  ttft?: number;
  totalTime?: number;
  tokensPerSecond?: number;
  tokenCount?: number;
}