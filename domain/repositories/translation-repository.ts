import { Translation } from '../entities/translation';
import { Language } from '../value-objects/language';
import { Tone } from '../value-objects/tone';

// Domain Repository Interface - контракт для работы с переводами
export interface ITranslationRepository {
  translateText(
    text: string,
    sourceLanguage: Language,
    targetLanguage: Language,
    tone: Tone
  ): Promise<Translation>;

  translateTextStream(
    text: string,
    sourceLanguage: Language,
    targetLanguage: Language,
    tone: Tone,
    abortSignal?: AbortSignal
  ): AsyncIterable<StreamingTranslationResult>;
}

// Результат стримингового перевода
export interface StreamingTranslationResult {
  type: 'delta' | 'metrics' | 'completed' | 'error';
  content?: string;
  metrics?: {
    ttft?: number;
    totalTime?: number;
    tokensPerSecond?: number;
    tokenCount?: number;
  };
  error?: string;
  translation?: Translation;
}