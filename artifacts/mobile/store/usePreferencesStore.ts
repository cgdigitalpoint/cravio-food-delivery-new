// ─── Preferences Store ────────────────────────────────────────────────────────
// Persists user-controlled app preferences to AsyncStorage so they survive
// app restarts.  Call load() once from _layout.tsx on startup.

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@cravio/preferences_v1';

export type AppTheme = 'light' | 'dark' | 'auto';

export interface NotificationPrefs {
  orderUpdates: boolean;
  offers: boolean;
  promotions: boolean;
  donations: boolean;
}

interface PreferencesState {
  // Notification preferences
  notifications: NotificationPrefs;
  // App appearance
  theme: AppTheme;
  // Language (future-ready; English only for now)
  language: string;
  // Whether AsyncStorage has been loaded
  _loaded: boolean;

  setNotificationPref: (key: keyof NotificationPrefs, value: boolean) => void;
  setTheme: (theme: AppTheme) => void;
  setLanguage: (lang: string) => void;
  /** Load persisted preferences from AsyncStorage. Call once on app startup. */
  load: () => Promise<void>;
}

const DEFAULT_NOTIFICATIONS: NotificationPrefs = {
  orderUpdates: true,
  offers: true,
  promotions: false,
  donations: true,
};

function persist(state: Pick<PreferencesState, 'notifications' | 'theme' | 'language'>) {
  AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {});
}

export const usePreferencesStore = create<PreferencesState>((set, get) => ({
  notifications: DEFAULT_NOTIFICATIONS,
  theme: 'auto',
  language: 'en',
  _loaded: false,

  setNotificationPref: (key, value) => {
    const notifications = { ...get().notifications, [key]: value };
    set({ notifications });
    persist({ notifications, theme: get().theme, language: get().language });
  },

  setTheme: (theme) => {
    set({ theme });
    persist({ notifications: get().notifications, theme, language: get().language });
  },

  setLanguage: (language) => {
    set({ language });
    persist({ notifications: get().notifications, theme: get().theme, language });
  },

  load: async () => {
    if (get()._loaded) return;
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<{
          notifications: NotificationPrefs;
          theme: AppTheme;
          language: string;
        }>;
        set({
          notifications: { ...DEFAULT_NOTIFICATIONS, ...(parsed.notifications ?? {}) },
          theme: parsed.theme ?? 'auto',
          language: parsed.language ?? 'en',
        });
      }
    } catch {
      // Corrupt data — fall back to defaults
    } finally {
      set({ _loaded: true });
    }
  },
}));
