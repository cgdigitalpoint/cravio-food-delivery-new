// ─── Orders API ───────────────────────────────────────────────────────────────
// Phase 1: type-safe stubs. Implement with Supabase client in Phase 2.

import type { Order, CartItem, Address, PaymentMethod } from '@/types';
import { apiGet, apiPost, apiPatch } from './client';
import type { ApiResponse, PaginatedResponse, RequestOptions } from './client';

export interface CreateOrderPayload {
  restaurantId: string;
  items: CartItem[];
  deliveryAddressId: string;
  paymentMethod: PaymentMethod;
  promoCode?: string;
  tip?: number;
  notes?: string;
}

export async function createOrder(
  payload: CreateOrderPayload,
  options?: RequestOptions
): Promise<ApiResponse<Order>> {
  return apiPost('/orders', payload, options);
}

export async function getOrders(
  page = 1,
  pageSize = 20,
  options?: RequestOptions
): Promise<ApiResponse<PaginatedResponse<Order>>> {
  return apiGet('/orders', options);
}

export async function getOrderById(
  id: string,
  options?: RequestOptions
): Promise<ApiResponse<Order>> {
  return apiGet(`/orders/${id}`, options);
}

export async function cancelOrder(
  id: string,
  reason?: string,
  options?: RequestOptions
): Promise<ApiResponse<Order>> {
  return apiPatch(`/orders/${id}/cancel`, { reason }, options);
}

export async function rateOrder(
  id: string,
  rating: number,
  comment?: string,
  options?: RequestOptions
): Promise<ApiResponse<void>> {
  return apiPost(`/orders/${id}/review`, { rating, comment }, options);
}
