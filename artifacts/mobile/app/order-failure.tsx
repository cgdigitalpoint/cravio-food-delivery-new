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
      // Retry: return to checkout so the user can tap "Place Order" again with the
      // same selections intact.
      onRetry={() => router.back()}
      // Back to Checkout: return normally without any scroll target.
      onBackToCheckout={() => router.back()}
    />
  );
}
