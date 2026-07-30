// ─── Deep Link Foundation (Phase 15A) ────────────────────────────────────────
// Maps notification deep-link strings to Expo Router navigation calls.
// No external push provider required — routes are resolved purely in-app.
// Phase 15B can wire this into push notification tap handlers unchanged.

import type { Router } from 'expo-router';

// ── Supported deep-link patterns ──────────────────────────────────────────────
//
//  /orders/:id          → orders/[id] screen
//  /orders              → orders list screen
//  /restaurant/:id      → restaurant/[id] screen
//  /offers/:id          → home (offer detail deferred to future phase)
//  /home                → home screen
//  /profile             → profile screen
//  /settings            → notification-preferences screen
//  /donations           → donations screen

export type DeepLinkTarget =
  | '/home'
  | '/orders'
  | '/profile'
  | '/settings'
  | '/donations'
  | string; // dynamic: /orders/:id, /restaurant/:id, /offers/:id

/**
 * Resolve a deep-link string and navigate using the Expo Router instance.
 * Safe to call with undefined — returns false (no navigation) in that case.
 *
 * @param router  The result of `useRouter()` from expo-router.
 * @param link    Deep link string stored on a CravioNotification.
 * @returns       true if navigation was performed, false otherwise.
 */
export function navigateDeepLink(router: Router, link: string | undefined): boolean {
  if (!link) return false;

  try {
    // ── Static routes ──────────────────────────────────────────────────────
    if (link === '/home') { router.push('/home'); return true; }
    if (link === '/orders') { router.push('/orders'); return true; }
    if (link === '/profile') { router.push('/profile'); return true; }
    if (link === '/settings') { router.push('/notification-preferences'); return true; }
    if (link === '/donations') { router.push('/donations'); return true; }
    if (link === '/notifications') { router.push('/notifications'); return true; }

    // ── Dynamic: /orders/:id ──────────────────────────────────────────────
    const orderMatch = link.match(/^\/orders\/([^/]+)$/);
    if (orderMatch) {
      router.push(`/orders/${orderMatch[1]}`);
      return true;
    }

    // ── Dynamic: /restaurant/:id ──────────────────────────────────────────
    const restaurantMatch = link.match(/^\/restaurant\/([^/]+)$/);
    if (restaurantMatch) {
      router.push(`/restaurant/${restaurantMatch[1]}`);
      return true;
    }

    // ── Dynamic: /offers/:id — fall back to home until offer screen exists
    const offerMatch = link.match(/^\/offers\/([^/]+)$/);
    if (offerMatch) {
      router.push('/home');
      return true;
    }

    // ── Unknown link — fall back to home ──────────────────────────────────
    router.push('/home');
    return true;
  } catch {
    return false;
  }
}

/**
 * Return a human-readable screen label for a deep-link string.
 * Used in notification cards to show where tapping will take the user.
 */
export function deepLinkLabel(link: string | undefined): string | undefined {
  if (!link) return undefined;
  if (link === '/home') return 'Open Home';
  if (link === '/orders') return 'View Orders';
  if (link === '/profile') return 'View Profile';
  if (link === '/settings') return 'Open Settings';
  if (link === '/donations') return 'View Donations';
  if (/^\/orders\//.test(link)) return 'View Order';
  if (/^\/restaurant\//.test(link)) return 'View Restaurant';
  if (/^\/offers\//.test(link)) return 'View Offer';
  return undefined;
}
