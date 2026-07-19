// ─── App Store (Zustand) ──────────────────────────────────────────────────────
// Global app-level state: onboarding, theme, version.

import { create } from 'zustand';

type AppTheme = 'light' | 'dark' | 'auto';

interface AppState {
  // Lifecycle
  isInitialized: boolean;
  isOnboardingComplete: boolean;
  isFirstLaunch: boolean;

  // App info
  appVersion: string;
  buildNumber: string;

  // Theme
  theme: AppTheme;

  // Network
  isConnected: boolean;

  // Actions
  setInitialized: (initialized: boolean) => void;
  setOnboardingComplete: (complete: boolean) => void;
  setFirstLaunch: (isFirst: boolean) => void;
  setTheme: (theme: AppTheme) => void;
  setConnected: (connected: boolean) => void;
  reset: () => void;
}

const INITIAL_STATE = {
  isInitialized: false,
  isOnboardingComplete: false,
  isFirstLaunch: true,
  appVersion: '1.0.0',
  buildNumber: '1',
  theme: 'auto' as AppTheme,
  isConnected: true,
};

export const useAppStore = create<AppState>((set) => ({
  ...INITIAL_STATE,

  setInitialized: (isInitialized) => set({ isInitialized }),
  setOnboardingComplete: (isOnboardingComplete) =>
    set({ isOnboardingComplete }),
  setFirstLaunch: (isFirstLaunch) => set({ isFirstLaunch }),
  setTheme: (theme) => set({ theme }),
  setConnected: (isConnected) => set({ isConnected }),
  reset: () => set(INITIAL_STATE),
}));
