// ─── Route: /notifications ────────────────────────────────────────────────────
import React from 'react';
import { useRouter } from 'expo-router';
import { NotificationCenterScreen } from '@/screens';

export default function NotificationsRoute() {
  const router = useRouter();
  return <NotificationCenterScreen onBack={() => router.back()} />;
}
