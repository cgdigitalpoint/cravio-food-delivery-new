// ─── Auth Store (Zustand) ─────────────────────────────────────────────────────
// Manages authentication state: user session, loading, errors.

import { create } from 'zustand';
import type { User, AppSession } from '@/types';

interface AuthStoreState {
  user: User | null;
  session: AppSession | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;

  // Actions
  setUser: (user: User | null) => void;
  setSession: (session: AppSession | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  signIn: (user: User, session: AppSession) => void;
  signOut: () => void;
  updateUser: (updates: Partial<User>) => void;
}

export const useAuthStore = create<AuthStoreState>((set, get) => ({
  user: null,
  session: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,

  setUser: (user) => set({ user, isAuthenticated: user !== null }),
  setSession: (session) => set({ session }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  signIn: (user, session) =>
    set({ user, session, isAuthenticated: true, error: null }),

  signOut: () =>
    set({
      user: null,
      session: null,
      isAuthenticated: false,
      error: null,
    }),

  updateUser: (updates) => {
    const current = get().user;
    if (!current) return;
    set({ user: { ...current, ...updates } });
  },
}));
