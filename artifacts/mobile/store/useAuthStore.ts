// ─── Auth Store (Zustand) ─────────────────────────────────────────────────────
import { create } from 'zustand';
import { authService } from '@/services/authService';
import { userService } from '@/services/userService';
import type { DbUser } from '@/types/db.types';

interface AuthStoreState {
  // State
  user: DbUser | null;
  supabaseUserId: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;

  // Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  /** Called by _layout.tsx on auth state change — syncs session without fetching profile. */
  setAuthenticatedUser: (userId: string) => void;
  setUnauthenticated: () => void;

  /** Full sign-in: auth + profile fetch. */
  login: (email: string, password: string) => Promise<void>;

  /** Full sign-up: auth + profile insert. */
  register: (email: string, password: string, name: string, phone?: string) => Promise<void>;

  /** Sign out and reset state. */
  logout: () => Promise<void>;

  /** Send forgot-password email. */
  forgotPassword: (email: string) => Promise<void>;

  /** Load profile from DB after session is established. */
  loadProfile: (userId: string) => Promise<void>;

  /** Update local user data after profile edit. */
  updateLocalUser: (updates: Partial<DbUser>) => void;

  /** Initialize from persisted Supabase session. */
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthStoreState>((set, get) => ({
  user: null,
  supabaseUserId: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  setAuthenticatedUser: (userId) =>
    set({ supabaseUserId: userId, isAuthenticated: true }),

  setUnauthenticated: () =>
    set({ user: null, supabaseUserId: null, isAuthenticated: false, error: null }),

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { user: authUser } = await authService.signIn(email, password);
      if (!authUser) throw new Error('Sign-in failed — no user returned.');
      const profile = await userService.getProfile(authUser.id);
      set({
        supabaseUserId: authUser.id,
        user: profile,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Login failed.';
      set({ isLoading: false, error: msg });
      throw err;
    }
  },

  register: async (email, password, name, phone) => {
    set({ isLoading: true, error: null });
    try {
      const { user: authUser } = await authService.signUp(email, password, name, phone);
      if (!authUser) throw new Error('Sign-up failed — no user returned.');
      const profile = await userService.getProfile(authUser.id);
      set({
        supabaseUserId: authUser.id,
        user: profile,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Registration failed.';
      set({ isLoading: false, error: msg });
      throw err;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await authService.signOut();
    } catch (_) {
      // Ignore sign-out errors — clear state regardless
    }
    set({
      user: null,
      supabaseUserId: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  },

  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      await authService.forgotPassword(email);
      set({ isLoading: false });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Could not send reset email.';
      set({ isLoading: false, error: msg });
      throw err;
    }
  },

  loadProfile: async (userId) => {
    try {
      const profile = await userService.getProfile(userId);
      if (profile) set({ user: profile });
    } catch (err) {
      console.warn('[Cravio] Failed to load profile:', err);
    }
  },

  updateLocalUser: (updates) => {
    const current = get().user;
    if (!current) return;
    set({ user: { ...current, ...updates } });
  },

  initializeAuth: async () => {
    set({ isLoading: true });
    try {
      const session = await authService.getSession();
      if (session?.user) {
        const profile = await userService.getProfile(session.user.id);
        set({
          supabaseUserId: session.user.id,
          user: profile,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch (_) {
      set({ isLoading: false });
    }
  },
}));
