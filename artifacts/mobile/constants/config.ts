// ─── App Configuration ────────────────────────────────────────────────────────

export const APP_NAME = 'Cravio' as const;
export const APP_TAGLINE = 'Food Delivery Platform' as const;
export const APP_VERSION = '1.0.0' as const;
export const APP_BUILD = '1' as const;

/** Network request timeout in milliseconds */
export const API_TIMEOUT = 10_000;

export const DELIVERY_CONFIG = {
  MIN_ORDER_AMOUNT: 5.0,
  MAX_DELIVERY_RADIUS_KM: 15,
  DEFAULT_DELIVERY_FEE: 2.99,
  FREE_DELIVERY_THRESHOLD: 25.0,
  ESTIMATED_DELIVERY_BUFFER_MINUTES: 10,
} as const;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  RESTAURANTS_PAGE_SIZE: 12,
  ORDERS_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 50,
} as const;

export const MAP_CONFIG = {
  DEFAULT_LATITUDE: 40.7128,
  DEFAULT_LONGITUDE: -74.006,
  DEFAULT_ZOOM_LEVEL: 13,
  DETAIL_ZOOM_LEVEL: 16,
} as const;

export const CART_CONFIG = {
  MAX_ITEMS_PER_ORDER: 50,
  DEFAULT_TIP_PERCENTAGES: [10, 15, 20, 25] as const,
  SESSION_TIMEOUT_HOURS: 24,
} as const;

export const CACHE_TTL = {
  RESTAURANTS: 5 * 60 * 1000, // 5 minutes
  MENU_ITEMS: 10 * 60 * 1000, // 10 minutes
  CATEGORIES: 60 * 60 * 1000, // 1 hour
  USER_PROFILE: 30 * 60 * 1000, // 30 minutes
} as const;
