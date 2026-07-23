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
      await register(email, password, name, phone || undefined);
      router.replace('/home');
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
