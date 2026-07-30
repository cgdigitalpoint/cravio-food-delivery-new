// ─── Route: /app-preferences ─────────────────────────────────────────────────
import React from 'react';
import { useRouter } from 'expo-router';
import { AppPreferencesScreen } from '@/screens';

export default function AppPreferencesRoute() {
  const router = useRouter();
  return <AppPreferencesScreen onBack={() => router.back()} />;
}
