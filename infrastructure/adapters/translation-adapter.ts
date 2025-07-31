import { Translation } from '@/domain/entities/translation';
import { Language } from '@/domain/value-objects/language';
import { Tone } from '@/domain/value-objects/tone';
import { ITranslationPort } from '@/application/ports/translation-port';
import { StreamTranslationChunk } from '@/application/dto/translation-dto';
import { OpenAITranslationRepository } from '../ai/openai-translation-repository';

// Infrastructure Adapter - адаптер между application и infrastructure слоями
export class TranslationAdapter implements ITranslationPort {
  constructor(
    private readonly repository: OpenAITranslationRepository
  ) {}

  async translateText(
    text: string,
    sourceLanguage: Language,
    targetLanguage: Language,
    tone: Tone
  ): Promise<Translation> {
    return await this.repository.translateText(
      text,
      sourceLanguage,
      targetLanguage,
      tone
    );
  }

  async* translateTextStream(
    text: string,
    sourceLanguage: Language,
    targetLanguage: Language,
    tone: Tone,
    abortSignal?: AbortSignal
  ): AsyncIterable<StreamTranslationChunk> {
    const stream = this.repository.translateTextStream(
      text,
      sourceLanguage,
      targetLanguage,
      tone,
      abortSignal
    );

    for await (const result of stream) {
      switch (result.type) {
        case 'delta':
          yield {
            type: 'delta',
            content: result.content
          };
          break;

        case 'metrics':
          yield {
            type: 'metrics',
            metrics: result.metrics
          };
          break;

        case 'completed':
          yield {
            type: 'completed',
            result: result.translation ? {
              id: result.translation.id,
              originalText: result.translation.originalText,
              translatedText: result.translation.translatedText,
              sourceLanguage: result.translation.sourceLanguage,
              targetLanguage: result.translation.targetLanguage,
              tone: result.translation.tone,
              createdAt: result.translation.createdAt.toISOString(),
              metadata: result.translation.metadata
            } : undefined,
            metrics: result.metrics
          };
          break;

        case 'error':
          yield {
            type: 'error',
            error: result.error
          };
          break;
      }
    }
  }
}