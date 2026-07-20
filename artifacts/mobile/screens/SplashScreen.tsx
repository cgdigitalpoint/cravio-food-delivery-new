// ─── Splash Screen ────────────────────────────────────────────────────────────
// Premium animated brand intro. Auto-calls onComplete after ~2.8s.
// Uses Poppins typeface + Reanimated spring/timing sequences.

import React, { useEffect } from 'react';
import { Dimensions, Platform, StyleSheet, Text, View } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Flame } from 'lucide-react-native';
import { PP } from '@/theme/poppins';

const { width } = Dimensions.get('window');

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const insets = useSafeAreaInsets();

  // Radial glow
  const glowOpacity = useSharedValue(0);
  const glowScale = useSharedValue(0.4);

  // Logo badge
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.6);

  // Wordmark
  const wordmarkOpacity = useSharedValue(0);
  const wordmarkY = useSharedValue(24);

  // Tagline
  const tagOpacity = useSharedValue(0);

  // Dots
  const d1 = useSharedValue(0);
  const d2 = useSharedValue(0);
  const d3 = useSharedValue(0);

  useEffect(() => {
    // Glow radiates in
    glowOpacity.value = withTiming(1, { duration: 900 });
    glowScale.value = withTiming(1, { duration: 1100 });

    // Logo bounces in
    logoOpacity.value = withDelay(250, withTiming(1, { duration: 500 }));
    logoScale.value = withDelay(250, withSpring(1, { damping: 12, stiffness: 120 }));

    // Wordmark slides up
    wordmarkOpacity.value = withDelay(650, withTiming(1, { duration: 500 }));
    wordmarkY.value = withDelay(650, withSpring(0, { damping: 16, stiffness: 120 }));

    // Tagline fades
    tagOpacity.value = withDelay(950, withTiming(1, { duration: 400 }));

    // Loading dots bounce
    const dotConfig = { damping: 10, stiffness: 200 };
    d1.value = withDelay(
      1300,
      withRepeat(
        withSequence(
          withSpring(1, dotConfig),
          withSpring(0.35, { damping: 12, stiffness: 180 }),
        ),
        3,
        false,
      ),
    );
    d2.value = withDelay(
      1450,
      withRepeat(
        withSequence(
          withSpring(1, dotConfig),
          withSpring(0.35, { damping: 12, stiffness: 180 }),
        ),
        3,
        false,
      ),
    );
    d3.value = withDelay(
      1600,
      withSequence(
        withRepeat(
          withSequence(
            withSpring(1, dotConfig),
            withSpring(0.35, { damping: 12, stiffness: 180 }),
          ),
          2,
          false,
        ),
        withSpring(1, dotConfig),
        withDelay(
          300,
          withTiming(0, { duration: 400 }, () => {
            runOnJS(onComplete)();
          }),
        ),
      ),
    );
  }, []);

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
    transform: [{ scale: glowScale.value }],
  }));

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const wordmarkStyle = useAnimatedStyle(() => ({
    opacity: wordmarkOpacity.value,
    transform: [{ translateY: wordmarkY.value }],
  }));

  const tagStyle = useAnimatedStyle(() => ({ opacity: tagOpacity.value }));
  const d1Style = useAnimatedStyle(() => ({ opacity: d1.value }));
  const d2Style = useAnimatedStyle(() => ({ opacity: d2.value }));
  const d3Style = useAnimatedStyle(() => ({ opacity: d3.value }));

  const paddingBottom = Platform.OS === 'web' ? 34 : insets.bottom;

  return (
    <View style={[styles.container, { paddingBottom }]}>
      {/* ── Background radial glow ── */}
      <Animated.View style={[styles.glowWrap, glowStyle]} pointerEvents="none">
        <LinearGradient
          colors={[
            'rgba(255,107,0,0.40)',
            'rgba(255,107,0,0.14)',
            'rgba(255,107,0,0.04)',
            'transparent',
          ]}
          style={styles.glow}
          start={{ x: 0.5, y: 0.5 }}
          end={{ x: 1.0, y: 1.0 }}
        />
      </Animated.View>

      {/* ── Secondary glow (top-right accent) ── */}
      <View style={styles.topAccent} pointerEvents="none">
        <LinearGradient
          colors={['rgba(34,197,94,0.12)', 'transparent']}
          style={{ width: 200, height: 200, borderRadius: 100 }}
        />
      </View>

      {/* ── Center composition ── */}
      <View style={styles.center}>
        {/* Logo badge */}
        <Animated.View style={logoStyle}>
          <View style={styles.outerRing}>
            <LinearGradient
              colors={['#FF8C38', '#FF6B00', '#E05500']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.logoBadge}
            >
              <Flame size={34} color="#FFFFFF" strokeWidth={2.2} />
            </LinearGradient>
          </View>
        </Animated.View>

        {/* Wordmark */}
        <Animated.View style={[styles.textGroup, wordmarkStyle]}>
          <Text style={[PP.displayXL, styles.wordmark]}>cravio</Text>
          <Animated.View style={tagStyle}>
            <Text style={[PP.overline, styles.tagline]}>
              Taste Delivered.
            </Text>
          </Animated.View>
        </Animated.View>
      </View>

      {/* ── Loading dots ── */}
      <View style={styles.dotsRow}>
        <Animated.View style={[styles.dot, d1Style]} />
        <Animated.View style={[styles.dot, d2Style]} />
        <Animated.View style={[styles.dot, d3Style]} />
      </View>

      {/* ── Version tag ── */}
      <Text style={[PP.caption, styles.version]}>v1.0</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowWrap: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    width: width * 1.4,
    height: width * 1.4,
    borderRadius: width * 0.7,
  },
  topAccent: {
    position: 'absolute',
    top: -40,
    right: -20,
  },
  center: {
    alignItems: 'center',
    gap: 28,
  },
  outerRing: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1.5,
    borderColor: 'rgba(255,107,0,0.35)',
    backgroundColor: 'rgba(255,107,0,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 0,
  },
  logoBadge: {
    width: 78,
    height: 78,
    borderRadius: 39,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textGroup: {
    alignItems: 'center',
    gap: 10,
  },
  wordmark: {
    color: '#FFFFFF',
    letterSpacing: 4,
  },
  tagline: {
    color: '#FF6B00',
    letterSpacing: 3.5,
  },
  dotsRow: {
    position: 'absolute',
    bottom: 64,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#FF6B00',
  },
  version: {
    position: 'absolute',
    bottom: 28,
    color: 'rgba(255,255,255,0.2)',
  },
});
