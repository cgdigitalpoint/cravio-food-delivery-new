# Cravio — Project Status

> Last updated: 2026-07-24
> App: Food Delivery Mobile App (Expo / React Native / TypeScript)
> Artifact: `artifacts/mobile` · Workflow: `artifacts/mobile: expo` (RUNNING)

---

## ✅ Completed Phases

### Phase 1 — Architecture (Complete)
Scaffolded the entire project skeleton: file-based routing (Expo Router), Zustand state stores, TypeScript types, API stubs, utility functions, and configuration constants. No business logic.

### Phase 2 — Design System (Complete)
Built 35+ reusable UI components powered by the Inter typeface and Cravio brand tokens. Includes a live `/design-system` documentation screen showcasing every component.

### Phase 3 — Premium UI Foundation (Complete ✅)
All pre-auth screens built with Poppins typography, Reanimated animations, glassmorphism, linear gradients, and Lucide icons. Full navigation flow verified and screenshot-confirmed on all 7 screens.

### Phase 8 — Restaurant Details & Menu (Complete ✅)
Upgraded `screens/RestaurantDetailsScreen.tsx` and added reusable restaurant menu components without changing completed phase routes or cart APIs.

| Feature | Detail |
|---|---|
| Restaurant header | Cover image, logo/initial fallback, name, cuisine, rating, reviews, veg/non-veg indicator, delivery time, distance, delivery fee, offer, and open/closed status |
| Menu discovery | Search within the active restaurant menu, category tabs, grouped menu sections, and sticky category/header controls |
| Ordering | Reusable food cards, shared `QuantitySelector`, add/increase/decrease actions, restaurant cart lock confirmation, and floating cart CTA |
| States | Animated skeleton loading, invalid-restaurant error state, no-results empty state, and empty-menu state |
| Motion & layout | Parallax cover, animated sticky header, smooth category scrolling, safe-area handling, NativeWind utility classes, and responsive flex layouts |

**Phase 8 verification:** `pnpm run typecheck` passes with zero TypeScript errors. The Expo iOS and Android production bundles, manifests, and assets build successfully. Expo Doctor reports only the existing non-blocking React type minor-version warning.

### Phase 9 — Engagement, Reviews & Personalization (Complete ✅)
Added Phase 9 engagement features without changing completed phase routes, the existing cart store, or the Supabase schema.

| Feature | Detail |
|---|---|
| Favorites | Supabase-backed restaurant favorites synchronized across Home, Search, Restaurant Details, and Favorites screen; food favorites persisted locally via AsyncStorage and shown in a Restaurants/Dishes Favorites screen |
| Search Engagement | Restaurant and food favorite toggles wired into Search results (all tabs) and the idle Popular Dishes section — heart buttons reflect live store state |
| Reviews | Restaurant rating summary, average rating, total review count, distribution bars, avatars, dates, verified-purchase badges, helpful voting, sorting, food review highlights, and photo placeholders |
| Personalization | Recommended food carousel ranks popular, highly rated, and favorited dishes; similar restaurant carousel uses cuisine, category, rating, and distance |
| Recently Viewed | Restaurant details auto-save a capped history in persistent storage; Profile links to a history screen with open and clear actions |
| Sharing | Native Share API actions for restaurants and food items |
| FoodCard | Added optional `isFavorite` / `onFavoritePress` props — renders a heart overlay on the image; backwards-compatible, existing usage unchanged |
| Profile | Version footer updated to reflect Phase 9 completion |
| UI quality | Reusable engagement components, empty states, favorite controls, responsive horizontal carousels, and preserved loading/error behavior |

**Phase 9 verification:** `pnpm run typecheck` passes with zero TypeScript errors. Expo iOS production bundle builds successfully. Expo Doctor reports only the existing non-blocking `@types/react` and `@types/react-dom` minor-version warning.

---

## 🖥️ Phase 3 Screens — Verified

| Screen | Route | Visual Status |
|---|---|---|
| Splash Screen | `/` | ✅ Dark bg · orange radial glow · Flame icon · Poppins wordmark · animated dots |
| Onboarding — Slide 1 | `/onboarding` | ✅ Orange gradient · food illustration · floating items · dot indicator · Next |
| Onboarding — Slides 2 & 3 | `/onboarding` (swipe/Next) | ✅ Dark delivery slide · Indigo deals slide |
| Welcome | `/welcome` | ✅ Dark hero · floating glass cards · food pills · white bottom card · CTAs |
| Login | `/auth/login` | ✅ Social buttons · email/password inputs · Forgot link · Sign Up link |
| Sign Up | `/auth/signup` | ✅ 4 inputs · terms checkbox · Create Account button |
| OTP Verification | `/auth/otp` | ✅ 6 digit boxes · countdown timer · Resend · Verify button |
| Forgot Password | `/auth/forgot-password` | ✅ Info box · email input · Send Reset Link · Back link |

