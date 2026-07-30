// ─── Root Layout ──────────────────────────────────────────────────────────────
import React, { useEffect, useRef, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/poppins';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as Linking from 'expo-linking';
import * as SplashScreen from 'expo-splash-screen';
import { supabase } from '@/services/supabase';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/store/useAuthStore';

// Prevent the native splash screen from auto-hiding before assets load.
SplashScreen.preventAutoHideAsync();

// Increase the font timeout so a slow network doesn't block the app forever.
const FONT_TIMEOUT_MS = 5000;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes — reduces redundant refetches
    },
  },
});

// Protected route segments — redirect to /welcome if unauthenticated
const PROTECTED = new Set(['home', 'search', 'profile', 'profile-edit', 'orders', 'favorites', 'recently-viewed', 'address', 'restaurant', 'cart', 'checkout', 'order-success', 'order-failure', 'invoice', 'donations', 'donation-management', 'legal', 'about', 'delete-account']);
// Auth-only segments — redirect to /home if already authenticated
const AUTH_ONLY = new Set(['auth']);

/** Process an incoming deep link URL.  If it's a cravio://auth/callback link
 *  (from email verification, password reset, or Google OAuth), extract the
 *  tokens and establish a Supabase session.  The onAuthStateChange listener
 *  below will then redirect the user automatically.
 */
async function processDeepLink(url: string | null) {
  if (!url) return;
  await authService.handleDeepLink(url);
}

function AuthGuard() {
  const router = useRouter();
  const segments = useSegments();
  const { isAuthenticated, setAuthenticatedUser, setUnauthenticated, loadProfile } = useAuthStore();
  const [authReady, setAuthReady] = useState(false);
  // Tracks whether we entered a PASSWORD_RECOVERY flow so we can navigate to
  // /home automatically once the USER_UPDATED event confirms the new password
  // was accepted. Without this, router.replace('/home') in reset-password.tsx
  // fires before isAuthenticated is set, causing the route guard to redirect
  // the user to /welcome instead.
  const postRecovery = useRef(false);

  // ── Deep-link handler ──────────────────────────────────────────────────────
  // Handles two cases:
  //  1. Cold-start: app was closed, user tapped the link → getInitialURL()
  //  2. Foreground: app was open, OS delivers the link → addEventListener
  useEffect(() => {
    // Cold-start link
    Linking.getInitialURL().then(processDeepLink);

    // Foreground / background-resume link
    const sub = Linking.addEventListener('url', ({ url }) => processDeepLink(url));
    return () => sub.remove();
  }, []);

  // ── Supabase auth state subscription ──────────────────────────────────────
  useEffect(() => {
    const subscription = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        // The reset link was clicked. A temporary session is live but the user
        // must choose a new password before we treat them as fully signed in.
        // Do NOT call setAuthenticatedUser here — route them to the reset form.
        postRecovery.current = true;
        setAuthReady(true);
        router.replace('/auth/reset-password');
        return;
      }

      if (session?.user) {
        setAuthenticatedUser(session.user.id);
        loadProfile(session.user.id);

        // USER_UPDATED fires after a successful resetPassword() call. If we
        // entered via PASSWORD_RECOVERY, navigate to /home here — doing it
        // from reset-password.tsx is too early (isAuthenticated is not yet
        // true at that point, so the route guard would redirect to /welcome).
        if (event === 'USER_UPDATED' && postRecovery.current) {
          postRecovery.current = false;
          router.replace('/home');
        }
      } else {
        setUnauthenticated();
      }
      setAuthReady(true);
    });
    return () => subscription.data.subscription.unsubscribe();
  }, []);

  // ── Route guard — runs whenever auth state or segments change ─────────────
  useEffect(() => {
    const seg0 = segments[0] as string | undefined;
    if (!seg0 || !authReady) return; // still resolving the persisted session

    if (isAuthenticated && AUTH_ONLY.has(seg0)) {
      router.replace('/home');
    } else if (!isAuthenticated && PROTECTED.has(seg0)) {
      router.replace('/welcome');
    }
  }, [authReady, isAuthenticated, segments]);

  return null;
}

function RootLayoutNav() {
  return (
    <>
      <AuthGuard />
      <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
        {/* ── Pre-auth flow ── */}
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="welcome" />

        {/* ── Auth screens ── */}
        <Stack.Screen name="auth/login" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="auth/signup" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="auth/otp" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="auth/forgot-password" options={{ animation: 'slide_from_right' }} />
        {/* Deep-link callback — cravio://auth/callback from email/OAuth */}
        <Stack.Screen name="auth/callback" options={{ animation: 'fade', headerShown: false }} />
        {/* Password reset form — reached via PASSWORD_RECOVERY deep link */}
        <Stack.Screen name="auth/reset-password" options={{ animation: 'slide_from_right', headerShown: false }} />

        {/* ── Home ── */}
        <Stack.Screen name="home" options={{ animation: 'slide_from_right' }} />

        {/* ── Search & Discovery ── */}
        <Stack.Screen name="search" options={{ animation: 'fade' }} />

        {/* ── Restaurant · Cart · Checkout ── */}
        <Stack.Screen name="restaurant/[id]" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="cart" options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="checkout" options={{ animation: 'slide_from_right' }} />

        {/* ── Profile & supporting screens ── */}
        <Stack.Screen name="profile" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="profile-edit" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="orders" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="orders/[id]" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="favorites" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="recently-viewed" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="address/index" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="address/new" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="address/[id]" options={{ animation: 'slide_from_right' }} />

        {/* ── Order Success / Failure / Invoice ── */}
        <Stack.Screen name="order-success" options={{ animation: 'fade', gestureEnabled: false }} />
        <Stack.Screen name="order-failure" options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="invoice/[id]" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="donations" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="donation-management" options={{ animation: 'slide_from_right' }} />

        {/* ── Legal Center & Policy docs ── */}
        <Stack.Screen name="legal/index" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="legal/[doc]" options={{ animation: 'slide_from_right' }} />

        {/* ── About & Account ── */}
        <Stack.Screen name="about" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="delete-account" options={{ animation: 'slide_from_right' }} />

        {/* ── Design system (dev only — hidden in production) ── */}
        <Stack.Screen name="design-system" options={{ animation: 'slide_from_right' }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
  });

  // Timeout fallback: if fonts take too long, reveal the app anyway so the
  // user isn't stuck looking at a blank native splash screen.
  const timedOut = useRef(false);
  const [fontTimedOut, setFontTimedOut] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => {
      if (!timedOut.current) {
        timedOut.current = true;
        setFontTimedOut(true);
      }
    }, FONT_TIMEOUT_MS);
    return () => clearTimeout(t);
  }, []);

  const fontsReady = fontsLoaded || !!fontError || fontTimedOut;

  useEffect(() => {
    if (fontsReady) {
      SplashScreen.hideAsync();
    }
  }, [fontsReady]);

  if (!fontsReady) return null;

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <KeyboardProvider>
              <RootLayoutNav />
            </KeyboardProvider>
          </GestureHandlerRootView>
        </QueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
