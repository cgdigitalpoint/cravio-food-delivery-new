# Cravio

A food delivery mobile app (Expo / React Native) with a full pre-auth flow, premium UI, and a design system — ready for Phase 4 (Home Screen & Restaurant Discovery).

## Run & Operate

- **Mobile app:** workflow `Cravio Mobile` — `PORT=18115 pnpm --filter @workspace/mobile run dev`
- `pnpm run typecheck` — full typecheck across all packages

## Stack

- pnpm workspaces, Node.js, TypeScript
- Mobile: Expo ~54 + Expo Router (file-based routing), React Native
- UI: Reanimated, Linear Gradient, Blur, Lucide icons, Poppins + Inter fonts
- State: Zustand
- pnpm monorepo with `artifacts/mobile` as the main artifact

## Where things live

- `artifacts/mobile/app/` — Expo Router file-based routes
- `artifacts/mobile/screens/` — screen components (SplashScreen, OnboardingScreen, WelcomeScreen, auth/*)
- `artifacts/mobile/components/` — 35+ reusable UI components (Phase 2 design system)
- `artifacts/mobile/app/(tabs)/` — orphaned tab scaffold, will be activated in Phase 4
- `PROJECT_STATUS.md` — detailed phase tracker, known issues, and next steps

## Architecture decisions

- File-based routing via Expo Router; screens live in `screens/` and are rendered by thin route files in `app/`
- Design tokens and brand colors defined in `constants/`; all Phase 2+ components use them
- Supabase client stubbed in `services/supabase.ts` — install and wire in Phase 6
- NativeWind config present but not activated — activate if Tailwind utility classes are needed

## Product

Pre-auth flow fully built: Splash → Onboarding (3 slides) → Welcome → Login / Sign Up / OTP / Forgot Password. Phase 4 next: tab navigator, Home screen with restaurant discovery using dummy data.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- `$PORT` is not injected automatically in a manually-configured workflow; the dev command must set `PORT=18115` explicitly
- `app/(tabs)/` scaffold is unregistered until Phase 4 wires it into `app/_layout.tsx`
- `shadow*` props and `props.pointerEvents` show deprecation warnings on web — non-blocking, native works fine

## Pointers

- See `PROJECT_STATUS.md` for completed phases, verified screens, pending phases, and known issues
- See the `pnpm-workspace` skill for workspace structure and TypeScript setup
