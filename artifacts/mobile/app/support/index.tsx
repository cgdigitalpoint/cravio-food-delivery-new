// ─── Route: /support ──────────────────────────────────────────────────────────
import React from 'react';
import { useRouter } from 'expo-router';
import { HelpCenterScreen } from '@/screens/support';

export default function HelpCenterRoute() {
  const router = useRouter();
  return (
    <HelpCenterScreen
      onBack={() => router.back()}
      onContactSupport={() => router.push('/support/contact')}
      onRaiseTicket={() => router.push('/support/raise-ticket')}
      onTicketHistory={() => router.push('/support/tickets')}
    />
  );
}
