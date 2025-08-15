// client_api/warmer.ts
import { createLogger } from "@/shared/utils/logger";

/**
 * Создаёт AbortSignal, который автоматически абортится через ms миллисекунд.
 * Без каких-либо type assertions.
 */
function createTimeoutSignal(ms: number): { signal: AbortSignal; cancel: () => void } {
	const controller = new AbortController();
	const timerId = setTimeout(() => {
	  // В браузере DOMException есть; в худшем случае передадим строку.
	  const reason =
		typeof DOMException !== "undefined"
		  ? new DOMException("TimeoutError", "TimeoutError")
		  : "TimeoutError";
	  controller.abort(reason);
	}, ms);
  
	const cancel = () => clearTimeout(timerId);
	return { signal: controller.signal, cancel };
  }
  
  /**
 * Быстрый HEAD-запрос для «прогрева» эндпоинта.
 * Не падает, не логирует в прод— только мягкий дебаг при необходимости.
 */
export const warmupServerConnection = async (
	url: string = "/api/translate-stream",
	timeout: number = 800
) => {
	const logger = createLogger("Warmer");
	const { signal, cancel } = createTimeoutSignal(timeout);
	
	logger.debug("Starting warmup request", { url, timeout });
	
	try {
	  const startTime = Date.now();
	  const response = await fetch(url, {
		method: "HEAD",
		signal,
		cache: "no-store",
	  });
	  
	  const duration = Date.now() - startTime;
	  logger.success("Warmup request completed", {
		status: response.status,
		duration: `${duration}ms`,
		headers: Object.fromEntries(response.headers.entries())
	  });
	  
	} catch (error) {
	  if (signal.aborted) {
		logger.warn("Warmup request timed out", { timeout, url });
	  } else {
		logger.warn("Warmup request failed (ignored)", {
		  error: error instanceof Error ? {
			name: error.name,
			message: error.message
		  } : error,
		  url
		});
	  }
	} finally {
	  cancel(); // снимаем таймер, чтобы не текли
	  logger.debug("Warmup request cleanup completed");
	}
};
  