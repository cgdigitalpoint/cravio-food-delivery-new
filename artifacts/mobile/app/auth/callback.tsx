// ─── Auth Callback Route ───────────────────────────────────────────────────────
// This route is registered so Expo Router can route cravio://auth/callback
// deep links internally.  The actual token extraction + session establishment
// happens in the root _layout.tsx deep-link listener, which fires before any
// route is rendered.  This screen simply shows a brief loading indicator so
// the user sees something while the session resolves.
import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import * as Linking from 'expo-linking';
import { authService } from '@/services/authService';
import { useColors } from '@/hooks/useColors';
import { PP } from '@/theme/poppins';

export default function AuthCallbackScreen() {
  const router = useRouter();
  const colors = useColors();

  useEffect(() => {
    // Grab the URL that opened this screen (works for both cold-start and
    // foreground-resume deep links).
    Linking.getInitialURL().then(async (url) => {
      if (url) {
        await authService.handleDeepLink(url);
      }
      // The onAuthStateChange listener in _layout.tsx will redirect the user
      // once the session is established.  If no session arrives within a short
      // window, send them to the welcome screen so they're not stuck.
      setTimeout(() => {
        router.replace('/welcome');
      }, 3000);
    });
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={[PP.bodySM, { color: colors.mutedForeground, marginTop: 16 }]}>
        Verifying your account…
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
});
