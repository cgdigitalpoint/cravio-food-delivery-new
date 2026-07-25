// ─── InputField ───────────────────────────────────────────────────────────────
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
  View,
} from 'react-native';
import { PP } from '@/theme/poppins';

interface Props extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function InputField({ label, error, helperText, leftIcon, rightIcon, style, ...rest }: Props) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.wrap}>
      {label ? <Text style={[PP.caption, styles.label]}>{label}</Text> : null}
      <View
        style={[
          styles.row,
          focused && styles.focused,
          error ? styles.errored : null,
        ]}
      >
        {leftIcon ? <View style={styles.icon}>{leftIcon}</View> : null}
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor="#9CA3AF"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...rest}
        />
        {rightIcon ? <View style={styles.icon}>{rightIcon}</View> : null}
      </View>
      {error ? (
        <Text style={[PP.captionSM, styles.error]}>{error}</Text>
      ) : helperText ? (
        <Text style={[PP.captionSM, styles.helper]}>{helperText}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 4 },
  label: { color: '#374151', fontFamily: 'Poppins_500Medium' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 14,
    minHeight: 52,
  },
  focused: { borderColor: '#FF6B00', backgroundColor: '#FFFBF8' },
  errored: { borderColor: '#EF4444' },
  input: { flex: 1, fontFamily: 'Poppins_400Regular', fontSize: 14, color: '#111827', paddingVertical: 14 },
  icon: { marginRight: 8 },
  error: { color: '#EF4444' },
  helper: { color: '#6B7280' },
});
