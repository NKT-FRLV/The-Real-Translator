// Поддерживаемые модели на OpenRouter (chat-ветка)
export const SUPPORTED_MODELS = {
	"kimi-k2:free": "moonshotai/kimi-k2:free",
	"kimi-k2": "moonshotai/kimi-k2",
	"deepseek-chat-v3-0324": "deepseek/deepseek-chat-v3-0324",
	"deepseek-chat-v3-0324:free": "deepseek/deepseek-chat-v3-0324:free",
	"gpt-5-nano": "openai/gpt-5-nano",
	"gpt-oss-120b": "openai/gpt-oss-120b",
	"gpt-oss-20b": "openai/gpt-oss-20b",
	"gpt-4o-mini": "openai/gpt-4o-mini",
	"gpt-4o": "openai/gpt-4o",
	"gpt-4.1-mini": "openai/gpt-4.1-mini",
	"gpt-4.1-nano": "openai/gpt-4.1-nano",
	"claude-3-5-sonnet": "anthropic/claude-3.5-sonnet",
	"claude-3-5-haiku": "anthropic/claude-3.5-haiku",
	"claude-3-haiku": "anthropic/claude-3-haiku",
	"gemini-2.5-flash": "google/gemini-2.5-flash",
	"gemini-2.5-flash-lite": "google/gemini-2.5-flash-lite-preview-06-17",
} as const;


const envModel = process.env.TRANSLATION_MODEL || "gpt-4.1-nano";

export const MODEL_KEY = (
	Object.keys(SUPPORTED_MODELS) as Array<keyof typeof SUPPORTED_MODELS>
).includes(envModel as keyof typeof SUPPORTED_MODELS)
	? (envModel as keyof typeof SUPPORTED_MODELS)
	: "gpt-4.1-nano";

export const MODEL = SUPPORTED_MODELS[MODEL_KEY];
