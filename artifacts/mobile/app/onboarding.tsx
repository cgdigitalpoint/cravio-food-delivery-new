// ─── Route: /onboarding ───────────────────────────────────────────────────────
import React from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { OnboardingScreen } from '@/screens';

const ONBOARDING_KEY = 'cravio_onboarding_done';

export default function OnboardingRoute() {
  const router = useRouter();

  const handleComplete = async () => {
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true').catch(() => {});
    router.replace('/welcome');
  };

  return <OnboardingScreen onComplete={handleComplete} />;
}
