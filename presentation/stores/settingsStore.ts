import { create } from 'zustand';
import { LanguageShort, Tone } from '@/shared/config/translation';
import { SpeechMode } from '@/shared/types/settings';

interface UserSettings {
  // Динамические настройки для текущей работы переводчика
  fromLang: LanguageShort; 
  toLang: LanguageShort;
  tone: Tone;
  
  // Статические настройки пользователя (сохраненные в БД)
  savedFromLang: LanguageShort;
  savedToLang: LanguageShort;
  savedTone: Tone;
  
  speechRecognitionMode: SpeechMode;
  uiLanguage: string | null;
  preferredLLM: string;
  reviewDailyTarget: number | null;
  notificationsEnabled: boolean;
  timezone: string | null;
  // Дополнительные настройки для UI
  emailNotifications: boolean;
  translationReminders: boolean;
}

interface SettingsState extends UserSettings {
  // Loading states
  isLoading: boolean;
  
  swapLanguages: (from: LanguageShort, to: LanguageShort) => void;
  
  // Actions для динамических настроек (меняются во время работы переводчика)
  setFromLang: (lang: LanguageShort) => void;
  setToLang: (lang: LanguageShort) => void;
  setTone: (style: Tone) => void;
  
  // Actions для статических настроек (обновляются только при загрузке из БД)
  setSavedFromLang: (lang: LanguageShort) => void;
  setSavedToLang: (lang: LanguageShort) => void;
  setSavedTone: (style: Tone) => void;
  
  setSpeechRecognitionMode: (mode: SpeechMode) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  setEmailNotifications: (enabled: boolean) => void;
  setTranslationReminders: (enabled: boolean) => void;
  setUiLanguage: (lang: string) => void;
  setReviewDailyTarget: (target: number | null) => void;
  setTimezone: (timezone: string | null) => void;
  
  // API Actions
  loadSettings: () => Promise<void>;
  resetToDefaults: () => void;
}

const defaultSettings: UserSettings = {
  // Динамические настройки для переводчика (изначально равны сохраненным)
  fromLang: "ru",
  toLang: "en",
  tone: "neutral",
  
  // Статические настройки пользователя (сохраненные в БД)
  savedFromLang: "ru",
  savedToLang: "en",
  savedTone: "neutral",
  
  speechRecognitionMode: "browser",
  uiLanguage: null,
  preferredLLM: "kimi-k2:free",
  reviewDailyTarget: null,
  notificationsEnabled: false,
  timezone: null,
  emailNotifications: false,
  translationReminders: false,
};

