// ─── Signup Route ─────────────────────────────────────────────────────────────
import { useRouter } from 'expo-router';
import { PartnerSignupScreen } from '@/screens';
import { usePartnerAuthStore } from '@/store/usePartnerAuthStore';

export default function SignupRoute() {
  const router = useRouter();
  const { register, isLoading, error } = usePartnerAuthStore();

  const handleRegister = async (email: string, password: string, name: string, phone: string) => {
    try {
      await register(email, password, name, phone);
      router.replace('/(tabs)');
    } catch {
      // Error stored in usePartnerAuthStore
    }
  };

  return (
    <PartnerSignupScreen
      onBack={() => router.back()}
      onLogin={() => router.replace('/auth/login')}
      onRegister={handleRegister}
      isLoading={isLoading}
      error={error}
    />
  );
}
