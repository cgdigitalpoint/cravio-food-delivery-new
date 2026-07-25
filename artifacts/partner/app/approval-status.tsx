import { useRouter } from 'expo-router';
import { ApprovalStatusScreen } from '@/screens';

export default function ApprovalStatusRoute() {
  const router = useRouter();
  return <ApprovalStatusScreen onBack={() => router.back()} />;
}
