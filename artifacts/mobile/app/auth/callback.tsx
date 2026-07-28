// ─── Auth Callback Route ───────────────────────────────────────────────────────
// This route is registered so Expo Router accepts cravio://auth/callback deep
// links without a "not found" error.  It renders a loading indicator while the
// session is being established.
//
// ALL token extraction, session establishment, and post-auth navigation live
// exclusively in the root _layout.tsx:
//   • Linking.getInitialURL()  → cold-start deep links
//   • Linking.addEventListener → foreground deep links
//   • onAuthStateChange        → redirects to /home once session is live
//
// This screen does NO navigation itself — it simply waits.  The AuthGuard in
// _layout.tsx will redirect away from it as soon as the session resolves.
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useColors } from '@/hooks/useColors';
import { PP } from '@/theme/poppins';

export default function AuthCallbackScreen() {
  const colors = useColors();

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
  },
});
