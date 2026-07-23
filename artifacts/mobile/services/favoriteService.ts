// ─── Favorite Service ─────────────────────────────────────────────────────────
import { supabase } from './supabase';
import type { DbFavorite } from '@/types/db.types';

export const favoriteService = {
  /** Get all favorites for a user. */
  async getFavorites(userId: string): Promise<DbFavorite[]> {
    const { data, error } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', userId);
    if (error) throw new Error(error.message);
    return (data ?? []) as DbFavorite[];
  },

  /** Add a restaurant to favorites. */
  async addFavorite(userId: string, restaurantId: string): Promise<DbFavorite> {
    const { data, error } = await supabase
      .from('favorites')
      .insert({ user_id: userId, restaurant_id: restaurantId })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as DbFavorite;
  },

  /** Remove a restaurant from favorites. */
  async removeFavorite(userId: string, restaurantId: string): Promise<void> {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('restaurant_id', restaurantId);
    if (error) throw new Error(error.message);
  },

  /** Check if a restaurant is in the user's favorites. */
  async isFavorite(userId: string, restaurantId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('restaurant_id', restaurantId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data !== null;
  },
};
