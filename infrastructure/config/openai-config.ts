// Infrastructure Configuration - настройки OpenAI
const validateAIModel = (model: string | undefined) => {
	if (!model) {
		return false;
	}
	const suportetModels = ["gpt-4.1-nano", "gpt-4o-mini", "gpt-4o", "gpt-4.1"];
	if (!suportetModels.includes(model)) {
		return false;
	}
	return model;
};

export class OpenAIConfig {
	static readonly API_KEY = process.env.OPENAI_API_KEY;
	static readonly MODEL =
		validateAIModel(process.env.OPENAI_MODEL) || "gpt-4.1-nano"; // Fastest model
	static readonly TEMPERATURE = 0.0; // Maximum determinism for translation
	static readonly MAX_OUTPUT_TOKENS = 1000; // Limit for speed
	static readonly TOP_P = 1; // Very focused selection for translation consistency

	static validate(): void {
		if (!this.API_KEY) {
			throw new Error("OPENAI_API_KEY environment variable is not set");
		}
	}

	static getClientConfig() {
		this.validate();
		return {
			apiKey: this.API_KEY,
		};
	}

	static getStreamingConfig() {
		return {
			model: this.MODEL,
			stream: true,
			temperature: this.TEMPERATURE,
			max_output_tokens: this.MAX_OUTPUT_TOKENS,
			top_p: this.TOP_P,
		};
	}
}