export const useSettingsStore = create<SettingsState>((set) => ({
  // Initial state
  ...defaultSettings,
  isLoading: false,

  // Setters для динамических настроек (используются в переводчике)
  setFromLang: (lang) => set({ fromLang: lang }),
  setToLang: (lang) => set({ toLang: lang }),
  setTone: (style) => set({ tone: style }),

  // Setters для статических настроек (обновляются только при загрузке из БД)
  setSavedFromLang: (lang) => set({ savedFromLang: lang }),
  setSavedToLang: (lang) => set({ savedToLang: lang }),
  setSavedTone: (style) => set({ savedTone: style }),

  setSpeechRecognitionMode: (mode) => set({ speechRecognitionMode: mode }),
  setNotificationsEnabled: (enabled) => set({ notificationsEnabled: enabled }),
  setEmailNotifications: (enabled) => set({ emailNotifications: enabled }),
  setTranslationReminders: (enabled) => set({ translationReminders: enabled }),
  setUiLanguage: (lang) => set({ uiLanguage: lang }),
  setReviewDailyTarget: (target) => set({ reviewDailyTarget: target }),
  setTimezone: (timezone) => set({ timezone }),

  swapLanguages: (from, to) => {
    set({ 
      fromLang: to, 
      toLang: from 
    });
  },


  // Load settings from API
  loadSettings: async () => {
    try {
      set({ isLoading: true });
      
      const response = await fetch('/api/settings');
      if (!response.ok) {
        throw new Error('Failed to load settings');
      }
      
      const settings = await response.json();
      
      // Маппинг полей из API в store
      const fromLang = settings.defaultSourceLang || defaultSettings.fromLang;
      const toLang = settings.defaultTargetLang || defaultSettings.toLang;
      const tone = settings.translationStyle || defaultSettings.tone;
      
      set({
        // Устанавливаем динамические настройки (изначально равны статическим)
        fromLang,
        toLang,
        tone,
        
        // Устанавливаем статические настройки (сохраненные в БД)
        savedFromLang: fromLang,
        savedToLang: toLang,
        savedTone: tone,
        
        // Остальные настройки
        speechRecognitionMode: settings.speechRecognitionMode || defaultSettings.speechRecognitionMode,
        uiLanguage: settings.uiLanguage || defaultSettings.uiLanguage,
        preferredLLM: settings.preferredLLM || defaultSettings.preferredLLM,
        reviewDailyTarget: settings.reviewDailyTarget || defaultSettings.reviewDailyTarget,
        notificationsEnabled: settings.notificationsEnabled || defaultSettings.notificationsEnabled,
        timezone: settings.timezone || defaultSettings.timezone,
        emailNotifications: settings.emailNotifications || defaultSettings.emailNotifications,
        translationReminders: settings.translationReminders || defaultSettings.translationReminders,
        
        isLoading: false,
      });
    } catch (error) {
      console.error('Error loading settings:', error);
      set({ isLoading: false });
    }
  },

  // Reset to default settings
  resetToDefaults: () => {
    set({
      ...defaultSettings,
    });
  },
}));

// Селекторы для динамических настроек (используются в переводчике)
export const useFromLang = () => useSettingsStore((state) => state.fromLang);
export const useToLang = () => useSettingsStore((state) => state.toLang);
export const useTone = () => useSettingsStore((state) => state.tone);

// Селекторы для статических настроек (используются в профиле)
export const useSavedFromLang = () => useSettingsStore((state) => state.savedFromLang);
export const useSavedToLang = () => useSettingsStore((state) => state.savedToLang);
export const useSavedTone = () => useSettingsStore((state) => state.savedTone);

// Остальные селекторы
export const useSpeechRecognitionMode = () => useSettingsStore((state) => state.speechRecognitionMode);
export const useNotificationsEnabled = () => useSettingsStore((state) => state.notificationsEnabled);
export const useEmailNotifications = () => useSettingsStore((state) => state.emailNotifications);
export const useTranslationReminders = () => useSettingsStore((state) => state.translationReminders);
export const useSettingsLoading = () => useSettingsStore((state) => state.isLoading);

// Actions selectors
export const useSwapLanguages = () => useSettingsStore((state) => state.swapLanguages);
export const useLoadSettings = () => useSettingsStore((state) => state.loadSettings);

// Actions для динамических настроек
export const useSetFromLang = () => useSettingsStore((state) => state.setFromLang);
export const useSetToLang = () => useSettingsStore((state) => state.setToLang);
export const useSetTone = () => useSettingsStore((state) => state.setTone);

// Actions для статических настроек (используются редко, в основном при загрузке)
export const useSetSavedFromLang = () => useSettingsStore((state) => state.setSavedFromLang);
export const useSetSavedToLang = () => useSettingsStore((state) => state.setSavedToLang);
export const useSetSavedTone = () => useSettingsStore((state) => state.setSavedTone);

export const useSetSpeechRecognitionMode = () => useSettingsStore((state) => state.setSpeechRecognitionMode);
export const useSetNotificationsEnabled = () => useSettingsStore((state) => state.setNotificationsEnabled);
export const useSetEmailNotifications = () => useSettingsStore((state) => state.setEmailNotifications);
export const useSetTranslationReminders = () => useSettingsStore((state) => state.setTranslationReminders);

// Hook that respects user role for speech recognition mode
export const useEffectiveSpeechRecognitionMode = (isAdmin: boolean = false): SpeechMode => {
  const storedMode = useSpeechRecognitionMode();
  // Force browser mode for non-admin users
  return !isAdmin ? "browser" : (storedMode || "browser");
};
