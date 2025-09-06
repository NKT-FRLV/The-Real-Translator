// app/api/speech-to-text/route.ts
import { NextRequest } from "next/server";
import { experimental_transcribe as transcribe, NoOutputGeneratedError } from 'ai';
import { openai } from '@ai-sdk/openai';
import { auth } from "@/app/auth";
import { languages, LanguageShort } from "@/shared/config/translation";

export const runtime = "edge";

// Mapping from our language codes to Whisper language codes
const LANGUAGE_MAPPING: Record<LanguageShort, string> = {
  en: 'en',
  ru: 'ru', 
  es: 'es',
  fr: 'fr',
  de: 'de',
  it: 'it',
  pt: 'pt',
  zh: 'zh',
  ja: 'ja',
  ar: 'ar',
  tr: 'tr',
  sv: 'sv',
  ua: 'uk', // Ukrainian: our 'ua' -> Whisper 'uk'
};

const SUPPORTED_LANGUAGES = Object.keys(languages) as LanguageShort[];
type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];

function isSupportedLanguage(lang: unknown): lang is SupportedLanguage {
  return typeof lang === 'string' && SUPPORTED_LANGUAGES.includes(lang as SupportedLanguage);
}

export async function POST(req: NextRequest) {
  try {
    // Check for abort signal early
    if (req.signal?.aborted) {
      return new Response(null, { status: 204 });
    }

    // Check if user is authenticated and has admin role
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return new Response(
        JSON.stringify({ error: "Access denied. Admin role required for Whisper AI transcription." }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    const formData = await req.formData();
    const audioFile = formData.get('audio') as File;
    const language = formData.get('language') as string;

    if (!audioFile) {
      return new Response(
        JSON.stringify({ error: "Audio file is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!language || !isSupportedLanguage(language)) {
      return new Response(
        JSON.stringify({ error: "Valid language is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Check file size (max 25MB for Whisper)
    if (audioFile.size > 25 * 1024 * 1024) {
      return new Response(
        JSON.stringify({ error: "Audio file too large. Maximum size is 25MB" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Check for abort signal before expensive operations
    if (req.signal?.aborted) {
      return new Response(null, { status: 204 });
    }

    // Convert File to Buffer for AI SDK
    const audioBuffer = Buffer.from(await audioFile.arrayBuffer());

    // Map language code to Whisper format
    const whisperLanguage = LANGUAGE_MAPPING[language];
    
    // Transcribe using OpenAI Whisper through AI SDK with enhanced settings
    const result = await transcribe({
      model: openai.transcription('whisper-1'),
      audio: audioBuffer,
      providerOptions: {
        openai: {
          language: whisperLanguage, // Use mapped language code for Whisper
          temperature: 0, // More deterministic output
          response_format: 'verbose_json', // Get detailed response with timestamps
          timestamp_granularities: ['word'], // Word-level timestamps
          prompt: "Transcribe this audio clearly and accurately.", // Context prompt
        },
      },
      abortSignal: req.signal,
      headers: {
        'X-Custom-Header': 'whisper-transcription',
        'X-Request-Source': 'translator-app',
        'X-Original-Language': language,
        'X-Whisper-Language': whisperLanguage,
      },
    });

    // Log warnings if any
    if (result.warnings && result.warnings.length > 0) {
      console.warn('Transcription warnings:', result.warnings);
    }

    return new Response(
      JSON.stringify({
        text: result.text,
        language: result.language,
        duration: result.durationInSeconds,
        segments: result.segments,
        warnings: result.warnings,
        model: 'whisper-1',
        timestamp: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: { 
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-transform",
          "X-Transcription-Model": "whisper-1",
          "X-Processing-Time": `${Date.now()}ms`,
        }
      }
    );

  } catch (error: unknown) {
    // Handle abort as normal scenario
    if (
      req.signal?.aborted ||
      (error instanceof Error && error.name === "AbortError")
    ) {
      return new Response(null, { status: 204 });
    }

    // Handle AI SDK specific errors
    if (NoOutputGeneratedError.isInstance(error)) {
      console.error('NoOutputGeneratedError:', {
        message: error.message,
        cause: error.cause,
      });
      
      return new Response(
        JSON.stringify({
          error: "Failed to generate transcript",
          details: "The audio could not be transcribed. Please ensure the audio is clear and contains speech.",
          type: "NO_TRANSCRIPT_GENERATED",
        }),
        { 
          status: 422, // Unprocessable Entity
          headers: { "Content-Type": "application/json" } 
        }
      );
    }

    console.error('Speech-to-text error:', error);

    // Determine error type and appropriate response
    let status = 500;
    let errorMessage = "Speech recognition failed";
    
    if (error instanceof Error) {
      if (error.message.includes("rate limit") || error.message.includes("quota")) {
        status = 429;
        errorMessage = "Rate limit exceeded. Please try again later.";
      } else if (error.message.includes("timeout")) {
        status = 408;
        errorMessage = "Request timeout. Audio processing took too long.";
      } else if (error.message.includes("file too large")) {
        status = 413;
        errorMessage = "Audio file too large. Maximum size is 25MB.";
      } else {
        errorMessage = error.message;
      }
    }

    return new Response(
      JSON.stringify({
        error: errorMessage,
        type: "TRANSCRIPTION_ERROR",
        timestamp: new Date().toISOString(),
      }),
      { 
        status, 
        headers: { "Content-Type": "application/json" } 
      }
    );
  }
}

// HEAD endpoint for connection warming
export async function HEAD() {
  return new Response(null, {
    status: 200,
    headers: { "Cache-Control": "no-cache" },
  });
}

// GET endpoint for service information
export async function GET() {
  const response = {
    supportedLanguages: SUPPORTED_LANGUAGES,
    maxFileSize: "25MB",
    model: "whisper-1",
    provider: "OpenAI",
    runtime,
  };

  return new Response(JSON.stringify(response), {
    headers: { "Content-Type": "application/json" },
  });
}
