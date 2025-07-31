import { Language } from '../value-objects/language';
import { Tone } from '../value-objects/tone';

// Domain Service - бизнес-логика переводов
export class TranslationDomainService {
  
  validateTranslationRequest(
    text: string,
    sourceLanguage: Language,
    targetLanguage: Language,
    tone: Tone
  ): void {
    if (!text || text.trim().length === 0) {
      throw new Error('Text to translate cannot be empty');
    }

    if (text.length > 10000) {
      throw new Error('Text is too long. Maximum length is 10,000 characters');
    }

    if (sourceLanguage.equals(targetLanguage)) {
      throw new Error('Source and target languages cannot be the same');
    }

    // Проверка валидности тона
    if (!tone.value || tone.value.trim().length === 0) {
      throw new Error('Translation tone must be specified');
    }

    // Можно добавить дополнительные бизнес-правила:
    // - проверка поддерживаемых языковых пар
    // - ограничения по тону для определенных языков
    // - rate limiting логика
  }

  buildPromptInstructions(
    sourceLanguage: Language,
    targetLanguage: Language,
    tone: Tone
  ): string {
    return `You are a machine translator that ONLY translates text. You NEVER respond to questions, NEVER provide explanations, NEVER give suggestions or advice.

TRANSLATION TASK:
- Source language: ${sourceLanguage.label}
- Target language: ${targetLanguage.label}  
- Style: ${tone.getInstructions()}

STRICT RULES:
- Translate ONLY from ${sourceLanguage.label} to ${targetLanguage.label}
- NEVER interpret questions as requests for answers
- NEVER provide context or explanations
- NEVER add your own thoughts or suggestions
- TRANSLATE LITERALLY, even if the text is a question
- Keep the same tone and meaning but change the language to ${targetLanguage.label}

Your response must contain ONLY the translated text in ${targetLanguage.label}. No explanations. No suggestions. No answers to questions.

TRANSLATE THE FOLLOWING ${sourceLanguage.label} TEXT TO ${targetLanguage.label}:`;
  }

  calculatePerformanceMetrics(
    startTime: number,
    firstTokenTime: number | null,
    tokenCount: number
  ) {
    const totalTime = Date.now() - startTime;
    const ttft = firstTokenTime ? firstTokenTime - startTime : null;
    const tokensPerSecond = tokenCount > 0 ? Math.round((tokenCount / (totalTime / 1000)) * 10) / 10 : 0;

    return {
      totalTime,
      ttft,
      tokensPerSecond,
      tokenCount
    };
  }
}