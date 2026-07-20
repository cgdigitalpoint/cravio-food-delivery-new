// ─── Route: /auth/signup ──────────────────────────────────────────────────────
import React from 'react';
import { useRouter } from 'expo-router';
import { SignupScreen } from '@/screens';

export default function SignupRoute() {
  const router = useRouter();

  return (
    <SignupScreen
      onBack={() => router.back()}
      onLogin={() => router.push('/auth/login')}
      onSignUp={() => router.push('/auth/otp')}
    />
  );
}
