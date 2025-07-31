// Domain Value Object - Тон перевода
import { Tone as ToneType } from "@/shared/types/types";
import { toneStyle } from "@/shared/constants/tone-style";

const SupportedTones: ToneType[] = Object.values(toneStyle);

export class Tone {
  constructor(public readonly value: ToneType) {
    if (!this.isValidTone(value)) {
      throw new Error(`Invalid tone: ${value}`);
    }
  }

  private isValidTone(tone: ToneType): boolean {
    return SupportedTones.includes(tone);
  }

  equals(other: Tone): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }

  getInstructions(): string {
    return ToneInstructions[this.value as keyof typeof ToneInstructions] || 'Use neutral translation style.';
  }
}

// Константы тонов


// Инструкции для каждого тона
export const ToneInstructions = {
  natural: `
    **NORMAL STYLE**: Use normal everyday language.
    - Neutral vocabulary
    - Simple and understandable constructions
    - Natural conversational turns
    - Avoid both too formal and street expressions
    Example: "Привет, как дела?" → "Hi, how are you?"
	Example: "Hola, ¿cómo estás?" → "Привет, как дела?"
  `,
  
  intellectual: `
    **INTELLECTUAL STYLE**: Use more sophisticated and formal language.
    - Rich vocabulary
    - Complex grammatical constructions
    - Academic approach
    - Avoid abbreviations and simplifications
    - Prefer full word forms
    Example: "Привет, как дела?" → английский: "Good day, how are you faring?"
	Example: "Hey, what's up?" → испанский: "Buenas tardes Señor, cómo está usted?"
  `,
  
  street: `
    **STREET/BANDIT STYLE**: Use street slang, slang and informal language.
    - Youth slang and street language
    - Abbreviations and simplifications
    - Street expressions
    - Informal addresses
    - Modern idioms
    - Regional street slang
    Examples:
    • "Привет, как дела?" → английский: "Yo, what's up?" / "Hey, what's good?"
    • "Привет, как дела?" → испанский: "¿Qué pasa tío?" / "¿Qué tal colega?"
    • "Привет, как дела?" → французский: "Salut mec, ça va?" / "Yo, comment ça va?"
  `
} as const;

// Фабрика для создания тонов
export class ToneFactory {
  static create(value: ToneType): Tone {
    return new Tone(value);
  }

  static natural(): Tone {
    return new Tone('natural');
  }

  static intellectual(): Tone {
    return new Tone('intellectual');
  }

  static street(): Tone {
    return new Tone('street');
  }

  static getSupportedTones(): Tone[] {
    return SupportedTones.map(tone => new Tone(tone));
  }
}