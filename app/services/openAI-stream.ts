// app/services/openAI-stream.ts
import OpenAI from "openai";

export type OpenAIStreamEvent =
  | { type: "delta"; text: string }
  | { type: "completed" }
  | { type: "error"; message: string };

export interface TranslateEventsStreamParams {
  model: string;
  instructions: string;
  input: string;
  apiKey?: string;
  temperature?: number;
  topP?: number;
  maxOutputTokens?: number;
  signal?: AbortSignal;
}

export async function* translateEventsStream(
  params: TranslateEventsStreamParams
): AsyncIterable<OpenAIStreamEvent> {
  const client = new OpenAI({ apiKey: params.apiKey ?? process.env.OPENAI_API_KEY });

  const responseStream = await client.responses.create(
    {
      model: params.model,
      instructions: params.instructions,
      input: params.input,
      stream: true,
      temperature: params.temperature ?? 0,
      top_p: params.topP ?? 1,
      max_output_tokens: params.maxOutputTokens ?? 1000,
    },
    { signal: params.signal }
  );

  for await (const event of responseStream) {
    if (params.signal?.aborted) break;

    if (event.type === "response.output_text.delta") {
      const text = event.delta ?? "";
      if (text.length > 0) {
        yield { type: "delta", text };
      }
    } else if (event.type === "response.completed") {
      yield { type: "completed" };
      break;
    } else if (event.type === "error") {
      yield { type: "error", message: "Translation failed" };
      break;
    }
  }
}


