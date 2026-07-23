# Cravio — Project Status

> Last updated: 2026-07-23
> App: Food Delivery Mobile App (Expo / React Native / TypeScript)
> Artifact: `artifacts/mobile` · Workflow: `artifacts/mobile: expo` (RUNNING)

---

## ✅ Completed Phases

| Phase | Feature | Status |
|-------|---------|--------|
| 1 | Splash Screen | ✅ Complete |
| 2 | Onboarding + Design System (36+ components) | ✅ Complete |
| 3 | Auth Screens (Login, Signup, OTP, Forgot Password) | ✅ Complete |
| 4 | Home Screen (discovery, banners, categories, floating cart, bottom nav) | ✅ Complete |
| 5 | Restaurant Details + Cart + Checkout | ✅ Complete |
| 6 | Profile, Orders, Favorites, Addresses — screens, routes, services, stores | ✅ Complete |
| 7 | Search & Discovery — global search, suggestions, recent, trending, results | ✅ Complete |

---

## ✅ Phase 7 — Search & Discovery (Complete)

Built a full premium Search & Discovery screen at `screens/SearchScreen.tsx` · route `app/search.tsx`.

### Features Delivered

| Feature | Detail |
|---------|--------|
| Global search input | Auto-focused TextInput in header · debounced 300 ms · clear button |
| Instant suggestions | Local suggestions appear while typing (restaurants, food, categories) |
| Recent searches | Stored in AsyncStorage (`@cravio/recent-searches`) · swipe to remove · clear all |
| Trending searches | 8 trending chips (Biryani, Pizza, Burger, Sushi, Coffee, Desserts, Healthy, Noodles) |
| Popular Restaurants | Horizontal scroll of compact restaurant cards with image/rating/delivery time |
| Popular Dishes | Vertical list of `FoodCard` components (isPopular items) |
| Search results | Async via `searchService` → Supabase first, falls back to local mock data |
| Result tabs | All · Restaurants · Food · Categories — with result count badges |
| Category results | Coloured chip grid from matching CATEGORIES |
| Empty state | `EmptyState` with `noSearchResult` variant + contextual message |
| Loading skeleton | `RestaurantCardSkeleton` + `FoodCardSkeleton` during search |
| Error state | `EmptyState` noInternet variant + Retry button |
| Dark / Light theme | Full `useColors()` support throughout all sub-components |
| TypeScript | Zero errors — `tsc --noEmit` clean |

### New Files

| File | Purpose |
|------|---------|
| `screens/SearchScreen.tsx` | Full search UI — all sub-components co-located |
| `app/search.tsx` | Thin Expo Router route |
| `services/searchService.ts` | Supabase-first search with local fallback + instant suggestions |

### Changed Files

| File | Change |
|------|--------|
| `app/_layout.tsx` | Added `search` to PROTECTED set + registered `Stack.Screen name="search"` |
| `navigation/routes.ts` | Added `ROUTES.SEARCH = '/search'` |
| `screens/HomeScreen.tsx` | Bottom nav index 1 (Search) now navigates to `/search` |

### Navigation

```
/home (bottom nav tab 1 → Search)
  └─→ /search
        ├─ Idle:   Recent + Trending + Popular Restaurants + Popular Dishes
        ├─ Active: Instant suggestions overlay
        └─ Results: Tabs (All / Restaurants / Food / Categories) + Empty state
```

### Supabase Integration

`services/searchService.ts` queries `restaurants` and `foods` tables via Supabase PostgREST.
Falls back to local `homeData.ts` mock arrays when DB returns empty (expected until data is seeded).

---

## 🖥️ Phase 6 — Screens & Backend Wiring (Complete ✅)

All screens, routes, Supabase services, and Zustand stores built and verified.

### Screens Built

| Screen | File | Route |
|--------|------|-------|
| Profile | `screens/ProfileScreen.tsx` | `/profile` |
| Orders List | `screens/OrdersScreen.tsx` | `/orders` |
| Order Details | `screens/OrderDetailsScreen.tsx` | `/orders/[id]` |
| Favorites | `screens/FavoritesScreen.tsx` | `/favorites` |
| Address List | `screens/address/AddressListScreen.tsx` | `/address` |
| Address Form | `screens/address/AddressFormScreen.tsx` | `/address/new`, `/address/[id]` |

### Backend Verified (2026-07-23)

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

---

## 🏗️ Environment

| Item | Status |
|------|--------|
| `pnpm install` | ✅ Done (1,095 packages) |
| TypeScript errors | ✅ Zero |
| Workflow `artifacts/mobile: expo` | ✅ Running — port 18115 |
| `EXPO_PUBLIC_SUPABASE_URL` | ✅ Set in Replit Secrets |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | ✅ Set in Replit Secrets |
| Supabase REST reachable | ✅ Connected |
| Database tables (8) | ✅ Schema applied |

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
| `@react-native-async-storage/async-storage` | 2.2.0 | Session + recent searches persistence |
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
                                                     ├─→ /search  ← Phase 7
                                                     │     └─→ (back) → /home
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
| Search results use local mock data | Medium | Supabase tables empty until data seeded — `searchService` falls back automatically |
| Card / Wallet payment | Low | Shows "Coming Soon" — Phase 8 scope |
| `shadow*` props deprecated on web | Low | Non-blocking — native shadows work fine |
| `props.pointerEvents` deprecation | Low | Non-blocking |
| `@types/react` minor version mismatch | Low | Non-blocking warning from Expo CLI |

---

## 🚀 Next Phase

**Phase 8** — optional: Real-time order tracking, push notifications, payment gateway (Stripe), or data seeding for restaurants/foods in Supabase.

---

*Workflow running. Zero TypeScript errors. All 7 phases complete.*
