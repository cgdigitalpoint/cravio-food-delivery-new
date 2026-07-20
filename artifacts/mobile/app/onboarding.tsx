// ─── Route: /onboarding ───────────────────────────────────────────────────────
import React from 'react';
import { useRouter } from 'expo-router';
import { OnboardingScreen } from '@/screens';

export default function OnboardingRoute() {
  const router = useRouter();

  return (
    <OnboardingScreen
      onComplete={() => router.replace('/welcome')}
    />
  );
}
