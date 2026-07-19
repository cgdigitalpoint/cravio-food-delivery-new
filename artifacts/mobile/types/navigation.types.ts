// ─── Navigation Types ─────────────────────────────────────────────────────────
// Route parameter definitions for type-safe navigation.
// Expand these as new screens are added in future phases.

export type RootStackParamList = {
  // Phase 1
  index: undefined;
  welcome: undefined;

  // Phase 2 — Authentication
  // 'auth/login': undefined;
  // 'auth/register': undefined;
  // 'auth/forgot-password': undefined;
  // 'auth/verify': { email: string };

  // Phase 3 — Main App (Tab Navigator)
  // '(tabs)': undefined;
  // '(tabs)/index': undefined;        // Home
  // '(tabs)/search': undefined;       // Search / Discover
  // '(tabs)/orders': undefined;       // Order History
  // '(tabs)/cart': undefined;         // Cart
  // '(tabs)/profile': undefined;      // User Profile

  // Phase 4 — Restaurant
  // 'restaurants/[id]': { restaurantId: string };

  // Phase 5 — Checkout & Orders
  // 'checkout/index': undefined;
  // 'checkout/address': undefined;
  // 'checkout/payment': undefined;
  // 'orders/[id]': { orderId: string };
  // 'orders/tracking': { orderId: string };

  // Phase 6 — Profile & Settings
  // 'profile/addresses': undefined;
  // 'profile/payment-methods': undefined;
  // 'profile/settings': undefined;
  // 'profile/notifications': undefined;
};

export type TabParamList = {
  index: undefined;
  search: undefined;
  orders: undefined;
  cart: undefined;
  profile: undefined;
};
