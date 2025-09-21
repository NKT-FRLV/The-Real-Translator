import { createOpenRouter } from "@openrouter/ai-sdk-provider";

// ───────────────────────────────────────────────────────────────────────────────
// OpenRouter provider с оптимизацией для максимальной скорости
// ───────────────────────────────────────────────────────────────────────────────
export const openrouter = createOpenRouter({
	apiKey: process.env.OPENROUTER_API_KEY,
	// Настройки для максимальной скорости
	baseURL: "https://openrouter.ai/api/v1",
	// Заголовки для оптимизации
	headers: {
		"HTTP-Referer": process.env.OPENROUTER_SITE_URL ?? "https://translator-app.com",
		"X-Title": process.env.OPENROUTER_APP_NAME ?? "translator-app",
		// Дополнительные заголовки для скорости
		"Accept": "application/json",
		"Content-Type": "application/json",
		"User-Agent": "translator-app/1.0",
		// Заголовки для sub-провайдеров
		"X-Sub-Provider-Routing": "fastest",
		"X-Priority": "speed",
	},
	// Настройки для быстрого соединения
	defaultQuery: {
		// Приоритет скорости
		priority: "speed",
		// Минимальные повторы
		retries: 2,
		// Быстрый таймаут
		timeout: 30000,
		// Настройки sub-провайдеров
		subProvider: {
			routing: "fastest", // Выбирает самого быстрого sub-провайдера
			priority: "speed", // Приоритет скорости
			latency: "low", // Минимальная задержка
			throughput: "high", // Максимальная пропускная способность
		},
	},
});
