import { create } from 'zustand';
import { Tone } from '@/shared/types/types';
import { LanguageShort } from '@/shared/types/types';

interface TranslatorState {
  // Language settings
  fromLang: LanguageShort;
  toLang: LanguageShort;
  
  // Tone/Style settings
  tone: Tone;
  
  // Text content
  inputText: string;
  outputText: string;
  
  // UI state
  isTranslating: boolean;
  
  // Actions
  setFromLang: (language: LanguageShort) => void;
  setToLang: (language: LanguageShort) => void;
  setTone: (tone: Tone) => void;
  setInputText: (text: string) => void;
  setOutputText: (text: string) => void;
  setIsTranslating: (isTranslating: boolean) => void;
  swapLanguages: (from: LanguageShort, to: LanguageShort) => void;
  clearTexts: () => void;
}

export const useTranslatorStore = create<TranslatorState>((set, get) => ({
  // Initial state
  fromLang: 'ru',
  toLang: 'es',
  tone: 'natural',
  inputText: '',
  outputText: '',
  isTranslating: false,

  // Actions
  setFromLang: (language) => set({ fromLang: language }),
  setToLang: (language) => set({ toLang: language }),
  setTone: (tone) => set({ tone }),
  setInputText: (text) => set({ inputText: text }),
  setOutputText: (text) => set({ outputText: text }),
  setIsTranslating: (isTranslating) => set({ isTranslating }),
  
  swapLanguages: (from, to) => {
    set({ 
      fromLang: to, 
      toLang: from 
    });
  },
  
  clearTexts: () => set({ 
    inputText: '', 
    outputText: '' 
  }),
}));

// Простые селекторы для предотвращения ререндеров
export const useFromLang = () => useTranslatorStore((state) => state.fromLang);
export const useToLang = () => useTranslatorStore((state) => state.toLang);
export const useTone = () => useTranslatorStore((state) => state.tone);
export const useSetFromLang = () => useTranslatorStore((state) => state.setFromLang);
export const useSetToLang = () => useTranslatorStore((state) => state.setToLang);
export const useSetTone = () => useTranslatorStore((state) => state.setTone);
export const useSwapLanguages = () => useTranslatorStore((state) => state.swapLanguages);


