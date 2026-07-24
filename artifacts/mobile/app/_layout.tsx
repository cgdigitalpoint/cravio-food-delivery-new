// ─── Root Layout ──────────────────────────────────────────────────────────────
import React, { useEffect } from 'react';
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
import * as SplashScreen from 'expo-splash-screen';
import { supabase } from '@/services/supabase';
import { useAuthStore } from '@/store/useAuthStore';

// Prevent the native splash screen from auto-hiding before assets load.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

// Protected route segments — redirect to /welcome if unauthenticated
const PROTECTED = new Set(['home', 'search', 'profile', 'orders', 'favorites', 'recently-viewed', 'address', 'restaurant', 'cart', 'checkout', 'order-success', 'order-failure', 'invoice']);
// Auth-only segments — redirect to /home if already authenticated
const AUTH_ONLY = new Set(['auth']);

function AuthGuard() {
  const router = useRouter();
  const segments = useSegments();
  const { isAuthenticated, setAuthenticatedUser, setUnauthenticated, loadProfile } = useAuthStore();

  // Subscribe to Supabase auth state on mount
  useEffect(() => {
    const subscription = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setAuthenticatedUser(session.user.id);
        loadProfile(session.user.id);
      } else {
        setUnauthenticated();
      }
    });
    return () => subscription.data.subscription.unsubscribe();
  }, []);

  // Route guard — runs whenever auth state or segments change
  useEffect(() => {
    const seg0 = segments[0] as string | undefined;
    if (!seg0) return; // still on splash — let it self-route

    if (isAuthenticated && AUTH_ONLY.has(seg0)) {
      router.replace('/home');
    } else if (!isAuthenticated && PROTECTED.has(seg0)) {
      router.replace('/welcome');
    }
  }, [isAuthenticated, segments]);

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

        {/* ── Phase 4: Home ── */}
        <Stack.Screen name="home" options={{ animation: 'slide_from_right' }} />

        {/* ── Phase 7: Search & Discovery ── */}
        <Stack.Screen name="search" options={{ animation: 'fade' }} />

        {/* ── Phase 5: Restaurant · Cart · Checkout ── */}
        <Stack.Screen name="restaurant/[id]" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="cart" options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="checkout" options={{ animation: 'slide_from_right' }} />

        {/* ── Phase 6: Profile & supporting screens ── */}
        <Stack.Screen name="profile" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="orders" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="orders/[id]" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="favorites" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="recently-viewed" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="address/index" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="address/new" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="address/[id]" options={{ animation: 'slide_from_right' }} />

        {/* ── Phase 10B: Order Success / Failure / Invoice ── */}
        <Stack.Screen name="order-success" options={{ animation: 'fade', gestureEnabled: false }} />
        <Stack.Screen name="order-failure" options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="invoice/[id]" options={{ animation: 'slide_from_right' }} />

        {/* ── Design system (Phase 2) ── */}
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

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <GestureHandlerRootView>
            <KeyboardProvider>
              <RootLayoutNav />
            </KeyboardProvider>
          </GestureHandlerRootView>
        </QueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
