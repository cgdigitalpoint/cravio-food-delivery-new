import { useRouter } from 'expo-router';
import { RestaurantProfileScreen } from '@/screens';

export default function RestaurantProfileRoute() {
  const router = useRouter();
  return <RestaurantProfileScreen onBack={() => router.back()} />;
}
