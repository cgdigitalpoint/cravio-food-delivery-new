// ─── Route: /invoice/[id] ─────────────────────────────────────────────────────
import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { InvoiceScreen } from '@/screens';

export default function InvoiceRoute() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <InvoiceScreen
      orderId={id ?? ''}
      onBack={() => router.back()}
    />
  );
}
