import { createOpenRouter } from "@openrouter/ai-sdk-provider";

// ───────────────────────────────────────────────────────────────────────────────
// OpenRouter provider (только chat, без completion/Responses API)
// ───────────────────────────────────────────────────────────────────────────────
export const openrouter = createOpenRouter({
	apiKey: process.env.OPENROUTER_API_KEY,
	// (не обязательно) атрибуция приложения:
	// headers: {
	//   "HTTP-Referer": process.env.OPENROUTER_SITE_URL ?? "",
	//   "X-Title": process.env.OPENROUTER_APP_NAME ?? "translator-app",
	// },
});
