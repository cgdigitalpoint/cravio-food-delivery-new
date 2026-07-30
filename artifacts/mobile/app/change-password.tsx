// ─── Route: /change-password ─────────────────────────────────────────────────
import React from 'react';
import { useRouter } from 'expo-router';
import { ChangePasswordScreen } from '@/screens';

export default function ChangePasswordRoute() {
  const router = useRouter();
  return (
    <ChangePasswordScreen
      onBack={() => router.back()}
      onSuccess={() => router.back()}
    />
  );
}
