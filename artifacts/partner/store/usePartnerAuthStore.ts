// ─── Partner Auth Store ───────────────────────────────────────────────────────
import { create } from 'zustand';
import { partnerAuthService } from '@/services/partnerAuthService';
import type { RestaurantPartner } from '@/types/restaurant.types';

interface PartnerAuthState {
  partner: RestaurantPartner | null;
  supabaseUserId: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;

  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setAuthenticatedUser: (userId: string) => void;
  setUnauthenticated: () => void;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, phone?: string) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  loadProfile: (userId: string) => Promise<void>;
  updateLocalPartner: (updates: Partial<RestaurantPartner>) => void;
  initializeAuth: () => Promise<void>;
}

export const usePartnerAuthStore = create<PartnerAuthState>((set, get) => ({
  partner: null,
  supabaseUserId: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  setAuthenticatedUser: (userId) =>
    set({ supabaseUserId: userId, isAuthenticated: true }),

  setUnauthenticated: () =>
    set({ partner: null, supabaseUserId: null, isAuthenticated: false, error: null }),

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { user } = await partnerAuthService.signIn(email, password);
      if (!user) throw new Error('Sign-in failed.');
      const profile = await partnerAuthService.getPartnerProfile(user.id);
      set({ supabaseUserId: user.id, partner: profile, isAuthenticated: true, isLoading: false, error: null });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Login failed.';
      set({ isLoading: false, error: msg });
      throw err;
    }
  },

  register: async (email, password, name, phone) => {
    set({ isLoading: true, error: null });
    try {
      const { user } = await partnerAuthService.signUp(email, password, name, phone);
      if (!user) throw new Error('Sign-up failed.');
      const profile = await partnerAuthService.getPartnerProfile(user.id);
      set({ supabaseUserId: user.id, partner: profile, isAuthenticated: true, isLoading: false, error: null });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Registration failed.';
      set({ isLoading: false, error: msg });
      throw err;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await partnerAuthService.signOut();
    } catch (_) {
      // Ignore errors — reset state regardless
    }
    set({ partner: null, supabaseUserId: null, isAuthenticated: false, isLoading: false, error: null });
  },

  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      await partnerAuthService.forgotPassword(email);
      set({ isLoading: false });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Could not send reset email.';
      set({ isLoading: false, error: msg });
      throw err;
    }
  },

  loadProfile: async (userId) => {
    try {
      const profile = await partnerAuthService.getPartnerProfile(userId);
      if (profile) set({ partner: profile });
    } catch (err) {
      console.warn('[Partner] Failed to load profile:', err);
    }
  },

  updateLocalPartner: (updates) => {
    const current = get().partner;
    if (!current) return;
    set({ partner: { ...current, ...updates } });
  },

  initializeAuth: async () => {
    set({ isLoading: true });
    try {
      const session = await partnerAuthService.getSession();
      if (session?.user) {
        const profile = await partnerAuthService.getPartnerProfile(session.user.id);
        set({ supabaseUserId: session.user.id, partner: profile, isAuthenticated: true, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (_) {
      set({ isLoading: false });
    }
  },
}));
