// ─── Order Success Screen — Phase 10B ────────────────────────────────────────
// Premium animated success screen after order placement.

import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Check, ChevronRight, ShoppingBag } from 'lucide-react-native';
import { useColors } from '@/hooks/useColors';
import { PP } from '@/theme/poppins';
import { borderRadius, spacing } from '@/theme';

// ─── Constants ────────────────────────────────────────────────────────────────
const PAYMENT_LABELS: Record<string, string> = {
  cod: 'Cash on Delivery',
  upi: 'UPI',
  card: 'Credit / Debit Card',
  wallet: 'Cravio Wallet',
};

// ─── Detail Row ───────────────────────────────────────────────────────────────
function DetailRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  const colors = useColors();
  return (
    <View style={styles.detailRow}>
      <Text style={[PP.bodySM, { color: colors.mutedForeground }]}>{label}</Text>
      <Text
        style={[
          PP.bodySM,
          {
            color: highlight ? '#FF6B00' : colors.foreground,
            fontFamily: 'Poppins_600SemiBold',
            flex: 1,
            textAlign: 'right',
          },
        ]}
        numberOfLines={1}
      >
        {value}
      </Text>
    </View>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────
export interface OrderSuccessScreenProps {
  orderId: string;
  restaurantName: string;
  grandTotal: number;
  paymentMethod: string;
  onContinueShopping: () => void;
  onViewOrder: () => void;
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export function OrderSuccessScreen({
  orderId,
  restaurantName,
  grandTotal,
  paymentMethod,
  onContinueShopping,
  onViewOrder,
}: OrderSuccessScreenProps) {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  // Animation values
  const circleScale = useSharedValue(0);
  const checkOpacity = useSharedValue(0);
  const contentOpacity = useSharedValue(0);
  const contentY = useSharedValue(24);
  const glowOpacity = useSharedValue(0);

  useEffect(() => {
    // 1. Circle pops in
    circleScale.value = withSpring(1, { damping: 10, stiffness: 160 });
    // 2. Glow fades in
    glowOpacity.value = withDelay(150, withTiming(1, { duration: 400 }));
    // 3. Checkmark appears
    checkOpacity.value = withDelay(220, withTiming(1, { duration: 250 }));
    // 4. Content slides up
    contentOpacity.value = withDelay(450, withTiming(1, { duration: 350 }));
    contentY.value = withDelay(450, withSpring(0, { damping: 18, stiffness: 200 }));
  }, []);

  const circleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: circleScale.value }],
  }));
  const checkStyle = useAnimatedStyle(() => ({ opacity: checkOpacity.value }));
  const glowStyle = useAnimatedStyle(() => ({ opacity: glowOpacity.value }));
  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentY.value }],
  }));

  const orderNumber = `#${orderId.slice(0, 8).toUpperCase()}`;

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.container,
          { paddingTop: insets.top + 48, paddingBottom: insets.bottom + 24 },
        ]}
      >
        {/* ── Glow ring ── */}
        <Animated.View style={[styles.glowRing, glowStyle]} />

        {/* ── Animated check circle ── */}
        <Animated.View style={[styles.circleWrap, circleStyle]}>
          <LinearGradient
            colors={['#34D399', '#16A34A']}
            style={styles.circle}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Animated.View style={checkStyle}>
              <Check size={56} color="#fff" strokeWidth={3} />
            </Animated.View>
          </LinearGradient>
        </Animated.View>

        {/* ── Content ── */}
        <Animated.View style={[styles.content, contentStyle]}>
          <Text style={[PP.h3, { color: colors.foreground, textAlign: 'center', marginBottom: 6 }]}>
            Order Placed! 🎉
          </Text>
          <Text
            style={[PP.bodySM, { color: colors.mutedForeground, textAlign: 'center', lineHeight: 20 }]}
          >
            Your order from{' '}
            <Text style={{ fontFamily: 'Poppins_600SemiBold', color: colors.foreground }}>
              {restaurantName}
            </Text>{' '}
            is confirmed and being prepared.
          </Text>

          {/* ── Order detail card ── */}
          <View
            style={[
              styles.card,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <DetailRow label="Order Number" value={orderNumber} />
            <View style={[styles.rowDivider, { backgroundColor: colors.border }]} />
            <DetailRow label="Restaurant" value={restaurantName} />
            <View style={[styles.rowDivider, { backgroundColor: colors.border }]} />
            <DetailRow label="Estimated ETA" value="30–45 min" highlight />
            <View style={[styles.rowDivider, { backgroundColor: colors.border }]} />
            <DetailRow
              label="Payment"
              value={PAYMENT_LABELS[paymentMethod] ?? paymentMethod.toUpperCase()}
            />
            <View style={[styles.totalDivider, { backgroundColor: colors.border }]} />
            <View style={styles.totalRow}>
              <Text style={[PP.label, { color: colors.mutedForeground }]}>Total Paid</Text>
              <Text style={[PP.title, { color: '#FF6B00' }]}>${grandTotal.toFixed(2)}</Text>
            </View>
          </View>

          {/* ── View Order CTA ── */}
          <TouchableOpacity
            onPress={onViewOrder}
            activeOpacity={0.9}
            style={styles.primaryBtnWrap}
            accessibilityLabel="View your order"
          >
            <LinearGradient
              colors={['#FF8C38', '#FF6B00']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.primaryBtn}
            >
              <Text style={[PP.button, { color: '#fff' }]}>View Order</Text>
              <ChevronRight size={18} color="#fff" strokeWidth={2.5} />
            </LinearGradient>
          </TouchableOpacity>

          {/* ── Continue Shopping ── */}
          <TouchableOpacity
            onPress={onContinueShopping}
            activeOpacity={0.8}
            style={[
              styles.secondaryBtn,
              { borderColor: colors.border, backgroundColor: colors.card },
            ]}
            accessibilityLabel="Continue shopping"
          >
            <ShoppingBag size={16} color={colors.foreground} />
            <Text style={[PP.label, { color: colors.foreground, marginLeft: 8 }]}>
              Continue Shopping
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  screen: { flex: 1 },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },

  // Glow
  glowRing: {
    position: 'absolute',
    top: 80,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#22C55E',
    opacity: 0.12,
    transform: [{ scale: 1.5 }],
  },

  // Circle
  circleWrap: { marginBottom: spacing.xl },
  circle: {
    width: 128,
    height: 128,
    borderRadius: 64,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#16A34A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 14,
  },

  // Content
  content: { width: '100%', alignItems: 'center' },

  // Card
  card: {
    width: '100%',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    padding: spacing.md,
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 9,
    gap: spacing.md12,
  },
  rowDivider: { height: StyleSheet.hairlineWidth },
  totalDivider: { height: 1, marginVertical: spacing.sm },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  // CTAs
  primaryBtnWrap: {
    width: '100%',
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  secondaryBtn: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
  },
});
