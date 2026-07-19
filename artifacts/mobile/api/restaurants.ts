// ─── Restaurant API ───────────────────────────────────────────────────────────
// Phase 1: type-safe stubs. Implement with Supabase client in Phase 2.

import type { Restaurant, MenuItem, Review, Category } from '@/types';
import { apiGet } from './client';
import type { ApiResponse, PaginatedResponse, RequestOptions } from './client';

export interface RestaurantFilters {
  categoryId?: string;
  maxDeliveryFee?: number;
  maxDeliveryTime?: number;
  minRating?: number;
  isOpen?: boolean;
  query?: string;
}

export async function getRestaurants(
  filters?: RestaurantFilters,
  page = 1,
  pageSize = 20,
  options?: RequestOptions
): Promise<ApiResponse<PaginatedResponse<Restaurant>>> {
  return apiGet('/restaurants', options);
}

export async function getRestaurantById(
  id: string,
  options?: RequestOptions
): Promise<ApiResponse<Restaurant>> {
  return apiGet(`/restaurants/${id}`, options);
}

export async function getRestaurantMenu(
  restaurantId: string,
  options?: RequestOptions
): Promise<ApiResponse<MenuItem[]>> {
  return apiGet(`/restaurants/${restaurantId}/menu`, options);
}

export async function getRestaurantReviews(
  restaurantId: string,
  page = 1,
  options?: RequestOptions
): Promise<ApiResponse<PaginatedResponse<Review>>> {
  return apiGet(`/restaurants/${restaurantId}/reviews`, options);
}

export async function getCategories(
  options?: RequestOptions
): Promise<ApiResponse<Category[]>> {
  return apiGet('/categories', options);
}

export async function getFeaturedRestaurants(
  options?: RequestOptions
): Promise<ApiResponse<Restaurant[]>> {
  return apiGet('/restaurants/featured', options);
}

export async function getNearbyRestaurants(
  latitude: number,
  longitude: number,
  radiusKm = 5,
  options?: RequestOptions
): Promise<ApiResponse<Restaurant[]>> {
  return apiGet(
    `/restaurants/nearby?lat=${latitude}&lng=${longitude}&radius=${radiusKm}`,
    options
  );
}
