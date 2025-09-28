import { create } from 'zustand';

interface TranslatorState {

  // Text content
  inputText: string;
  outputText: string;
  
  // UI state
  isTranslating: boolean;
  
  // Actions
  setInputText: (text: string) => void;
  setOutputText: (text: string) => void;
  setIsTranslating: (isTranslating: boolean) => void;
  clearTexts: () => void;
}

export const useTranslatorStore = create<TranslatorState>((set, get) => ({
  // Initial state
  inputText: '',
  outputText: '',
  isTranslating: false,

  // Actions
  setInputText: (text) => set({ inputText: text }),
  setOutputText: (text) => set({ outputText: text }),
  setIsTranslating: (isTranslating) => set({ isTranslating }),
  
  
  
  clearTexts: () => set({ 
    inputText: '', 
    outputText: '' 
  }),
}));



