// ─── Route: /tracking/[id] ────────────────────────────────────────────────────
import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { OrderTrackingScreen } from '@/screens/OrderTrackingScreen';

export default function TrackingRoute() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  return <OrderTrackingScreen orderId={id ?? ''} onBack={() => router.back()} />;
}
