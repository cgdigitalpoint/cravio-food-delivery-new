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
      onDonations={() => router.push('/donations')}
      onAddresses={() => router.push('/address')}
      onEditProfile={() => router.push('/profile-edit')}
      onLogout={() => router.replace('/welcome')}
    />
  );
}
