# Cravio Partner App — Project Status

> Last updated: 2026-07-25
> App: Restaurant Partner Mobile App (Expo / React Native / TypeScript)
> Artifact: `artifacts/partner` · Workflow: `artifacts/partner: expo` (RUNNING)
> Supabase: shared instance with customer app — separate partner tables only

---

## ✅ Completed Phases

### Phase 11A — Restaurant Partner App Foundation (Complete ✅)

Bootstrapped a fully independent Expo partner app alongside the customer app. No code shared with `artifacts/mobile`.

#### Architecture

| Layer | Detail |
|---|---|
| Routing | Expo Router file-based: `app/_layout.tsx` (root + AuthGuard) → `app/(tabs)/` (3 tabs) + modal stacks |
| State | Zustand: `usePartnerAuthStore` · `useRestaurantStore` |
| Styling | NativeWind v4, `tailwind.config.js`, `global.css`, brand tokens in `constants/colors.ts` |
| Typography | `theme/poppins.ts` — Poppins scale PP.h1–PP.captionSM (same as customer app) |
| Backend | Supabase (`services/supabase.ts`) — 6 partner-only tables, never touches customer-facing tables |

#### Screens & Features

| Screen | Path | Detail |
|---|---|---|
| Login | `app/auth/login.tsx` | Email/password, forgot/signup links |
| Sign Up | `app/auth/signup.tsx` | Name, email, phone, password, confirm, terms checkbox |
| Forgot Password | `app/auth/forgot-password.tsx` | Email input + success state |
| Dashboard | `app/(tabs)/index.tsx` | Greeting, approval status card, open/close Switch, 6 quick-action tiles |
| Restaurant Hub | `app/(tabs)/restaurant.tsx` | Links to all 6 management screens |
| Account | `app/(tabs)/account.tsx` | Partner info, logout |
| Restaurant Profile | `app/restaurant-profile.tsx` | Full form: name, cuisine, address, contact, delivery settings |
| Approval Status | `app/approval-status.tsx` | Timeline stepper + rejection reason |
| Documents | `app/documents.tsx` | 5 doc types, expo-image-picker, per-doc status badge |
| Bank Details | `app/bank-details.tsx` | Account number (confirmed), IFSC validation |
| GST Details | `app/gst-details.tsx` | 15-char GST regex validation |
| Business Hours | `app/business-hours.tsx` | 7-day toggle + 30-min time picker, "Apply to All" |

#### Database Schema (`services/schema.sql`)

| Table | Purpose |
|---|---|
| `restaurant_partners` | Auth-linked partner profiles |
| `partner_restaurants` | Restaurant submission (admin promotes to `restaurants` on approval) |
| `restaurant_documents` | Document uploads with approval status |
| `bank_details` | Bank account info |
| `gst_details` | GST registration |
| `business_hours` | Per-day open/close windows |

All tables have Row-Level Security policies — partners can only read/write their own rows.

#### Shared UI Components (`components/ui/`)

- `PremiumButton` — gradient/variant button with haptics
- `InputField` — labeled input with focus ring, icons, error
- `PasswordInput` — show/hide password wrapper
- `StatusBadge` — colored pill for ApprovalStatus / DocumentStatus
- `TopAppBar` — header with back button and optional right element

**Verification:** `pnpm run typecheck` → 0 errors. Expo Metro starts cleanly.

---

## ⏳ Pending Phases

### Phase 11B — Document Upload & Storage
- Wire `DocumentsScreen` to Supabase Storage (bucket: `partner-documents`)
- Upload file on pick, store public URL in `restaurant_documents.file_url`
- Download / re-upload existing documents

### Phase 11C — Admin Super Panel
- Web artifact for Cravio admins
- List pending partner applications with document viewer
- Approve / reject with reason → promotes `partner_restaurants` row to `restaurants`
- Manage existing restaurant listings

### Phase 11D — Live Data & Notifications
- Replace dummy data in DashboardScreen with real Supabase queries
- Push notification for approval status changes (Expo Push Notifications)
- In-app notification bell

---

## ⚠️ Known Issues

| Issue | Severity | Status |
|---|---|---|
| Document upload stores local URI only | Intentional | Supabase Storage upload deferred to Phase 11B |
| NativeTabs SF Symbols for restaurant/account tabs | Low | ClassicTabLayout fallback uses Lucide icons (safe on all versions) |
| `@types/react` minor version mismatch | Low | Non-blocking — Expo ecosystem warning, not a type error |

---

*Zero TypeScript errors. Phase 11A complete. Ready for Phase 11B.*
