// ─── Route: /support/raise-ticket ────────────────────────────────────────────
import React from 'react';
import { useRouter } from 'expo-router';
import { RaiseTicketScreen } from '@/screens/support';

export default function RaiseTicketRoute() {
  const router = useRouter();
  return (
    <RaiseTicketScreen
      onBack={() => router.back()}
      onSuccess={() => router.push('/support/tickets')}
    />
  );
}
