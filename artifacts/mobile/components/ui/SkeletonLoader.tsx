// ─── Skeleton Loader ──────────────────────────────────────────────────────────
import React, { useEffect } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useColors } from '@/hooks/useColors';
import { borderRadius as br, spacing } from '@/theme';

export interface SkeletonProps {
  width?: number | `${number}%`;
  height?: number;
  radius?: number;
  style?: StyleProp<ViewStyle>;
}

export function Skeleton({ width = '100%', height = 16, radius = br.sm, style }: SkeletonProps) {
  const colors = useColors();
  const opacity = useSharedValue(0.4);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(0.9, { duration: 750 }), -1, true);
  }, []);

  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[
        animStyle,
        {
          width: width as any,
          height,
          borderRadius: radius,
          backgroundColor: colors.muted,
        },
        style,
      ]}
    />
  );
}

// ─── Preset: Restaurant Card Skeleton ─────────────────────────────────────────
export function RestaurantCardSkeleton() {
  const colors = useColors();
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.card, borderRadius: br.xl },
      ]}
    >
      <Skeleton height={160} radius={0} />
      <View style={styles.info}>
        <Skeleton height={18} width="65%" />
        <Skeleton height={13} width="45%" style={{ marginTop: spacing.sm }} />
        <View style={styles.metaRow}>
          <Skeleton width={48} height={22} radius={br.pill} />
          <Skeleton width={60} height={22} radius={br.pill} />
          <Skeleton width={80} height={22} radius={br.pill} />
        </View>
      </View>
    </View>
  );
}

// ─── Preset: Food Card Skeleton ───────────────────────────────────────────────
export function FoodCardSkeleton() {
  const colors = useColors();
  return (
    <View
      style={[
        styles.foodCard,
        {
          backgroundColor: colors.card,
          borderRadius: br.lg,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={styles.foodInfo}>
        <Skeleton width={40} height={16} radius={br.pill} />
        <Skeleton height={16} width="70%" style={{ marginTop: spacing.sm }} />
        <Skeleton height={13} width="55%" style={{ marginTop: 4 }} />
        <Skeleton height={20} width={60} style={{ marginTop: spacing.md }} />
      </View>
      <Skeleton width={100} height={100} radius={br.md} />
    </View>
  );
}

// ─── Preset: List Item Skeleton ───────────────────────────────────────────────
export function ListItemSkeleton() {
  const colors = useColors();
  return (
    <View style={[styles.listItem, { backgroundColor: colors.card }]}>
      <Skeleton width={48} height={48} radius={br.pill} />
      <View style={styles.listContent}>
        <Skeleton height={14} width="60%" />
        <Skeleton height={12} width="40%" style={{ marginTop: 6 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  info: { padding: spacing.md, gap: 6 },
  metaRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
  foodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderWidth: 1,
    gap: spacing.md,
  },
  foodInfo: { flex: 1 },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.md,
  },
  listContent: { flex: 1 },
});
