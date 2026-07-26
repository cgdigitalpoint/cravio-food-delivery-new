// ─── Route: /auth/signup ──────────────────────────────────────────────────────
import React from 'react';
import { useRouter } from 'expo-router';
import { SignupScreen } from '@/screens';
import { useAuthStore } from '@/store/useAuthStore';

export default function SignupRoute() {
  const router = useRouter();
  const { register, isLoading, error, setError } = useAuthStore();

  const handleSignUp = async (name: string, email: string, phone: string, password: string) => {
    setError(null);
    try {
      const needsVerification = await register(email, password, name, phone || undefined);
      if (needsVerification) {
        // Email confirmation required — send to OTP/verification screen
        router.replace({ pathname: '/auth/otp', params: { email, mode: 'signup' } });
      } else {
        router.replace('/home');
      }
    } catch (_) {
      // Error already set in store
    }
  };

  return (
    <SignupScreen
      onBack={() => router.back()}
      onLogin={() => { setError(null); router.push('/auth/login'); }}
      onSignUp={handleSignUp}
      isLoading={isLoading}
      error={error}
    />
  );
}
