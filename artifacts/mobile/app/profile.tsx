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
      // Settings — Account
      onChangePassword={() => router.push('/change-password')}
      onNotificationPreferences={() => router.push('/notification-preferences')}
      onAppPreferences={() => router.push('/app-preferences')}
      // Settings — App
      onAbout={() => router.push('/about')}
      // Legal
      onLegalCenter={() => router.push('/legal')}
      onPrivacyPolicy={() => router.push('/legal/privacy-policy')}
      onTerms={() => router.push('/legal/terms')}
      onRefundPolicy={() => router.push('/legal/refund-policy')}
      onShippingPolicy={() => router.push('/legal/shipping-policy')}
      onDonationPolicy={() => router.push('/legal/donation-policy')}
      onCommunityGuidelines={() => router.push('/legal/community-guidelines')}
      onCopyright={() => router.push('/legal/copyright')}
      onOpenSourceLicenses={() => router.push('/legal/open-source-licenses')}
      // Account
      onDeleteAccount={() => router.push('/delete-account')}
    />
  );
}
