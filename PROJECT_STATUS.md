# Cravio — Project Status

> Last updated: 2026-07-20
> App: Food Delivery Mobile App (Expo / React Native / TypeScript)
> Artifact: `artifacts/mobile` · Workflow: `artifacts/mobile: expo` (RUNNING)

---

## ✅ Completed Phases

### Phase 1 — Architecture (Complete)
Scaffolded the entire project skeleton: routing, state management, types, API stubs, utility functions, and configuration constants. No business logic, no backend calls.

### Phase 2 — Design System (Complete)
Built 35+ reusable UI components (buttons, inputs, cards, chips, badges, navigation, loading states, empty states, dialogs, snackbars, toasts). All powered by Inter typeface and brand color tokens. Includes a live `DesignSystemScreen` documentation page at `/design-system`.

### Phase 3 — Premium UI Foundation (Complete — current session)
Built all pre-auth screens with premium Poppins typography, Reanimated animations, glassmorphism, gradients, and Lucide icons. Full navigation flow: Splash → Onboarding → Welcome → Auth.

---

## 📁 Folder Structure

```
artifacts/mobile/
├── app/                          # Expo Router file-based routes
│   ├── _layout.tsx               # Root Stack — loads Inter + Poppins, all screens registered
│   ├── index.tsx                 # / → SplashScreen → /onboarding
│   ├── onboarding.tsx            # /onboarding → OnboardingScreen → /welcome
│   ├── welcome.tsx               # /welcome → WelcomeScreen → /auth/login or /auth/signup
│   ├── design-system.tsx         # /design-system → DesignSystemScreen
│   ├── auth/
│   │   ├── login.tsx             # /auth/login
│   │   ├── signup.tsx            # /auth/signup
│   │   ├── otp.tsx               # /auth/otp (accepts ?contact= ?mode=)
│   │   └── forgot-password.tsx   # /auth/forgot-password
│   └── (tabs)/                   # Orphaned scaffold tabs — unregistered, do not delete
│
├── screens/                      # Screen components (rendered by routes)
│   ├── SplashScreen.tsx          # Phase 3 — dark bg, orange glow, Flame icon, animated dots
│   ├── OnboardingScreen.tsx      # Phase 3 — 3 slides, illustrations, dot indicator, Skip/Next
│   ├── WelcomeScreen.tsx         # Phase 3 — dark hero, floating cards, white bottom card
│   ├── DesignSystemScreen.tsx    # Phase 2 — scrollable component catalogue
│   ├── index.ts                  # Barrel export for all screens
│   └── auth/
│       ├── LoginScreen.tsx       # Email + password, social buttons, forgot password link
│       ├── SignupScreen.tsx      # Name, email, phone, password, terms checkbox
│       ├── OTPScreen.tsx         # 6-digit OTP boxes, countdown timer, resend
│       └── ForgotPasswordScreen.tsx  # Email input, send reset link CTA
│
├── components/
│   ├── ErrorBoundary.tsx
│   ├── ErrorFallback.tsx
│   ├── KeyboardAwareScrollViewCompat.tsx
│   └── ui/                       # Phase 2 Design System components
│       ├── index.ts              # Full barrel — exports all 36 components + types
│       ├── — Buttons —
│       ├── Button.tsx            # 5 variants, 3 sizes, loading/disabled, icon slots
│       ├── IconButton.tsx        # Circular icon button, 4 variants
│       ├── FloatingActionButton.tsx
│       ├── PremiumButton.tsx     # Phase 3 — Poppins gradient button, 6 variants
│       ├── — Inputs —
│       ├── TextInput.tsx         # InputField — labeled input, icon slots, error/helper
│       ├── SearchBar.tsx         # Pill search with clear + filter
│       ├── OTPInput.tsx          # 4–6 digit OTP with blinking cursor
│       ├── PasswordField.tsx     # Password with show/hide toggle
│       ├── — Cards —
│       ├── RestaurantCard.tsx    # Image/gradient, rating, delivery info, badges
│       ├── FoodCard.tsx          # Horizontal layout, Chip labels, add button
│       ├── OfferCard.tsx         # Gradient full-width offer banner
│       ├── CategoryCard.tsx      # Circular icon + name, selected state
│       ├── BannerCard.tsx        # Full-bleed banner with dark scrim
│       ├── — Chips & Badges —
│       ├── Chip.tsx              # 6 variants incl. filter (selected state)
│       ├── Badge.tsx             # 5 variants: rating, deliveryTime, offer, freeDelivery, custom
│       ├── — Navigation —
│       ├── BottomNavigation.tsx  # 5-tab bar, active dot, notification badge, safe area
│       ├── TopAppBar.tsx         # Back button, title/subtitle, right actions, safe area
│       ├── SectionHeader.tsx     # Title + subtitle + "See all" chevron
│       ├── — Other —
│       ├── Avatar.tsx            # Initials fallback, deterministic color, badge overlay
│       ├── Divider.tsx           # Horizontal/vertical, configurable
│       ├── Tag.tsx               # Pill tag, icon slot, close button
│       ├── QuantitySelector.tsx  # −/count/+, min/max, haptics, 3 sizes
│       ├── FavoriteButton.tsx    # Heart toggle, spring bounce, haptics
│       ├── NotificationBadge.tsx # Count overlay, dot mode, maxCount+ truncation
│       ├── — Loading —
│       ├── SkeletonLoader.tsx    # Skeleton + RestaurantCard/FoodCard/ListItem presets
│       ├── CircularLoader.tsx    # ActivityIndicator wrapper, full-screen overlay mode
│       ├── — Empty States —
│       ├── EmptyState.tsx        # 5 variants: noOrders, noInternet, noSearch, emptyCart, custom
│       ├── — Dialogs —
│       ├── Dialog.tsx            # Spring-in modal, 3 variants: confirmation, success, error
│       ├── — Notifications —
│       ├── Snackbar.tsx          # Bottom slide-up, 4 types, auto-dismiss, action text
│       ├── Toast.tsx             # Top slide-down, 4 types, close button
│       ├── — Layout —
│       ├── Typography.tsx
│       └── Spacer.tsx
│
├── theme/
│   ├── index.ts                  # Barrel: spacing, typography, borderRadius
│   ├── typography.ts             # Inter-based scale (Phase 2 DS)
│   ├── borderRadius.ts           # sm:8 → md:12 → lg:16 → xl:20 → xxl:24 → pill:999
│   ├── spacing.ts
│   └── poppins.ts                # Phase 3 — Poppins scale (displayXL → caption)
│
├── constants/
│   ├── colors.ts                 # Brand tokens: primary #FF6B00, secondary #22C55E, dark #111827
│   ├── config.ts                 # App constants (delivery config, pagination, etc.)
│   └── index.ts
│
├── hooks/
│   └── useColors.ts              # Returns color tokens for current theme
│
├── store/
│   ├── useAppStore.ts            # App state (Zustand stub)
│   ├── useCartStore.ts           # Cart state (Zustand stub)
│   └── useAuthStore.ts           # Auth state (Zustand stub)
│
├── types/
│   ├── food.types.ts
│   ├── user.types.ts
│   ├── navigation.types.ts
│   └── index.ts
│
├── api/                          # Typed API stubs (return 501)
│   ├── client.ts
│   ├── restaurants.ts
│   └── orders.ts
│
├── services/
│   └── supabase.ts               # Config stub — not installed yet
│
├── navigation/
│   └── routes.ts                 # ROUTES constants
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
| `react-native-reanimated` | ~4.1.1 | Animations |
| `react-native-gesture-handler` | ~2.28.0 | Gestures |
| `react-native-safe-area-context` | ~5.6.0 | Safe area insets |
| `react-native-screens` | ~4.16.0 | Screen optimization |
| `react-native-svg` | 15.12.1 | SVG support |
| `expo-linear-gradient` | ~15.0.8 | Gradient backgrounds |
| `expo-blur` | ~15.0.8 | Blur / glassmorphism |
| `expo-haptics` | ~15.0.8 | Haptic feedback |
| `expo-font` | ~14.0.10 | Font loading |
| `expo-constants` | ~18.0.11 | App constants |
| `expo-image` | ~3.0.11 | Optimized images |
| `@expo-google-fonts/inter` | ^0.4.0 | Phase 2 — Inter typeface |
| `@expo-google-fonts/poppins` | latest | Phase 3 — Poppins typeface |
| `@expo/vector-icons` | ^15.0.3 | Ionicons + other icon sets |
| `lucide-react-native` | latest | Phase 3 — Lucide icon set |
| `zustand` | ^5.0.14 | State management |
| `@tanstack/react-query` | catalog | Data fetching |
| `react-native-keyboard-controller` | 1.18.5 | Keyboard handling |
| `@react-native-async-storage/async-storage` | 2.2.0 | Local storage |

**Not yet installed (deferred):**
- `@supabase/supabase-js` — pending Phase 4
- `nativewind` — NativeWind v4 config exists but not activated

---

## ✅ Completed Screens (Phase 3)

| Screen | Route | Status | Notes |
|---|---|---|---|
| Splash Screen | `/` | ✅ Complete | Dark bg, orange radial glow, Flame icon, Poppins wordmark, animated dots |
| Onboarding | `/onboarding` | ✅ Complete | 3 slides, Reanimated slide transitions, content fade, dot pill indicator, Skip/Next |
| Welcome | `/welcome` | ✅ Complete | Dark hero, floating glassmorphism cards, food category pills, white bottom card |
| Login | `/auth/login` | ✅ Complete | Social buttons, email/password, forgot link, sign up link |
| Sign Up | `/auth/signup` | ✅ Complete | Name/email/phone/password, terms checkbox, login link |
| OTP Verification | `/auth/otp` | ✅ Complete | 6-digit OTP boxes, countdown timer, resend, accepts `?contact` param |
| Forgot Password | `/auth/forgot-password` | ✅ Complete | Email input, info box, send reset link CTA |

**Navigation flow:**
```
/ (Splash)
  └─→ /onboarding (after 2.8s auto)
        └─→ /welcome (Skip or last Next)
              ├─→ /auth/signup  (Get Started)
              │     └─→ /auth/otp
              └─→ /auth/login   (Log In)
                    ├─→ /auth/forgot-password
                    │     └─→ /auth/otp
                    └─→ /auth/signup
