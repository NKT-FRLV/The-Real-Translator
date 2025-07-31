import { LanguageFactory } from '@/domain/value-objects/language';
import { ToneFactory, ToneType } from '@/domain/value-objects/tone';
import { TranslationDomainService } from '@/domain/services/translation-service';
import { ITranslationPort } from '../ports/translation-port';
import { StreamTranslationRequest, StreamTranslationChunk } from '../dto/translation-dto';

// Application Use Case - сценарий стримингового перевода
export class StreamTranslationUseCase {
  constructor(
    private readonly translationPort: ITranslationPort,
    private readonly translationService: TranslationDomainService
  ) {}

  async* execute(request: StreamTranslationRequest): AsyncIterable<StreamTranslationChunk> {
    try {
      // 1. Проверка отмены
      if (request.abortSignal?.aborted) {
        return; // Запрос уже отменен
      }

      // 2. Валидация входных данных
      const sourceLanguage = LanguageFactory.create(request.fromLang);
      const targetLanguage = LanguageFactory.create(request.toLang);
      const tone = ToneFactory.create(request.tone as ToneType);

      // 3. Проверка бизнес-правил
      this.translationService.validateTranslationRequest(
        request.text,
        sourceLanguage,
        targetLanguage,
        tone
      );

      // 4. Запуск стримингового перевода через порт с AbortSignal
      const translationStream = this.translationPort.translateTextStream(
        request.text,
        sourceLanguage,
        targetLanguage,
        tone,
        request.abortSignal
      );

      // 5. Передача результатов по мере поступления
      for await (const chunk of translationStream) {
        // ✅ Проверяем отмену перед каждым chunk
        if (request.abortSignal?.aborted) {
          break; // Выходим из цикла при отмене
        }
        yield chunk;
      }

    } catch (error) {
      // 6. Не обрабатываем отмену как ошибку
      if (request.abortSignal?.aborted || 
          (error instanceof Error && error.name === 'AbortError')) {
        return; // Graceful exit on cancellation
      }

      // 7. Обработка реальных ошибок
      yield {
        type: 'error',
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
}