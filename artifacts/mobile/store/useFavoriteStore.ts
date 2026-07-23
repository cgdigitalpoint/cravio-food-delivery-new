// ─── Favorite Store (Zustand) ─────────────────────────────────────────────────
import { create } from 'zustand';
import { favoriteService } from '@/services/favoriteService';
import type { DbFavorite } from '@/types/db.types';

interface FavoriteStoreState {
  favorites: DbFavorite[];
  favoriteIds: Set<string>; // restaurantIds for O(1) lookup
  isLoading: boolean;
  error: string | null;

  fetchFavorites: (userId: string) => Promise<void>;
  addFavorite: (userId: string, restaurantId: string) => Promise<void>;
  removeFavorite: (userId: string, restaurantId: string) => Promise<void>;
  toggleFavorite: (userId: string, restaurantId: string) => Promise<void>;
  isFavorite: (restaurantId: string) => boolean;
  clearFavorites: () => void;
}

export const useFavoriteStore = create<FavoriteStoreState>((set, get) => ({
  favorites: [],
  favoriteIds: new Set(),
  isLoading: false,
  error: null,

  fetchFavorites: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const favorites = await favoriteService.getFavorites(userId);
      const favoriteIds = new Set(favorites.map((f) => f.restaurant_id));
      set({ favorites, favoriteIds, isLoading: false });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to load favorites.', isLoading: false });
    }
  },

  addFavorite: async (userId, restaurantId) => {
    // Optimistic update
    const prev = get().favorites;
    const prevIds = new Set(get().favoriteIds);
    const temp: DbFavorite = { id: `temp_${Date.now()}`, user_id: userId, restaurant_id: restaurantId };
    prevIds.add(restaurantId);
    set({ favorites: [...prev, temp], favoriteIds: prevIds });

    try {
      const fav = await favoriteService.addFavorite(userId, restaurantId);
      set((state) => ({
        favorites: state.favorites.map((f) => (f.id === temp.id ? fav : f)),
      }));
    } catch (err) {
      // Rollback
      set({ favorites: prev, favoriteIds: new Set(Array.from(prevIds).filter((id) => id !== restaurantId)) });
      throw err;
    }
  },

  removeFavorite: async (userId, restaurantId) => {
    const prev = get().favorites;
    const prevIds = new Set(get().favoriteIds);
    prevIds.delete(restaurantId);
    set({
      favorites: prev.filter((f) => f.restaurant_id !== restaurantId),
      favoriteIds: prevIds,
    });

    try {
      await favoriteService.removeFavorite(userId, restaurantId);
    } catch (err) {
      set({ favorites: prev, favoriteIds: new Set([...prevIds, restaurantId]) });
      throw err;
    }
  },

  toggleFavorite: async (userId, restaurantId) => {
    const { isFavorite, addFavorite, removeFavorite } = get();
    if (isFavorite(restaurantId)) {
      await removeFavorite(userId, restaurantId);
    } else {
      await addFavorite(userId, restaurantId);
    }
  },

  isFavorite: (restaurantId) => get().favoriteIds.has(restaurantId),
  clearFavorites: () => set({ favorites: [], favoriteIds: new Set(), error: null }),
}));
