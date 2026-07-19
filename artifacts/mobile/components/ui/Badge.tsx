// ─── Badge ────────────────────────────────────────────────────────────────────
import React from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { typography, borderRadius, spacing } from '@/theme';

export type BadgeVariant = 'rating' | 'deliveryTime' | 'offer' | 'freeDelivery' | 'custom';

export interface BadgeProps {
  variant: BadgeVariant;
  value?: string | number;
  label?: string;
  style?: StyleProp<ViewStyle>;
}

export function Badge({ variant, value, label, style }: BadgeProps) {
  const colors = useColors();

  if (variant === 'rating') {
    return (
      <View
        style={[
          styles.badge,
          { backgroundColor: '#22C55E', borderRadius: borderRadius.sm },
          style,
        ]}
      >
        <Ionicons name="star" size={11} color="#FFFFFF" />
        <Text style={[typography.caption, styles.whiteText]}>
          {value ?? '4.5'}
        </Text>
      </View>
    );
  }

  if (variant === 'deliveryTime') {
    return (
      <View
        style={[
          styles.badge,
          { backgroundColor: colors.surfaceVariant ?? colors.muted, borderRadius: borderRadius.sm },
          style,
        ]}
      >
        <Ionicons name="time-outline" size={11} color={colors.mutedForeground} />
        <Text style={[typography.caption, { color: colors.mutedForeground }]}>
          {value ?? '30'} min
        </Text>
      </View>
    );
  }

  if (variant === 'offer') {
    return (
      <View
        style={[
          styles.badge,
          { backgroundColor: `${colors.primary}15`, borderRadius: borderRadius.sm },
          style,
        ]}
      >
        <Ionicons name="pricetag-outline" size={11} color={colors.primary} />
        <Text style={[typography.caption, { color: colors.primary, fontFamily: 'Inter_600SemiBold' }]}>
          {value ?? '20% OFF'}
        </Text>
      </View>
    );
  }

  if (variant === 'freeDelivery') {
    return (
      <View
        style={[
          styles.badge,
          { backgroundColor: `${colors.secondary}15`, borderRadius: borderRadius.sm },
          style,
        ]}
      >
        <Ionicons name="bicycle-outline" size={11} color={colors.secondary} />
        <Text
          style={[
            typography.caption,
            { color: colors.secondary, fontFamily: 'Inter_600SemiBold' },
          ]}
        >
          Free Delivery
        </Text>
      </View>
    );
  }

  // Custom
  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: colors.muted, borderRadius: borderRadius.sm },
        style,
      ]}
    >
      <Text style={[typography.caption, { color: colors.mutedForeground }]}>
        {label ?? value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  whiteText: { color: '#FFFFFF', fontFamily: 'Inter_600SemiBold' },
});
