// ─── Route: /profile ─────────────────────────────────────────────────────────
import React from 'react';
import { useRouter } from 'expo-router';
import { ProfileScreen } from '@/screens';

export default function ProfileRoute() {
  const router = useRouter();
  return (
    <ProfileScreen
      onOrders={() => router.push('/orders')}
      onFavorites={() => router.push('/favorites')}
      onRecentlyViewed={() => router.push('/recently-viewed')}
      onAddresses={() => router.push('/address')}
      onLogout={() => router.replace('/welcome')}
    />
  );
}
