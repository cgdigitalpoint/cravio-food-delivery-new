// ─── Typography Component ─────────────────────────────────────────────────────
import React from 'react';
import { Text, type TextProps } from 'react-native';
import { useColors } from '@/hooks/useColors';
import { typography, type TypographyVariant } from '@/theme';

export interface TypographyProps extends TextProps {
  variant?: TypographyVariant;
  color?: string;
  align?: 'left' | 'center' | 'right';
}

export function Typography({
  variant = 'bodyMD',
  color,
  align = 'left',
  style,
  children,
  ...rest
}: TypographyProps) {
  const colors = useColors();
  return (
    <Text
      style={[
        typography[variant],
        { color: color ?? colors.foreground, textAlign: align },
        style,
      ]}
      {...rest}
    >
      {children}
    </Text>
  );
}
