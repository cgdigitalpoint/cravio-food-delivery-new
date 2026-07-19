// ─── Top App Bar ──────────────────────────────────────────────────────────────
import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { typography, spacing } from '@/theme';

export interface TopAppBarProps {
  title: string;
  subtitle?: string;
  onBackPress?: () => void;
  rightActions?: React.ReactNode[];
  transparent?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function TopAppBar({
  title,
  subtitle,
  onBackPress,
  rightActions,
  transparent = false,
  style,
}: TopAppBarProps) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === 'web';
  const paddingTop = isWeb ? 67 : insets.top;

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: paddingTop + 4,
          backgroundColor: transparent ? 'transparent' : colors.card,
          borderBottomColor: transparent ? 'transparent' : colors.border,
          borderBottomWidth: transparent ? 0 : 1,
        },
        style,
      ]}
    >
      <View style={styles.row}>
        {/* Back button */}
        {onBackPress != null ? (
          <TouchableOpacity
            onPress={onBackPress}
            style={styles.backBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="arrow-back" size={24} color={colors.foreground} />
          </TouchableOpacity>
        ) : (
          <View style={styles.backBtn} />
        )}

        {/* Title */}
        <View style={styles.titleContainer}>
          <Text
            style={[typography.title, { color: colors.foreground }]}
            numberOfLines={1}
          >
            {title}
          </Text>
          {subtitle != null && (
            <Text
              style={[
                typography.caption,
                { color: colors.mutedForeground },
              ]}
              numberOfLines={1}
            >
              {subtitle}
            </Text>
          )}
        </View>

        {/* Right actions */}
        <View style={styles.actions}>
          {rightActions?.map((action, i) => (
            <View key={i}>{action}</View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: spacing.sm,
    paddingHorizontal: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  actions: {
    width: 40,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
  },
});
