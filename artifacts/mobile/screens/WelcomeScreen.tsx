// ─── Welcome Screen ───────────────────────────────────────────────────────────
// Brand introduction shown after the splash screen.
// Displays: Cravio · Food Delivery Platform · Version 1.0 · CTA button.

import React, { useEffect } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Typography } from '@/components/ui';

interface WelcomeScreenProps {
  onStartDevelopment: () => void;
}

export function WelcomeScreen({ onStartDevelopment }: WelcomeScreenProps) {
  const insets = useSafeAreaInsets();

  const titleOpacity = useSharedValue(0);
  const titleY = useSharedValue(28);
  const subtitleOpacity = useSharedValue(0);
  const subtitleY = useSharedValue(20);
  const badgeOpacity = useSharedValue(0);
  const buttonOpacity = useSharedValue(0);
  const buttonY = useSharedValue(24);

  useEffect(() => {
    titleOpacity.value = withDelay(80, withTiming(1, { duration: 600 }));
    titleY.value = withDelay(80, withTiming(0, { duration: 600 }));

    subtitleOpacity.value = withDelay(260, withTiming(1, { duration: 600 }));
    subtitleY.value = withDelay(260, withTiming(0, { duration: 600 }));

    badgeOpacity.value = withDelay(460, withTiming(1, { duration: 500 }));

    buttonOpacity.value = withDelay(640, withTiming(1, { duration: 600 }));
    buttonY.value = withDelay(640, withTiming(0, { duration: 600 }));
  }, []);

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleY.value }],
  }));
  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
    transform: [{ translateY: subtitleY.value }],
  }));
  const badgeStyle = useAnimatedStyle(() => ({ opacity: badgeOpacity.value }));
  const buttonStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
    transform: [{ translateY: buttonY.value }],
  }));

  const paddingTop = Platform.OS === 'web' ? 67 : insets.top;
  const paddingBottom = Platform.OS === 'web' ? 34 : insets.bottom;

  return (
    <View style={[styles.container, { paddingTop, paddingBottom }]}>
      {/* Decorative glow circles */}
      <View style={styles.glowTopRight} />
      <View style={styles.glowBottomLeft} />

      {/* Main brand content */}
      <View style={styles.body}>
        {/* Brand mark */}
        <View style={styles.mark}>
          <View style={styles.outerRing}>
            <View style={styles.innerDot} />
          </View>
        </View>

        {/* Cravio */}
        <Animated.View style={titleStyle}>
          <Typography
            variant="displayMedium"
            color="#FFFFFF"
            align="center"
            style={styles.title}
          >
            Cravio
          </Typography>
        </Animated.View>

        {/* Food Delivery Platform */}
        <Animated.View style={subtitleStyle}>
          <Typography
            variant="headingMD"
            color="rgba(255,255,255,0.65)"
            align="center"
          >
            Food Delivery Platform
          </Typography>
        </Animated.View>

        {/* Version badge */}
        <Animated.View style={[styles.badge, badgeStyle]}>
          <Typography variant="labelSM" color="#FF7043">
            Version 1.0
          </Typography>
        </Animated.View>
      </View>

      {/* Footer CTA */}
      <Animated.View style={[styles.footer, buttonStyle]}>
        <Button
          label="Start Development"
          variant="primary"
          size="lg"
          fullWidth
          onPress={onStartDevelopment}
          testID="welcome-cta"
        />
        <Typography
          variant="caption"
          color="rgba(255,255,255,0.3)"
          align="center"
          style={styles.phase}
        >
          Phase 1 — Architecture Setup Complete
        </Typography>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F0F',
  },
  glowTopRight: {
    position: 'absolute',
    top: -100,
    right: -100,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: 'rgba(255,87,34,0.10)',
  },
  glowBottomLeft: {
    position: 'absolute',
    bottom: -80,
    left: -80,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(255,193,7,0.07)',
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingHorizontal: 32,
  },
  mark: {
    marginBottom: 12,
  },
  outerRing: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2.5,
    borderColor: '#FF5722',
    backgroundColor: 'rgba(255,87,34,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF5722',
  },
  title: {
    letterSpacing: -1,
  },
  badge: {
    marginTop: 6,
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: 'rgba(255,112,67,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,112,67,0.28)',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 8,
    gap: 14,
  },
  phase: {
    marginTop: 2,
  },
});
