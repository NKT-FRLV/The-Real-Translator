import { useCallback, useRef, useState, useMemo, useEffect } from "react";
import { LanguageShort } from "@/shared/config/translation";

interface UseTextToSpeechOptions {
  onError?: (error: string) => void;
  onStart?: () => void;
  onEnd?: () => void;
}

interface UseTextToSpeechReturn {
  speak: (text: string, language: LanguageShort) => void;
  stop: () => void;
  isSpeaking: boolean;
  currentLanguage: LanguageShort | null;
  isSupported: boolean;
  supportedLanguages: string[];
  availableLanguages: string[];
  getAvailableLanguageNames: () => string[];
  isLanguageSupported: (language: LanguageShort) => boolean;
}

// Маппинг языков на коды для speech synthesis (только поддерживаемые языки)
const LANGUAGE_MAP: Record<LanguageShort, string> = {
  "ru": "ru-RU",
  "en": "en-US", 
  "es": "es-ES",
  "fr": "fr-FR",
  "de": "de-DE",
  "it": "it-IT",
  "pt": "pt-PT",
  "zh": "zh-CN",
  "ja": "ja-JP",
  "ar": "ar-SA",
  "tr": "tr-TR",
  "sv": "sv-SE",
  "ua": "uk-UA"
};


// Маппинг кодов языков на человекочитаемые названия
const LANGUAGE_NAMES: Record<string, string> = {
  "ru-RU": "Russian",
  "en-US": "English",
  "es-ES": "Spanish", 
  "fr-FR": "French",
  "de-DE": "German",
  "it-IT": "Italian",
  "pt-PT": "Portuguese",
  "zh-CN": "Chinese",
  "ja-JP": "Japanese",
  "ar-SA": "Arabic",
  "tr-TR": "Turkish",
  "sv-SE": "Swedish",
  "uk-UA": "Ukrainian"
};

