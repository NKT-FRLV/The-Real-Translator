// Application Layer DTOs - объекты передачи данных между слоями

export interface TranslateTextRequest {
  text: string;
  fromLang: string;
  toLang: string;
  tone: string;
}

export interface TranslateTextResponse {
  id: string;
  originalText: string;
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  tone: string;
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
  fromLang: string;
  toLang: string;
  tone: string;
  abortSignal?: AbortSignal;
}

export interface StreamTranslationChunk {
  type: 'delta' | 'metrics' | 'completed' | 'error';
  content?: string;
  metrics?: TranslationMetadataDto;
  error?: string;
  result?: TranslateTextResponse;
}