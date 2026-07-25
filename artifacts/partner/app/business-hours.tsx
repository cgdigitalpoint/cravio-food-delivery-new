import { useRouter } from 'expo-router';
import { BusinessHoursScreen } from '@/screens';

export default function BusinessHoursRoute() {
  const router = useRouter();
  return <BusinessHoursScreen onBack={() => router.back()} />;
}
