// ─── Route: /orders/[id] ──────────────────────────────────────────────────────
import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { OrderDetailsScreen } from '@/screens';

export default function OrderDetailsRoute() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <OrderDetailsScreen
      orderId={id ?? ''}
      onBack={() => router.back()}
    />
  );
}
