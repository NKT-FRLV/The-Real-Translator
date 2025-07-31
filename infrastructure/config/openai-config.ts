// Infrastructure Configuration - настройки OpenAI
export class OpenAIConfig {
  static readonly API_KEY = process.env.OPENAI_API_KEY;
  static readonly MODEL = "gpt-4.1-nano"; // Fastest model
  static readonly TEMPERATURE = 0.05; // Maximum determinism for translation
  static readonly MAX_OUTPUT_TOKENS = 500; // Limit for speed
  static readonly TOP_P = 0.1; // Very focused selection for translation consistency

  static validate(): void {
    if (!this.API_KEY) {
      throw new Error('OPENAI_API_KEY environment variable is not set');
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
      top_p: this.TOP_P
    };
  }
}