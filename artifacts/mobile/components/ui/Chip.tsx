// ─── Chip ─────────────────────────────────────────────────────────────────────
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { typography, borderRadius, spacing } from '@/theme';

export type ChipVariant = 'veg' | 'nonVeg' | 'popular' | 'discount' | 'new' | 'filter';

export interface ChipProps {
  variant?: ChipVariant;
  label?: string;
  selected?: boolean;
  onPress?: () => void;
  onClose?: () => void;
}

interface ChipConfig {
  label: string;
  bg: string;
  textColor: string;
  borderColor: string;
  icon?: React.ReactNode;
}

export function Chip({
  variant = 'filter',
  label,
  selected,
  onPress,
  onClose,
}: ChipProps) {
  const colors = useColors();

  const configs: Record<ChipVariant, ChipConfig> = {
    veg: {
      label: 'Veg',
      bg: '#F0FDF4',
      textColor: '#16A34A',
      borderColor: '#16A34A',
      icon: (
        <View style={[styles.vegDot, { backgroundColor: '#16A34A' }]} />
      ),
    },
    nonVeg: {
      label: 'Non-Veg',
      bg: '#FFF1F2',
      textColor: '#E11D48',
      borderColor: '#E11D48',
      icon: (
        <View
          style={[
            styles.vegDot,
            { backgroundColor: '#E11D48', borderRadius: 0 },
          ]}
        />
      ),
    },
    popular: {
      label: 'Popular',
      bg: '#FFF7ED',
      textColor: '#FF6B00',
      borderColor: '#FF6B00',
      icon: <Ionicons name="flame" size={11} color="#FF6B00" />,
    },
    discount: {
      label: 'Deal',
      bg: '#F0FDF4',
      textColor: '#16A34A',
      borderColor: '#16A34A',
      icon: <Ionicons name="pricetag" size={11} color="#16A34A" />,
    },
    new: {
      label: 'New',
      bg: '#EFF6FF',
      textColor: '#2563EB',
      borderColor: '#2563EB',
    },
    filter: {
      label: label ?? 'Filter',
      bg: selected ? colors.primary : colors.card,
      textColor: selected ? '#FFFFFF' : colors.foreground,
      borderColor: selected ? colors.primary : colors.border,
    },
  };

  const config = configs[variant];
  const displayLabel = label ?? config.label;

  const content = (
    <View
      style={[
        styles.chip,
        {
          backgroundColor: config.bg,
          borderColor: config.borderColor,
          borderRadius: borderRadius.pill,
        },
      ]}
    >
      {config.icon != null && config.icon}
      <Text
        style={[
          typography.caption,
          {
            color: config.textColor,
            fontFamily: 'Inter_500Medium',
          },
        ]}
      >
        {displayLabel}
      </Text>
      {onClose != null && (
        <TouchableOpacity
          onPress={onClose}
          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
        >
          <Ionicons name="close" size={12} color={config.textColor} />
        </TouchableOpacity>
      )}
    </View>
  );

  if (onPress != null) {
    return (
      <TouchableOpacity activeOpacity={0.75} onPress={onPress}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderWidth: 1,
  },
  vegDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
  },
});
