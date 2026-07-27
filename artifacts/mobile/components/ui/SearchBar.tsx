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
  onSubmitEditing?: () => void;
  style?: StyleProp<ViewStyle>;
  autoFocus?: boolean;
}

export function SearchBar({
  value,
  onChangeText,
  placeholder = 'Search restaurants, food...',
  onClear,
  onFilterPress,
  onSubmitEditing,
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
            shadowColor: isFocused ? colors.primary : '#000',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: isFocused ? 0.15 : 0.03,
            shadowRadius: isFocused ? 8 : 4,
            elevation: isFocused ? 3 : 1,
          },
        ]}
      >
        <Ionicons
          name="search"
          size={18}
          color={isFocused ? colors.primary : colors.mutedForeground}
          style={styles.searchIcon}
        />

        <TextInput
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmitEditing}
          placeholder={placeholder}
          placeholderTextColor={colors.mutedForeground}
          style={[
            styles.input,
            typography.body,
            { color: colors.foreground, fontFamily: 'Inter_500Medium', fontSize: 13 },
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
            <Ionicons name="close-circle" size={16} color={colors.mutedForeground} />
          </TouchableOpacity>
        )}

        {onFilterPress != null && (
          <TouchableOpacity onPress={onFilterPress} style={[styles.filterBtn, { backgroundColor: colors.primary }]}>
            <Ionicons name="options" size={16} color="#FFFFFF" />
          </TouchableOpacity>
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
    height: 48,
    paddingHorizontal: spacing.md,
  },
  searchIcon: { marginRight: 8 },
  input: {
    flex: 1,
    height: '100%',
    paddingVertical: 0,
  },
  clearBtn: { padding: 4, marginRight: 4 },
  filterBtn: { 
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
});
