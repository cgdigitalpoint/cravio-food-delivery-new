// ─── Bottom Navigation — Premium Animated ────────────────────────────────────
// Zomato-quality: pill active background, Poppins font, spring bounce.
import React, { useEffect } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolate,
  interpolateColor,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';
import { useColors } from '@/hooks/useColors';
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

  const progress = useSharedValue(isActive ? 1 : 0);
  const scale = useSharedValue(1);

  useEffect(() => {
    progress.value = withTiming(isActive ? 1 : 0, { duration: 220 });
    if (isActive) {
      scale.value = withSpring(1.14, { damping: 10, stiffness: 280, mass: 0.5 });
      scale.value = withSpring(1, { damping: 12, stiffness: 200 });
    }
  }, [isActive]);

  // Active pill background behind icon+label
  const pillStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [0, 1]),
    transform: [{ scaleX: interpolate(progress.value, [0, 1], [0.6, 1]) }],
  }));

  const iconScaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const labelStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [0.55, 1]),
  }));

  const activeColor = colors.primary;
  const inactiveColor = colors.mutedForeground;
  const color = isActive ? activeColor : inactiveColor;

  const handlePress = () => {
    if (!isActive) {
      Haptics.selectionAsync().catch(() => {});
    }
    onPress(index);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={handlePress}
      style={styles.tab}
      accessibilityRole="tab"
      accessibilityState={{ selected: isActive }}
      accessibilityLabel={item.label}
    >
      {/* Pill background */}
      <Animated.View
        style={[
          styles.activePill,
          { backgroundColor: `${colors.primary}18` },
          pillStyle,
        ]}
      />

      {/* Icon */}
      <Animated.View style={iconScaleStyle}>
        <NotificationBadge count={item.badge}>
          {item.icon(isActive, color)}
        </NotificationBadge>
      </Animated.View>

      {/* Label */}
      <Animated.Text
        style={[
          styles.label,
          {
            color,
            fontFamily: isActive ? 'Poppins_600SemiBold' : 'Poppins_400Regular',
          },
          labelStyle,
        ]}
        numberOfLines={1}
      >
        {item.label}
      </Animated.Text>
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
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const isIOS = Platform.OS === 'ios';
  const isWeb = Platform.OS === 'web';
  const paddingBottom = isWeb ? 34 : insets.bottom;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isIOS ? 'transparent' : colors.card,
          borderTopColor: colors.border,
          paddingBottom: paddingBottom + 4,
        },
      ]}
    >
      {/* Blur background for iOS */}
      {isIOS && (
        <BlurView
          intensity={95}
          tint={isDark ? 'dark' : 'light'}
          style={StyleSheet.absoluteFill}
        />
      )}

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
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 14,
  },
  row: {
    flexDirection: 'row',
    paddingTop: 8,
    paddingHorizontal: 4,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    gap: 2,
    position: 'relative',
  },
  activePill: {
    position: 'absolute',
    top: 0,
    left: 6,
    right: 6,
    bottom: 0,
    borderRadius: 12,
  },
  label: {
    fontSize: 10,
    letterSpacing: 0.1,
    marginTop: 1,
  },
});
