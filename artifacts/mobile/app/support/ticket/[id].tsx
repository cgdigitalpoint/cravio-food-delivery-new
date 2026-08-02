// ─── Route: /support/ticket/[id] ─────────────────────────────────────────────
import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { TicketDetailsScreen } from '@/screens/support';

export default function TicketDetailsRoute() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <TicketDetailsScreen
      ticketId={id ?? ''}
      onBack={() => router.back()}
    />
  );
}
