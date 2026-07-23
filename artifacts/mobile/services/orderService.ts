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
    total: number;
    paymentMethod: string;
    items: Array<{ foodId: string; foodName: string; foodImage: string; quantity: number; price: number }>;
  }): Promise<DbOrder> {
    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        user_id: params.userId,
        restaurant_id: params.restaurantId,
        restaurant_name: params.restaurantName,
        status: 'pending' as OrderStatus,
        total: params.total,
        payment_method: params.paymentMethod,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();
    if (error) throw new Error(error.message);

    const items: Omit<DbOrderItem, 'id'>[] = params.items.map((item) => ({
      order_id: (order as DbOrder).id,
      food_id: item.foodId,
      food_name: item.foodName,
      food_image: item.foodImage,
      quantity: item.quantity,
      price: item.price,
    }));

    const { error: itemsError } = await supabase.from('order_items').insert(items);
    if (itemsError) throw new Error(itemsError.message);

    return order as DbOrder;
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
