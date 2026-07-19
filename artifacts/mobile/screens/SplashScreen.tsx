// ─── Splash Screen ────────────────────────────────────────────────────────────
// Animated brand intro shown on app launch.
// Auto-calls onComplete after the animation finishes (~2.5s).

import React, { useEffect } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Typography } from '@/components/ui';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const insets = useSafeAreaInsets();

  // Logo fade + scale
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.82);

  // Loading dots
  const dot1 = useSharedValue(0);
  const dot2 = useSharedValue(0);
  const dot3 = useSharedValue(0);

  useEffect(() => {
    logoOpacity.value = withTiming(1, { duration: 700 });
    logoScale.value = withTiming(1, { duration: 700 });

    // Staggered dot pulse then exit
    const dotDuration = 280;
    dot1.value = withDelay(900, withSequence(
      withTiming(1, { duration: dotDuration }),
      withTiming(0.25, { duration: dotDuration }),
    ));
    dot2.value = withDelay(1080, withSequence(
      withTiming(1, { duration: dotDuration }),
      withTiming(0.25, { duration: dotDuration }),
    ));
    dot3.value = withDelay(1260, withSequence(
      withTiming(1, { duration: dotDuration }),
      withTiming(0.25, { duration: dotDuration }),
      withDelay(300, withTiming(0, { duration: 200 }, () => {
        runOnJS(onComplete)();
      })),
    ));
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const d1 = useAnimatedStyle(() => ({ opacity: dot1.value }));
  const d2 = useAnimatedStyle(() => ({ opacity: dot2.value }));
  const d3 = useAnimatedStyle(() => ({ opacity: dot3.value }));

  const paddingTop = Platform.OS === 'web' ? 67 : insets.top;
  const paddingBottom = Platform.OS === 'web' ? 34 : insets.bottom;

  return (
    <View style={[styles.container, { paddingTop, paddingBottom }]}>
      <Animated.View style={[styles.center, logoStyle]}>
        {/* Brand mark */}
        <View style={styles.outerRing}>
          <View style={styles.innerDot} />
        </View>

        <View style={styles.textGroup}>
          <Typography
            variant="displayLarge"
            color="#FFFFFF"
            align="center"
            style={styles.wordmark}
          >
            cravio
          </Typography>
          <Typography
            variant="overline"
            color="#FF7043"
            align="center"
          >
            food delivery
          </Typography>
        </View>
      </Animated.View>

      {/* Loading dots */}
      <View style={styles.dots}>
        <Animated.View style={[styles.dot, d1]} />
        <Animated.View style={[styles.dot, d2]} />
        <Animated.View style={[styles.dot, d3]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F0F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    alignItems: 'center',
    gap: 28,
  },
  outerRing: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 3,
    borderColor: '#FF5722',
    backgroundColor: 'rgba(255,87,34,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerDot: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FF5722',
  },
  textGroup: {
    alignItems: 'center',
    gap: 6,
  },
  wordmark: {
    letterSpacing: 5,
  },
  dots: {
    position: 'absolute',
    bottom: 56,
    flexDirection: 'row',
    gap: 10,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF5722',
  },
});
