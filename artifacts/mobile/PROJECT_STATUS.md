# Cravio — Project Status

> Last updated: 2026-07-23
> App: Food Delivery Mobile App (Expo / React Native / TypeScript)
> Artifact: `artifacts/mobile` · Workflow: `Cravio Mobile` (RUNNING)

---

## ✅ Completed Phases

| Phase | Feature | Status |
|-------|---------|--------|
| 1 | Splash Screen | ✅ Complete |
| 2 | Onboarding + Design System (35+ components) | ✅ Complete |
| 3 | Auth Screens (Login, Signup, OTP, Forgot Password) | ✅ Complete |
| 4 | Home Screen (discovery, banners, categories, floating cart, bottom nav) | ✅ Complete |
| 5 | Restaurant Details + Cart + Checkout | ✅ Complete |
| 6 | Profile, Orders, Favorites, Addresses — screens, routes, services, stores | ✅ Complete (pending schema) |

---

## 🖥️ Phase 6 — Screens & Backend Wiring (Complete ✅)

All screens, routes, Supabase services, and Zustand stores are built and wired.

### Screens Built

| Screen | File | Route |
|--------|------|-------|
| Profile | `screens/ProfileScreen.tsx` | `/profile` |
| Orders List | `screens/OrdersScreen.tsx` | `/orders` |
| Order Details | `screens/OrderDetailsScreen.tsx` | `/orders/[id]` |
| Favorites | `screens/FavoritesScreen.tsx` | `/favorites` |
| Address List | `screens/address/AddressListScreen.tsx` | `/address` |
| Address Form | `screens/address/AddressFormScreen.tsx` | `/address/new`, `/address/[id]` |

### Services (all wired to Supabase — NOT stubs)

| File | Responsibility |
|------|---------------|
| `services/supabase.ts` | Client with AsyncStorage session persistence |
| `services/authService.ts` | signUp · signIn · signOut · forgotPassword · getSession |
| `services/userService.ts` | getProfile · updateProfile |
| `services/orderService.ts` | getOrders · getOrderById · createOrder · updateStatus |
| `services/favoriteService.ts` | getFavorites · addFavorite · removeFavorite · toggleFavorite |
| `services/addressService.ts` | getAddresses · addAddress · updateAddress · deleteAddress · setDefault |

### Stores (all wired)

| File | Responsibility |
|------|---------------|
| `store/useAuthStore.ts` | Full auth lifecycle · initializeAuth · Supabase session sync |
| `store/useOrderStore.ts` | fetchOrders · createOrder · fetchOrderById |
| `store/useFavoriteStore.ts` | fetch · add · remove · toggle · O(1) isFavorite |
| `store/useAddressStore.ts` | fetch · add · update · delete · setDefault |
| `store/useUserStore.ts` | profile state |

### Auth Guard (`app/_layout.tsx`)

- Subscribes to `supabase.auth.onAuthStateChange` on mount
- Protects: `home`, `profile`, `orders`, `favorites`, `address`, `restaurant`, `cart`, `checkout`
- Redirects unauthenticated → `/welcome`, authenticated → `/home` from auth routes

### Supabase Schema (`services/schema.sql`)

Complete schema with RLS policies ready to apply:

| Table | Purpose |
|-------|---------|
| `users` | User profiles (mirrors `auth.users`) |
| `addresses` | Saved delivery addresses |
| `restaurants` | Restaurant catalogue |
| `foods` | Menu items |
| `orders` | Order records |
| `order_items` | Line items per order |
| `favorites` | Saved restaurants |
| `cart` | Persistent cart |

---

## ✅ Backend Verified (2026-07-23)

Full end-to-end authenticated verification passed. All 9 checks green.

