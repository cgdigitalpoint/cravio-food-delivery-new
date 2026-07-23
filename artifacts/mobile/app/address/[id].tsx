// ─── Route: /address/[id] (edit) ─────────────────────────────────────────────
import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AddressFormScreen } from '@/screens';
import { useAddressStore } from '@/store/useAddressStore';

export default function AddressEditRoute() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const addresses = useAddressStore((s) => s.addresses);
  const address = addresses.find((a) => a.id === id) ?? null;

  return (
    <AddressFormScreen
      existingAddress={address}
      onBack={() => router.back()}
      onSaved={() => router.back()}
    />
  );
}
