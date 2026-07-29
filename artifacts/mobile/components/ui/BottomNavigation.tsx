// ─── Bottom Navigation — Animated ────────────────────────────────────────────
import React, { useEffect } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
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

// Per-tab animated icon wrapper
function NavTab({
  item,
  index,
  isActive,
  onPress,
}: {
  item: BottomNavItem;
  index: number;
  isActive: boolean;
  onPress: (index: number) => void;
}) {
  const colors = useColors();
  const color = isActive ? colors.primary : colors.mutedForeground;

  // Scale spring: pops up on activation
  const scale = useSharedValue(1);
  const indicatorWidth = useSharedValue(isActive ? 1 : 0);

  useEffect(() => {
    scale.value = withSpring(isActive ? 1.18 : 1, {
      damping: 12,
      stiffness: 220,
      mass: 0.6,
    });
    indicatorWidth.value = withTiming(isActive ? 1 : 0, { duration: 200 });
  }, [isActive]);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const indicatorStyle = useAnimatedStyle(() => ({
    width: interpolate(indicatorWidth.value, [0, 1], [0, 20]),
    opacity: indicatorWidth.value,
  }));

  const handlePress = () => {
    if (!isActive) {
      Haptics.selectionAsync();
    }
    onPress(index);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={handlePress}
      style={styles.tab}
    >
      {/* Active pill indicator at top */}
      <Animated.View
        style={[
          styles.activePill,
          { backgroundColor: colors.primary },
          indicatorStyle,
        ]}
      />

      {/* Icon with bounce */}
      <Animated.View style={iconStyle}>
        <NotificationBadge count={item.badge}>
          {item.icon(isActive, color)}
        </NotificationBadge>
      </Animated.View>

      <Text
        style={[
          typography.caption,
          {
            color,
            fontFamily: isActive ? 'Inter_600SemiBold' : 'Inter_400Regular',
            marginTop: 3,
          },
        ]}
      >
        {item.label}
      </Text>
    </TouchableOpacity>
  );
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
          paddingBottom: paddingBottom + 6,
        },
      ]}
    >
      <View style={styles.row}>
        {items.map((item, index) => (
          <NavTab
            key={item.label}
            item={item}
            index={index}
            isActive={index === activeIndex}
            onPress={onPress}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: StyleSheet.hairlineWidth,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 12,
  },
  row: {
    flexDirection: 'row',
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xs,
    gap: 1,
  },
  activePill: {
    height: 3,
    borderRadius: 2,
    marginBottom: 5,
  },
});
