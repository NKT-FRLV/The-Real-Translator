// Application Layer DTOs - объекты передачи данных между слоями

import { LanguageShort, Tone } from "@/shared/types/types";

export interface TranslateTextRequest {
  text: string;
  fromLang: LanguageShort;
  toLang: LanguageShort;
  tone: Tone;
}

export interface TranslateTextResponse {
  id: string;
  originalText: string;
  translatedText: string;
  sourceLanguage: LanguageShort;
  targetLanguage: LanguageShort;
  tone: Tone;
  createdAt: string;
  metadata?: TranslationMetadataDto;
}

export interface TranslationMetadataDto {
  ttft?: number;
  totalTime?: number;
  tokensPerSecond?: number;
  tokenCount?: number;
}

export interface StreamTranslationRequest {
  text: string;
  fromLang: LanguageShort;
  toLang: LanguageShort;
  tone: Tone;
  abortSignal?: AbortSignal;
}

export interface StreamTranslationChunk {
  type: 'delta' | 'metrics' | 'completed' | 'error';
  content?: string;
  metrics?: TranslationMetadataDto;
  error?: string;
  result?: TranslateTextResponse;
}