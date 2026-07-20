// ─── Route: /auth/login ───────────────────────────────────────────────────────
import React from 'react';
import { useRouter } from 'expo-router';
import { LoginScreen } from '@/screens';

export default function LoginRoute() {
  const router = useRouter();

  return (
    <LoginScreen
      onBack={() => router.back()}
      onLogin={() => router.replace('/welcome')}
      onSignUp={() => router.push('/auth/signup')}
      onForgotPassword={() => router.push('/auth/forgot-password')}
    />
  );
}
