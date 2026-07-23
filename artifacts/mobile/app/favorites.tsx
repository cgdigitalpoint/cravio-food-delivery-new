// ─── Route: /favorites ────────────────────────────────────────────────────────
import React from 'react';
import { useRouter } from 'expo-router';
import { FavoritesScreen } from '@/screens';

export default function FavoritesRoute() {
  const router = useRouter();
  return (
    <FavoritesScreen
      onBack={() => router.back()}
      onRestaurantPress={(id) => router.push(`/restaurant/${id}`)}
    />
  );
}
