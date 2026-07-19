// ─── Input Field ──────────────────────────────────────────────────────────────
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput as RNTextInput,
  type TextInputProps as RNTextInputProps,
  View,
} from 'react-native';
import { useColors } from '@/hooks/useColors';
import { typography, borderRadius, spacing } from '@/theme';

export interface InputFieldProps extends RNTextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function InputField({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  style,
  ...rest
}: InputFieldProps) {
  const colors = useColors();
  const [isFocused, setIsFocused] = useState(false);

  const borderColor = error
    ? colors.error
    : isFocused
      ? colors.primary
      : colors.border;

  return (
    <View style={styles.wrapper}>
      {label != null && (
        <Text style={[typography.label, { color: colors.foreground, marginBottom: 6 }]}>
          {label}
        </Text>
      )}

      <View
        style={[
          styles.container,
          {
            borderColor,
            borderRadius: borderRadius.md,
            backgroundColor: colors.card,
            borderWidth: isFocused ? 1.5 : 1,
          },
        ]}
      >
        {leftIcon != null && (
          <View style={styles.leftIcon}>{leftIcon}</View>
        )}

        <RNTextInput
          style={[
            styles.input,
            typography.body,
            {
              color: colors.foreground,
              paddingLeft: leftIcon ? spacing.sm : spacing.md,
              paddingRight: rightIcon ? spacing.sm : spacing.md,
            },
            style,
          ]}
          placeholderTextColor={colors.mutedForeground}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...rest}
        />

        {rightIcon != null && (
          <View style={styles.rightIcon}>{rightIcon}</View>
        )}
      </View>

      {(error ?? helperText) != null && (
        <Text
          style={[
            typography.caption,
            {
              color: error ? colors.error : colors.mutedForeground,
              marginTop: 4,
            },
          ]}
        >
          {error ?? helperText}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 0 },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    overflow: 'hidden',
  },
  input: {
    flex: 1,
    height: '100%',
    paddingVertical: 0,
  },
  leftIcon: { paddingLeft: spacing.md, marginRight: 2 },
  rightIcon: { paddingRight: spacing.md, marginLeft: 2 },
});
