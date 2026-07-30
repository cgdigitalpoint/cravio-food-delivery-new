// ─── Order Store (Zustand) ────────────────────────────────────────────────────
import { create } from 'zustand';
import { orderService } from '@/services/orderService';
import type { DbOrder, OrderStatus } from '@/types/db.types';

interface OrderStoreState {
  orders: DbOrder[];
  selectedOrder: DbOrder | null;
  isLoading: boolean;
  error: string | null;

  fetchOrders: (userId: string) => Promise<void>;
  fetchOrderById: (orderId: string) => Promise<void>;
  createOrder: (params: Parameters<typeof orderService.createOrder>[0]) => Promise<DbOrder>;
  cancelOrder: (orderId: string) => Promise<void>;
  setSelectedOrder: (order: DbOrder | null) => void;
  clearOrders: () => void;
}

export const useOrderStore = create<OrderStoreState>((set, get) => ({
  orders: [],
  selectedOrder: null,
  isLoading: false,
  error: null,

  fetchOrders: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const orders = await orderService.getOrders(userId);
      set({ orders, isLoading: false });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to load orders.', isLoading: false });
    }
  },

  fetchOrderById: async (orderId) => {
    set({ isLoading: true, error: null });
    try {
      const order = await orderService.getOrderById(orderId);
      set({ selectedOrder: order, isLoading: false });
      // Also update in the list
      if (order) {
        const orders = get().orders.map((o) => (o.id === order.id ? order : o));
        set({ orders });
      }
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to load order.', isLoading: false });
    }
  },

  createOrder: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const order = await orderService.createOrder(params);
      set((state) => ({ orders: [order, ...state.orders], isLoading: false }));
      return order;
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to create order.', isLoading: false });
      throw err;
    }
  },

  cancelOrder: async (orderId) => {
    set({ isLoading: true, error: null });
    try {
      await orderService.cancelOrder(orderId);
      const patch = (o: DbOrder) => o.id === orderId ? { ...o, status: 'cancelled' as OrderStatus } : o;
      set((state) => ({
        orders: state.orders.map(patch),
        selectedOrder: state.selectedOrder?.id === orderId
          ? { ...state.selectedOrder, status: 'cancelled' as OrderStatus }
          : state.selectedOrder,
        isLoading: false,
      }));
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to cancel order.', isLoading: false });
      throw err;
    }
  },

  setSelectedOrder: (order) => set({ selectedOrder: order }),
  clearOrders: () => set({ orders: [], selectedOrder: null, error: null }),
}));
