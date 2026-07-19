// ─── Password Field ───────────────────────────────────────────────────────────
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { typography, borderRadius, spacing } from '@/theme';

export interface PasswordInputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  helperText?: string;
}

export function PasswordInput({
  label,
  value,
  onChangeText,
  placeholder = 'Enter password',
  error,
  helperText,
}: PasswordInputProps) {
  const colors = useColors();
  const [isFocused, setIsFocused] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const borderColor = error ? colors.error : isFocused ? colors.primary : colors.border;

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
            borderWidth: isFocused ? 1.5 : 1,
            borderRadius: borderRadius.md,
            backgroundColor: colors.card,
          },
        ]}
      >
        <Ionicons
          name="lock-closed-outline"
          size={20}
          color={isFocused ? colors.primary : colors.mutedForeground}
          style={styles.lockIcon}
        />

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.mutedForeground}
          secureTextEntry={!isVisible}
          autoCapitalize="none"
          style={[styles.input, typography.body, { color: colors.foreground }]}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />

        <TouchableOpacity
          onPress={() => setIsVisible((v) => !v)}
          style={styles.eyeBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons
            name={isVisible ? 'eye-off-outline' : 'eye-outline'}
            size={20}
            color={colors.mutedForeground}
          />
        </TouchableOpacity>
      </View>

      {(error ?? helperText) != null && (
        <Text
          style={[
            typography.caption,
            { color: error ? colors.error : colors.mutedForeground, marginTop: 4 },
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
  },
  lockIcon: { marginLeft: spacing.md, marginRight: spacing.sm },
  input: {
    flex: 1,
    height: '100%',
    paddingVertical: 0,
  },
  eyeBtn: { padding: spacing.md },
});
