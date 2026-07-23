// ─── Route: /restaurant/[id] ─────────────────────────────────────────────────
import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { RestaurantDetailsScreen } from '@/screens';

export default function RestaurantRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <RestaurantDetailsScreen restaurantId={id ?? 'r1'} />;
}
