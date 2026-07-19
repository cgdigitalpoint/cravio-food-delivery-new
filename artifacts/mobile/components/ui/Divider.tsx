// ─── Divider ──────────────────────────────────────────────────────────────────
import React from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { useColors } from '@/hooks/useColors';

export interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  color?: string;
  thickness?: number;
  style?: StyleProp<ViewStyle>;
  inset?: number;
}

export function Divider({
  orientation = 'horizontal',
  color,
  thickness = 1,
  inset,
  style,
}: DividerProps) {
  const colors = useColors();
  const lineColor = color ?? colors.border;

  if (orientation === 'vertical') {
    return (
      <View
        style={[{ width: thickness, backgroundColor: lineColor, alignSelf: 'stretch' }, style]}
      />
    );
  }

  return (
    <View
      style={[
        {
          height: thickness,
          backgroundColor: lineColor,
          marginHorizontal: inset,
        },
        style,
      ]}
    />
  );
}