export const useTextToSpeech = (options: UseTextToSpeechOptions = {}): UseTextToSpeechReturn => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<LanguageShort | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  
  const { onError, onStart, onEnd } = options;

  // Проверяем поддержку speech synthesis
  const isSupported = typeof window !== "undefined" && "speechSynthesis" in window;

  // Загружаем голоса асинхронно (браузеры загружают голоса по-разному)
  useEffect(() => {
    if (!isSupported) return;

    const loadVoices = () => {
      const allVoices = speechSynthesis.getVoices();
      if (allVoices.length > 0) {
        console.log('Available voices:', allVoices);
        setVoices(allVoices);
      }
    };

    // Загружаем голоса сразу
    loadVoices();

    // Подписываемся на событие загрузки голосов (для Chrome и других браузеров)
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = null;
      }
    };
  }, [isSupported]);

  // Получаем список поддерживаемых языков
  const supportedLanguages = useMemo(() => {
    return voices.map(voice => voice.lang);
  }, [voices]);

  // Получаем доступные языки (уникальные коды языков)
  const availableLanguages = useMemo(() => {
    const uniqueLanguages = [...new Set(voices.map(voice => voice.lang))];
    console.log('Available languages:', uniqueLanguages);
    return uniqueLanguages;
  }, [voices]);

  // Функция выбора голоса для языка
  const selectVoiceForLanguage = useCallback((language: LanguageShort) => {
    const primaryLang = LANGUAGE_MAP[language];
    const languageVoices = voices.filter(voice => voice.lang === primaryLang);
    
    if (languageVoices.length === 0) {
      console.warn(`No voices found for language: ${language} (${primaryLang})`);
      return null;
    }
    
    if (language === "es") {
      // Для испанского: третий -> второй -> первый
      const selectedVoice = languageVoices.length >= 3 ? languageVoices[2] : 
                           languageVoices.length >= 2 ? languageVoices[1] : 
                           languageVoices[0];
      console.log(`Spanish voice selection: ${selectedVoice.name} (${languageVoices.length} voices available)`);
      return selectedVoice;
    } else if (language === "ru") {
      // Для русского: второй -> первый
      const selectedVoice = languageVoices.length >= 2 ? languageVoices[1] : languageVoices[0];
      console.log(`Russian voice selection: ${selectedVoice.name} (${languageVoices.length} voices available)`);
      return selectedVoice;
    } else {
      // Для остальных: первый
      const selectedVoice = languageVoices[0];
      console.log(`${language} voice selection: ${selectedVoice.name} (${languageVoices.length} voices available)`);
      return selectedVoice;
    }
  }, [voices]);

  // Получаем названия доступных языков
  const getAvailableLanguageNames = useCallback((): string[] => {
    return availableLanguages
      .map(lang => LANGUAGE_NAMES[lang] || lang)
      .filter(Boolean);
  }, [availableLanguages]);

  // Проверяем, поддерживается ли язык (только основной язык)
  const isLanguageSupported = useCallback((language: LanguageShort): boolean => {
    if (!isSupported) return false;
    
    const primaryLang = LANGUAGE_MAP[language];
    return supportedLanguages.includes(primaryLang);
  }, [isSupported, supportedLanguages]);
  

  // Находим подходящий голос (только основной язык)
  const findSupportedLanguage = useCallback((language: LanguageShort): string | null => {
    if (!isSupported) return null;

    const selectedVoice = selectVoiceForLanguage(language);
    if (selectedVoice) {
      console.log(`Selected voice for ${language}:`, selectedVoice.name);
      return selectedVoice.lang;
    }

    return null;
  }, [isSupported, selectVoiceForLanguage]);

  // Останавливаем текущее воспроизведение
  const stop = useCallback(() => {
    if (currentUtteranceRef.current) {
      speechSynthesis.cancel();
      currentUtteranceRef.current = null;
      setIsSpeaking(false);
      setCurrentLanguage(null);
    }
  }, []);

  // Основная функция воспроизведения
  const speak = useCallback((text: string, language: LanguageShort) => {
    if (!isSupported) {
      onError?.("Speech synthesis is not supported in this browser");
      return;
    }

    if (!text.trim()) {
      onError?.("No text to speak");
      return;
    }

    // Проверяем, поддерживается ли язык
    if (!isLanguageSupported(language)) {
      onError?.(`Language ${language} is not supported`);
      return;
    }

    // Останавливаем предыдущее воспроизведение
    stop();

    // Находим подходящий язык
    const supportedLang = findSupportedLanguage(language);
    
    if (!supportedLang) {
      onError?.(`Language ${language} is not available in this browser`);
      return;
    }

    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = supportedLang;
      
      // Выбираем конкретный голос
      const selectedVoice = selectVoiceForLanguage(language);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
        console.log(`Using voice: ${selectedVoice.name} for ${language}`);
      }
      
      // Настройки качества
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      // Обработчики событий
      utterance.onstart = () => {
        setIsSpeaking(true);
        setCurrentLanguage(language);
        onStart?.();
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setCurrentLanguage(null);
        currentUtteranceRef.current = null;
        onEnd?.();
      };

      utterance.onerror = (event) => {
        setIsSpeaking(false);
        setCurrentLanguage(null);
        currentUtteranceRef.current = null;
        onError?.(`Speech synthesis error: ${event.error}`);
      };

      utterance.onpause = () => {
        setIsSpeaking(false);
      };

      utterance.onresume = () => {
        setIsSpeaking(true);
      };

      currentUtteranceRef.current = utterance;
      speechSynthesis.speak(utterance);
      
    } catch (error) {
      onError?.(`Failed to create speech utterance: ${error}`);
    }
  }, [isSupported, findSupportedLanguage, stop, onError, onStart, onEnd, isLanguageSupported, selectVoiceForLanguage]);

  return {
    speak,
    stop,
    isSpeaking,
    currentLanguage,
    isSupported,
    supportedLanguages,
    availableLanguages,
    getAvailableLanguageNames,
    isLanguageSupported
  };
};
