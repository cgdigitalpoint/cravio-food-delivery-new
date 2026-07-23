// ─── Route Constants ──────────────────────────────────────────────────────────
export const ROUTES = {
  // ── Pre-auth flow ──────────────────────────────────────────────────────────
  SPLASH: '/' as const,
  ONBOARDING: '/onboarding' as const,
  WELCOME: '/welcome' as const,

  // ── Auth ───────────────────────────────────────────────────────────────────
  AUTH_LOGIN: '/auth/login' as const,
  AUTH_SIGNUP: '/auth/signup' as const,
  AUTH_OTP: '/auth/otp' as const,
  AUTH_FORGOT_PASSWORD: '/auth/forgot-password' as const,

  // ── Main app ───────────────────────────────────────────────────────────────
  HOME: '/home' as const,

  // ── Phase 5: Restaurant · Cart · Checkout ──────────────────────────────────
  RESTAURANT_DETAIL: '/restaurant' as const, // append /[id]
  CART: '/cart' as const,
  CHECKOUT: '/checkout' as const,

  // ── Phase 7: Search & Discovery ────────────────────────────────────────────
  SEARCH: '/search' as const,

  // ── Phase 6: Profile & supporting screens ──────────────────────────────────
  PROFILE: '/profile' as const,
  ORDERS: '/orders' as const,
  ORDER_DETAILS: '/orders' as const, // append /[id]
  FAVORITES: '/favorites' as const,
  ADDRESSES: '/address' as const,
  ADDRESS_NEW: '/address/new' as const,
  ADDRESS_EDIT: '/address' as const, // append /[id]
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
