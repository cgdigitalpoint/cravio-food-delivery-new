// ─── Route: /welcome ─────────────────────────────────────────────────────────
import React from 'react';
import { useRouter } from 'expo-router';
import { WelcomeScreen } from '@/screens';

export default function WelcomeRoute() {
  const router = useRouter();

  return (
    <WelcomeScreen
      onGetStarted={() => router.push('/auth/signup')}
      onLogIn={() => router.push('/auth/login')}
    />
  );
}
