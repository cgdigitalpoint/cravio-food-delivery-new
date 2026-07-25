// ─── Forgot Password Route ────────────────────────────────────────────────────
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { PartnerForgotPasswordScreen } from '@/screens';
import { usePartnerAuthStore } from '@/store/usePartnerAuthStore';

export default function ForgotPasswordRoute() {
  const router = useRouter();
  const { forgotPassword, isLoading, error } = usePartnerAuthStore();
  const [success, setSuccess] = useState(false);

  const handleSend = async (email: string) => {
    try {
      await forgotPassword(email);
      setSuccess(true);
    } catch {
      // Error stored in usePartnerAuthStore
    }
  };

  return (
    <PartnerForgotPasswordScreen
      onBack={() => router.back()}
      onSend={handleSend}
      isLoading={isLoading}
      error={error}
      success={success}
    />
  );
}
