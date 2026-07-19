// ─── Dialog ───────────────────────────────────────────────────────────────────
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { typography, borderRadius, spacing } from '@/theme';

export type DialogVariant = 'confirmation' | 'success' | 'error';

export interface DialogProps {
  visible: boolean;
  variant?: DialogVariant;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  onDismiss?: () => void;
}

export function Dialog({
  visible,
  variant = 'confirmation',
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  onDismiss,
}: DialogProps) {
  const colors = useColors();
  const scale = useRef(new Animated.Value(0.88)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
          tension: 120,
          friction: 8,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scale.setValue(0.88);
      opacity.setValue(0);
    }
  }, [visible]);

  const iconMap: Record<DialogVariant, { name: string; color: string }> = {
    confirmation: { name: 'alert-circle', color: colors.primary },
    success: { name: 'checkmark-circle', color: colors.success ?? '#22C55E' },
    error: { name: 'close-circle', color: colors.error ?? '#EF4444' },
  };

  const cfg = iconMap[variant];
  const confirmBg =
    variant === 'error' ? (colors.error ?? '#EF4444') : colors.primary;

  const dismiss = onDismiss ?? onCancel;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      statusBarTranslucent
      onRequestClose={dismiss}
    >
      <TouchableWithoutFeedback onPress={dismiss}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.card,
                {
                  backgroundColor: colors.card,
                  borderRadius: borderRadius.xl,
                  transform: [{ scale }],
                  opacity,
                },
              ]}
            >
              {/* Icon */}
              <View
                style={[
                  styles.iconWrap,
                  {
                    backgroundColor: `${cfg.color}18`,
                    borderRadius: 40,
                  },
                ]}
              >
                <Ionicons name={cfg.name as any} size={36} color={cfg.color} />
              </View>

              {/* Title */}
              <Text
                style={[
                  typography.heading3,
                  {
                    color: colors.foreground,
                    textAlign: 'center',
                    marginTop: spacing.md,
                  },
                ]}
              >
                {title}
              </Text>

              {/* Message */}
              <Text
                style={[
                  typography.body,
                  {
                    color: colors.mutedForeground,
                    textAlign: 'center',
                    marginTop: spacing.sm,
                    lineHeight: 22,
                  },
                ]}
              >
                {message}
              </Text>

              {/* Actions */}
              <View style={styles.actions}>
                {variant === 'confirmation' && (
                  <TouchableOpacity
                    onPress={onCancel}
                    style={[
                      styles.cancelBtn,
                      {
                        borderColor: colors.border,
                        borderRadius: borderRadius.md,
                      },
                    ]}
                  >
                    <Text
                      style={[typography.buttonText, { color: colors.foreground }]}
                    >
                      {cancelText}
                    </Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  onPress={variant === 'confirmation' ? onConfirm : (onConfirm ?? dismiss)}
                  style={[
                    styles.confirmBtn,
                    {
                      backgroundColor: confirmBg,
                      borderRadius: borderRadius.md,
                      flex: variant === 'confirmation' ? 1 : 0,
                      paddingHorizontal:
                        variant === 'confirmation' ? 0 : spacing.xl,
                    },
                  ]}
                >
                  <Text style={[typography.buttonText, { color: '#FFFFFF' }]}>
                    {confirmText}
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  card: {
    width: '100%',
    alignItems: 'center',
    padding: spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 12,
  },
  iconWrap: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xl,
    width: '100%',
  },
  cancelBtn: {
    flex: 1,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  confirmBtn: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
