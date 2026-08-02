// ─── Route: /support/contact ──────────────────────────────────────────────────
import React from 'react';
import { useRouter } from 'expo-router';
import { ContactSupportScreen } from '@/screens/support';

export default function ContactSupportRoute() {
  const router = useRouter();
  return (
    <ContactSupportScreen
      onBack={() => router.back()}
      onRaiseTicket={() => router.push('/support/raise-ticket')}
    />
  );
}
