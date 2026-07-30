// ─── Route: /legal ────────────────────────────────────────────────────────────
import React from 'react';
import { useRouter } from 'expo-router';
import { LegalCenterScreen } from '@/screens/legal';

export default function LegalCenterRoute() {
  const router = useRouter();
  return (
    <LegalCenterScreen
      onBack={() => router.back()}
      onOpenDoc={(docId) => router.push(`/legal/${docId}` as any)}
    />
  );
}
