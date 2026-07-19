// ─── Route: /welcome ─────────────────────────────────────────────────────────
import React from 'react';
import { WelcomeScreen } from '@/screens';

export default function WelcomeRoute() {
  const handleStartDevelopment = () => {
    // Phase 2: navigate to /auth/login
    // router.push('/auth/login');
    if (__DEV__) {
      console.log('[Cravio] Phase 1 complete — architecture ready for Phase 2');
    }
  };

  return <WelcomeScreen onStartDevelopment={handleStartDevelopment} />;
}
