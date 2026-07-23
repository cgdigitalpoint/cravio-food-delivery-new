// ─── Route: /auth/forgot-password ────────────────────────────────────────────
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { ForgotPasswordScreen } from '@/screens';
import { useAuthStore } from '@/store/useAuthStore';

export default function ForgotPasswordRoute() {
  const router = useRouter();
  const { forgotPassword, isLoading, error, setError } = useAuthStore();
  const [success, setSuccess] = useState(false);

  const handleSendLink = async (email: string) => {
    setError(null);
    try {
      await forgotPassword(email);
      setSuccess(true);
    } catch (_) {
      // Error already set in store
    }
  };

  return (
    <ForgotPasswordScreen
      onBack={() => { setError(null); router.back(); }}
      onSendLink={handleSendLink}
      isLoading={isLoading}
      error={error}
      success={success}
    />
  );
}
