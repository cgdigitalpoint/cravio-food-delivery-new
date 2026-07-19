// ─── Button Component ─────────────────────────────────────────────────────────
import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type TouchableOpacityProps,
} from 'react-native';
import { useColors } from '@/hooks/useColors';
import { typography } from '@/theme';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'destructive';

export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends TouchableOpacityProps {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export function Button({
  label,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  disabled,
  style,
  ...rest
}: ButtonProps) {
  const colors = useColors();
  const isDisabled = disabled || isLoading;

  const bgMap: Record<ButtonVariant, string> = {
    primary: colors.primary,
    secondary: colors.secondary,
    outline: 'transparent',
    ghost: 'transparent',
    destructive: colors.destructive,
  };

  const textMap: Record<ButtonVariant, string> = {
    primary: colors.primaryForeground,
    secondary: colors.secondaryForeground,
    outline: colors.primary,
    ghost: colors.foreground,
    destructive: colors.destructiveForeground,
  };

  const height = { sm: 36, md: 48, lg: 56 }[size];
  const px = { sm: 14, md: 20, lg: 28 }[size];
  const fontSize = { sm: 13, md: 15, lg: 16 }[size];

  return (
    <TouchableOpacity
      activeOpacity={0.78}
      disabled={isDisabled}
      style={[
        styles.base,
        {
          height,
          paddingHorizontal: px,
          borderRadius: colors.radius,
          backgroundColor: bgMap[variant],
          borderColor:
            variant === 'outline' ? colors.primary : 'transparent',
          borderWidth: variant === 'outline' ? 1.5 : 0,
          opacity: isDisabled ? 0.5 : 1,
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
        },
        style,
      ]}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator color={textMap[variant]} size="small" />
      ) : (
        <View style={styles.row}>
          {leftIcon != null && (
            <View style={styles.iconLeft}>{leftIcon}</View>
          )}
          <Text
            style={[
              typography.label,
              {
                color: textMap[variant],
                fontSize,
                fontFamily: 'Inter_600SemiBold',
              },
            ]}
          >
            {label}
          </Text>
          {rightIcon != null && (
            <View style={styles.iconRight}>{rightIcon}</View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconLeft: { marginRight: 2 },
  iconRight: { marginLeft: 2 },
});
