// ─── Section Header ───────────────────────────────────────────────────────────
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { typography, spacing } from '@/theme';

export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  onSeeAllPress?: () => void;
  seeAllText?: string;
  style?: StyleProp<ViewStyle>;
}

export function SectionHeader({
  title,
  subtitle,
  onSeeAllPress,
  seeAllText = 'See all',
  style,
}: SectionHeaderProps) {
  const colors = useColors();

  return (
    <View style={[styles.container, style]}>
      <View style={styles.left}>
        <Text style={[typography.heading3, { color: colors.foreground }]}>
          {title}
        </Text>
        {subtitle != null && (
          <Text style={[typography.caption, { color: colors.mutedForeground }]}>
            {subtitle}
          </Text>
        )}
      </View>

      {onSeeAllPress != null && (
        <TouchableOpacity
          onPress={onSeeAllPress}
          style={styles.seeAll}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text
            style={[
              typography.label,
              { color: colors.primary },
            ]}
          >
            {seeAllText}
          </Text>
          <Ionicons name="chevron-forward" size={16} color={colors.primary} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: { flex: 1, gap: 2 },
  seeAll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
});
