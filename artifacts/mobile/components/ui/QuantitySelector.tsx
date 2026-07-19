// ─── Quantity Selector ────────────────────────────────────────────────────────
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useColors } from '@/hooks/useColors';
import { typography, borderRadius, spacing } from '@/theme';

export type QuantitySelectorSize = 'sm' | 'md' | 'lg';

export interface QuantitySelectorProps {
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  min?: number;
  max?: number;
  size?: QuantitySelectorSize;
}

export function QuantitySelector({
  value,
  onIncrement,
  onDecrement,
  min = 0,
  max = 99,
  size = 'md',
}: QuantitySelectorProps) {
  const colors = useColors();

  const btnSize = { sm: 28, md: 36, lg: 44 }[size];
  const fontSize = { sm: 13, md: 15, lg: 17 }[size];

  const handleDecrement = () => {
    if (value <= min) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onDecrement();
  };

  const handleIncrement = () => {
    if (value >= max) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onIncrement();
  };

  return (
    <View
      style={[
        styles.container,
        {
          borderRadius: borderRadius.pill,
          borderColor: colors.border,
          height: btnSize,
        },
      ]}
    >
      {/* Decrement */}
      <TouchableOpacity
        onPress={handleDecrement}
        disabled={value <= min}
        style={[
          styles.btn,
          {
            width: btnSize,
            height: btnSize,
            backgroundColor: value <= min ? colors.muted : `${colors.primary}15`,
          },
        ]}
      >
        <Text
          style={[
            typography.heading3,
            {
              color: value <= min ? colors.mutedForeground : colors.primary,
              fontSize,
              lineHeight: btnSize,
            },
          ]}
        >
          −
        </Text>
      </TouchableOpacity>

      {/* Count */}
      <Text
        style={[
          typography.label,
          {
            color: colors.foreground,
            fontSize,
            minWidth: btnSize - 8,
            textAlign: 'center',
          },
        ]}
      >
        {value}
      </Text>

      {/* Increment */}
      <TouchableOpacity
        onPress={handleIncrement}
        disabled={value >= max}
        style={[
          styles.btn,
          {
            width: btnSize,
            height: btnSize,
            backgroundColor:
              value >= max ? colors.muted : colors.primary,
          },
        ]}
      >
        <Text
          style={[
            typography.heading3,
            {
              color: value >= max ? colors.mutedForeground : '#FFFFFF',
              fontSize,
              lineHeight: btnSize,
            },
          ]}
        >
          +
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    overflow: 'hidden',
    alignSelf: 'flex-start',
  },
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
