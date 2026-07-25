import { useRouter } from 'expo-router';
import { GSTDetailsScreen } from '@/screens';

export default function GSTDetailsRoute() {
  const router = useRouter();
  return <GSTDetailsScreen onBack={() => router.back()} />;
}
