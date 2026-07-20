// ─── Route: /auth/forgot-password ────────────────────────────────────────────
import React from 'react';
import { useRouter } from 'expo-router';
import { ForgotPasswordScreen } from '@/screens';

export default function ForgotPasswordRoute() {
  const router = useRouter();

  return (
    <ForgotPasswordScreen
      onBack={() => router.back()}
      onSendLink={() => router.push('/auth/otp')}
    />
  );
}
