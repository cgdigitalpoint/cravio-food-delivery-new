// ─── Toast ────────────────────────────────────────────────────────────────────
// Appears at the top of the screen with title + optional message.
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { typography, borderRadius, spacing } from '@/theme';

export type ToastType = 'default' | 'success' | 'error' | 'warning';

export interface ToastProps {
  visible: boolean;
  title: string;
  message?: string;
  type?: ToastType;
  duration?: number;
  onDismiss?: () => void;
}

export function Toast({
  visible,
  title,
  message,
  type = 'default',
  duration = 3500,
  onDismiss,
}: ToastProps) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const show = () => {
    Animated.parallel([
      Animated.spring(translateY, { toValue: 0, useNativeDriver: true, tension: 120, friction: 9 }),
      Animated.timing(opacityAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
    ]).start();
  };

  const hide = () => {
    Animated.parallel([
      Animated.timing(translateY, { toValue: -100, duration: 250, useNativeDriver: true }),
      Animated.timing(opacityAnim, { toValue: 0, duration: 250, useNativeDriver: true }),
    ]).start(() => onDismiss?.());
  };

  useEffect(() => {
    if (visible) {
      show();
      const timer = setTimeout(hide, duration);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  const typeConfig: Record<ToastType, { icon: string; color: string; bg: string }> = {
    default: { icon: 'information-circle', color: colors.primary, bg: colors.card },
    success: { icon: 'checkmark-circle', color: colors.success ?? '#22C55E', bg: colors.card },
    error: { icon: 'close-circle', color: colors.error ?? '#EF4444', bg: colors.card },
    warning: { icon: 'warning', color: colors.warning ?? '#F59E0B', bg: colors.card },
  };

  const cfg = typeConfig[type];
  const top = Platform.OS === 'web' ? 67 : insets.top;

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.toast,
        {
          backgroundColor: cfg.bg,
          borderRadius: borderRadius.lg,
          top: top + spacing.sm,
          borderLeftColor: cfg.color,
          transform: [{ translateY }],
          opacity: opacityAnim,
        },
      ]}
    >
      {/* Left color bar */}
      <View style={[styles.bar, { backgroundColor: cfg.color }]} />

      <Ionicons name={cfg.icon as any} size={22} color={cfg.color} style={styles.icon} />

      <View style={styles.textCol}>
        <Text style={[typography.label, { color: colors.foreground }]}>{title}</Text>
        {message != null && (
          <Text style={[typography.caption, { color: colors.mutedForeground, marginTop: 2 }]}>
            {message}
          </Text>
        )}
      </View>

      <TouchableOpacity onPress={hide} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
        <Ionicons name="close" size={18} color={colors.mutedForeground} />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 200,
    paddingVertical: spacing.md,
    paddingRight: spacing.md,
  },
  bar: {
    width: 4,
    alignSelf: 'stretch',
    marginRight: spacing.sm,
  },
  icon: { marginRight: spacing.sm },
  textCol: { flex: 1 },
});
