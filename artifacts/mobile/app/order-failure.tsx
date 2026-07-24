// ─── Route: /order-failure ────────────────────────────────────────────────────
import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { OrderFailureScreen } from '@/screens';

export default function OrderFailureRoute() {
  const router = useRouter();
  const { error } = useLocalSearchParams<{ error: string }>();

  return (
    <OrderFailureScreen
      error={error ?? 'Something went wrong. Please try again.'}
      onRetry={() => router.back()}
      onBackToCheckout={() => router.back()}
      onChangePayment={() => router.back()}
    />
  );
}
