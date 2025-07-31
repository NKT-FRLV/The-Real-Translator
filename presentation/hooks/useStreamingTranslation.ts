// presentation/hooks/useStreamingTranslation.ts - Clean UI Hook
import { useState, useCallback, useRef } from 'react';
import { LanguageShort, Tone } from '@/shared/types/types';
import { toneStyle } from '@/shared/constants/tone-style';

interface TranslationOptions {
  fromLang: LanguageShort;
  toLang: LanguageShort;
  tone?: Tone;
}

interface PerformanceMetrics {
  ttft?: number;
  totalTime?: number;
  tokensPerSecond?: number;
  tokenCount?: number;
}

interface TranslationState {
  isStreaming: boolean;
  result: string;
  error: string | null;
  metrics: PerformanceMetrics;
}

// ✅ Clean Presentation Hook - только UI логика
export const useStreamingTranslation = () => {
  const [state, setState] = useState<TranslationState>({
    isStreaming: false,
    result: '',
    error: null,
    metrics: {},
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const translate = useCallback(async (
    text: string, 
    options: TranslationOptions
  ) => {
    if (!text.trim()) return;
    
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    // Reset state
    setState(prev => ({
      ...prev,
      isStreaming: true,
      result: '',
      error: null,
      metrics: {},
    }));

    const localMetrics: PerformanceMetrics = {};
    let hasError = false;

    try {
      // ✅ Простой HTTP вызов - делегируем сложность контроллеру
      const response = await fetch('/api/translate-stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text, 
          fromLang: options.fromLang,
          toLang: options.toLang,
          tone: options.tone || toneStyle.natural
        }),
        signal: abortController.signal,
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // ✅ Простой SSE парсинг - только UI обновления
      await processStreamResponse(response, setState, localMetrics, abortController);
      
    } catch (err) {
      hasError = true;
      
      if (err instanceof Error && err.name === 'AbortError') {
        return; // User cancelled
      }
      
      setState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Translation failed',
      }));
      
    } finally {
      setState(prev => ({ ...prev, isStreaming: false }));
      
      // Emit metrics for monitoring
      emitPerformanceMetrics(localMetrics, hasError);
      
      // Clean up
      if (abortControllerRef.current === abortController) {
        abortControllerRef.current = null;
      }
    }
  }, []);

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      console.log('🚫 Client: Cancelling translation request');
      abortControllerRef.current.abort();
      setState(prev => ({ ...prev, isStreaming: false }));
    }
  }, []);

  const reset = useCallback(() => {
    cancel();
    setState({
      isStreaming: false,
      result: '',
      error: null,
      metrics: {},
    });
  }, [cancel]);

  return {
    translate,
    cancel,
    reset,
    ...state,
  };
};

// ✅ Вспомогательные функции - вынесены из основного хука
async function processStreamResponse(
  response: Response,
  setState: React.Dispatch<React.SetStateAction<TranslationState>>,
  localMetrics: PerformanceMetrics,
  abortController: AbortController
) {
  const reader = response.body?.getReader();
  if (!reader) throw new Error('Stream reader unavailable');

  const decoder = new TextDecoder();
  let buffer = '';

  while (!abortController.signal.aborted) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        try {
          const data = JSON.parse(line.slice(6));
          
          if (data.d) {
            setState(prev => ({ ...prev, result: prev.result + data.d }));
          } else if (data.metrics) {
            const newMetrics = { ...localMetrics, ...data.metrics };
            Object.assign(localMetrics, newMetrics);
            setState(prev => ({ ...prev, metrics: newMetrics }));
          } else if (data.completed) {
            if (data.metrics) {
              setState(prev => ({ 
                ...prev, 
                metrics: { ...prev.metrics, ...data.metrics }
              }));
            }
            return;
          } else if (data.error) {
            throw new Error(data.error);
          }
        } catch (parseError) {
          console.warn('Failed to parse SSE data:', parseError);
        }
      }
    }
  }
}

function emitPerformanceMetrics(metrics: PerformanceMetrics, hasError: boolean) {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    const event = new CustomEvent('translation-performance', {
      detail: {
        ttft: metrics.ttft,
        tokensPerSecond: metrics.tokensPerSecond,
        error: hasError,
      }
    });
    window.dispatchEvent(event);
  }
}