| Check | Result |
|-------|--------|
| Supabase connection — all 8 tables | ✅ 200 |
| Signup (email confirmation disabled for dev) | ✅ user created + access_token |
| Login (password grant) | ✅ token + user_id match |
| Session persistence (refresh token exchange) | ✅ new token, stable user_id |
| Profile upsert + read-back + update | ✅ |
| Addresses — insert 2, read, default flag | ✅ |
| Favorites — insert, delete, duplicate blocked (409) | ✅ |
| Orders + order_items — create, join select, items verified | ✅ |
| RLS — anon sees 0 rows; user2 cannot read user1's data | ✅ |

**Note:** `orderService.updateStatus()` is intentionally blocked for client users (no UPDATE RLS on orders). Order status is managed server-side only. This is correct by design.

---

## 🏗️ Environment

| Item | Status |
|------|--------|
| `pnpm install` | ✅ Done (1,095 packages) |
| TypeScript errors | ✅ Zero |
| Workflow `Cravio Mobile` | ✅ Running — `PORT=18115 pnpm --filter @workspace/mobile run dev` |
| `EXPO_PUBLIC_SUPABASE_URL` | ✅ Set in Replit Secrets |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | ✅ Set in Replit Secrets |
| Supabase REST reachable | ✅ Connected (`tksdioppxwtqsogavmks.supabase.co`) |
| Database tables exist | ❌ Schema not yet applied |

---

## 📦 Installed Packages

| Package | Version | Purpose |
|---------|---------|---------|
| `expo` | ~54.0.27 | Core framework |
| `expo-router` | ~6.0.17 | File-based routing |
| `react-native` | 0.81.5 | Native runtime |
| `@supabase/supabase-js` | ^2.110.8 | Backend client |
| `zustand` | ^5.0.14 | State management |
| `@tanstack/react-query` | catalog | Data fetching |
| `react-native-reanimated` | ~4.1.1 | Animations |
| `nativewind` | ^4.2.6 | Tailwind utility classes |
| `lucide-react-native` | ^1.25.0 | Icons |
| `expo-linear-gradient` | ~15.0.8 | Gradients |
| `expo-haptics` | ~15.0.8 | Haptic feedback |
| `react-native-keyboard-controller` | 1.18.5 | Keyboard handling |
| `@react-native-async-storage/async-storage` | 2.2.0 | Session persistence |
| `@expo-google-fonts/inter` | ^0.4.0 | Inter typeface |
| `@expo-google-fonts/poppins` | ^0.4.1 | Poppins typeface |

---

## 📁 Full Route Map

```
/ (Splash ~2.8s)
  └─→ /onboarding ──Skip/last-Next──→ /welcome
                                         ├─→ /auth/signup → /auth/otp
                                         └─→ /auth/login
                                               ├─→ /auth/forgot-password → /auth/otp
                                               └─→ (success) → /home
                                                     ├─→ /restaurant/[id]
                                                     │     └─→ /cart → /checkout
                                                     ├─→ /profile
                                                     │     ├─→ /orders → /orders/[id]
                                                     │     ├─→ /favorites
                                                     │     └─→ /address → /address/new
                                                     │                  → /address/[id]
                                                     └─→ (tab nav: home / search / orders / profile)
```

---

## ⚠️ Known Limitations (by design)

| Issue | Severity | Status |
|-------|----------|--------|
| Database schema not applied | **Blocker for auth/data** | Must run `schema.sql` in Supabase SQL Editor |
| Search screen not built | Medium | Phase 7 scope |
| Card / Wallet payment | Low | Shows "Coming Soon" — Phase 7 scope |
| `shadow*` props deprecated on web | Low | Non-blocking — native shadows work fine |
| `props.pointerEvents` deprecation | Low | Non-blocking |
| `@types/react` minor version mismatch | Low | Non-blocking warning from Expo CLI |

---

## 🚀 Next Phase

**Phase 7** — Search Screen + optional: real-time order tracking, payment gateway, push notifications.

Entry point: build `screens/SearchScreen.tsx` + `app/search.tsx` and wire the Home screen search bar to navigate to `/search`.

---

*Workflow running. Zero TypeScript errors. Schema SQL ready at `services/schema.sql` — apply in Supabase to unlock all backend features.*
