"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { LanguageShort } from "@/shared/config/translation";
import { SpeechMode } from "@/shared/types/settings";

interface SpeechToTextOptions {
  language: LanguageShort;
  mode: SpeechMode;
  isAdmin?: boolean;
  onTranscriptUpdate?: (transcript: string) => void;
  onError?: (error: string) => void;
}

interface SpeechToTextReturn {
  transcript: string;
  listening: boolean;
  isSupported: boolean;
  isBrowserSupported: boolean;
  isMicrophoneAvailable: boolean;
  startListening: () => Promise<void>;
  stopListening: () => void;
  resetTranscript: () => void;
  error: string | null;
  isTranscribing: boolean;
}

const BASE_LOCALES = {
  en: "en-US",
  ru: "ru-RU",
} as const;

function resolveLocale(lang: "en" | "ru") {
  if (typeof navigator === "undefined") return BASE_LOCALES[lang];
  const prefs = navigator.languages ?? [navigator.language];

  if (lang === "en") {
    if (prefs.some(l => l.toLowerCase().startsWith("en-gb"))) return "en-GB";
    return "en-US";
  }
  return "ru-RU";
}

export const useSpeechToText = ({
  language,
  mode,
  isAdmin = false,
  onTranscriptUpdate,
  onError,
}: SpeechToTextOptions): SpeechToTextReturn => {
  // Browser speech recognition
  const {
    transcript: browserTranscript,
    listening: browserListening,
    resetTranscript: resetBrowserTranscript,
    isMicrophoneAvailable,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  // Whisper speech recognition state
  const [whisperTranscript, setWhisperTranscript] = useState("");
  const [whisperListening, setWhisperListening] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Media recording for Whisper
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const pendingRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Force browser mode for non-admin users
  const effectiveMode: SpeechMode = !isAdmin ? "browser" : mode;

  // Current active transcript and listening state based on effective mode
  const transcript = effectiveMode === "browser" ? browserTranscript : whisperTranscript;
  const listening = effectiveMode === "browser" ? browserListening : whisperListening;

  // Support checks
  const isBrowserSupported = browserSupportsSpeechRecognition;
  const isWhisperSupported = typeof navigator !== "undefined" && 
    navigator.mediaDevices && 
    typeof MediaRecorder !== "undefined";
  
  const isSupported = effectiveMode === "browser" 
    ? isBrowserSupported && ["en", "ru"].includes(language)
    : isWhisperSupported;

  // Reset error when mode or language changes
  useEffect(() => {
    setError(null);
  }, [mode, language, isAdmin]);

  // Notify about transcript updates
  useEffect(() => {
    if (onTranscriptUpdate && transcript) {
      onTranscriptUpdate(transcript);
    }
  }, [transcript, onTranscriptUpdate]);

  // Whisper transcription function
  const transcribeWithWhisper = useCallback(async (audioBlob: Blob) => {
    try {
      setError(null);
      setIsTranscribing(true);
      
      // Create abort controller for this request
      const abortController = new AbortController();
      abortControllerRef.current = abortController;
      
      const formData = new FormData();
      formData.append("audio", audioBlob, "audio.webm");
      formData.append("language", language);

      const response = await fetch("/api/speech-to-text", {
        method: "POST",
        body: formData,
        signal: abortController.signal,
        headers: {
          'X-Speech-Mode': 'whisper-ai',
          'X-Request-Timeout': '30000',
        },
      });

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error("Access denied. Admin role required for Whisper AI transcription.");
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.error) {
        throw new Error(result.error);
      }

      const transcriptText = result.text || "";
      
      // Get current transcript and concatenate
      const currentTranscript = whisperTranscript || "";
      const newTranscript = currentTranscript 
        ? `${currentTranscript} ${transcriptText}`
        : transcriptText;
      
      setWhisperTranscript(newTranscript);
      
      // Notify about transcript update with new text for concatenation
      if (onTranscriptUpdate && transcriptText) {
        onTranscriptUpdate(transcriptText);
      }
      
    } catch (error) {
      // Handle abort gracefully
      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }
      
      const errorMessage = error instanceof Error ? error.message : "Speech recognition failed";
      setError(errorMessage);
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      abortControllerRef.current = null;
      setIsTranscribing(false);
    }
  }, [language, onError, onTranscriptUpdate, whisperTranscript]);

  // Clean up resources
  const cleanupResources = useCallback(() => {
    // Stop recording if active
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    
    // Clean up stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    // Abort any ongoing transcription
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    
    setWhisperListening(false);
  }, []);

  // Start listening function
  const startListening = useCallback(async () => {
    if (pendingRef.current) return;
    pendingRef.current = true;

    try {
      setError(null);

      if (effectiveMode === "browser") {
        // Browser speech recognition
        if (!isBrowserSupported || !isMicrophoneAvailable) {
          throw new Error("Browser speech recognition not supported or microphone unavailable");
        }
        if (!["en", "ru"].includes(language)) {
          throw new Error("Language not supported for browser speech recognition");
        }

        if (browserListening) {
          SpeechRecognition.stopListening();
          return;
        }

        const lang = resolveLocale(language as "en" | "ru");
        resetBrowserTranscript();
        await new Promise(r => setTimeout(r, 50));

        SpeechRecognition.startListening({
          language: lang,
          interimResults: true,
        });
      } else {
        // Whisper speech recognition
        if (!isWhisperSupported) {
          throw new Error("Whisper speech recognition not supported");
        }

        if (whisperListening) {
          // Stop current recording
          cleanupResources();
          return;
        }

        // Request microphone access
        const stream = await navigator.mediaDevices.getUserMedia({ 
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
            sampleRate: 16000,
          }
        });
        
        streamRef.current = stream;
        
        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: 'audio/webm;codecs=opus'
        });
        mediaRecorderRef.current = mediaRecorder;
        chunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
          
          // Transcribe if we have sufficient audio data
          if (audioBlob.size > 1000) {
            try {
              await transcribeWithWhisper(audioBlob);
            } catch (error) {
              console.error('Transcription failed:', error);
            }
          } else {
            setError("Recording too short or no audio detected");
          }
          
          // Clean up resources
          cleanupResources();
        };

        // Start recording
        mediaRecorder.start(250);
        setWhisperListening(true);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      setError(errorMessage);
      if (onError) {
        onError(errorMessage);
      }
      cleanupResources();
    } finally {
      pendingRef.current = false;
    }
  }, [
    effectiveMode,
    language,
    isBrowserSupported,
    isMicrophoneAvailable,
    browserListening,
    whisperListening,
    isWhisperSupported,
    resetBrowserTranscript,
    transcribeWithWhisper,
    onError,
    cleanupResources,
  ]);

  // Stop listening function
  const stopListening = useCallback(() => {
    if (effectiveMode === "browser") {
      SpeechRecognition.stopListening();
    } else {
      cleanupResources();
    }
  }, [effectiveMode, cleanupResources]);

  // Reset transcript function
  const resetTranscript = useCallback(() => {
    if (effectiveMode === "browser") {
      resetBrowserTranscript();
    } else {
      setWhisperTranscript("");
    }
    setError(null);
  }, [effectiveMode, resetBrowserTranscript]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      cleanupResources();
    };
  }, [cleanupResources]);

  return {
    transcript,
    listening,
    isSupported,
    isBrowserSupported,
    isMicrophoneAvailable,
    startListening,
    stopListening,
    resetTranscript,
    error,
    isTranscribing,
  };
};