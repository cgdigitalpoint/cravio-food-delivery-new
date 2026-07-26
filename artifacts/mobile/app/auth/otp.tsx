// ─── Route: /auth/otp ─────────────────────────────────────────────────────────
import React from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { OTPScreen } from '@/screens';
import { useAuthStore } from '@/store/useAuthStore';

export default function OTPRoute() {
  const router = useRouter();
  const params = useLocalSearchParams<{ email?: string; contact?: string; mode?: 'signup' | 'forgot' }>();
  const { resendVerification, isLoading } = useAuthStore();

  // Support both 'email' and legacy 'contact' params
  const emailOrContact = params.email ?? params.contact ?? 'your email';
  const mode = params.mode ?? 'signup';

  const handleResend = async () => {
    if (emailOrContact && emailOrContact !== 'your email') {
      try {
        await resendVerification(emailOrContact);
      } catch (_) {
        // Error displayed in store
      }
    }
  };

  const handleVerify = () => {
    // After email verification the user will log in normally
    router.replace('/auth/login');
  };

  return (
    <OTPScreen
      onBack={() => router.back()}
      onVerify={handleVerify}
      onResend={handleResend}
      contact={emailOrContact}
      mode={mode}
      isLoading={isLoading}
    />
  );
}
