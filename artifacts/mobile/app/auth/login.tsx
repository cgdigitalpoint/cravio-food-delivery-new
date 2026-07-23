// ─── Route: /auth/login ───────────────────────────────────────────────────────
import React from 'react';
import { useRouter } from 'expo-router';
import { LoginScreen } from '@/screens';
import { useAuthStore } from '@/store/useAuthStore';

export default function LoginRoute() {
  const router = useRouter();
  const { login, isLoading, error, setError } = useAuthStore();

  const handleLogin = async (email: string, password: string) => {
    setError(null);
    try {
      await login(email, password);
      router.replace('/home');
    } catch (_) {
      // Error is already set in the store
    }
  };

  return (
    <LoginScreen
      onBack={() => router.back()}
      onLogin={handleLogin}
      onSignUp={() => { setError(null); router.push('/auth/signup'); }}
      onForgotPassword={() => { setError(null); router.push('/auth/forgot-password'); }}
      isLoading={isLoading}
      error={error}
    />
  );
}
