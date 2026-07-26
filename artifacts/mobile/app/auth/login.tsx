// ─── Route: /auth/login ───────────────────────────────────────────────────────
import React from 'react';
import { useRouter } from 'expo-router';
import { LoginScreen } from '@/screens';
import { useAuthStore } from '@/store/useAuthStore';

export default function LoginRoute() {
  const router = useRouter();
  const { login, loginWithGoogle, isLoading, error, setError } = useAuthStore();

  const handleLogin = async (email: string, password: string) => {
    setError(null);
    try {
      await login(email, password);
      router.replace('/home');
    } catch (_) {
      // Error is already set in the store
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    try {
      await loginWithGoogle();
      // Auth state change will trigger navigation via AuthGuard in _layout.tsx
    } catch (_) {
      // Error already set in store
    }
  };

  return (
    <LoginScreen
      onBack={() => router.back()}
      onLogin={handleLogin}
      onGoogleLogin={handleGoogleLogin}
      onSignUp={() => { setError(null); router.push('/auth/signup'); }}
      onForgotPassword={() => { setError(null); router.push('/auth/forgot-password'); }}
      isLoading={isLoading}
      error={error}
    />
  );
}
