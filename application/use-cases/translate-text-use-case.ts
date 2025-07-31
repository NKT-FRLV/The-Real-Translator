import { Translation } from '@/domain/entities/translation';
import { LanguageFactory } from '@/domain/value-objects/language';
import { ToneFactory } from '@/domain/value-objects/tone';
import { TranslationDomainService } from '@/domain/services/translation-service';
import { ITranslationPort, ITranslationCachePort } from '../ports/translation-port';
import { TranslateTextRequest, TranslateTextResponse } from '../dto/translation-dto';

// Application Use Case - сценарий перевода текста
export class TranslateTextUseCase {
  constructor(
    private readonly translationPort: ITranslationPort,
    private readonly translationService: TranslationDomainService,
    private readonly cachePort?: ITranslationCachePort
  ) {}

  async execute(request: TranslateTextRequest): Promise<TranslateTextResponse> {
    // 1. Валидация входных данных
    const sourceLanguage = LanguageFactory.create(request.fromLang);
    const targetLanguage = LanguageFactory.create(request.toLang);
    const tone = ToneFactory.create(request.tone);

    // 2. Проверка бизнес-правил
    this.translationService.validateTranslationRequest(
      request.text,
      sourceLanguage,
      targetLanguage,
      tone
    );

    // 3. Проверка кэша (если доступен)
    if (this.cachePort) {
      const cacheKey = this.cachePort.generateKey(
        request.text,
        request.fromLang,
        request.toLang,
        request.tone
      );
      const cachedTranslation = await this.cachePort.get(cacheKey);
      if (cachedTranslation) {
        return this.mapToResponse(cachedTranslation);
      }
    }

    // 4. Выполнение перевода через порт
    const translation = await this.translationPort.translateText(
      request.text,
      sourceLanguage,
      targetLanguage,
      tone
    );

    // 5. Сохранение в кэш (если доступен)
    if (this.cachePort) {
      const cacheKey = this.cachePort.generateKey(
        request.text,
        request.fromLang,
        request.toLang,
        request.tone
      );
      await this.cachePort.set(cacheKey, translation);
    }

    // 6. Возврат результата
    return this.mapToResponse(translation);
  }

  private mapToResponse(translation: Translation): TranslateTextResponse {
    return {
      id: translation.id,
      originalText: translation.originalText,
      translatedText: translation.translatedText,
      sourceLanguage: translation.sourceLanguage,
      targetLanguage: translation.targetLanguage,
      tone: translation.tone,
      createdAt: translation.createdAt.toISOString(),
      metadata: translation.metadata
    };
  }
}