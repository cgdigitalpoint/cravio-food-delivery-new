// ─── Mock Push Payload Generator (Phase 15B — Dev / Test Only) ───────────────
// Generates realistic raw push notification data payloads that mimic what
// FCM, Expo Push, or OneSignal would deliver to a tap handler.
//
// Use these in development to test the full push → parse → route → navigate
// pipeline without a real push server.
//
// Example:
//   import { mockPushPayloads, MOCK_PUSH_SCENARIOS } from '@/utils/mockPushPayloads';
//   const raw = mockPushPayloads.orderPlaced('ORDER_123', 'Spice Garden');
//   await notificationRouter.route(raw, router);

import type { RawPushData } from '@/utils/pushPayloadParser';
import type { NotificationType } from '@/store/useNotificationStore';

// ── Helpers ───────────────────────────────────────────────────────────────────

function fakeId(prefix = '') {
  return prefix + Math.random().toString(36).slice(2, 10).toUpperCase();
}

// ── Mock payload factory ──────────────────────────────────────────────────────

/**
 * Factory functions that return RawPushData objects.
 * Each function mimics the exact shape a Cravio backend would send.
 */
export const mockPushPayloads = {
  // ── Order payloads ─────────────────────────────────────────────────────────

  orderPlaced(
    orderId: string = fakeId('ORD'),
    restaurantName = 'Spice Garden',
  ): RawPushData {
    return {
      kind: 'order_details',
      type: 'order_placed' satisfies NotificationType,
      category: 'order',
      title: 'Order Placed ✅',
      body: `Your order at ${restaurantName} has been placed successfully!`,
      deepLink: `/orders/${orderId}`,
      orderId,
    };
  },

  orderAccepted(
    orderId: string = fakeId('ORD'),
    restaurantName = 'Spice Garden',
  ): RawPushData {
    return {
      kind: 'order_details',
      type: 'order_accepted' satisfies NotificationType,
      category: 'order',
      title: 'Order Accepted 🍳',
      body: `${restaurantName} has accepted your order and is preparing it.`,
      deepLink: `/orders/${orderId}`,
      orderId,
    };
  },

  orderPreparing(
    orderId: string = fakeId('ORD'),
    restaurantName = 'Spice Garden',
    estimatedMinutes = 25,
  ): RawPushData {
    return {
      kind: 'order_details',
      type: 'preparing' satisfies NotificationType,
      category: 'order',
      title: 'Preparing Your Order 👨‍🍳',
      body: `${restaurantName} is cooking. Estimated: ${estimatedMinutes} mins.`,
      deepLink: `/orders/${orderId}`,
      orderId,
    };
  },

  orderPickedUp(orderId: string = fakeId('ORD')): RawPushData {
    return {
      kind: 'order_details',
      type: 'picked_up' satisfies NotificationType,
      category: 'order',
      title: 'Order Picked Up 🛵',
      body: 'A delivery partner has collected your order. On the way!',
      deepLink: `/orders/${orderId}`,
      orderId,
    };
  },

  orderOutForDelivery(
    orderId: string = fakeId('ORD'),
    etaMinutes = 10,
  ): RawPushData {
    return {
      kind: 'order_details',
      type: 'out_for_delivery' satisfies NotificationType,
      category: 'order',
      title: 'Out for Delivery 🏃',
      body: `Your order is ${etaMinutes} minutes away. Get ready!`,
      deepLink: `/orders/${orderId}`,
      orderId,
    };
  },

  orderDelivered(
    orderId: string = fakeId('ORD'),
    restaurantName = 'Spice Garden',
  ): RawPushData {
    return {
      kind: 'order_details',
      type: 'delivered' satisfies NotificationType,
      category: 'order',
      title: 'Order Delivered 🎉',
      body: `Your order from ${restaurantName} has arrived. Enjoy your meal!`,
      deepLink: `/orders/${orderId}`,
      orderId,
    };
  },

  orderCancelled(
    orderId: string = fakeId('ORD'),
    reason = 'Restaurant unavailable',
  ): RawPushData {
    return {
      kind: 'order_details',
      type: 'cancelled' satisfies NotificationType,
      category: 'order',
      title: 'Order Cancelled',
      body: `Your order was cancelled. Reason: ${reason}. Refund initiated.`,
      deepLink: `/orders/${orderId}`,
      orderId,
    };
  },

  // ── Restaurant payloads ────────────────────────────────────────────────────

  restaurantPromotion(
    restaurantId: string = fakeId('REST'),
    restaurantName = 'The Biryani House',
  ): RawPushData {
    return {
      kind: 'restaurant',
      type: 'promotion' satisfies NotificationType,
      category: 'promotion',
      title: `${restaurantName} just launched! 🎊`,
      body: `${restaurantName} is now on Cravio. First order at 30% off!`,
      deepLink: `/restaurant/${restaurantId}`,
      restaurantId,
      restaurantName,
    };
  },

  // ── Offer payloads ─────────────────────────────────────────────────────────

  newOffer(
    offerId: string = fakeId('OFFER'),
    promoCode = 'CRAVIO50',
    discount = '50%',
  ): RawPushData {
    return {
      kind: 'offer',
      type: 'offer' satisfies NotificationType,
      category: 'offer',
      title: `🔥 ${discount} Off This Weekend!`,
      body: `Use code ${promoCode} for ${discount} off your next order. Valid till Sunday.`,
      deepLink: `/offers/${offerId}`,
      offerId,
      promoCode,
    };
  },

  flashOffer(): RawPushData {
    return {
      kind: 'offer',
      type: 'offer' satisfies NotificationType,
      category: 'offer',
      title: '⚡ Flash Deal — 2 Hours Only!',
      body: 'Get free delivery on all orders above ₹199. Ends soon!',
      deepLink: '/home',
      offerId: undefined,
      promoCode: undefined,
    };
  },

  // ── Profile payloads ───────────────────────────────────────────────────────

  profileUpdated(): RawPushData {
    return {
      kind: 'profile',
      type: 'account_update' satisfies NotificationType,
      category: 'account',
      title: 'Profile Updated',
      body: 'Your account information has been updated successfully.',
      deepLink: '/profile',
    };
  },

  welcomeUser(name = 'Foodie'): RawPushData {
    return {
      kind: 'profile',
      type: 'welcome' satisfies NotificationType,
      category: 'account',
      title: `Welcome to Cravio, ${name}! 🍽️`,
      body: 'Explore top restaurants, deals, and lightning-fast delivery near you.',
      deepLink: '/home',
    };
  },

  // ── Settings payloads ──────────────────────────────────────────────────────

  notificationPreferencesPrompt(): RawPushData {
    return {
      kind: 'settings',
      type: 'system' satisfies NotificationType,
      category: 'system',
      title: 'Notification Settings',
      body: 'Customise which alerts you receive from Cravio.',
      deepLink: '/notification-preferences',
      settingsTarget: 'notification-preferences',
    };
  },

  // ── Donation payloads ──────────────────────────────────────────────────────

  donationConfirmed(amount = '25'): RawPushData {
    return {
      kind: 'system',
      type: 'donation_confirmed' satisfies NotificationType,
      category: 'donation',
      title: 'Donation Received ❤️',
      body: `₹${amount} has been added to your Hunger Relief wallet. Thank you!`,
      deepLink: '/donations',
    };
  },
};

