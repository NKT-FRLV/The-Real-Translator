// app/api/translate-stream/route.ts - Simplified streaming API (Edge)
import { NextRequest } from "next/server";
import OpenAI from "openai";
import { LanguageShort, Tone } from "@/shared/types/types";
import { isLanguageShort, isTone } from "@/shared/config/translation";

export const runtime = "edge";

// Types sourced from shared/config. Local duplication removed.

const MODEL = process.env.OPENAI_MODEL && [
	"gpt-5-nano",
  "gpt-4.1-nano",
  "gpt-4o-mini",
  "gpt-4o",
  "gpt-4.1",
].includes(process.env.OPENAI_MODEL)
  ? (process.env.OPENAI_MODEL as string)
  : "gpt-4.1-nano";

function getToneInstructions(tone: Tone): string {
  const map: Record<Tone, string> = {
    natural:
      "Use neutral, simple, everyday language. Avoid overly formal or slang expressions.",
    intellectual:
      "Use sophisticated, formal language with richer vocabulary and precise phrasing.",
    street:
      "Use informal, conversational style with slang where natural, concise phrasing.",
  };
  return map[tone] ?? map.natural;
}

function buildInstructions(fromLang: LanguageShort, toLang: LanguageShort, tone: Tone): string {
  return `You are a machine translator that ONLY translates text. Do not explain, do not answer questions.

TRANSLATION TASK:
- Source language: ${fromLang}
- Target language: ${toLang}
- Style: ${getToneInstructions(tone)}

STRICT RULES:
- Translate ONLY from ${fromLang} to ${toLang}
- Never provide explanations or extra text
- Output ONLY the translated text
`;
}

function sse(data: unknown): Uint8Array {
  return new TextEncoder().encode(`data: ${JSON.stringify(data)}\n\n`);
}

function calculateMetrics(start: number, firstToken: number | null, tokenCount: number) {
  const totalTime = Date.now() - start;
  const ttft = firstToken ? firstToken - start : undefined;
  const tokensPerSecond = tokenCount > 0 ? Math.round((tokenCount / (totalTime / 1000)) * 10) / 10 : 0;
  return { totalTime, ttft, tokensPerSecond, tokenCount };
}

export async function HEAD() {
  return new Response(null, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const raw = await req.json();
    // Narrow unknown shape into a typed object without `as`.
    const text = typeof raw?.text === 'string' ? raw.text : '';
    const fromLang = isLanguageShort(raw?.fromLang) ? raw.fromLang : undefined;
    const toLang = isLanguageShort(raw?.toLang) ? raw.toLang : undefined;
    const tone: Tone = isTone(raw?.tone) ? raw.tone : 'natural';

    if (!text.trim()) {
      return new Response(JSON.stringify({ error: "Text is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    if (!fromLang || !toLang) {
      return new Response(JSON.stringify({ error: "Languages are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    if (fromLang === toLang) {
      return new Response(
        JSON.stringify({ error: "Source and target languages cannot be the same" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const instructions = buildInstructions(fromLang, toLang, tone);

    const abortController = new AbortController();
    req.signal?.addEventListener("abort", () => abortController.abort());

    const stream = new ReadableStream<Uint8Array>({
      start: async (controller) => {
        const startTime = Date.now();
        let firstTokenTime: number | null = null;
        let tokenCount = 0;

        try {
          const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

          const responseStream = await client.responses.create(
            {
              model: MODEL,
              instructions,
              input: text,
              stream: true,
              temperature: 0,
              top_p: 1,
              max_output_tokens: 1000,
            },
            { signal: abortController.signal }
          );

          for await (const event of responseStream) {
            if (abortController.signal.aborted) break;

            if (event.type === "response.output_text.delta") {
              if (!firstTokenTime) {
                firstTokenTime = Date.now();
                const m = calculateMetrics(startTime, firstTokenTime, tokenCount);
                controller.enqueue(sse({ metrics: { ttft: m.ttft } }));
              }
              tokenCount++;
              controller.enqueue(sse({ d: event.delta ?? "" }));
            } else if (event.type === "response.completed") {
              const m = calculateMetrics(startTime, firstTokenTime, tokenCount);
              controller.enqueue(sse({ completed: true, metrics: m }));
              break;
            } else if (event.type === "error") {
              controller.enqueue(sse({ error: "Translation failed" }));
              break;
            }
          }
        } catch (error) {
          const isAbort =
            abortController.signal.aborted || (error instanceof Error && error.name === "AbortError");
          if (!isAbort) {
            controller.enqueue(
              sse({ error: error instanceof Error ? error.message : "Unknown error" })
            );
          }
        } finally {
          try {
            controller.close();
          } catch {}
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Cache-Control",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Request processing failed" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
}
