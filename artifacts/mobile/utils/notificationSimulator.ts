// ─── Local Notification Simulator (Phase 15A — Dev Only) ─────────────────────
// Generates sample notifications for each type so the Notification Center
// can be tested without a real backend or push provider.
// This file is DEVELOPMENT ONLY — do not call these in production code.

import { useNotificationStore } from '@/store/useNotificationStore';

/** Helper: resolve store dispatch at call time (avoids stale closures). */
function dispatch() {
  return useNotificationStore.getState().addNotification;
}

// ── Sample order IDs ──────────────────────────────────────────────────────────

function fakeOrderId() {
  return Math.random().toString(36).slice(2, 10).toUpperCase();
}

// ── Individual simulators ─────────────────────────────────────────────────────

export function simulateOrderConfirmed() {
  const orderId = fakeOrderId();
  dispatch()({
    type: 'order_placed',
    title: 'Order Confirmed',
    message: 'Your order at Spice Garden has been placed! Preparing it now.',
    deepLink: `/orders/${orderId}`,
    payload: { orderId },
  });
}

export function simulatePreparingFood() {
  const orderId = fakeOrderId();
  dispatch()({
    type: 'preparing',
    title: 'Preparing Your Food',
    message: 'Spice Garden is cooking your order. Estimated time: 25 mins.',
    deepLink: `/orders/${orderId}`,
    payload: { orderId },
  });
}

export function simulatePickedUp() {
  const orderId = fakeOrderId();
  dispatch()({
    type: 'picked_up',
    title: 'Order Picked Up',
    message: 'A delivery partner has picked up your order. On the way!',
    deepLink: `/orders/${orderId}`,
    payload: { orderId },
  });
}

export function simulateOutForDelivery() {
  const orderId = fakeOrderId();
  dispatch()({
    type: 'out_for_delivery',
    title: 'Out for Delivery',
    message: 'Your order is 10 minutes away. Get ready!',
    deepLink: `/orders/${orderId}`,
    payload: { orderId },
  });
}

export function simulateDelivered() {
  const orderId = fakeOrderId();
  dispatch()({
    type: 'delivered',
    title: 'Order Delivered 🎉',
    message: 'Your order from Spice Garden has arrived. Enjoy your meal!',
    deepLink: `/orders/${orderId}`,
    payload: { orderId },
  });
}

export function simulateOffer() {
  dispatch()({
    type: 'offer',
    title: '🔥 50% Off This Weekend!',
    message: 'Use code CRAVIO50 for 50% off your next order. Valid till Sunday.',
    deepLink: '/home',
  });
}

export function simulateWelcome() {
  dispatch()({
    type: 'welcome',
    title: 'Welcome to Cravio! 🍽️',
    message: 'Discover top restaurants, exclusive deals, and lightning-fast delivery.',
    deepLink: '/home',
  });
}

export function simulateAccountUpdate() {
  dispatch()({
    type: 'account_update',
    title: 'Profile Updated',
    message: 'Your profile information has been updated successfully.',
    deepLink: '/profile',
  });
}

export function simulateDonation() {
  dispatch()({
    type: 'donation_confirmed',
    title: 'Donation Received ❤️',
    message: '₹25 has been added to your Hunger Relief wallet. Thank you!',
    deepLink: '/donations',
  });
}

export function simulatePromotion() {
  dispatch()({
    type: 'promotion',
    title: 'New Restaurant Alert!',
    message: 'The Biryani House just launched on Cravio. First order at 30% off!',
    deepLink: '/home',
  });
}

// ── Batch simulator ───────────────────────────────────────────────────────────

/** Simulate a sequence of order lifecycle notifications (useful for demo). */
export function simulateOrderLifecycle() {
  simulateOrderConfirmed();
  setTimeout(simulatePreparingFood, 800);
  setTimeout(simulatePickedUp, 1600);
  setTimeout(simulateOutForDelivery, 2400);
  setTimeout(simulateDelivered, 3200);
}

/** Simulate one of every notification type. */
export function simulateAll() {
  simulateOrderConfirmed();
  setTimeout(simulatePreparingFood, 300);
  setTimeout(simulatePickedUp, 600);
  setTimeout(simulateOutForDelivery, 900);
  setTimeout(simulateDelivered, 1200);
  setTimeout(simulateOffer, 1500);
  setTimeout(simulatePromotion, 1800);
  setTimeout(simulateWelcome, 2100);
  setTimeout(simulateAccountUpdate, 2400);
  setTimeout(simulateDonation, 2700);
}

// ── Simulator registry ────────────────────────────────────────────────────────
// Consumed by the debug panel in NotificationCenterScreen.

export interface SimulatorEntry {
  id: string;
  label: string;
  run: () => void;
}

export const SIMULATORS: SimulatorEntry[] = [
  { id: 'order_confirmed', label: 'Order Confirmed', run: simulateOrderConfirmed },
  { id: 'preparing', label: 'Preparing Food', run: simulatePreparingFood },
  { id: 'picked_up', label: 'Picked Up', run: simulatePickedUp },
  { id: 'out_for_delivery', label: 'Out for Delivery', run: simulateOutForDelivery },
  { id: 'delivered', label: 'Delivered', run: simulateDelivered },
  { id: 'offer', label: 'New Offer', run: simulateOffer },
  { id: 'promotion', label: 'Promotion', run: simulatePromotion },
  { id: 'welcome', label: 'Welcome', run: simulateWelcome },
  { id: 'account_update', label: 'Account Update', run: simulateAccountUpdate },
  { id: 'donation', label: 'Donation Confirmed', run: simulateDonation },
  { id: 'all', label: 'Fire All (demo)', run: simulateAll },
];