**Navigation flow:**
```
/ (Splash ~2.8s)
  └─→ /onboarding  ──Skip or last-Next──→  /welcome
                                               ├─→ /auth/signup  →  /auth/otp
                                               └─→ /auth/login
                                                     ├─→ /auth/forgot-password  →  /auth/otp
                                                     └─→ /auth/signup
```

---

## 📁 Full Folder Structure

```
artifacts/mobile/
├── app/                              Expo Router file-based routes
│   ├── _layout.tsx                   Root Stack · Inter + Poppins fonts · all screens registered
│   ├── index.tsx                     / → SplashScreen → /onboarding
│   ├── onboarding.tsx                /onboarding → OnboardingScreen → /welcome
│   ├── welcome.tsx                   /welcome → WelcomeScreen → auth routes
│   ├── design-system.tsx             /design-system → DesignSystemScreen (Phase 2 DS)
│   ├── auth/
│   │   ├── login.tsx                 /auth/login
│   │   ├── signup.tsx                /auth/signup
│   │   ├── otp.tsx                   /auth/otp  (accepts ?contact= ?mode=)
│   │   └── forgot-password.tsx       /auth/forgot-password
│   └── (tabs)/                       Orphaned scaffold — unregistered, reserved for Phase 4
│
├── screens/                          Screen components rendered by routes
│   ├── SplashScreen.tsx              Phase 3 · dark bg · orange glow · Flame icon · dots
│   ├── OnboardingScreen.tsx          Phase 3 · 3 slides · illustrations · slide animation
│   ├── WelcomeScreen.tsx             Phase 3 · dark hero · glassmorphism cards · white CTA card
│   ├── DesignSystemScreen.tsx        Phase 2 · scrollable component catalogue
│   ├── index.ts                      Barrel export for all screens + auth screens
│   └── auth/
│       ├── LoginScreen.tsx           Email + password · social buttons · forgot link
│       ├── SignupScreen.tsx          Name · email · phone · password · terms checkbox
│       ├── OTPScreen.tsx             6-digit OTP · countdown timer · resend
│       └── ForgotPasswordScreen.tsx  Email input · info box · send reset link
│
├── components/
│   ├── ErrorBoundary.tsx
│   ├── ErrorFallback.tsx
│   ├── KeyboardAwareScrollViewCompat.tsx
│   └── ui/                           Phase 2 + Phase 3 design system components
│       ├── index.ts                  Full barrel — all 36 components + types
│       │
│       ├── — Phase 3 (new) —
│       ├── PremiumButton.tsx         Poppins · gradient primary · 6 variants · animated press
│       │
│       ├── — Phase 2 Buttons —
│       ├── Button.tsx                5 variants · 3 sizes · loading/disabled · icon slots
│       ├── IconButton.tsx            4 variants · circular
│       ├── FloatingActionButton.tsx  Normal / small / large · extended with label
│       │
│       ├── — Phase 2 Inputs —
│       ├── TextInput.tsx             InputField · labeled · icon slots · error/helper
│       ├── SearchBar.tsx             Pill search · clear button · filter icon
│       ├── OTPInput.tsx              4–6 digit · blinking cursor
│       ├── PasswordField.tsx         Show/hide toggle
│       │
│       ├── — Phase 2 Cards —
│       ├── RestaurantCard.tsx        Image/gradient · rating · delivery info · badges
│       ├── FoodCard.tsx              Horizontal · price · add button
│       ├── OfferCard.tsx             Gradient full-width offer
│       ├── CategoryCard.tsx          Circular icon · selected state
│       ├── BannerCard.tsx            Full-bleed · dark scrim · CTA
│       │
│       ├── — Phase 2 Chips & Badges —
│       ├── Chip.tsx                  6 variants incl. filter with selected state
│       ├── Badge.tsx                 5 variants: rating · deliveryTime · offer · freeDelivery · custom
│       │
│       ├── — Phase 2 Navigation —
│       ├── BottomNavigation.tsx      5 tabs · active dot · notification badge · safe area
│       ├── TopAppBar.tsx             Back · title/subtitle · right actions · safe area
│       ├── SectionHeader.tsx         Title + subtitle + "See all" chevron
│       │
│       ├── — Phase 2 Other —
│       ├── Avatar.tsx                Initials fallback · deterministic color · badge overlay
│       ├── Divider.tsx               Horizontal/vertical · configurable
│       ├── Tag.tsx                   Pill · icon slot · close button
│       ├── QuantitySelector.tsx      −/+ · min/max · haptics · 3 sizes
│       ├── FavoriteButton.tsx        Heart toggle · spring bounce · haptics
│       ├── NotificationBadge.tsx     Count overlay · dot mode · maxCount+
│       │
│       ├── — Phase 2 Loading —
│       ├── SkeletonLoader.tsx        Skeleton + RestaurantCard/FoodCard/ListItem presets
│       ├── CircularLoader.tsx        ActivityIndicator wrapper · full-screen overlay mode
│       │
│       ├── — Phase 2 Empty States —
│       ├── EmptyState.tsx            5 variants: noOrders · noInternet · noSearch · emptyCart · custom
│       │
│       ├── — Phase 2 Dialogs —
│       ├── Dialog.tsx                Spring-in modal · confirmation / success / error
│       │
│       ├── — Phase 2 Notifications —
│       ├── Snackbar.tsx              Bottom slide-up · 4 types · auto-dismiss · action
│       ├── Toast.tsx                 Top slide-down · 4 types · close button
│       │
│       └── — Phase 2 Layout —
│           ├── Typography.tsx
│           └── Spacer.tsx
│
├── theme/
│   ├── index.ts                      Barrel: spacing · typography · borderRadius
│   ├── typography.ts                 Inter-based scale (Phase 2 DS)
│   ├── borderRadius.ts               sm:8 → md:12 → lg:16 → xl:20 → xxl:24 → pill:999
│   ├── spacing.ts
│   └── poppins.ts                    Phase 3 · Poppins scale (displayXL → caption)
│
├── constants/
│   ├── colors.ts                     Primary #FF6B00 · Secondary #22C55E · Dark #111827
│   ├── config.ts                     Delivery config · pagination · app constants
│   └── index.ts
│
├── hooks/
│   └── useColors.ts                  Returns color tokens for current theme
│
├── store/
│   ├── useAppStore.ts                Zustand stub
│   ├── useCartStore.ts               Zustand stub
│   └── useAuthStore.ts               Zustand stub
│
├── types/
│   ├── food.types.ts
│   ├── user.types.ts
│   ├── navigation.types.ts
│   └── index.ts
│
├── api/                              Typed stubs — return 501 until Phase 6
│   ├── client.ts
│   ├── restaurants.ts
│   └── orders.ts
│
├── services/
│   └── supabase.ts                   Commented stub — install in Phase 6
│
├── navigation/
│   └── routes.ts                     ROUTES constants
│
└── utils/
    ├── formatters.ts
    └── validators.ts
```

