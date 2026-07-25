// ─── Root Route — Splash & Redirect ──────────────────────────────────────────
import { Redirect } from 'expo-router';
import { usePartnerAuthStore } from '@/store/usePartnerAuthStore';

export default function Index() {
  const isAuthenticated = usePartnerAuthStore((s) => s.isAuthenticated);
  if (isAuthenticated) return <Redirect href="/(tabs)/" />;
  return <Redirect href="/auth/login" />;
}
