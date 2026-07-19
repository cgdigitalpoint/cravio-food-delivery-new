// ─── Tag ──────────────────────────────────────────────────────────────────────
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
import { typography, borderRadius, spacing } from '@/theme';

export interface TagProps {
  label: string;
  color?: string;
  textColor?: string;
  onClose?: () => void;
  onPress?: () => void;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function Tag({
  label,
  color,
  textColor,
  onClose,
  onPress,
  icon,
  style,
}: TagProps) {
  const colors = useColors();
  const bg = color ?? `${colors.primary}15`;
  const text = textColor ?? colors.primary;

  const content = (
    <View
      style={[
        styles.tag,
        {
          backgroundColor: bg,
          borderRadius: borderRadius.pill,
        },
        style,
      ]}
    >
      {icon != null && icon}
      <Text
        style={[
          typography.caption,
          { color: text, fontFamily: 'Inter_500Medium' },
        ]}
      >
        {label}
      </Text>
      {onClose != null && (
        <TouchableOpacity
          onPress={onClose}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="close" size={12} color={text} />
        </TouchableOpacity>
      )}
    </View>
  );

  if (onPress != null) {
    return (
      <TouchableOpacity activeOpacity={0.75} onPress={onPress}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
});
