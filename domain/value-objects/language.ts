// Domain Value Object - Язык
export class Language {
  constructor(
    public readonly code: string,
    public readonly label: string
  ) {
    if (!code || code.trim().length === 0) {
      throw new Error('Language code cannot be empty');
    }
    if (!label || label.trim().length === 0) {
      throw new Error('Language label cannot be empty');
    }
  }

  equals(other: Language): boolean {
    return this.code === other.code;
  }

  toString(): string {
    return this.code;
  }
}

// Фабрика для создания поддерживаемых языков
export class LanguageFactory {
  private static readonly SUPPORTED_LANGUAGES = {
    en: { label: "English", code: "en" },
    ru: { label: "Russian", code: "ru" },
    es: { label: "Spanish", code: "es" },
    fr: { label: "French", code: "fr" },
    de: { label: "German", code: "de" }
  } as const;

  static create(code: string): Language {
    const config = this.SUPPORTED_LANGUAGES[code as keyof typeof this.SUPPORTED_LANGUAGES];
    if (!config) {
      throw new Error(`Unsupported language code: ${code}`);
    }
    return new Language(config.code, config.label);
  }

  static getSupportedLanguages(): Language[] {
    return Object.values(this.SUPPORTED_LANGUAGES).map(
      config => new Language(config.code, config.label)
    );
  }

  static isSupported(code: string): boolean {
    return code in this.SUPPORTED_LANGUAGES;
  }
}