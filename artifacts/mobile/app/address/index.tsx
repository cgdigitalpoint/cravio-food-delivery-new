// ─── Route: /address ──────────────────────────────────────────────────────────
import React from 'react';
import { useRouter } from 'expo-router';
import { AddressListScreen } from '@/screens';
import type { DbAddress } from '@/types/db.types';

export default function AddressListRoute() {
  const router = useRouter();
  return (
    <AddressListScreen
      onBack={() => router.back()}
      onAddAddress={() => router.push('/address/new')}
      onEditAddress={(address: DbAddress) => router.push(`/address/${address.id}`)}
    />
  );
}
