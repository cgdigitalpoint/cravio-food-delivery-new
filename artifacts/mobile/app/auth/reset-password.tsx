// ─── Route: /auth/reset-password ─────────────────────────────────────────────
// Reached when the cravio://auth/callback deep link carries type=recovery.
// By the time the user lands here, their session is already live (established
// by the PASSWORD_RECOVERY handler in _layout.tsx).  They just enter a new pw.
import React from 'react';
import { useRouter } from 'expo-router';
import { ResetPasswordScreen } from '@/screens';
import { useAuthStore } from '@/store/useAuthStore';

export default function ResetPasswordRoute() {
  const router = useRouter();
  const { resetPassword, isLoading, error, setError } = useAuthStore();

  const handleReset = async (newPassword: string) => {
    setError(null);
    try {
      await resetPassword(newPassword);
      // Success — navigate to home; the user is now fully authenticated.
      router.replace('/home');
    } catch (_) {
      // Error already set in store
    }
  };

  return (
    <ResetPasswordScreen
      onReset={handleReset}
      onBack={() => { setError(null); router.replace('/auth/login'); }}
      isLoading={isLoading}
      error={error}
    />
  );
}
