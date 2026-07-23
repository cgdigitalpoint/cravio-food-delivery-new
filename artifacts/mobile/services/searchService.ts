// ─── Search Service ───────────────────────────────────────────────────────────
// Queries Supabase first; falls back to local mock data when DB is empty.

import { supabase } from './supabase';
import {
  CATEGORIES,
  FOOD_ITEMS,
  RESTAURANTS,
  type Category,
  type FoodItem,
  type Restaurant,
} from '@/data/homeData';

export interface SearchResults {
  restaurants: Restaurant[];
  foods: FoodItem[];
  categories: Category[];
}

export interface SearchSuggestion {
  id: string;
  label: string;
  type: 'restaurant' | 'food' | 'category';
  emoji?: string;
}

// ─── Local filter helpers ──────────────────────────────────────────────────────
function filterRestaurantsLocally(q: string): Restaurant[] {
  return RESTAURANTS.filter(
    (r) =>
      r.name.toLowerCase().includes(q) ||
      r.cuisine.toLowerCase().includes(q) ||
      r.category.toLowerCase().includes(q),
  );
}

function filterFoodsLocally(q: string): FoodItem[] {
  return FOOD_ITEMS.filter(
    (f) =>
      f.name.toLowerCase().includes(q) ||
      (f.description ?? '').toLowerCase().includes(q) ||
      f.restaurantName.toLowerCase().includes(q),
  );
}

function filterCategoriesLocally(q: string): Category[] {
  return CATEGORIES.filter((c) => c.name.toLowerCase().includes(q));
}

// ─── Main search ──────────────────────────────────────────────────────────────
export async function searchAll(query: string): Promise<SearchResults> {
  const q = query.toLowerCase().trim();
  if (!q) return { restaurants: [], foods: [], categories: [] };

  try {
    // Attempt Supabase queries in parallel
    const [restaurantsRes, foodsRes] = await Promise.all([
      supabase
        .from('restaurants')
        .select('id,name,cuisine,rating,delivery_time,delivery_fee,image_url,is_open')
        .or(`name.ilike.%${q}%,cuisine.ilike.%${q}%`)
        .limit(20),
      supabase
        .from('foods')
        .select('id,name,description,price,rating,image_url,is_veg')
        .or(`name.ilike.%${q}%,description.ilike.%${q}%`)
        .limit(20),
    ]);

    // Prefer DB data when rows exist, otherwise fall back to local mock data
    const restaurants =
      restaurantsRes.data && restaurantsRes.data.length > 0
        ? (restaurantsRes.data as unknown as Restaurant[])
        : filterRestaurantsLocally(q);

    const foods =
      foodsRes.data && foodsRes.data.length > 0
        ? (foodsRes.data as unknown as FoodItem[])
        : filterFoodsLocally(q);

    const categories = filterCategoriesLocally(q);

    return { restaurants, foods, categories };
  } catch {
    // Network / parse error — serve local results silently
    return {
      restaurants: filterRestaurantsLocally(q),
      foods: filterFoodsLocally(q),
      categories: filterCategoriesLocally(q),
    };
  }
}

// ─── Instant suggestions (local-only, no network round-trip) ─────────────────
export function getSuggestions(query: string): SearchSuggestion[] {
  const q = query.toLowerCase().trim();
  if (!q || q.length < 2) return [];

  const results: SearchSuggestion[] = [];

  RESTAURANTS.filter((r) => r.name.toLowerCase().includes(q)).forEach((r) =>
    results.push({ id: `r-${r.id}`, label: r.name, type: 'restaurant' }),
  );

  FOOD_ITEMS.filter((f) => f.name.toLowerCase().includes(q)).forEach((f) =>
    results.push({ id: `f-${f.id}`, label: f.name, type: 'food' }),
  );

  CATEGORIES.filter((c) => c.name.toLowerCase().includes(q)).forEach((c) =>
    results.push({ id: `c-${c.id}`, label: c.name, type: 'category', emoji: c.emoji }),
  );

  return results.slice(0, 8);
}
