// ─── Push Provider Abstraction (Phase 15B) ───────────────────────────────────
// Provider-independent interface for any push notification vendor.
// Supported future providers: Expo Push Notifications, Firebase Cloud Messaging
// (FCM), OneSignal. No provider is integrated here — only the contract and a
// no-op placeholder base class.
//
// To integrate a real provider in a future phase:
//   1. Import this file.
//   2. Extend AbstractPushProvider and implement every method.
//   3. Call notificationService.setProvider(new YourProvider()) at app startup.

import type { INotificationProvider } from '@/services/notificationService';
import type { CravioNotification } from '@/store/useNotificationStore';

// ── Token ─────────────────────────────────────────────────────────────────────

/** A device push token returned by the underlying OS/vendor. */
export interface PushToken {
  /** Raw token string (FCM registration token, Expo push token, etc.) */
  value: string;
  /** Which provider issued this token */
  provider: PushProviderName;
  /** ISO-8601 timestamp of when the token was obtained */
  obtainedAt: string;
}

/** Supported push provider names (no SDK installed yet). */
export type PushProviderName = 'expo' | 'fcm' | 'onesignal' | 'local';

// ── Topic ─────────────────────────────────────────────────────────────────────

/** A logical channel users can subscribe/unsubscribe from. */
export type PushTopic =
  | 'order_updates'
  | 'offers'
  | 'promotions'
  | 'system'
  | 'donations';

// ── Local notification payload ────────────────────────────────────────────────

/** Payload for triggering a device-local (OS-scheduled) notification. */
export interface LocalNotificationPayload {
  title: string;
  body: string;
  /** Seconds from now before the notification fires (0 = immediate). */
  delaySeconds?: number;
  /** Custom data attached to the notification tap. */
  data?: Record<string, string>;
}

// ── Extended provider interface ───────────────────────────────────────────────

/**
 * IPushProvider extends the Phase 15A INotificationProvider with the full
 * surface area needed for a real push notification vendor.
 *
 * Methods may have placeholder implementations until a real provider is wired.
 */
export interface IPushProvider extends INotificationProvider {
  /** Identifier for this provider — used for logging and token storage. */
  readonly providerName: PushProviderName;

  /**
   * Register this device with the push provider.
   * Obtains an OS push token and stores it for later use.
   * MUST be called after permission is granted.
   *
   * @returns The obtained PushToken, or null if registration is not possible.
   */
  registerDevice(): Promise<PushToken | null>;

  /**
   * Return the last known push token for this device.
   * Returns null if registerDevice has not been called or failed.
   */
  getPushToken(): Promise<PushToken | null>;

  /**
   * Subscribe this device to a named topic so the backend can target
   * topic-based broadcasts (e.g. "offers", "order_updates").
   */
  subscribeTopic(topic: PushTopic): Promise<void>;

  /**
   * Unsubscribe this device from a named topic.
   */
  unsubscribeTopic(topic: PushTopic): Promise<void>;

  /**
   * Schedule or immediately display a device-local (OS) notification.
   * Does NOT require a server — the notification is generated on-device.
   *
   * @returns A stable notification identifier for later cancellation.
   */
  sendLocalNotification(payload: LocalNotificationPayload): Promise<string>;
}

// ── Abstract base class ───────────────────────────────────────────────────────

/**
 * AbstractPushProvider — placeholder base class with no-op implementations.
 *
 * Extend this class when integrating a real provider. Override only the
 * methods that the provider SDK supports; the rest stay as safe no-ops.
 *
 * Example (future phase):
 *   export class ExpoPushProvider extends AbstractPushProvider { ... }
 *   export class FCMPushProvider  extends AbstractPushProvider { ... }
 */
export abstract class AbstractPushProvider implements IPushProvider {
  abstract readonly providerName: PushProviderName;

  // ── INotificationProvider ────────────────────────────────────────────────

  /** Deliver a CravioNotification. Override to call provider SDK. */
  async deliver(_notification: CravioNotification): Promise<string> {
    // Placeholder — real provider sends via SDK here.
    return `${this.providerName}_${Date.now()}`;
  }

  /** Cancel a delivered notification by its ID. */
  async cancel(_deliveryId: string): Promise<void> {
    // Placeholder — real provider cancels via SDK here.
  }

  /** Request OS notification permission. Override to call the OS dialog. */
  async requestPermission(): Promise<boolean> {
    // Placeholder — real provider calls Permissions.requestAsync() or equivalent.
    return false;
  }

  // ── IPushProvider ─────────────────────────────────────────────────────────

  /** Register device with the push provider. Override in real provider. */
  async registerDevice(): Promise<PushToken | null> {
    // Placeholder — real provider calls SDK.getDevicePushTokenAsync() or equivalent.
    return null;
  }

  /** Return last-known push token. Override in real provider. */
  async getPushToken(): Promise<PushToken | null> {
    // Placeholder — real provider reads from OS/SDK cache.
    return null;
  }

  /** Subscribe to a topic. Override in real provider (FCM / OneSignal). */
  async subscribeTopic(_topic: PushTopic): Promise<void> {
    // Placeholder — FCM: messaging().subscribeToTopic(topic)
    // OneSignal: OneSignal.sendTag(topic, 'true')
  }

  /** Unsubscribe from a topic. Override in real provider. */
  async unsubscribeTopic(_topic: PushTopic): Promise<void> {
    // Placeholder — FCM: messaging().unsubscribeFromTopic(topic)
  }

  /** Send a device-local OS notification. Override in real provider. */
  async sendLocalNotification(_payload: LocalNotificationPayload): Promise<string> {
    // Placeholder — Expo: Notifications.scheduleNotificationAsync(...)
    // FCM: firebase.notifications().displayNotification(...)
    return `local_placeholder_${Date.now()}`;
  }
}

// ── No-op placeholder provider ────────────────────────────────────────────────

/**
 * PlaceholderPushProvider — drop-in stub for Phase 15B.
 * Safe to use until a real provider SDK is integrated.
 * All methods are no-ops; no network calls, no OS dialogs.
 */
export class PlaceholderPushProvider extends AbstractPushProvider {
  readonly providerName: PushProviderName = 'local';
}
