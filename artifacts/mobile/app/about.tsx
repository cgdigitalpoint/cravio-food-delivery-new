// ─── Route: /about ────────────────────────────────────────────────────────────
import React from 'react';
import { useRouter } from 'expo-router';
import { AboutScreen } from '@/screens/AboutScreen';

export default function AboutRoute() {
  const router = useRouter();
  return <AboutScreen onBack={() => router.back()} />;
}
