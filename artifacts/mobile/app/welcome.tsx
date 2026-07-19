// ─── Route: /welcome ─────────────────────────────────────────────────────────
import React from 'react';
import { useRouter } from 'expo-router';
import { WelcomeScreen } from '@/screens';

export default function WelcomeRoute() {
  const router = useRouter();

  const handleStartDevelopment = () => {
    router.push('/design-system');
  };

  return <WelcomeScreen onStartDevelopment={handleStartDevelopment} />;
}
