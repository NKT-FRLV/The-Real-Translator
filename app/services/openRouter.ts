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
		"HTTP-Referer": process.env.OPENROUTER_SITE_URL ?? "https://translator.nkt-frlv.dev/",
		"X-Title": process.env.OPENROUTER_APP_NAME ?? "translator-app",
		// Дополнительные заголовки для скорости
		"Accept": "application/json",
		"Content-Type": "application/json",
		"User-Agent": "translator-app/1.0",
		// Заголовки для sub-провайдеров
		"X-Sub-Provider-Routing": "fastest",
		"X-Priority": "speed",
	},
});
