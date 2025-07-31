import OpenAI from "openai";
import { OpenAIConfig } from '../config/openai-config';

// Infrastructure HTTP Client - клиент для OpenAI API
export class OpenAIClient {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI(OpenAIConfig.getClientConfig());
  }

  async createStreamingResponse(
    instructions: string,
    input: string,
    abortSignal?: AbortSignal
  ) {
    const config = OpenAIConfig.getStreamingConfig();
    
    // ✅ Передаем AbortSignal в OpenAI для реальной отмены стрима
    return await this.client.responses.create({
      ...config,
      instructions,
      input,
      stream: true
    }, {
      signal: abortSignal // 🎯 КЛЮЧЕВОЕ ИСПРАВЛЕНИЕ! (в options)
    });
  }

  async createChatCompletion(
    messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
    options?: Partial<OpenAI.Chat.Completions.ChatCompletionCreateParams>
  ) {
    return await this.client.chat.completions.create({
      model: OpenAIConfig.MODEL,
      messages,
      temperature: OpenAIConfig.TEMPERATURE,
      max_tokens: OpenAIConfig.MAX_OUTPUT_TOKENS,
      top_p: OpenAIConfig.TOP_P,
      stream: false,
      ...options
    });
  }
}