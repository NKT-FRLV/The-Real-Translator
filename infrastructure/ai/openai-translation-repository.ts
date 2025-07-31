import OpenAI from 'openai';
import { Translation } from '@/domain/entities/translation';
import { Language } from '@/domain/value-objects/language';
import { Tone } from '@/domain/value-objects/tone';
import { ITranslationRepository, StreamingTranslationResult } from '@/domain/repositories/translation-repository';
import { TranslationDomainService } from '@/domain/services/translation-service';
import { OpenAIClient } from '../http/openai-client';

// Infrastructure Repository - реализация репозитория через OpenAI
export class OpenAITranslationRepository implements ITranslationRepository {
  constructor(
    private readonly openaiClient: OpenAIClient,
    private readonly domainService: TranslationDomainService
  ) {}

  async translateText(
    text: string,
    sourceLanguage: Language,
    targetLanguage: Language,
    tone: Tone
  ): Promise<Translation> {
    const instructions = this.domainService.buildPromptInstructions(
      sourceLanguage,
      targetLanguage,
      tone
    );

    const response = await this.openaiClient.createChatCompletion([
      { role: 'system', content: instructions },
      { role: 'user', content: text }
    ]) as OpenAI.Chat.Completions.ChatCompletion;

    const translatedText = response.choices?.[0]?.message?.content || '';
    
    return Translation.create(
      text,
      translatedText,
      sourceLanguage.code,
      targetLanguage.code,
      tone.value
    );
  }

  async* translateTextStream(
    text: string,
    sourceLanguage: Language,
    targetLanguage: Language,
    tone: Tone,
    abortSignal?: AbortSignal
  ): AsyncIterable<StreamingTranslationResult> {
    const startTime = Date.now();
    let firstTokenTime: number | null = null;
    let tokenCount = 0;
    let translatedText = '';

    try {
      // ✅ Проверка отмены перед началом
      if (abortSignal?.aborted) {
        return;
      }

      const instructions = this.domainService.buildPromptInstructions(
        sourceLanguage,
        targetLanguage,
        tone
      );

      // ✅ Передаем AbortSignal в OpenAI для реальной отмены стрима!
      const stream = await this.openaiClient.createStreamingResponse(instructions, text, abortSignal);

      console.log('🚀 OpenAI stream started, abortSignal:', abortSignal?.aborted);

      for await (const event of stream) {
        // 📊 Логирование chunks для отладки
        console.log('📦 OpenAI chunk received:', {
          type: event.type,
          aborted: abortSignal?.aborted,
          content: event.type === "response.output_text.delta" ? event.delta : null
        });

        // ✅ Проверяем отмену перед каждым событием
        if (abortSignal?.aborted) {
          console.log('🛑 Breaking OpenAI stream due to abort signal');
          break; // Выходим из цикла при отмене
        }

        if (event.type === "response.output_text.delta") {
          // Track first token time
          if (!firstTokenTime) {
            firstTokenTime = Date.now();
            const metrics = this.domainService.calculatePerformanceMetrics(
              startTime,
              firstTokenTime,
              tokenCount
            );
            
            // ✅ Проверяем отмену перед yield
            if (abortSignal?.aborted) break;
            
            yield {
              type: 'metrics',
              metrics: {
                ttft: metrics.ttft ?? undefined
              }
            };
          }

          tokenCount++;
          translatedText += event.delta || '';

          // ✅ Проверяем отмену перед yield
          if (abortSignal?.aborted) break;

          yield {
            type: 'delta',
            content: event.delta || ''
          };

        } else if (event.type === "response.completed") {
          console.log('✅ OpenAI stream completed normally');
          
          // ✅ Проверяем отмену перед финальным yield
          if (abortSignal?.aborted) {
            console.log('🛑 Stream completed but request was aborted');
            break;
          }

          const metrics = this.domainService.calculatePerformanceMetrics(
            startTime,
            firstTokenTime,
            tokenCount
          );

          // Fix null to undefined for ttft
          const fixedMetrics = {
            ...metrics,
            ttft: metrics.ttft ?? undefined
          };

          const translation = Translation.create(
            text,
            translatedText,
            sourceLanguage.code,
            targetLanguage.code,
            tone.value,
            fixedMetrics
          );

          yield {
            type: 'completed',
            translation,
            metrics: fixedMetrics
          };

        } else if (event.type === "error") {
          console.log('❌ OpenAI stream error event');
          yield {
            type: 'error',
            error: 'Translation failed'
          };
        }
      }
      
      console.log('🏁 OpenAI stream loop ended');
      
    } catch (error) {
      console.log('🚨 OpenAI stream error caught:', {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : 'Unknown error',
        aborted: abortSignal?.aborted
      });

      // ✅ Не обрабатываем отмену как ошибку
      if (abortSignal?.aborted || 
          (error instanceof Error && error.name === 'AbortError')) {
        console.log('✅ Graceful exit: request was cancelled');
        return; // Graceful exit on cancellation
      }

      yield {
        type: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}