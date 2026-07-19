// ─── Route: / (Splash) ────────────────────────────────────────────────────────
import React from 'react';
import { useRouter } from 'expo-router';
import { SplashScreen } from '@/screens';

export default function SplashRoute() {
  const router = useRouter();

  const handleComplete = () => {
    router.replace('/welcome');
  };

  return <SplashScreen onComplete={handleComplete} />;
}
