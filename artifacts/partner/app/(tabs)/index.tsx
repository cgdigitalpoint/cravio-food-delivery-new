// ─── Dashboard Tab ────────────────────────────────────────────────────────────
import { useRouter } from 'expo-router';
import { DashboardScreen } from '@/screens';

export default function DashboardTab() {
  const router = useRouter();
  return (
    <DashboardScreen
      onNavigate={(route) => router.push(`/${route}` as Parameters<typeof router.push>[0])}
    />
  );
}
