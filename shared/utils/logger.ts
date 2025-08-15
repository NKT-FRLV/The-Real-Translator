// shared/utils/logger.ts

interface LogContext {
  requestId: string;
  timestamp: string;
  component: string;
}

export function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
}

export function createLogger(component: string, requestId?: string) {
  const reqId = requestId || generateRequestId();
  
  const createLogContext = (step?: string): LogContext => ({
    requestId: reqId,
    timestamp: new Date().toISOString(),
    component: step ? `${component}:${step}` : component,
  });

  return {
    requestId: reqId,
    
    info: (message: string, data?: Record<string, unknown>, step?: string) => {
      const context = createLogContext(step);
      console.log(`[${context.timestamp}] [${context.component}] [${context.requestId}] ℹ️ ${message}`, data ? { ...data } : '');
    },
    
    success: (message: string, data?: Record<string, unknown>, step?: string) => {
      const context = createLogContext(step);
      console.log(`[${context.timestamp}] [${context.component}] [${context.requestId}] ✅ ${message}`, data ? { ...data } : '');
    },
    
    error: (message: string, error?: unknown, data?: Record<string, unknown>, step?: string) => {
      const context = createLogContext(step);
      console.error(`[${context.timestamp}] [${context.component}] [${context.requestId}] ❌ ${message}`, {
        error: error instanceof Error ? {
          name: error.name,
          message: error.message,
          stack: error.stack,
        } : error,
        ...data
      });
    },
    
    warn: (message: string, data?: Record<string, unknown>, step?: string) => {
      const context = createLogContext(step);
      console.warn(`[${context.timestamp}] [${context.component}] [${context.requestId}] ⚠️ ${message}`, data ? { ...data } : '');
    },
    
    debug: (message: string, data?: Record<string, unknown>, step?: string) => {
      if (process.env.NODE_ENV === 'development') {
        const context = createLogContext(step);
        console.debug(`[${context.timestamp}] [${context.component}] [${context.requestId}] 🔍 ${message}`, data ? { ...data } : '');
      }
    },

    // Специальные методы для stream events
    streamStart: (data?: Record<string, unknown>) => {
      const context = createLogContext('stream-start');
      console.log(`[${context.timestamp}] [${context.component}] [${context.requestId}] 🌊 Stream starting`, data ? { ...data } : '');
    },
    
    streamData: (chunk: string, chunkIndex: number) => {
      const context = createLogContext('stream-data');
      console.log(`[${context.timestamp}] [${context.component}] [${context.requestId}] 📦 Stream chunk #${chunkIndex}`, {
        chunkLength: chunk.length,
        chunkPreview: chunk.substring(0, 50) + (chunk.length > 50 ? '...' : '')
      });
    },
    
    streamEnd: (totalChunks?: number, totalLength?: number) => {
      const context = createLogContext('stream-end');
      console.log(`[${context.timestamp}] [${context.component}] [${context.requestId}] 🏁 Stream completed`, {
        totalChunks,
        totalLength
      });
    },
    
    streamAbort: (reason?: unknown) => {
      const context = createLogContext('stream-abort');
      console.warn(`[${context.timestamp}] [${context.component}] [${context.requestId}] 🛑 Stream aborted`, {
        reason: reason instanceof Error ? {
          name: reason.name,
          message: reason.message,
        } : reason
      });
    }
  };
}

// Экспорт для удобства
export const createRequestLogger = (component: string) => createLogger(component);
