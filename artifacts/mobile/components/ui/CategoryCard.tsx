// ─── Category Card ────────────────────────────────────────────────────────────
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useColors } from '@/hooks/useColors';
import { typography, borderRadius, spacing } from '@/theme';

export interface CategoryCardProps {
  name: string;
  icon: React.ReactNode;
  color?: string;
  isSelected?: boolean;
  onPress?: () => void;
}

export function CategoryCard({
  name,
  icon,
  color,
  isSelected,
  onPress,
}: CategoryCardProps) {
  const colors = useColors();
  const bg = color ?? colors.primary;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={styles.container}
    >
      <View
        style={[
          styles.iconCircle,
          {
            backgroundColor: isSelected ? bg : `${bg}18`,
            borderRadius: borderRadius.xl,
            borderWidth: isSelected ? 2 : 0,
            borderColor: bg,
          },
        ]}
      >
        {icon}
      </View>

      <Text
        style={[
          typography.caption,
          {
            color: isSelected ? bg : colors.foreground,
            fontFamily: isSelected ? 'Inter_600SemiBold' : 'Inter_400Regular',
            marginTop: spacing.xs,
            textAlign: 'center',
          },
        ]}
        numberOfLines={1}
      >
        {name}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: 72,
  },
  iconCircle: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
