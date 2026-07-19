// ─── Route: /design-system ────────────────────────────────────────────────────
import React from 'react';
import { useRouter } from 'expo-router';
import { DesignSystemScreen } from '@/screens';

export default function DesignSystemRoute() {
  const router = useRouter();
  return <DesignSystemScreen onBack={() => router.back()} />;
}
