// ─── Icon Button ──────────────────────────────────────────────────────────────
import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  type TouchableOpacityProps,
  type ViewStyle,
  type StyleProp,
} from 'react-native';
import { useColors } from '@/hooks/useColors';
import { borderRadius } from '@/theme';

export type IconButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline';
export type IconButtonSize = 'sm' | 'md' | 'lg';

export interface IconButtonProps extends TouchableOpacityProps {
  icon: React.ReactNode;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  rounded?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function IconButton({
  icon,
  variant = 'ghost',
  size = 'md',
  rounded = true,
  disabled,
  style,
  ...rest
}: IconButtonProps) {
  const colors = useColors();

  const dimension = { sm: 36, md: 44, lg: 52 }[size];
  const radius = rounded ? borderRadius.pill : borderRadius.md;

  const bgMap: Record<IconButtonVariant, string> = {
    primary: colors.primary,
    secondary: `${colors.primary}15`,
    ghost: 'transparent',
    outline: 'transparent',
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={disabled}
      style={[
        styles.base,
        {
          width: dimension,
          height: dimension,
          borderRadius: radius,
          backgroundColor: bgMap[variant],
          borderWidth: variant === 'outline' ? 1.5 : 0,
          borderColor: variant === 'outline' ? colors.border : 'transparent',
          opacity: disabled ? 0.45 : 1,
        },
        style,
      ]}
      {...rest}
    >
      {icon}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
