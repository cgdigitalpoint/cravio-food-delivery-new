// ─── User Profile Store (Zustand) ─────────────────────────────────────────────
import { create } from 'zustand';
import { userService } from '@/services/userService';
import type { DbUser } from '@/types/db.types';

interface UserStoreState {
  profile: DbUser | null;
  isLoading: boolean;
  error: string | null;

  fetchProfile: (userId: string) => Promise<void>;
  updateProfile: (userId: string, updates: Partial<Omit<DbUser, 'id' | 'created_at'>>) => Promise<void>;
  setProfile: (profile: DbUser | null) => void;
  clearProfile: () => void;
}

export const useUserStore = create<UserStoreState>((set) => ({
  profile: null,
  isLoading: false,
  error: null,

  fetchProfile: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const profile = await userService.getProfile(userId);
      set({ profile, isLoading: false });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to load profile.', isLoading: false });
    }
  },

  updateProfile: async (userId, updates) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await userService.updateProfile(userId, updates);
      set({ profile: updated, isLoading: false });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to update profile.', isLoading: false });
      throw err;
    }
  },

  setProfile: (profile) => set({ profile }),
  clearProfile: () => set({ profile: null, error: null }),
}));
