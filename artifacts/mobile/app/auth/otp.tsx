// ─── Route: /auth/otp ─────────────────────────────────────────────────────────
import React from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { OTPScreen } from '@/screens';

export default function OTPRoute() {
  const router = useRouter();
  const params = useLocalSearchParams<{ contact?: string; mode?: 'signup' | 'forgot' }>();

  return (
    <OTPScreen
      onBack={() => router.back()}
      onVerify={() => router.replace('/welcome')}
      contact={params.contact ?? 'your email'}
      mode={params.mode ?? 'signup'}
    />
  );
}
