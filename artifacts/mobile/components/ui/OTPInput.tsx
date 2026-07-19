// ─── OTP Input ────────────────────────────────────────────────────────────────
import React, { useRef } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useColors } from '@/hooks/useColors';
import { typography, borderRadius, spacing } from '@/theme';

export interface OTPInputProps {
  length?: number;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
}

export function OTPInput({
  length = 6,
  value,
  onChangeText,
  error,
}: OTPInputProps) {
  const colors = useColors();
  const inputRef = useRef<TextInput>(null);
  const digits = Array.from({ length });

  return (
    <View>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => inputRef.current?.focus()}
      >
        <View style={styles.row}>
          {digits.map((_, i) => {
            const char = value[i] ?? '';
            const isActive = value.length === i || (value.length === length && i === length - 1);
            return (
              <View
                key={i}
                style={[
                  styles.box,
                  {
                    borderColor: error
                      ? colors.error
                      : isActive
                        ? colors.primary
                        : char
                          ? colors.border
                          : colors.border,
                    backgroundColor: char ? `${colors.primary}08` : colors.card,
                    borderWidth: isActive ? 2 : 1.5,
                    borderRadius: borderRadius.md,
                  },
                ]}
              >
                {char !== '' && (
                  <Text style={[typography.heading3, { color: colors.foreground }]}>
                    {char}
                  </Text>
                )}
                {isActive && char === '' && (
                  <View
                    style={[styles.cursor, { backgroundColor: colors.primary }]}
                  />
                )}
              </View>
            );
          })}
        </View>

        <TextInput
          ref={inputRef}
          value={value}
          onChangeText={(text) =>
            onChangeText(text.replace(/[^0-9]/g, '').slice(0, length))
          }
          keyboardType="number-pad"
          maxLength={length}
          style={styles.hiddenInput}
          caretHidden
        />
      </TouchableOpacity>

      {error != null && (
        <Text style={[typography.caption, { color: colors.error, marginTop: spacing.sm }]}>
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
  },
  box: {
    width: 48,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cursor: {
    width: 2,
    height: 22,
    borderRadius: 1,
  },
  hiddenInput: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
  },
});
