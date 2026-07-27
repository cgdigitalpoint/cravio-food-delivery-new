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
            backgroundColor: isSelected ? bg : colors.surfaceVariant,
            borderRadius: 28,
            borderWidth: isSelected ? 0 : 1,
            borderColor: colors.border,
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
            fontFamily: isSelected ? 'Inter_600SemiBold' : 'Inter_500Medium',
            marginTop: 6,
            textAlign: 'center',
            fontSize: 9,
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
    width: 64,
  },
  iconCircle: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
