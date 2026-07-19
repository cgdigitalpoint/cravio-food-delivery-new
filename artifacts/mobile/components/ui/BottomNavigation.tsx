// ─── Bottom Navigation ────────────────────────────────────────────────────────
import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { typography, spacing } from '@/theme';
import { NotificationBadge } from './NotificationBadge';

export interface BottomNavItem {
  label: string;
  icon: (active: boolean, color: string) => React.ReactNode;
  badge?: number;
}

export interface BottomNavigationProps {
  items: BottomNavItem[];
  activeIndex: number;
  onPress: (index: number) => void;
}

export function BottomNavigation({
  items,
  activeIndex,
  onPress,
}: BottomNavigationProps) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === 'web';

  const paddingBottom = isWeb ? 34 : insets.bottom;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          paddingBottom: paddingBottom + 8,
        },
      ]}
    >
      {/* Top border accent */}
      <View style={[styles.topLine, { backgroundColor: colors.border }]} />

      <View style={styles.row}>
        {items.map((item, index) => {
          const isActive = index === activeIndex;
          const color = isActive ? colors.primary : colors.mutedForeground;

          return (
            <TouchableOpacity
              key={item.label}
              activeOpacity={0.75}
              onPress={() => onPress(index)}
              style={styles.tab}
            >
              <NotificationBadge count={item.badge}>
                {item.icon(isActive, color)}
              </NotificationBadge>

              <Text
                style={[
                  typography.caption,
                  {
                    color,
                    fontFamily: isActive
                      ? 'Inter_600SemiBold'
                      : 'Inter_400Regular',
                    marginTop: 3,
                  },
                ]}
              >
                {item.label}
              </Text>

              {/* Active indicator dot */}
              {isActive && (
                <View
                  style={[styles.activeDot, { backgroundColor: colors.primary }]}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 8,
  },
  topLine: { height: 0 },
  row: {
    flexDirection: 'row',
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xs,
    position: 'relative',
  },
  activeDot: {
    position: 'absolute',
    top: -spacing.sm - 2,
    width: 20,
    height: 3,
    borderRadius: 2,
  },
});
