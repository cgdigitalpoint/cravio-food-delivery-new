// ─── Cart Service ─────────────────────────────────────────────────────────────
// Persists the user's cart to Supabase so it survives app restarts and
// login/logout cycles.  Sync is intentionally fire-and-forget: the local
// Zustand store is always the source of truth for the UI; remote sync is
// best-effort.
import { supabase } from './supabase';
import type { DbCart } from '@/types/db.types';

export const cartService = {
  /** Fetch all persisted cart rows for a user. */
  async getCartItems(userId: string): Promise<DbCart[]> {
    const { data, error } = await supabase
      .from('cart')
      .select('*')
      .eq('user_id', userId);
    if (error) throw new Error(error.message);
    return (data ?? []) as DbCart[];
  },

  /** Upsert a single cart row (insert or update quantity + metadata). */
  async upsertItem(userId: string, item: Omit<DbCart, 'user_id'>): Promise<void> {
    const { error } = await supabase
      .from('cart')
      .upsert(
        { user_id: userId, ...item },
        { onConflict: 'user_id,food_id' }
      );
    if (error) throw new Error(error.message);
  },

  /** Remove a single food item from the persisted cart. */
  async removeItem(userId: string, foodId: string): Promise<void> {
    const { error } = await supabase
      .from('cart')
      .delete()
      .eq('user_id', userId)
      .eq('food_id', foodId);
    if (error) throw new Error(error.message);
  },

  /** Delete every row in the cart for the given user. */
  async clearCart(userId: string): Promise<void> {
    const { error } = await supabase
      .from('cart')
      .delete()
      .eq('user_id', userId);
    if (error) throw new Error(error.message);
  },
};
