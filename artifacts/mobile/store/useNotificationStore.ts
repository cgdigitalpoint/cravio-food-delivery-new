// ─── Notification Store (Zustand) ────────────────────────────────────────────
// In-memory notification model — no push integration yet.
// Notifications are generated locally on order state changes.

import { create } from 'zustand';

export type NotificationType =
  | 'order_placed'
  | 'order_accepted'
  | 'preparing'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface CravioNotification {
  id: string;
  type: NotificationType;
  orderId: string;
  orderNumber: string;
  restaurantName: string;
  message: string;
  createdAt: string;
  read: boolean;
}

interface NotificationStoreState {
  notifications: CravioNotification[];
  unreadCount: number;

  addNotification: (params: Omit<CravioNotification, 'id' | 'createdAt' | 'read'>) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  clearNotifications: () => void;
}

const NOTIFICATION_MESSAGES: Record<NotificationType, string> = {
  order_placed: 'Your order has been placed successfully!',
  order_accepted: 'Your order has been accepted by the restaurant.',
  preparing: 'The restaurant is preparing your order.',
  out_for_delivery: 'Your order is out for delivery.',
  delivered: 'Your order has been delivered. Enjoy your meal!',
  cancelled: 'Your order has been cancelled.',
};

export const useNotificationStore = create<NotificationStoreState>((set, get) => ({
  notifications: [],
  unreadCount: 0,

  addNotification: (params) => {
    const notification: CravioNotification = {
      ...params,
      id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      message: params.message || NOTIFICATION_MESSAGES[params.type],
      createdAt: new Date().toISOString(),
      read: false,
    };
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));
  },

  markRead: (id) => {
    set((state) => {
      const notifications = state.notifications.map((n) =>
        n.id === id && !n.read ? { ...n, read: true } : n,
      );
      const unreadCount = notifications.filter((n) => !n.read).length;
      return { notifications, unreadCount };
    });
  },

  markAllRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    }));
  },

  clearNotifications: () => set({ notifications: [], unreadCount: 0 }),
}));
