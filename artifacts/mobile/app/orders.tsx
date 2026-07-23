// ─── Route: /orders ───────────────────────────────────────────────────────────
import React from 'react';
import { useRouter } from 'expo-router';
import { OrdersScreen } from '@/screens';

export default function OrdersRoute() {
  const router = useRouter();
  return (
    <OrdersScreen
      onBack={() => router.back()}
      onOrderPress={(orderId) => router.push(`/orders/${orderId}`)}
    />
  );
}
