import { useRouter } from 'expo-router';
import { DocumentsScreen } from '@/screens';

export default function DocumentsRoute() {
  const router = useRouter();
  return <DocumentsScreen onBack={() => router.back()} />;
}
