// ─── Notification Service (Phase 15A) ────────────────────────────────────────
// Provider-independent notification service.
// The INotificationProvider interface isolates the app from any push vendor.
// Swap the provider in Phase 15B (Expo Push / FCM / OneSignal) without
// touching any screen or store.

import type {
  AddNotificationParams,
  CravioNotification,
  NotificationCategory,
  NotificationType,
} from '@/store/useNotificationStore';
import {
  categoryForType,
  NOTIFICATION_MESSAGES,
  NOTIFICATION_TITLES,
} from '@/store/useNotificationStore';

// ── Provider Interface ────────────────────────────────────────────────────────

/**
 * Implement this interface for any push/remote notification provider.
 * The LocalNotificationProvider below is used during development.
 */
export interface INotificationProvider {
  /** Display or enqueue a notification.  Returns a stable delivery ID. */
  deliver(notification: CravioNotification): Promise<string>;
  /** Cancel a previously delivered notification by its delivery ID. */
  cancel(deliveryId: string): Promise<void>;
  /** Request OS permission (no-op for local provider). */
  requestPermission(): Promise<boolean>;
}

// ── Local (dev-only) Provider ─────────────────────────────────────────────────

/**
 * LocalNotificationProvider — no OS permission, no external service.
 * Notifications are delivered purely through the Zustand store.
 * Replace with ExpoNotificationProvider in Phase 15B.
 */
export class LocalNotificationProvider implements INotificationProvider {
  async deliver(_notification: CravioNotification): Promise<string> {
    // Local provider: delivery is handled by the store directly.
    // Return a stub delivery ID.
    return `local_${Date.now()}`;
  }

  async cancel(_deliveryId: string): Promise<void> {
    // No OS notification to cancel in local mode.
  }

  async requestPermission(): Promise<boolean> {
    // Local mode always reports permission granted.
    return true;
  }
}

// ── Notification Service ──────────────────────────────────────────────────────

type StoreDispatch = (params: AddNotificationParams) => void;

export interface CreateNotificationOptions {
  type: NotificationType;
  title?: string;
  message?: string;
  category?: NotificationCategory;
  deepLink?: string;
  payload?: Record<string, string>;
}

class NotificationService {
  private provider: INotificationProvider;
  /** Injected by the store after initialisation (avoids circular import). */
  private dispatch: StoreDispatch | null = null;

  constructor(provider: INotificationProvider) {
    this.provider = provider;
  }

  /**
   * Call once after the Zustand store is ready to wire up delivery.
   * e.g. notificationService.setDispatch(useNotificationStore.getState().addNotification)
   */
  setDispatch(fn: StoreDispatch) {
    this.dispatch = fn;
  }

  /** Swap the underlying provider at runtime (used in tests / Phase 15B setup). */
  setProvider(provider: INotificationProvider) {
    this.provider = provider;
  }

  /** Request OS-level notification permission from the active provider. */
  async requestPermission(): Promise<boolean> {
    return this.provider.requestPermission();
  }

  /**
   * Create and deliver a notification through both the store (in-app)
   * and the active provider (OS/push in Phase 15B).
   */
  async send(options: CreateNotificationOptions): Promise<void> {
    const { type } = options;
    const category = options.category ?? categoryForType(type);
    const title = options.title ?? NOTIFICATION_TITLES[type];
    const message = options.message ?? NOTIFICATION_MESSAGES[type];

    const notification: CravioNotification = {
      id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      type,
      category,
      title,
      message,
      createdAt: new Date().toISOString(),
      read: false,
      deepLink: options.deepLink,
      payload: options.payload,
    };

    // 1. Deliver through OS/push provider
    await this.provider.deliver(notification);

    // 2. Write into Zustand store for in-app Notification Center
    this.dispatch?.({
      type: notification.type,
      category: notification.category,
      title: notification.title,
      message: notification.message,
      deepLink: notification.deepLink,
      payload: notification.payload,
    });
  }

  // ── Convenience helpers ──────────────────────────────────────────────────

  async sendOrderPlaced(payload: { orderId: string; restaurantName: string }) {
    return this.send({
      type: 'order_placed',
      message: `Your order at ${payload.restaurantName} has been placed successfully!`,
      deepLink: `/orders/${payload.orderId}`,
      payload: { orderId: payload.orderId },
    });
  }

  async sendOrderAccepted(payload: { orderId: string; restaurantName: string }) {
    return this.send({
      type: 'order_accepted',
      message: `${payload.restaurantName} has accepted your order and will start preparing it shortly.`,
      deepLink: `/orders/${payload.orderId}`,
      payload: { orderId: payload.orderId },
    });
  }

  async sendPreparing(payload: { orderId: string; restaurantName: string }) {
    return this.send({
      type: 'preparing',
      message: `${payload.restaurantName} is preparing your order.`,
      deepLink: `/orders/${payload.orderId}`,
      payload: { orderId: payload.orderId },
    });
  }

  async sendPickedUp(payload: { orderId: string }) {
    return this.send({
      type: 'picked_up',
      deepLink: `/orders/${payload.orderId}`,
      payload: { orderId: payload.orderId },
    });
  }

  async sendOutForDelivery(payload: { orderId: string }) {
    return this.send({
      type: 'out_for_delivery',
      deepLink: `/orders/${payload.orderId}`,
      payload: { orderId: payload.orderId },
    });
  }

  async sendDelivered(payload: { orderId: string; restaurantName: string }) {
    return this.send({
      type: 'delivered',
      message: `Your order from ${payload.restaurantName} has been delivered. Enjoy your meal!`,
      deepLink: `/orders/${payload.orderId}`,
      payload: { orderId: payload.orderId },
    });
  }

  async sendOffer(payload: { title: string; message: string; offerId?: string }) {
    return this.send({
      type: 'offer',
      title: payload.title,
      message: payload.message,
      deepLink: payload.offerId ? `/offers/${payload.offerId}` : '/home',
      payload: payload.offerId ? { offerId: payload.offerId } : undefined,
    });
  }

  async sendWelcome(payload: { name: string }) {
    return this.send({
      type: 'welcome',
      message: `Hi ${payload.name}! Welcome to Cravio. Explore great restaurants near you.`,
      deepLink: '/home',
    });
  }

  async sendDonationConfirmed(payload: { amount: string }) {
    return this.send({
      type: 'donation_confirmed',
      message: `₹${payload.amount} donation received. Thank you for supporting Hunger Relief!`,
      deepLink: '/donations',
    });
  }
}

// ── Singleton export ──────────────────────────────────────────────────────────

export const notificationService = new NotificationService(new LocalNotificationProvider());