---

## 📦 Installed Packages

| Package | Version | Purpose |
|---|---|---|
| `expo` | ~54.0.27 | Core framework |
| `expo-router` | ~6.0.17 | File-based routing |
| `react-native` | 0.81.5 | Native runtime |
| `react-native-reanimated` | ~4.1.1 | Animations (Splash, Onboarding, Welcome, PremiumButton) |
| `react-native-gesture-handler` | ~2.28.0 | Gestures |
| `react-native-safe-area-context` | ~5.6.0 | Safe area insets |
| `react-native-screens` | ~4.16.0 | Screen optimization |
| `react-native-svg` | 15.12.1 | SVG (required by lucide-react-native) |
| `expo-linear-gradient` | ~15.0.8 | Gradient backgrounds (Splash, Onboarding, Welcome, PremiumButton) |
| `expo-blur` | ~15.0.8 | Available — not yet used (glassmorphism done via rgba) |
| `expo-haptics` | ~15.0.8 | Haptic feedback (PremiumButton, QuantitySelector, FavoriteButton) |
| `expo-font` | ~14.0.10 | Font loading |
| `expo-constants` | ~18.0.11 | App constants |
| `expo-image` | ~3.0.11 | Optimized images |
| `@expo-google-fonts/inter` | ^0.4.0 | Phase 2 DS — Inter typeface |
| `@expo-google-fonts/poppins` | latest | Phase 3 — Poppins typeface (400/500/600/700/800) |
| `@expo/vector-icons` | ^15.0.3 | Ionicons (illustrations, social login icons) |
| `lucide-react-native` | latest | Phase 3 — Lucide icons (Flame, Mail, Lock, User, Phone, ArrowLeft…) |
| `zustand` | ^5.0.14 | State management |
| `@tanstack/react-query` | catalog | Data fetching (ready for Phase 6) |
| `react-native-keyboard-controller` | 1.18.5 | Keyboard handling (auth screens) |
| `@react-native-async-storage/async-storage` | 2.2.0 | Local storage |

