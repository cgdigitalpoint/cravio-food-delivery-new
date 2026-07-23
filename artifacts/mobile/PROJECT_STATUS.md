# Cravio — Project Status

## Phase Overview

| Phase | Feature | Status |
|-------|---------|--------|
| 1 | Splash Screen | ✅ Complete |
| 2 | Onboarding + Design System | ✅ Complete |
| 3 | Auth Screens (Sign In, Sign Up, OTP, Forgot Password) | ✅ Complete |
| 4 | Home Screen (restaurant discovery, categories, banners, floating cart, bottom nav) | ✅ Complete |
| 5 | Restaurant Details + Cart + Checkout | ✅ Complete |

---

## Phase 5 — Complete

### New Screens

| Screen | File | Route |
|--------|------|-------|
| Restaurant Details | `screens/RestaurantDetailsScreen.tsx` | `/restaurant/[id]` |
| Cart | `screens/CartScreen.tsx` | `/cart` |
| Checkout | `screens/CheckoutScreen.tsx` | `/checkout` |

### New Data

| File | Contents |
|------|----------|
| `data/restaurantData.ts` | `RestaurantMenuItem` type, full menus for r1–r4, generic fallback for r5–r10, `PROMO_CODES` |

### New Route Files

| File | Route |
|------|-------|
| `app/restaurant/[id].tsx` | `/restaurant/[id]` |
| `app/cart.tsx` | `/cart` |
| `app/checkout.tsx` | `/checkout` |

### Updated Files

| File | Change |
|------|--------|
| `app/_layout.tsx` | Registered `restaurant/[id]`, `cart`, `checkout` in Stack |
| `screens/index.ts` | Exported `RestaurantDetailsScreen`, `CartScreen`, `CheckoutScreen` |
| `navigation/routes.ts` | Added `RESTAURANT_DETAIL`, `CART`, `CHECKOUT` constants |
| `screens/HomeScreen.tsx` | Wired `useRouter` + `useCartStore`; restaurant cards navigate to `/restaurant/[id]`; floating cart navigates to `/cart`; cart count/total from live store |

### Feature Checklist

- ✅ Restaurant Details: parallax cover, info card, sticky category tabs, item add/qty controls, floating cart bar
- ✅ Cart: item list with qty controls, special instructions per item, coupon validation (`CRAVIO20`, `FIRST50`, `FREEDEL`), bill breakdown (subtotal + delivery + platform fee + 5% tax), proceed to checkout CTA
- ✅ Checkout: saved address selection, add-new-address button, COD/Card/Wallet payment selector (card + wallet show "Coming Soon"), order notes, order summary, animated Place Order button
- ✅ Success animation: spring checkmark + confetti dots, ETA card, "Track My Order" CTA clears cart and returns to home
- ✅ Floating cart on Home: live `itemCount` + `totalAmount` from Zustand store, taps → `/cart`
- ✅ Zero TypeScript errors
- ✅ All navigation routes registered in Expo Router Stack

### Known Limitations (by design — dummy data, no backend)

- Card and Wallet payment methods show "Coming Soon" (no payment gateway)
- Order tracking screen not built (Phase 6 scope)
- Addresses are hardcoded dummy data
- No persistence between app restarts (Zustand in-memory only)

---

## Next Phase (not started)

**Phase 6** — Order Tracking + Profile + Search
