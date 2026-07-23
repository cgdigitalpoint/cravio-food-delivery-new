// ─── Route Constants ──────────────────────────────────────────────────────────
// Single source of truth for all app routes.
// Update this file as new screens are added in future phases.

export const ROUTES = {
  // ── Phase 1: Architecture ──────────────────────────────────────────────
  SPLASH: '/' as const,
  WELCOME: '/welcome' as const,

  // ── Phase 2: Authentication ────────────────────────────────────────────
  // AUTH_LOGIN: '/auth/login' as const,
  // AUTH_REGISTER: '/auth/register' as const,
  // AUTH_FORGOT_PASSWORD: '/auth/forgot-password' as const,
  // AUTH_VERIFY_EMAIL: '/auth/verify' as const,
  // AUTH_ONBOARDING: '/auth/onboarding' as const,

  // ── Phase 3: Main App ──────────────────────────────────────────────────
  // HOME: '/(tabs)/' as const,
  // SEARCH: '/(tabs)/search' as const,
  // ORDERS: '/(tabs)/orders' as const,
  // CART: '/(tabs)/cart' as const,
  // PROFILE: '/(tabs)/profile' as const,

  // ── Phase 4 & 5: Restaurant + Cart + Checkout ─────────────────────────
  RESTAURANT_DETAIL: '/restaurant' as const,  // append /[id]
  CART: '/cart' as const,
  CHECKOUT: '/checkout' as const,

  // ── Phase 6: Profile & Settings ────────────────────────────────────────
  // PROFILE_ADDRESSES: '/profile/addresses' as const,
  // PROFILE_PAYMENT: '/profile/payment-methods' as const,
  // PROFILE_SETTINGS: '/profile/settings' as const,
  // PROFILE_NOTIFICATIONS: '/profile/notifications' as const,
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
