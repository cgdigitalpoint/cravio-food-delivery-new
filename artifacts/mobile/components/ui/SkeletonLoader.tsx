// ─── Skeleton Loader ──────────────────────────────────────────────────────────
import React, { useEffect } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle, Dimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useColors } from '@/hooks/useColors';
import { borderRadius as br, spacing } from '@/theme';

export interface SkeletonProps {
  width?: number | `${number}%`;
  height?: number;
  radius?: number;
  style?: StyleProp<ViewStyle>;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export function Skeleton({ width = '100%', height = 16, radius = br.sm, style }: SkeletonProps) {
  const shimmerValue = useSharedValue(0);

  useEffect(() => {
    shimmerValue.value = withRepeat(
      withTiming(1, { duration: 1200, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  const animStyle = useAnimatedStyle(() => {
    const translateX = interpolate(shimmerValue.value, [0, 1], [-SCREEN_WIDTH, SCREEN_WIDTH]);
    return {
      transform: [{ translateX }],
    };
  });

  return (
    <View
      style={[
        {
          width: width as any,
          height,
          borderRadius: radius,
          backgroundColor: '#E5E7EB',
          overflow: 'hidden',
        },
        style,
      ]}
    >
      <Animated.View style={[StyleSheet.absoluteFill, animStyle]}>
        <LinearGradient
          colors={['transparent', 'rgba(255,255,255,0.5)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
}

// ─── Preset: Restaurant Card Skeleton ─────────────────────────────────────────
export function RestaurantCardSkeleton() {
  const colors = useColors();
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.card, borderRadius: br.lg },
      ]}
    >
      <Skeleton height={120} radius={0} />
      <View style={styles.info}>
        <Skeleton height={18} width="65%" />
        <Skeleton height={13} width="45%" style={{ marginTop: spacing.xs }} />
        <View style={styles.metaRow}>
          <Skeleton width={40} height={20} radius={br.pill} />
          <Skeleton width={50} height={20} radius={br.pill} />
          <Skeleton width={70} height={20} radius={br.pill} />
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
      <Skeleton width={80} height={80} radius={br.md} />
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
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  info: { padding: 12, gap: 6 },
  metaRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xs },
  foodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
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
