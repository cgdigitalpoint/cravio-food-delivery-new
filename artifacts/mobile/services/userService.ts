// ─── User Profile Service ─────────────────────────────────────────────────────
import { supabase } from './supabase';
import type { DbUser } from '@/types/db.types';

export const userService = {
  /** Fetch the profile row for a given user ID. */
  async getProfile(userId: string): Promise<DbUser | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw new Error(error.message);
    }
    return data as DbUser;
  },

  /** Update the authenticated user's profile fields. */
  async updateProfile(userId: string, updates: Partial<Omit<DbUser, 'id' | 'created_at'>>) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as DbUser;
  },

  /** Upsert a profile row (used after OAuth or first sign-in). */
  async upsertProfile(profile: Partial<DbUser> & { id: string }) {
    const { data, error } = await supabase
      .from('users')
      .upsert(profile)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as DbUser;
  },
};
