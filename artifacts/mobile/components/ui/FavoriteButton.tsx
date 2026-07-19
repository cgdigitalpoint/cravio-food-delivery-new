// ─── Favorite Button ──────────────────────────────────────────────────────────
import React, { useRef } from 'react';
import { Animated, StyleSheet, TouchableOpacity, type StyleProp, type ViewStyle } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';

export type FavoriteButtonSize = 'sm' | 'md' | 'lg';

export interface FavoriteButtonProps {
  isFavorite: boolean;
  onToggle: () => void;
  size?: FavoriteButtonSize;
  style?: StyleProp<ViewStyle>;
  backgroundColor?: string;
}

export function FavoriteButton({
  isFavorite,
  onToggle,
  size = 'md',
  style,
  backgroundColor,
}: FavoriteButtonProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const iconSize = { sm: 16, md: 22, lg: 28 }[size];
  const containerSize = { sm: 30, md: 40, lg: 52 }[size];

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Animated.sequence([
      Animated.timing(scale, { toValue: 1.35, duration: 120, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, tension: 200, friction: 6 }),
    ]).start();
    onToggle();
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.75}
      style={[
        styles.btn,
        {
          width: containerSize,
          height: containerSize,
          borderRadius: containerSize / 2,
          backgroundColor: backgroundColor ?? 'rgba(0,0,0,0.08)',
        },
        style,
      ]}
    >
      <Animated.View style={{ transform: [{ scale }] }}>
        <Ionicons
          name={isFavorite ? 'heart' : 'heart-outline'}
          size={iconSize}
          color={isFavorite ? '#EF4444' : '#6B7280'}
        />
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
