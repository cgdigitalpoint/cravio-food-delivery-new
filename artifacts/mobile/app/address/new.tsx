// ─── Route: /address/new ─────────────────────────────────────────────────────
import React from 'react';
import { useRouter } from 'expo-router';
import { AddressFormScreen } from '@/screens';

export default function AddressNewRoute() {
  const router = useRouter();
  return (
    <AddressFormScreen
      existingAddress={null}
      onBack={() => router.back()}
      onSaved={() => router.back()}
    />
  );
}
