

interface SpeechToTextResponse {
  text: string;
  language?: string;
  duration?: number;
}

export const SpeechToText = async (
  formData: FormData, 
  abortController: AbortController
): Promise<SpeechToTextResponse> => {
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

  return result as SpeechToTextResponse;
};