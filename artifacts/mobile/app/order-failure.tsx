// ─── Route: /order-failure ────────────────────────────────────────────────────
import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { OrderFailureScreen } from '@/screens';
import { useCartStore } from '@/store/useCartStore';

export default function OrderFailureRoute() {
  const router = useRouter();
  const { error } = useLocalSearchParams<{ error: string }>();
  const setCheckoutScrollTo = useCartStore((s) => s.setCheckoutScrollTo);

  return (
    <OrderFailureScreen
      error={error ?? 'Something went wrong. Please try again.'}
      // Retry: return to checkout so the user can tap "Place Order" again with the
      // same selections intact.
      onRetry={() => router.back()}
      // Back to Checkout: return normally without any scroll target.
      onBackToCheckout={() => router.back()}
      // Change Payment: signal checkout to scroll to & highlight the payment section,
      // then navigate back so the user lands right on it.
      onChangePayment={() => {
        setCheckoutScrollTo('payment');
        router.back();
      }}
    />
  );
}
