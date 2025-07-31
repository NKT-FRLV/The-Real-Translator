import { Translation } from '@/domain/entities/translation';
import { Language } from '@/domain/value-objects/language';
import { Tone } from '@/domain/value-objects/tone';
import { StreamTranslationChunk } from '../dto/translation-dto';

// Application Ports - интерфейсы для внешних зависимостей

// Порт для работы с репозиторием переводов (исходящий порт)
export interface ITranslationPort {
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
  ): AsyncIterable<StreamTranslationChunk>;
}

// Порт для уведомлений о событиях (исходящий порт)
export interface ITranslationEventPort {
  onTranslationStarted(text: string, targetLanguage: string): Promise<void>;
  onTranslationCompleted(translation: Translation): Promise<void>;
  onTranslationFailed(error: string): Promise<void>;
}

// Порт для кэширования (исходящий порт)
export interface ITranslationCachePort {
  get(key: string): Promise<Translation | null>;
  set(key: string, translation: Translation, ttl?: number): Promise<void>;
  generateKey(text: string, sourceLanguage: string, targetLanguage: string, tone: string): string;
}