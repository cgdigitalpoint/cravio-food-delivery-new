// ─── Login Route ──────────────────────────────────────────────────────────────
import { useRouter } from 'expo-router';
import { PartnerLoginScreen } from '@/screens';
import { usePartnerAuthStore } from '@/store/usePartnerAuthStore';

export default function LoginRoute() {
  const router = useRouter();
  const { login, isLoading, error } = usePartnerAuthStore();

  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password);
      router.replace('/(tabs)');
    } catch {
      // Error stored in usePartnerAuthStore
    }
  };

  return (
    <PartnerLoginScreen
      onLogin={handleLogin}
      onForgotPassword={() => router.push('/auth/forgot-password')}
      onSignUp={() => router.push('/auth/signup')}
      isLoading={isLoading}
      error={error}
    />
  );
}
