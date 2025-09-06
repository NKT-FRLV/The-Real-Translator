import { create } from 'zustand';
import { LanguageShort, Tone } from '@/shared/config/translation';
import { SpeechMode } from '@/shared/types/settings';

interface UserSettings {
  defaultSourceLang: LanguageShort | null; // LanguageShort
  defaultTargetLang: LanguageShort | null;
  translationStyle: Tone;
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
  isSaving: boolean;
  lastSaved: Date | null;
  
  // Actions
  setDefaultSourceLang: (lang: LanguageShort) => void;
  setDefaultTargetLang: (lang: LanguageShort) => void;
  setTranslationStyle: (style: Tone) => void;
  setSpeechRecognitionMode: (mode: SpeechMode) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  setEmailNotifications: (enabled: boolean) => void;
  setTranslationReminders: (enabled: boolean) => void;
  setUiLanguage: (lang: string) => void;
  setReviewDailyTarget: (target: number | null) => void;
  setTimezone: (timezone: string | null) => void;
  
  // API Actions
  loadSettings: () => Promise<void>;
  saveSettings: () => Promise<void>;
  resetToDefaults: () => void;
}

const defaultSettings: UserSettings = {
  defaultSourceLang: "ru",
  defaultTargetLang: "en",
  translationStyle: "neutral",
  speechRecognitionMode: "browser",
  uiLanguage: null,
  preferredLLM: "kimi-k2:free",
  reviewDailyTarget: null,
  notificationsEnabled: false,
  timezone: null,
  emailNotifications: false,
  translationReminders: false,
};

export const useSettingsStore = create<SettingsState>((set, get) => ({
  // Initial state
  ...defaultSettings,
  isLoading: false,
  isSaving: false,
  lastSaved: null,

  // Individual setters
  setDefaultSourceLang: (lang) => set({ defaultSourceLang: lang }),
  setDefaultTargetLang: (lang) => set({ defaultTargetLang: lang }),
  setTranslationStyle: (style) => set({ translationStyle: style }),
  setSpeechRecognitionMode: (mode) => set({ speechRecognitionMode: mode }),
  setNotificationsEnabled: (enabled) => set({ notificationsEnabled: enabled }),
  setEmailNotifications: (enabled) => set({ emailNotifications: enabled }),
  setTranslationReminders: (enabled) => set({ translationReminders: enabled }),
  setUiLanguage: (lang) => set({ uiLanguage: lang }),
  setReviewDailyTarget: (target) => set({ reviewDailyTarget: target }),
  setTimezone: (timezone) => set({ timezone }),

  // Load settings from API
  loadSettings: async () => {
    try {
      set({ isLoading: true });
      
      const response = await fetch('/api/settings');
      if (!response.ok) {
        throw new Error('Failed to load settings');
      }
      
      const settings = await response.json();
      
      set({
        ...settings,
        // Map additional fields that might not be in DB  
        speechRecognitionMode: settings.speechRecognitionMode || defaultSettings.speechRecognitionMode,
        emailNotifications: settings.emailNotifications || defaultSettings.emailNotifications,
        translationReminders: settings.translationReminders || defaultSettings.translationReminders,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error loading settings:', error);
      set({ isLoading: false });
    }
  },

  // Save settings to API
  saveSettings: async () => {
    try {
      set({ isSaving: true });
      
      const state = get();
      const settingsToSave = {
        defaultSourceLang: state.defaultSourceLang,
        defaultTargetLang: state.defaultTargetLang,
        translationStyle: state.translationStyle,
        speechRecognitionMode: state.speechRecognitionMode,
        uiLanguage: state.uiLanguage,
        preferredLLM: state.preferredLLM,
        reviewDailyTarget: state.reviewDailyTarget,
        notificationsEnabled: state.notificationsEnabled,
        timezone: state.timezone,
        // Additional UI settings
        emailNotifications: state.emailNotifications,
        translationReminders: state.translationReminders,
      };

      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settingsToSave),
      });

      if (!response.ok) {
        throw new Error('Failed to save settings');
      }

      set({ 
        isSaving: false, 
        lastSaved: new Date() 
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      set({ isSaving: false });
      throw error; // Re-throw to handle in UI
    }
  },

  // Reset to default settings
  resetToDefaults: () => {
    set({
      ...defaultSettings,
      lastSaved: null,
    });
  },
}));

// Селекторы для оптимизации ререндеров
export const useDefaultSourceLang = () => useSettingsStore((state) => state.defaultSourceLang);
export const useDefaultTargetLang = () => useSettingsStore((state) => state.defaultTargetLang);
export const useTranslationStyle = () => useSettingsStore((state) => state.translationStyle);
export const useSpeechRecognitionMode = () => useSettingsStore((state) => state.speechRecognitionMode);
export const useNotificationsEnabled = () => useSettingsStore((state) => state.notificationsEnabled);
export const useEmailNotifications = () => useSettingsStore((state) => state.emailNotifications);
export const useTranslationReminders = () => useSettingsStore((state) => state.translationReminders);
export const useSettingsLoading = () => useSettingsStore((state) => state.isLoading);
export const useSettingsSaving = () => useSettingsStore((state) => state.isSaving);
export const useLastSaved = () => useSettingsStore((state) => state.lastSaved);

// Actions selectors
export const useLoadSettings = () => useSettingsStore((state) => state.loadSettings);
export const useSaveSettings = () => useSettingsStore((state) => state.saveSettings);
export const useSetDefaultSourceLang = () => useSettingsStore((state) => state.setDefaultSourceLang);
export const useSetDefaultTargetLang = () => useSettingsStore((state) => state.setDefaultTargetLang);
export const useSetTranslationStyle = () => useSettingsStore((state) => state.setTranslationStyle);
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
