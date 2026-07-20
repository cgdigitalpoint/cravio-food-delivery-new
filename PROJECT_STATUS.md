# Cravio — Project Status

> Last updated: 2026-07-20
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

## ⏳ Pending Phases

### Phase 4 — Home Screen & Restaurant Discovery
- Activate `app/(tabs)/` tab navigator
- Home tab: SearchBar · CategoryChip scroll · OfferCard banners · RestaurantCard list
- Restaurant detail screen
- All using dummy data arrays

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

**Phase 4 — Home Screen & Restaurant Discovery**

Entry point: activate `app/(tabs)/` group in `app/_layout.tsx`, replace the orphaned scaffold with a proper tab navigator using the existing `BottomNavigation` component (Phase 2), then build the Home screen reusing RestaurantCard, CategoryCard, OfferCard, SearchBar, Badge, and SectionHeader from Phase 2.

---

*All 3 workflows are running. Project is clean and stable. Waiting for next instruction.*
