// ─── Route: /order-success ────────────────────────────────────────────────────
import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { OrderSuccessScreen } from '@/screens';

export default function OrderSuccessRoute() {
  const router = useRouter();
  const { orderId, restaurantName, total, paymentMethod } =
    useLocalSearchParams<{
      orderId: string;
      restaurantName: string;
      total: string;
      paymentMethod: string;
    }>();

  return (
    <OrderSuccessScreen
      orderId={orderId ?? ''}
      restaurantName={restaurantName ?? 'Restaurant'}
      grandTotal={parseFloat(total ?? '0')}
      paymentMethod={paymentMethod ?? 'cod'}
      onContinueShopping={() => router.replace('/home')}
      onViewOrder={() => router.replace(`/orders/${orderId}` as any)}
    />
  );
}
