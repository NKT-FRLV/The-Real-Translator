import { NextRequest } from 'next/server';
import { StreamTranslationUseCase } from '@/application/use-cases/stream-translation-use-case';
import { StreamTranslationChunk } from '@/application/dto/translation-dto';
import { container } from '@/infrastructure/di/container';

// Interface Adapter - контроллер для обработки HTTP запросов
export class TranslationController {
  private streamUseCase: StreamTranslationUseCase;

  constructor() {
    // ✅ Используем DI контейнер для управления зависимостями
    this.streamUseCase = container.streamTranslationUseCase;
  }

  async handleStreamTranslation(req: NextRequest): Promise<Response> {
    try {
      const { text, fromLang, toLang, tone = "natural" } = await req.json();

      // ✅ Получаем AbortSignal из Request
      const abortController = new AbortController();
      
      // Отменяем когда клиент закрывает соединение
      req.signal?.addEventListener('abort', () => {
        console.log('🔌 Client disconnected - aborting translation request');
        abortController.abort();
      });

      console.log('🎯 Starting translation request:', { text: text.substring(0, 50) + '...', fromLang, toLang, tone });

      const stream = new ReadableStream({
        start: async (controller) => {
          try {
            const translationStream = this.streamUseCase.execute({
              text,
              fromLang,
              toLang,
              tone,
              abortSignal: abortController.signal // ✅ Передаем signal
            });

            for await (const chunk of translationStream) {
              // ✅ Проверяем отмену перед записью
              if (abortController.signal.aborted) {
                console.log('🛑 Controller: Breaking stream due to abort signal');
                break;
              }

              try {
                const data = this.formatSSEData(chunk);
                controller.enqueue(new TextEncoder().encode(data));
                
                // Логируем только важные chunks (не каждый delta)
                if (chunk.type !== 'delta') {
                  console.log('📤 Controller: Sent SSE chunk:', chunk.type);
                }
              } catch (error: unknown) {
                console.log('⚠️ Controller: Error sending chunk:', error);
                
                // ✅ Graceful обработка ECONNRESET
                const isConnectionError = error && typeof error === 'object' && 'code' in error && error.code === 'ECONNRESET';
                const isAbortError = error instanceof Error && error.name === 'AbortError';
                
                if (isConnectionError || isAbortError) {
                  console.log('✅ Controller: Connection error is normal (client disconnected)');
                  break; // Клиент отключился - это нормально
                }
                throw error; // Другие ошибки пробрасываем
              }
            }
            
            console.log('🏁 Controller: Translation stream completed');
          } catch (error) {
            // ✅ Не логируем отмену как ошибку
            if (!abortController.signal.aborted) {
              const errorData = this.formatSSEData({
                type: 'error',
                error: error instanceof Error ? error.message : 'Unknown error'
              });
              try {
                controller.enqueue(new TextEncoder().encode(errorData));
              } catch {
                // Ignore ECONNRESET on error reporting
              }
            }
          } finally {
            try {
              controller.close();
            } catch {
              // Ignore close errors if connection already closed
            }
          }
        }
      });

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache, no-transform',
          'Connection': 'keep-alive',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Cache-Control',
          'X-Accel-Buffering': 'no'
        }
      });
    } catch (error) {
      return new Response(
        JSON.stringify({
          error: error instanceof Error ? error.message : 'Request processing failed'
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  }

  async handleWarmup(): Promise<Response> {
    return new Response(null, {
      status: 200,
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache'
      }
    });
  }

  private formatSSEData(chunk: StreamTranslationChunk): string {
    // Преобразование в SSE формат
    const sseData = JSON.stringify({
      ...(chunk.type === 'delta' && { d: chunk.content }),
      ...(chunk.type === 'metrics' && { metrics: chunk.metrics }),
      ...(chunk.type === 'completed' && { 
        completed: true, 
        metrics: chunk.metrics 
      }),
      ...(chunk.type === 'error' && { error: chunk.error })
    });

    return `data: ${sseData}\n\n`;
  }
}