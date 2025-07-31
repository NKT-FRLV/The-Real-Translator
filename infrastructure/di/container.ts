// Infrastructure DI Container - управление зависимостями
import { TranslationDomainService } from '@/domain/services/translation-service';
import { OpenAIClient } from '../http/openai-client';
import { OpenAITranslationRepository } from '../ai/openai-translation-repository';
import { TranslationAdapter } from '../adapters/translation-adapter';
import { StreamTranslationUseCase } from '@/application/use-cases/stream-translation-use-case';
import { TranslateTextUseCase } from '@/application/use-cases/translate-text-use-case';

// Простой DI контейнер для управления зависимостями
class DIContainer {
  private instances = new Map<string, TranslationDomainService | OpenAIClient | OpenAITranslationRepository | TranslationAdapter | StreamTranslationUseCase | TranslateTextUseCase>();

  // Singleton getters для основных сервисов
  get domainService(): TranslationDomainService {
    if (!this.instances.has('domainService')) {
      this.instances.set('domainService', new TranslationDomainService());
    }
    return this.instances.get('domainService') as TranslationDomainService;
  }

  get openaiClient(): OpenAIClient {
    if (!this.instances.has('openaiClient')) {
      this.instances.set('openaiClient', new OpenAIClient());
    }
    return this.instances.get('openaiClient') as OpenAIClient;
  }

  get translationRepository(): OpenAITranslationRepository {
    if (!this.instances.has('translationRepository')) {
      this.instances.set(
        'translationRepository', 
        new OpenAITranslationRepository(this.openaiClient, this.domainService)
      );
    }
    return this.instances.get('translationRepository') as OpenAITranslationRepository;
  }

  get translationAdapter(): TranslationAdapter {
    if (!this.instances.has('translationAdapter')) {
      this.instances.set(
        'translationAdapter',
        new TranslationAdapter(this.translationRepository)
      );
    }
    return this.instances.get('translationAdapter') as TranslationAdapter;
  }

  get streamTranslationUseCase(): StreamTranslationUseCase {
    if (!this.instances.has('streamTranslationUseCase')) {
      this.instances.set(
        'streamTranslationUseCase',
        new StreamTranslationUseCase(this.translationAdapter, this.domainService)
      );
    }
    return this.instances.get('streamTranslationUseCase') as StreamTranslationUseCase;
  }

  get translateTextUseCase(): TranslateTextUseCase {
    if (!this.instances.has('translateTextUseCase')) {
      this.instances.set(
        'translateTextUseCase',
        new TranslateTextUseCase(this.translationAdapter, this.domainService)
      );
    }
    return this.instances.get('translateTextUseCase') as TranslateTextUseCase;
  }

  // Метод для очистки (полезно для тестов)
  clear(): void {
    this.instances.clear();
  }
}

// Экспорт синглтона контейнера
export const container = new DIContainer();