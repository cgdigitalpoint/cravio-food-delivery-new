// ─── Route: /notification-preferences ────────────────────────────────────────
import React from 'react';
import { useRouter } from 'expo-router';
import { NotificationPreferencesScreen } from '@/screens';

export default function NotificationPreferencesRoute() {
  const router = useRouter();
  return <NotificationPreferencesScreen onBack={() => router.back()} />;
}
