// ─── Search Bar ───────────────────────────────────────────────────────────────
import React, { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { typography, borderRadius, spacing } from '@/theme';

export interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
  onFilterPress?: () => void;
  style?: StyleProp<ViewStyle>;
  autoFocus?: boolean;
}

export function SearchBar({
  value,
  onChangeText,
  placeholder = 'Search restaurants, food...',
  onClear,
  onFilterPress,
  style,
  autoFocus,
}: SearchBarProps) {
  const colors = useColors();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.wrapper, style]}>
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.card,
            borderRadius: borderRadius.pill,
            borderColor: isFocused ? colors.primary : colors.border,
            borderWidth: isFocused ? 1.5 : 1,
          },
        ]}
      >
        <Ionicons
          name="search"
          size={20}
          color={isFocused ? colors.primary : colors.mutedForeground}
          style={styles.searchIcon}
        />

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.mutedForeground}
          style={[
            styles.input,
            typography.body,
            { color: colors.foreground },
          ]}
          returnKeyType="search"
          autoFocus={autoFocus}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />

        {value.length > 0 && (
          <TouchableOpacity
            onPress={() => {
              onChangeText('');
              onClear?.();
            }}
            style={styles.clearBtn}
          >
            <Ionicons name="close-circle" size={18} color={colors.mutedForeground} />
          </TouchableOpacity>
        )}

        {onFilterPress != null && (
          <>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <TouchableOpacity onPress={onFilterPress} style={styles.filterBtn}>
              <Ionicons name="options" size={20} color={colors.primary} />
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {},
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    paddingHorizontal: spacing.md,
  },
  searchIcon: { marginRight: spacing.sm },
  input: {
    flex: 1,
    height: '100%',
    paddingVertical: 0,
  },
  clearBtn: { padding: 4 },
  divider: { width: 1, height: 24, marginHorizontal: spacing.sm },
  filterBtn: { padding: 4 },
});
