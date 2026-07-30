// ─── Notification Store (Zustand) ────────────────────────────────────────────
// In-memory + AsyncStorage-persisted notification model.
// No push integration — provider-independent by design (Phase 15A).
// Provider can be swapped in Phase 15B without touching this store.

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ── Category ─────────────────────────────────────────────────────────────────

export type NotificationCategory =
  | 'order'
  | 'offer'
  | 'promotion'
  | 'account'
  | 'system'
  | 'donation';

// ── Type ─────────────────────────────────────────────────────────────────────

export type NotificationType =
  // Order
  | 'order_placed'
  | 'order_accepted'
  | 'preparing'
  | 'picked_up'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  // Offer / Promotion
  | 'offer'
  | 'promotion'
  // Account
  | 'welcome'
  | 'account_update'
  // System
  | 'system'
  // Donation
  | 'donation_confirmed'
  | 'donation_impact';

// ── Model ─────────────────────────────────────────────────────────────────────

export interface CravioNotification {
  id: string;
  type: NotificationType;
  category: NotificationCategory;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  /** Optional deep-link target for navigation on tap */
  deepLink?: string;
  /** Extra payload — e.g. orderId, restaurantId, offerId */
  payload?: Record<string, string>;
}

// ── Defaults ─────────────────────────────────────────────────────────────────

/** Derive category from type automatically */
export function categoryForType(type: NotificationType): NotificationCategory {
  if (
    type === 'order_placed' ||
    type === 'order_accepted' ||
    type === 'preparing' ||
    type === 'picked_up' ||
    type === 'out_for_delivery' ||
    type === 'delivered' ||
    type === 'cancelled'
  ) return 'order';
  if (type === 'offer') return 'offer';
  if (type === 'promotion') return 'promotion';
  if (type === 'welcome' || type === 'account_update') return 'account';
  if (type === 'system') return 'system';
  if (type === 'donation_confirmed' || type === 'donation_impact') return 'donation';
  return 'system';
}

export const NOTIFICATION_TITLES: Record<NotificationType, string> = {
  order_placed: 'Order Placed',
  order_accepted: 'Order Accepted',
  preparing: 'Preparing Your Order',
  picked_up: 'Order Picked Up',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Order Delivered',
  cancelled: 'Order Cancelled',
  offer: 'New Offer for You',
  promotion: 'Promotion',
  welcome: 'Welcome to Cravio!',
  account_update: 'Account Updated',
  system: 'System Alert',
  donation_confirmed: 'Donation Confirmed',
  donation_impact: 'Your Donation Impact',
};

export const NOTIFICATION_MESSAGES: Record<NotificationType, string> = {
  order_placed: 'Your order has been placed successfully!',
  order_accepted: 'Your order has been accepted by the restaurant.',
  preparing: 'The restaurant is preparing your order.',
  picked_up: 'A delivery partner has picked up your order.',
  out_for_delivery: 'Your order is out for delivery.',
  delivered: 'Your order has been delivered. Enjoy your meal!',
  cancelled: 'Your order has been cancelled.',
  offer: 'A new exclusive offer is available for you.',
  promotion: 'Check out what\'s new — limited time event!',
  welcome: 'Glad to have you on board. Explore restaurants near you!',
  account_update: 'Your account information has been updated.',
  system: 'A system update is available.',
  donation_confirmed: 'Your donation has been received. Thank you!',
  donation_impact: 'See how your donations are making a difference.',
};

// ── Persistence ───────────────────────────────────────────────────────────────

const STORAGE_KEY = '@cravio/notifications_v2';
const MAX_PERSISTED = 100; // cap to avoid growing unbounded

function saveToStorage(notifications: CravioNotification[]) {
  const slice = notifications.slice(0, MAX_PERSISTED);
  AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(slice)).catch(() => {});
}

// ── Store ─────────────────────────────────────────────────────────────────────

export type AddNotificationParams = Omit<CravioNotification, 'id' | 'createdAt' | 'read' | 'category'> & {
  category?: NotificationCategory;
};

interface NotificationStoreState {
  notifications: CravioNotification[];
  unreadCount: number;
  _loaded: boolean;

  /** Load persisted notifications from AsyncStorage. Call once at startup. */
  load: () => Promise<void>;
  addNotification: (params: AddNotificationParams) => void;
  markRead: (id: string) => void;
  markUnread: (id: string) => void;
  markAllRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
  /** Legacy alias kept for backward-compat with CheckoutScreen */
  clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationStoreState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  _loaded: false,

  load: async () => {
    if (get()._loaded) return;
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CravioNotification[];
        if (Array.isArray(parsed)) {
          const unreadCount = parsed.filter((n) => !n.read).length;
          set({ notifications: parsed, unreadCount, _loaded: true });
          return;
        }
      }
    } catch {
      // Corrupt storage — fall back to empty
    }
    set({ _loaded: true });
  },

  addNotification: (params) => {
    const type = params.type;
    const category = params.category ?? categoryForType(type);
    const notification: CravioNotification = {
      id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      type,
      category,
      title: params.title ?? NOTIFICATION_TITLES[type],
      message: params.message ?? NOTIFICATION_MESSAGES[type],
      createdAt: new Date().toISOString(),
      read: false,
      deepLink: params.deepLink,
      payload: params.payload,
    };
    set((state) => {
      const notifications = [notification, ...state.notifications];
      const unreadCount = state.unreadCount + 1;
      saveToStorage(notifications);
      return { notifications, unreadCount };
    });
  },

  markRead: (id) => {
    set((state) => {
      const notifications = state.notifications.map((n) =>
        n.id === id && !n.read ? { ...n, read: true } : n,
      );
      const unreadCount = notifications.filter((n) => !n.read).length;
      saveToStorage(notifications);
      return { notifications, unreadCount };
    });
  },

  markUnread: (id) => {
    set((state) => {
      const notifications = state.notifications.map((n) =>
        n.id === id && n.read ? { ...n, read: false } : n,
      );
      const unreadCount = notifications.filter((n) => !n.read).length;
      saveToStorage(notifications);
      return { notifications, unreadCount };
    });
  },

  markAllRead: () => {
    set((state) => {
      const notifications = state.notifications.map((n) => ({ ...n, read: true }));
      saveToStorage(notifications);
      return { notifications, unreadCount: 0 };
    });
  },

  deleteNotification: (id) => {
    set((state) => {
      const notifications = state.notifications.filter((n) => n.id !== id);
      const unreadCount = notifications.filter((n) => !n.read).length;
      saveToStorage(notifications);
      return { notifications, unreadCount };
    });
  },

  clearAll: () => {
    AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
    set({ notifications: [], unreadCount: 0 });
  },

  clearNotifications: () => {
    AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
    set({ notifications: [], unreadCount: 0 });
  },
}));
