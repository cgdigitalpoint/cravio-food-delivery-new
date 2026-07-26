// ─── Route: /profile-edit ────────────────────────────────────────────────────
import React from 'react';
import { useRouter } from 'expo-router';
import { EditProfileScreen } from '@/screens';

export default function ProfileEditRoute() {
  const router = useRouter();
  return (
    <EditProfileScreen
      onBack={() => router.back()}
      onSaved={() => router.back()}
    />
  );
}
