// ─── Route: /support/tickets ──────────────────────────────────────────────────
import React from 'react';
import { useRouter } from 'expo-router';
import { TicketHistoryScreen } from '@/screens/support';

export default function TicketHistoryRoute() {
  const router = useRouter();
  return (
    <TicketHistoryScreen
      onBack={() => router.back()}
      onOpenTicket={(id) => router.push(`/support/ticket/${id}` as any)}
      onRaiseTicket={() => router.push('/support/raise-ticket')}
    />
  );
}
