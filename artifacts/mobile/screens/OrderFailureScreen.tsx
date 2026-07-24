// ─── Order Failure Screen — Phase 10B ────────────────────────────────────────
// Shown when order creation fails. Offers retry, back to checkout, change payment.

import React, { useEffect } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AlertCircle, ArrowLeft, CreditCard, RefreshCw } from 'lucide-react-native';
import { useColors } from '@/hooks/useColors';
import { PP } from '@/theme/poppins';
import { borderRadius, spacing } from '@/theme';

export interface OrderFailureScreenProps {
  error: string;
  onRetry: () => void;
  onBackToCheckout: () => void;
  onChangePayment: () => void;
}

export function OrderFailureScreen({
  error,
  onRetry,
  onBackToCheckout,
  onChangePayment,
}: OrderFailureScreenProps) {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const circleScale = useSharedValue(0);
  const iconShake = useSharedValue(0);
  const contentOpacity = useSharedValue(0);
  const contentY = useSharedValue(20);

  useEffect(() => {
    circleScale.value = withSpring(1, { damping: 10, stiffness: 160 });
    // Shake the icon for emphasis
    iconShake.value = withDelay(
      300,
      withSequence(
        withTiming(-8, { duration: 60 }),
        withTiming(8, { duration: 60 }),
        withTiming(-6, { duration: 60 }),
        withTiming(6, { duration: 60 }),
        withTiming(0, { duration: 60 }),
      ),
    );
    contentOpacity.value = withDelay(350, withTiming(1, { duration: 300 }));
    contentY.value = withDelay(350, withSpring(0, { damping: 18, stiffness: 200 }));
  }, []);

  const circleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: circleScale.value }],
  }));
  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: iconShake.value }],
  }));
  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentY.value }],
  }));

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.container,
          { paddingTop: insets.top + 56, paddingBottom: insets.bottom + 24 },
        ]}
      >
        {/* ── Error circle ── */}
        <Animated.View style={[styles.circleWrap, circleStyle]}>
          <View style={[styles.circle, { backgroundColor: '#FEF2F2', borderColor: '#FECACA' }]}>
            <Animated.View style={iconStyle}>
              <AlertCircle size={60} color="#EF4444" strokeWidth={2} />
            </Animated.View>
          </View>
        </Animated.View>

        {/* ── Content ── */}
        <Animated.View style={[styles.content, contentStyle]}>
          <Text style={[PP.h3, { color: colors.foreground, textAlign: 'center', marginBottom: 8 }]}>
            Order Failed
          </Text>
          <Text
            style={[PP.bodySM, { color: colors.mutedForeground, textAlign: 'center', lineHeight: 20 }]}
          >
            {error || 'Something went wrong while placing your order. Please try again.'}
          </Text>

          {/* ── Error box ── */}
          <View
            style={[
              styles.errorBox,
              { backgroundColor: '#FEF2F2', borderColor: '#FECACA' },
            ]}
          >
            <Text style={[PP.caption, { color: '#DC2626', textAlign: 'center' }]}>
              Your cart and payment details are still saved. You can retry safely.
            </Text>
          </View>

          {/* ── Action buttons ── */}
          <TouchableOpacity
            onPress={onRetry}
            activeOpacity={0.85}
            style={[styles.actionBtn, { backgroundColor: '#EF4444' }]}
            accessibilityLabel="Retry placing order"
          >
            <RefreshCw size={17} color="#fff" />
            <Text style={[PP.label, { color: '#fff', marginLeft: 8 }]}>Try Again</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onChangePayment}
            activeOpacity={0.85}
            style={[
              styles.actionBtn,
              { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
            ]}
            accessibilityLabel="Change payment method"
          >
            <CreditCard size={17} color={colors.foreground} />
            <Text style={[PP.label, { color: colors.foreground, marginLeft: 8 }]}>
              Change Payment
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onBackToCheckout}
            activeOpacity={0.75}
            style={styles.textBtn}
            accessibilityLabel="Back to checkout"
          >
            <ArrowLeft size={14} color={colors.mutedForeground} />
            <Text style={[PP.caption, { color: colors.mutedForeground, marginLeft: 4 }]}>
              Back to Checkout
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
  circleWrap: { marginBottom: spacing.xl },
  circle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { width: '100%', alignItems: 'center' },
  errorBox: {
    width: '100%',
    borderRadius: borderRadius.md,
    borderWidth: 1,
    padding: spacing.md12,
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
  },
  actionBtn: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
  },
  textBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    paddingVertical: spacing.sm,
  },
});
