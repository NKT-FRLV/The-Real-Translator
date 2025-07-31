// Domain Entity - основная бизнес-сущность перевода
export class Translation {
  constructor(
    public readonly id: string,
    public readonly originalText: string,
    public readonly translatedText: string,
    public readonly sourceLanguage: string,
    public readonly targetLanguage: string,
    public readonly tone: string,
    public readonly createdAt: Date,
    public readonly metadata?: TranslationMetadata
  ) {}

  static create(
    originalText: string,
    translatedText: string,
    sourceLanguage: string,
    targetLanguage: string,
    tone: string,
    metadata?: TranslationMetadata
  ): Translation {
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