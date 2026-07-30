// ─── Route: /legal/[doc] ──────────────────────────────────────────────────────
import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LegalDocScreen } from '@/screens/legal';

export default function LegalDocRoute() {
  const router = useRouter();
  const { doc } = useLocalSearchParams<{ doc: string }>();
  return (
    <LegalDocScreen
      docId={doc ?? ''}
      onBack={() => router.back()}
    />
  );
}
