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
import { usePartnerAuthStore } from '@/store/usePartnerAuthStore';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

// Segments that require authentication
const PROTECTED = new Set([
  '(tabs)', 'approval-status', 'documents', 'bank-details',
  'gst-details', 'business-hours', 'restaurant-profile',
]);
// Segments only for unauthenticated users
const AUTH_ONLY = new Set(['auth']);

function AuthGuard() {
  const router = useRouter();
  const segments = useSegments();
  const { isAuthenticated, setAuthenticatedUser, setUnauthenticated, loadProfile } = usePartnerAuthStore();

  // Subscribe to Supabase auth state
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setAuthenticatedUser(session.user.id);
        void loadProfile(session.user.id);
      } else {
        setUnauthenticated();
      }
    });
    return () => data.subscription.unsubscribe();
  }, []);

  // Route guard
  useEffect(() => {
    const seg0 = segments[0] as string | undefined;
    if (!seg0) return;
    if (isAuthenticated && AUTH_ONLY.has(seg0)) {
      router.replace('/(tabs)');
    } else if (!isAuthenticated && PROTECTED.has(seg0)) {
      router.replace('/auth/login');
    }
  }, [isAuthenticated, segments]);

  return null;
}

function RootLayoutNav() {
  return (
    <>
      <AuthGuard />
      <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="auth/login" options={{ animation: 'fade' }} />
        <Stack.Screen name="auth/signup" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="auth/forgot-password" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
        <Stack.Screen name="approval-status" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="documents" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="bank-details" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="gst-details" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="business-hours" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="restaurant-profile" options={{ animation: 'slide_from_right' }} />
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
      void SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

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
