// ─── Supabase Client Configuration ────────────────────────────────────────────
//
// Phase 1: Configuration stub.
// Phase 2 activation steps:
//   1. pnpm --filter @workspace/mobile add @supabase/supabase-js
//   2. Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in .env
//   3. Uncomment the createClient block below
//
// import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env['EXPO_PUBLIC_SUPABASE_URL'] ?? '';
const SUPABASE_ANON_KEY = process.env['EXPO_PUBLIC_SUPABASE_ANON_KEY'] ?? '';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  // Expected in Phase 1 — set env vars before Phase 2
  if (__DEV__) {
    console.warn(
      '[Cravio] Supabase env vars not set.\n' +
        'Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in .env'
    );
  }
}

/** Supabase project config — use this before instantiating the client. */
export const supabaseConfig = {
  url: SUPABASE_URL,
  anonKey: SUPABASE_ANON_KEY,
} as const;

// Phase 2: uncomment and export the real client
//
// export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
//   auth: {
//     autoRefreshToken: true,
//     persistSession: true,
//     detectSessionInUrl: false,
//     storage: AsyncStorage, // from @react-native-async-storage/async-storage
//   },
// });
