// ─── Empty State ──────────────────────────────────────────────────────────────
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, type StyleProp, type ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { typography, borderRadius, spacing } from '@/theme';

export type EmptyStateVariant =
  | 'noOrders'
  | 'noInternet'
  | 'noSearchResult'
  | 'emptyCart'
  | 'custom';

export interface EmptyStateProps {
  variant?: EmptyStateVariant;
  title?: string;
  subtitle?: string;
  ctaText?: string;
  onCtaPress?: () => void;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

interface EmptyConfig {
  iconName: string;
  iconColor: string;
  bgColor: string;
  title: string;
  subtitle: string;
}

export function EmptyState({
  variant = 'custom',
  title,
  subtitle,
  ctaText,
  onCtaPress,
  icon,
  style,
}: EmptyStateProps) {
  const colors = useColors();

  const configs: Record<EmptyStateVariant, EmptyConfig> = {
    noOrders: {
      iconName: 'receipt-outline',
      iconColor: colors.primary,
      bgColor: `${colors.primary}12`,
      title: 'No orders yet',
      subtitle: 'When you place an order, it will appear here.',
    },
    noInternet: {
      iconName: 'cloud-offline-outline',
      iconColor: '#6B7280',
      bgColor: `${colors.muted}`,
      title: 'No internet connection',
      subtitle: 'Please check your network settings and try again.',
    },
    noSearchResult: {
      iconName: 'search-outline',
      iconColor: colors.primary,
      bgColor: `${colors.primary}12`,
      title: 'No results found',
      subtitle: 'Try adjusting your search or browse our categories.',
    },
    emptyCart: {
      iconName: 'cart-outline',
      iconColor: colors.primary,
      bgColor: `${colors.primary}12`,
      title: 'Your cart is empty',
      subtitle: 'Add items from a restaurant to get started.',
    },
    custom: {
      iconName: 'help-circle-outline',
      iconColor: colors.mutedForeground,
      bgColor: colors.muted,
      title: title ?? 'Nothing here',
      subtitle: subtitle ?? '',
    },
  };

  const cfg = configs[variant];
  const displayTitle = title ?? cfg.title;
  const displaySubtitle = subtitle ?? cfg.subtitle;

  return (
    <View style={[styles.container, style]}>
      {/* Icon container */}
      <View
        style={[
          styles.iconCircle,
          {
            backgroundColor: cfg.bgColor,
            borderRadius: borderRadius.xxl,
          },
        ]}
      >
        {icon ?? (
          <Ionicons name={cfg.iconName as any} size={48} color={cfg.iconColor} />
        )}
      </View>

      {/* Text */}
      <Text
        style={[
          typography.heading3,
          { color: colors.foreground, textAlign: 'center', marginTop: spacing.lg },
        ]}
      >
        {displayTitle}
      </Text>

      {displaySubtitle !== '' && (
        <Text
          style={[
            typography.body,
            {
              color: colors.mutedForeground,
              textAlign: 'center',
              marginTop: spacing.sm,
              maxWidth: 280,
            },
          ]}
        >
          {displaySubtitle}
        </Text>
      )}

      {/* CTA */}
      {ctaText != null && (
        <TouchableOpacity
          onPress={onCtaPress}
          activeOpacity={0.8}
          style={[
            styles.cta,
            {
              backgroundColor: colors.primary,
              borderRadius: borderRadius.pill,
              marginTop: spacing.xl,
            },
          ]}
        >
          <Text style={[typography.buttonText, { color: '#FFFFFF' }]}>
            {ctaText}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxxl,
  },
  iconCircle: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cta: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
});
