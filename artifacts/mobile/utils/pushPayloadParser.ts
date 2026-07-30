// ─── Push Payload Parser (Phase 15B) ─────────────────────────────────────────
// Parses raw push notification data payloads (as received from FCM, Expo Push,
// or OneSignal) into strongly-typed Cravio domain objects.
//
// No backend integration. No navigation. Parsing only.
//
// Typical usage in a push tap handler (future phase):
//   const parsed = parsePushPayload(remoteMessage.data);
//   if (parsed.kind === 'order_details') {
//     router.push(`/orders/${parsed.orderId}`);
//   }

import type { NotificationType, NotificationCategory } from '@/store/useNotificationStore';

// ── Raw payload shape ─────────────────────────────────────────────────────────

/**
 * The raw key-value string map that arrives inside a push notification.
 * FCM, Expo, and OneSignal all deliver data as Record<string, string>.
 */
export type RawPushData = Record<string, string | undefined>;

// ── Typed payload variants ────────────────────────────────────────────────────

export interface OrderDetailsPayload {
  kind: 'order_details';
  orderId: string;
  notificationType: NotificationType;
  category: 'order';
  title: string;
  body: string;
  deepLink: string;
}

export interface RestaurantPayload {
  kind: 'restaurant';
  restaurantId: string;
  restaurantName: string | null;
  notificationType: NotificationType;
  category: 'offer' | 'promotion';
  title: string;
  body: string;
  deepLink: string;
}

export interface OfferPayload {
  kind: 'offer';
  offerId: string | null;
  promoCode: string | null;
  notificationType: NotificationType;
  category: 'offer' | 'promotion';
  title: string;
  body: string;
  deepLink: string;
}

export interface ProfilePayload {
  kind: 'profile';
  notificationType: NotificationType;
  category: 'account';
  title: string;
  body: string;
  deepLink: string;
}

export interface SettingsPayload {
  kind: 'settings';
  settingsTarget: 'notification-preferences' | 'account' | 'general';
  notificationType: NotificationType;
  category: 'account' | 'system';
  title: string;
  body: string;
  deepLink: string;
}

export interface SystemPayload {
  kind: 'system';
  notificationType: NotificationType;
  category: NotificationCategory;
  title: string;
  body: string;
  deepLink: string;
}

/** Discriminated union of all parsed push payload types. */
export type ParsedPushPayload =
  | OrderDetailsPayload
  | RestaurantPayload
  | OfferPayload
  | ProfilePayload
  | SettingsPayload
  | SystemPayload;

// ── Parser ────────────────────────────────────────────────────────────────────

/**
 * Parse raw push notification data into a typed ParsedPushPayload.
 *
 * The function is tolerant of missing/malformed fields: it always returns
 * a valid object (falling back to 'system' kind if the data is unrecognisable).
 *
 * Expected raw keys (all strings):
 *   - `kind`          : payload kind discriminant
 *   - `type`          : NotificationType (e.g. 'order_placed')
 *   - `category`      : NotificationCategory (e.g. 'order')
 *   - `title`         : notification title string
 *   - `body`          : notification body/message string
 *   - `deepLink`      : in-app navigation target (e.g. '/orders/ABC123')
 *   - `orderId`       : (order payloads) order identifier
 *   - `restaurantId`  : (restaurant payloads) restaurant identifier
 *   - `restaurantName`: (restaurant payloads) display name
 *   - `offerId`       : (offer payloads) offer identifier
 *   - `promoCode`     : (offer payloads) promo code string
 *   - `settingsTarget`: (settings payloads) sub-screen target
 */
export function parsePushPayload(data: RawPushData): ParsedPushPayload {
  const kind = data['kind'] ?? '';
  const title = data['title'] ?? 'Cravio';
  const body = data['body'] ?? '';
  const deepLink = data['deepLink'] ?? '/home';
  const rawType = (data['type'] ?? 'system') as NotificationType;
  const rawCategory = (data['category'] ?? 'system') as NotificationCategory;

  // ── Order Details ──────────────────────────────────────────────────────────
  if (kind === 'order_details') {
    const orderId = data['orderId'] ?? '';
    return {
      kind: 'order_details',
      orderId,
      notificationType: rawType,
      category: 'order',
      title,
      body,
      deepLink: orderId ? `/orders/${orderId}` : deepLink,
    };
  }

  // ── Restaurant ─────────────────────────────────────────────────────────────
  if (kind === 'restaurant') {
    const restaurantId = data['restaurantId'] ?? '';
    return {
      kind: 'restaurant',
      restaurantId,
      restaurantName: data['restaurantName'] ?? null,
      notificationType: rawType,
      category: rawCategory === 'promotion' ? 'promotion' : 'offer',
      title,
      body,
      deepLink: restaurantId ? `/restaurant/${restaurantId}` : deepLink,
    };
  }

  // ── Offer ──────────────────────────────────────────────────────────────────
  if (kind === 'offer') {
    const offerId = data['offerId'] ?? null;
    return {
      kind: 'offer',
      offerId,
      promoCode: data['promoCode'] ?? null,
      notificationType: rawType,
      category: rawCategory === 'promotion' ? 'promotion' : 'offer',
      title,
      body,
      deepLink: offerId ? `/offers/${offerId}` : '/home',
    };
  }

  // ── Profile ────────────────────────────────────────────────────────────────
  if (kind === 'profile') {
    return {
      kind: 'profile',
      notificationType: rawType,
      category: 'account',
      title,
      body,
      deepLink: '/profile',
    };
  }

  // ── Settings ───────────────────────────────────────────────────────────────
  if (kind === 'settings') {
    const rawTarget = data['settingsTarget'] ?? 'general';
    const settingsTarget: SettingsPayload['settingsTarget'] =
      rawTarget === 'notification-preferences' ? 'notification-preferences'
      : rawTarget === 'account' ? 'account'
      : 'general';
    return {
      kind: 'settings',
      settingsTarget,
      notificationType: rawType,
      category: rawCategory === 'system' ? 'system' : 'account',
      title,
      body,
      deepLink:
        settingsTarget === 'notification-preferences'
          ? '/notification-preferences'
          : '/profile',
    };
  }

  // ── Fallback: system ───────────────────────────────────────────────────────
  return {
    kind: 'system',
    notificationType: rawType,
    category: rawCategory,
    title,
    body,
    deepLink,
  };
}

// ── Type guards ───────────────────────────────────────────────────────────────

export function isOrderPayload(p: ParsedPushPayload): p is OrderDetailsPayload {
  return p.kind === 'order_details';
}

export function isRestaurantPayload(p: ParsedPushPayload): p is RestaurantPayload {
  return p.kind === 'restaurant';
}

export function isOfferPayload(p: ParsedPushPayload): p is OfferPayload {
  return p.kind === 'offer';
}

export function isProfilePayload(p: ParsedPushPayload): p is ProfilePayload {
  return p.kind === 'profile';
}

export function isSettingsPayload(p: ParsedPushPayload): p is SettingsPayload {
  return p.kind === 'settings';
}
