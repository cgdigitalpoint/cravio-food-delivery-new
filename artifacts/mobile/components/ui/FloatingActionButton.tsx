// ─── Floating Action Button ───────────────────────────────────────────────────
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useColors } from '@/hooks/useColors';
import { typography, borderRadius, spacing } from '@/theme';

export type FABSize = 'small' | 'normal' | 'large';

export interface FABProps {
  icon: React.ReactNode;
  onPress: () => void;
  label?: string;
  size?: FABSize;
  color?: string;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
}

export function FloatingActionButton({
  icon,
  onPress,
  label,
  size = 'normal',
  color,
  style,
  disabled,
}: FABProps) {
  const colors = useColors();
  const bg = color ?? colors.primary;

  const dimension = { small: 40, normal: 56, large: 68 }[size];
  const isExtended = !!label;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.fab,
        {
          width: isExtended ? undefined : dimension,
          height: dimension,
          borderRadius: isExtended ? borderRadius.pill : dimension / 2,
          backgroundColor: bg,
          paddingHorizontal: isExtended ? spacing.lg : 0,
          opacity: disabled ? 0.45 : 1,
        },
        style,
      ]}
    >
      {icon}
      {isExtended && (
        <Text
          style={[
            typography.buttonText,
            { color: '#FFFFFF', marginLeft: spacing.sm },
          ]}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 8,
  },
});
