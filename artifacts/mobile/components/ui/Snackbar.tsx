// ─── Snackbar ─────────────────────────────────────────────────────────────────
// Appears at the bottom of the screen. Place at the root level of the screen.
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

export type SnackbarType = 'default' | 'success' | 'error' | 'warning';

export interface SnackbarProps {
  visible: boolean;
  message: string;
  type?: SnackbarType;
  duration?: number;
  actionText?: string;
  onAction?: () => void;
  onDismiss?: () => void;
}

export function Snackbar({
  visible,
  message,
  type = 'default',
  duration = 3000,
  actionText,
  onAction,
  onDismiss,
}: SnackbarProps) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(80)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const show = () => {
    Animated.parallel([
      Animated.timing(translateY, { toValue: 0, duration: 280, useNativeDriver: true }),
      Animated.timing(opacityAnim, { toValue: 1, duration: 280, useNativeDriver: true }),
    ]).start();
  };

  const hide = () => {
    Animated.parallel([
      Animated.timing(translateY, { toValue: 80, duration: 220, useNativeDriver: true }),
      Animated.timing(opacityAnim, { toValue: 0, duration: 220, useNativeDriver: true }),
    ]).start(() => onDismiss?.());
  };

  useEffect(() => {
    if (visible) {
      show();
      const timer = setTimeout(hide, duration);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  const bgMap: Record<SnackbarType, string> = {
    default: '#1F2937',
    success: colors.success ?? '#22C55E',
    error: colors.error ?? '#EF4444',
    warning: colors.warning ?? '#F59E0B',
  };

  const iconMap: Record<SnackbarType, string> = {
    default: 'information-circle',
    success: 'checkmark-circle',
    error: 'close-circle',
    warning: 'warning',
  };

  const bottom = Platform.OS === 'web' ? 34 : insets.bottom + spacing.md;

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.snackbar,
        {
          backgroundColor: bgMap[type],
          borderRadius: borderRadius.lg,
          bottom: bottom + 16,
          transform: [{ translateY }],
          opacity: opacityAnim,
        },
      ]}
    >
      <Ionicons name={iconMap[type] as any} size={20} color="#FFFFFF" />

      <Text style={[typography.body, { color: '#FFFFFF', flex: 1, marginLeft: spacing.sm }]}>
        {message}
      </Text>

      {actionText != null && (
        <TouchableOpacity onPress={onAction} style={styles.action}>
          <Text
            style={[
              typography.label,
              { color: '#FFFFFF', fontFamily: 'Inter_700Bold', textDecorationLine: 'underline' },
            ]}
          >
            {actionText}
          </Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  snackbar: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 100,
  },
  action: { marginLeft: spacing.sm },
});
