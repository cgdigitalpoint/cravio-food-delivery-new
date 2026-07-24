import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

const STORAGE_KEY = '@cravio/phase9-engagement';

export interface ViewedRestaurant {
  restaurantId: string;
  viewedAt: string;
}

interface PersistedEngagement {
  favoriteFoodIds: string[];
  viewedRestaurants: ViewedRestaurant[];
}

interface EngagementStoreState {
  favoriteFoodIds: Set<string>;
  viewedRestaurants: ViewedRestaurant[];
  isHydrated: boolean;
  hydrate: () => Promise<void>;
  toggleFoodFavorite: (foodId: string) => Promise<void>;
  isFoodFavorite: (foodId: string) => boolean;
  addRecentlyViewed: (restaurantId: string) => Promise<void>;
  clearRecentlyViewed: () => Promise<void>;
}

async function persist(favoriteFoodIds: Set<string>, viewedRestaurants: ViewedRestaurant[]) {
  const value: PersistedEngagement = {
    favoriteFoodIds: Array.from(favoriteFoodIds),
    viewedRestaurants,
  };
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(value));
}

export const useEngagementStore = create<EngagementStoreState>((set, get) => ({
  favoriteFoodIds: new Set<string>(),
  viewedRestaurants: [],
  isHydrated: false,

  hydrate: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (!raw) {
        set({ isHydrated: true });
        return;
      }
      const parsed = JSON.parse(raw) as Partial<PersistedEngagement>;
      set({
        favoriteFoodIds: new Set(parsed.favoriteFoodIds ?? []),
        viewedRestaurants: parsed.viewedRestaurants ?? [],
        isHydrated: true,
      });
    } catch {
      set({ isHydrated: true });
    }
  },

  toggleFoodFavorite: async (foodId) => {
    const next = new Set(get().favoriteFoodIds);
    if (next.has(foodId)) next.delete(foodId);
    else next.add(foodId);
    set({ favoriteFoodIds: next });
    await persist(next, get().viewedRestaurants);
  },

  isFoodFavorite: (foodId) => get().favoriteFoodIds.has(foodId),

  addRecentlyViewed: async (restaurantId) => {
    const next = [
      { restaurantId, viewedAt: new Date().toISOString() },
      ...get().viewedRestaurants.filter((item) => item.restaurantId !== restaurantId),
    ].slice(0, 12);
    set({ viewedRestaurants: next });
    await persist(get().favoriteFoodIds, next);
  },

  clearRecentlyViewed: async () => {
    set({ viewedRestaurants: [] });
    await persist(get().favoriteFoodIds, []);
  },
}));