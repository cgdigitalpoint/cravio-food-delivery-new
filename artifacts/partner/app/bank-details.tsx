import { useRouter } from 'expo-router';
import { BankDetailsScreen } from '@/screens';

export default function BankDetailsRoute() {
  const router = useRouter();
  return <BankDetailsScreen onBack={() => router.back()} />;
}
