// app/utils/stream.ts
export type Metrics = {
  totalTime: number;
  ttft?: number;
  tokensPerSecond: number;
  tokenCount: number;
};

export type MetricsHooks = {
  onFirstToken?: (metrics: Pick<Metrics, "ttft">) => void;
  onComplete?: (metrics: Metrics) => void;
};

const encoder = new TextEncoder();
export function sse(data: unknown): Uint8Array {
  return encoder.encode(`data: ${JSON.stringify(data)}\n\n`);
}

export function calculateMetrics(
  start: number,
  firstToken: number | null,
  tokenCount: number
): Metrics {
  const totalTime = Date.now() - start;
  const ttft = firstToken ? firstToken - start : undefined;
  const tokensPerSecond = tokenCount > 0 ? Math.round((tokenCount / (totalTime / 1000)) * 10) / 10 : 0;
  return { totalTime, ttft, tokensPerSecond, tokenCount };
}

export type StreamOrchestratorParams = {
  signal?: AbortSignal;
  metricsHooks?: MetricsHooks; // dependency inversion: pass hooks or omit entirely
  collectMetrics?: boolean; // if not provided, inferred from presence of metricsHooks
  onDelta: (chunk: string) => void; // stream chank AI response!!
  onError: (message: string) => void;
  onCompleted: (summary?: Metrics) => void;
};

export type TokenSource = AsyncIterable<
  | { type: "delta"; text: string }
  | { type: "completed" }
  | { type: "error"; message: string }
>;

export async function runStreamingOrchestrator(
  source: TokenSource,
  params: StreamOrchestratorParams
): Promise<void> {
  const enableMetrics = params.collectMetrics ?? Boolean(params.metricsHooks);
  const startTime = enableMetrics ? Date.now() : undefined;
  let firstTokenTime: number | null | undefined = enableMetrics ? null : undefined;
  let tokenCount: number | undefined = enableMetrics ? 0 : undefined;

  try {
    for await (const event of source) {
      if (params.signal?.aborted) break;

      if (event.type === "delta") {
        if (enableMetrics) {
          if (!firstTokenTime) {
            firstTokenTime = Date.now();
            const m = calculateMetrics(startTime!, firstTokenTime, tokenCount!);
            params.metricsHooks?.onFirstToken?.({ ttft: m.ttft });
          }
          tokenCount = (tokenCount ?? 0) + 1;
        }
        params.onDelta(event.text);
      } else if (event.type === "completed") {
        if (enableMetrics) {
          const m = calculateMetrics(startTime!, firstTokenTime ?? null, tokenCount ?? 0);
          params.metricsHooks?.onComplete?.(m);
          params.onCompleted(m);
        } else {
          params.onCompleted();
        }
        break;
      } else if (event.type === "error") {
        params.onError(event.message);
        break;
      }
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    params.onError(message);
  }
}


