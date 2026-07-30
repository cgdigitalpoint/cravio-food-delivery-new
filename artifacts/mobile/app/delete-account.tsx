// ─── Route: /delete-account ───────────────────────────────────────────────────
import React from 'react';
import { useRouter } from 'expo-router';
import { DeleteAccountScreen } from '@/screens/DeleteAccountScreen';

export default function DeleteAccountRoute() {
  const router = useRouter();
  return (
    <DeleteAccountScreen
      onBack={() => router.back()}
      onDeleted={() => router.replace('/welcome')}
    />
  );
}