// ── Scenario registry ─────────────────────────────────────────────────────────

/**
 * Named scenarios for the debug panel.
 * Each entry produces a RawPushData payload for testing the full
 * push → parse → route pipeline.
 */
export interface MockPushScenario {
  id: string;
  label: string;
  generate: () => RawPushData;
}

export const MOCK_PUSH_SCENARIOS: MockPushScenario[] = [
  { id: 'order_placed',          label: 'Order Placed',            generate: () => mockPushPayloads.orderPlaced() },
  { id: 'order_accepted',        label: 'Order Accepted',          generate: () => mockPushPayloads.orderAccepted() },
  { id: 'order_preparing',       label: 'Preparing Food',          generate: () => mockPushPayloads.orderPreparing() },
  { id: 'order_picked_up',       label: 'Order Picked Up',         generate: () => mockPushPayloads.orderPickedUp() },
  { id: 'order_out_for_delivery',label: 'Out for Delivery',        generate: () => mockPushPayloads.orderOutForDelivery() },
  { id: 'order_delivered',       label: 'Order Delivered',         generate: () => mockPushPayloads.orderDelivered() },
  { id: 'order_cancelled',       label: 'Order Cancelled',         generate: () => mockPushPayloads.orderCancelled() },
  { id: 'restaurant_promo',      label: 'Restaurant Promotion',    generate: () => mockPushPayloads.restaurantPromotion() },
  { id: 'new_offer',             label: 'New Offer (with code)',   generate: () => mockPushPayloads.newOffer() },
  { id: 'flash_offer',           label: 'Flash Deal',              generate: () => mockPushPayloads.flashOffer() },
  { id: 'profile_updated',       label: 'Profile Updated',         generate: () => mockPushPayloads.profileUpdated() },
  { id: 'welcome',               label: 'Welcome User',            generate: () => mockPushPayloads.welcomeUser() },
  { id: 'notification_settings', label: 'Notification Prefs Prompt', generate: () => mockPushPayloads.notificationPreferencesPrompt() },
  { id: 'donation_confirmed',    label: 'Donation Confirmed',      generate: () => mockPushPayloads.donationConfirmed() },
];
