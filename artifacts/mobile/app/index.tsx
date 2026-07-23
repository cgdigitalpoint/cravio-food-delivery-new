// ─── Route: / (Splash) ────────────────────────────────────────────────────────
import React from 'react';
import { useRouter } from 'expo-router';
import { SplashScreen } from '@/screens';
import { authService } from '@/services/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDING_KEY = 'cravio_onboarding_done';

export default function SplashRoute() {
  const router = useRouter();

  const handleComplete = async () => {
    try {
      const session = await authService.getSession();
      if (session) {
        // Already authenticated — go straight to home
        router.replace('/home');
        return;
      }
    } catch (_) {
      // Session check failed — fall through to onboarding/welcome
    }

    try {
      const done = await AsyncStorage.getItem(ONBOARDING_KEY);
      if (done === 'true') {
        router.replace('/welcome');
      } else {
        router.replace('/onboarding');
      }
    } catch (_) {
      router.replace('/onboarding');
    }
  };

  return <SplashScreen onComplete={handleComplete} />;
}