**Not yet installed (deferred):**
- `@supabase/supabase-js` — Phase 6
- `nativewind` — config exists in `tailwind.config.js` but not activated

---

## 🧩 Reusable Components — Full Inventory

### Phase 3 (new)
| Component | Variants | Notes |
|---|---|---|
| `PremiumButton` | primary · dark · ghost · outline · white · social | Poppins · gradient · animated press scale · haptics |

### Phase 2 (existing)
| Component | Description |
|---|---|
| `Button` | Primary / Secondary / Outline / Ghost / Destructive |
| `SearchBar` | Pill · clear · filter icon |
| `Chip` | Veg / NonVeg / Popular / Discount / New / Filter (selected) |
| `RestaurantCard` | Image / gradient placeholder · rating · delivery info · badges |
| `FoodCard` | Horizontal · Chip labels · price · add button |
| `Badge` | Rating / DeliveryTime / Offer / FreeDelivery / Custom |
| `OfferCard` / `BannerCard` | Gradient offer banners |
| `BottomNavigation` | 5 tabs · active dot · notification badge · safe area |
| `QuantitySelector` | −/+ · min/max · 3 sizes · haptics |

---

## ✅ Phase 4 — Premium Home Screen (Complete ✅)

Built the full Home Screen at `screens/HomeScreen.tsx` · route `app/home.tsx`.

| Feature | Detail |
|---|---|
| Header | Location selector · delivery address · notification badge (3) · avatar |
| Search | Rounded pill search bar · search icon · voice hint row with Mic |
| Categories | Horizontal scroll · 9 chips: All, Pizza, Burger, Biryani, Chinese, South Indian, North Indian, Cafe, Desserts |
| Offer Banners | Auto-sliding carousel (3.2 s) · 4 banners: 50% OFF · Free Delivery · Buy 1 Get 1 · Weekend Special · dot indicator |
| Restaurant Sections | Featured · Popular Near You (category-filterable) · Fast Delivery · Top Rated · Recommended — each scrolls horizontally |
| Restaurant Card | Image · name · veg/non-veg indicator · rating pill · delivery time · distance · delivery fee · offer badge · NEW badge · heart favourite |
| Food Cards | Image · veg indicator · name · restaurant name · description · rating · price · Add button |
| Floating Cart | Orange gradient pill · item count · price · spring animation — visible only when cart > 0 |
| Bottom Nav | 4 tabs: Home · Search · Orders · Profile · Orders badge |
| Skeleton Loaders | Premium animated skeletons during 1.5 s simulated load |
| Light / Dark | Full theme support via `useColors()` |
| NativeWind | Installed and activated (v4) · tailwind.config.js · metro.config.js · global.css |
| Dummy Data | `data/homeData.ts` — 10 restaurants · 6 food items · 9 categories · 4 banners |

**Navigation:** Post-auth screens redirect to `/home` (placeholder — final wiring in Phase 6).

---

## ⏳ Pending Phases

### Phase 5 — Cart & Checkout
- Cart screen with QuantitySelector per item
- Address selection UI
- Payment method selection (UI only)
- Order summary & confirmation screen

### Phase 6 — Backend Integration
- Install `@supabase/supabase-js` + add env vars
- Uncomment `services/supabase.ts` client
- Wire Zustand auth/cart/app stores to real API
- Replace 501 stubs in `api/`

### Phase 7 — Profile & Orders
- User profile screen
- Order history list
- Address management
- Notification preferences

---

## ⚠️ Known Issues

| Issue | Severity | Status |
|---|---|---|
| `shadow*` props deprecated on web | Low | Non-blocking · native shadows work fine · replace with `boxShadow` in a future cleanup pass |
| `props.pointerEvents` deprecation | Low | Non-blocking · migrate to `style.pointerEvents` in future |
| `app/(tabs)/` scaffold orphaned | Low | Exists from initial scaffold · unregistered · will be wired in Phase 4 |
| Supabase not installed | Intentional | Stub in `services/supabase.ts` · install in Phase 6 |
| NativeWind not activated | Intentional | `tailwind.config.js` exists · activate in future if needed |

---

## 🚀 Next Phase to Start

**Phase 10 — To be defined**

Do not start until the next product scope is agreed.

---

*Workflow running. Zero TypeScript errors. Phases 1–9 complete. Waiting for Phase 10 scope.*