```

---

## 🧩 Reusable Components Created

### Phase 3 (new)
| Component | File | Description |
|---|---|---|
| `PremiumButton` | `components/ui/PremiumButton.tsx` | Poppins, gradient primary, 6 variants, animated press scale, haptics |

### Phase 2 (existing, fully reusable)
| Component | Key Variants |
|---|---|
| `Button` | primary / secondary / outline / ghost / destructive |
| `SearchBar` | pill shape, clear button, filter icon |
| `Chip` | veg / nonVeg / popular / discount / new / filter |
| `RestaurantCard` | image/gradient, rating, delivery info, badges |
| `FoodCard` | horizontal, price, add button |
| `Badge` | rating / deliveryTime / offer / freeDelivery |
| `OfferCard` / `BannerCard` | gradient banners |
| `BottomNavigation` | 5 tabs, active dot, notification badge |
| `QuantitySelector` | −/+, min/max, 3 sizes |

---

## ⏳ Pending Tasks

### Phase 4 — Home Screen & Restaurant Discovery
- Bottom tab navigator (`app/(tabs)/`)
- Home screen: search bar, category chips, offer banners, restaurant list
- Restaurant detail screen
- Menu / item detail
- Cart sheet

### Phase 5 — Cart & Checkout
- Cart screen with quantity selectors
- Address selection
- Payment method selection (UI only)
- Order summary & confirmation

### Phase 6 — Backend Integration
- Install `@supabase/supabase-js`
- Add env vars: `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- Uncomment `services/supabase.ts` client
- Wire Zustand stores to real API calls
- Replace stub API functions in `api/`

