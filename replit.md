# Cravio

A food delivery mobile app (Expo / React Native / TypeScript) — Phases 1–6 complete, Phase 7 pending.

## Run & Operate

- **Mobile app:** managed workflow `artifacts/mobile: expo` — `pnpm --filter @workspace/mobile run dev`
- `pnpm run typecheck` — full typecheck across all packages

## Stack

- pnpm workspaces, Node.js, TypeScript
- Mobile: Expo ~54 + Expo Router (file-based routing), React Native
- UI: Reanimated, NativeWind (v4), Linear Gradient, Lucide icons, Poppins + Inter fonts
- State: Zustand
- Backend: Supabase (auth, database, RLS)
- pnpm monorepo with `artifacts/mobile` as the main artifact

## Where things live

- `artifacts/mobile/app/` — Expo Router file-based routes
- `artifacts/mobile/screens/` — screen components
- `artifacts/mobile/components/ui/` — 36+ reusable design system components
- `artifacts/mobile/services/` — Supabase client + auth/user/order/favorite/address services
- `artifacts/mobile/store/` — Zustand stores (auth, cart, orders, favorites, addresses, user)
- `artifacts/mobile/services/schema.sql` — Supabase schema with RLS (must be applied manually)
- `PROJECT_STATUS.md` — detailed phase tracker, known issues, and next steps

## Architecture decisions

- File-based routing via Expo Router; screens live in `screens/` and are rendered by thin route files in `app/`
- Design tokens and brand colors: `constants/colors.ts` (#FF6B00 orange, #22C55E green, #111827 dark)
- Supabase client initialized in `services/supabase.ts` using `EXPO_PUBLIC_SUPABASE_URL` + `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- Auth guard in `app/_layout.tsx` — protects post-auth routes, redirects unauthenticated → `/welcome`
- NativeWind v4 active (tailwind.config.js + metro.config.js + global.css)

## Environment

| Secret | Status |
|--------|--------|
| `EXPO_PUBLIC_SUPABASE_URL` | ✅ Set |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | ✅ Set |

## Product — Completed Phases

- Phase 1: Architecture scaffold
- Phase 2: Design system (36+ components, Inter typeface)
- Phase 3: Pre-auth screens (Splash, Onboarding, Welcome, Login, Signup, OTP, Forgot Password)
- Phase 4: Home Screen (categories, banners, restaurant cards, floating cart, bottom nav)
- Phase 5: Restaurant Details + Cart + Checkout
- Phase 6: Profile, Orders, Favorites, Addresses — screens + Supabase services + Zustand stores

**Phase 7 next:** Search screen (`screens/SearchScreen.tsx` + `app/search.tsx`)

⚠️ **Blocker:** `artifacts/mobile/services/schema.sql` must be applied in the Supabase SQL Editor before auth/data features work.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- `EXPO_PUBLIC_*` vars are baked into the Metro bundle at dev-server start — restart the workflow after changing secrets
- The managed workflow is `artifacts/mobile: expo`; do not create a duplicate manual workflow for the same port
- `shadow*` props and `props.pointerEvents` show deprecation warnings on web — non-blocking, native works fine
- `@types/react` minor version mismatch warning from Expo CLI — non-blocking

## Pointers

- See `PROJECT_STATUS.md` for completed phases, verified screens, pending phases, and known issues
- See the `pnpm-workspace` skill for workspace structure and TypeScript setup
