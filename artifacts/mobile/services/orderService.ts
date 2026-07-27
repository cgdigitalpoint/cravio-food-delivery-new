// ─── Order Service ────────────────────────────────────────────────────────────
import { supabase } from './supabase';
import type { DbOrder, DbOrderItem, OrderStatus } from '@/types/db.types';

export const orderService = {
  /** Fetch all orders for a user, newest first. */
  async getOrders(userId: string): Promise<DbOrder[]> {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []) as DbOrder[];
  },

  /** Fetch a single order with its items. */
  async getOrderById(orderId: string): Promise<DbOrder | null> {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .eq('id', orderId)
      .single();
    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(error.message);
    }
    return data as DbOrder;
  },

  /** Create a new order and its items in a single call. */
  async createOrder(params: {
    userId: string;
    restaurantId: string;
    restaurantName: string;
    addressId: string;
    total: number;
    paymentMethod: string;
    donationAmount?: number;
    items: Array<{ foodId: string; foodName: string; foodImage: string; quantity: number; price: number }>;
  }): Promise<DbOrder> {
    if (!params.userId) throw new Error('Your session has expired. Please sign in again.');
    if (!params.addressId) throw new Error('Please select a delivery address before placing your order.');
    if (!params.restaurantId) throw new Error('The restaurant could not be identified. Please return to the menu and try again.');
    if (params.items.length === 0) throw new Error('Your cart is empty. Add an item before placing your order.');

    // Order creation is intentionally one database transaction. The SQL function
    // also validates the authenticated user and address, so the client cannot
    // create an order with a different user's data or leave orphan rows behind.
    const rpcParams = {
      p_restaurant_id: params.restaurantId,
      p_restaurant_name: params.restaurantName,
      p_address_id: params.addressId,
      p_total: params.total,
      // COD is the only supported payment method in this phase.
      p_payment_method: 'Cash on Delivery',
      p_items: params.items.map((item) => ({
        foodId: item.foodId,
        foodName: item.foodName,
        foodImage: item.foodImage,
        quantity: item.quantity,
        price: item.price,
      })),
    };
    const donationAmount = Math.max(0, params.donationAmount ?? 0);
    const { data, error } = donationAmount > 0
      ? await supabase.rpc('create_order_with_donation', {
          ...rpcParams,
          p_donation_amount: donationAmount,
        })
      : await supabase.rpc('create_order_with_items', rpcParams);

    if (error) {
      throw new Error(formatOrderError(error.message));
    }
    if (!data) throw new Error('The order was not returned by Supabase. Please try again.');
    return data as DbOrder;
  },

  /** Update an order's status. */
  async updateStatus(orderId: string, status: OrderStatus): Promise<void> {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);
    if (error) throw new Error(error.message);
  },
};

function formatOrderError(message: string): string {
  const normalized = message.toLowerCase();
  if (normalized.includes('not authenticated') || normalized.includes('jwt')) {
    return 'Your session has expired. Please sign in again.';
  }
  if (normalized.includes('address')) {
    return 'That delivery address is no longer available. Please select another address.';
  }
  if (normalized.includes('function') && normalized.includes('does not exist')) {
    return 'Order service is not configured yet. Run the SQL migration in services/schema.sql, then try again.';
  }
  if (normalized.includes('network') || normalized.includes('fetch')) {
    return 'Network connection failed. Check your internet connection and try again.';
  }
  return `We could not place your order: ${message}`;
}