### Phase 7 — Profile & Orders
- User profile screen
- Order history
- Address management
- Notification preferences

---

## ⚠️ Known Issues

| Issue | Severity | Notes |
|---|---|---|
| `shadow*` props deprecated on web | Low | `shadowColor/Offset/Opacity/Radius` trigger a web warning. Replace with `boxShadow` for web parity. Non-blocking on native. |
| `app/(tabs)/` scaffold files orphaned | Low | `app/(tabs)/index.tsx` and `_layout.tsx` exist from initial scaffold but are unregistered in the root Stack. Do not delete — will be wired in Phase 4. |
| Supabase not installed | Intentional | `services/supabase.ts` is a commented stub. Install in Phase 6. |
| NativeWind not activated | Intentional | `tailwind.config.js` exists. To activate: install `nativewind@^4 tailwindcss`, add `withNativeWind` to `metro.config.js`, create `global.css`. Deferred. |
| `pointerEvents` prop deprecation | Low | RN props-based `pointerEvents` deprecated; migrate to `style.pointerEvents`. Non-blocking. |

---

## 🚀 Next Phase to Start

**Phase 4 — Home Screen & Restaurant Discovery**

Start by activating the `(tabs)` layout in `app/(tabs)/`:
1. Register `(tabs)` as a route group in `app/_layout.tsx`
2. Build `BottomNavigation` tab bar (reuse Phase 2 component)
3. Home tab: search, categories, banners, restaurant cards
4. Restaurants use dummy data arrays (no backend yet)

---

*All workflows are running. Project is in a clean, stable state. Waiting for next instruction.*
