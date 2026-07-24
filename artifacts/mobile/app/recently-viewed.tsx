import React from 'react';
import { useRouter } from 'expo-router';
import { RecentlyViewedScreen } from '@/screens';

export default function RecentlyViewedRoute() {
  const router = useRouter();
  return (
    <RecentlyViewedScreen
      onBack={() => router.back()}
      onRestaurantPress={(id) => router.push(`/restaurant/${id}`)}
    />
  );
}