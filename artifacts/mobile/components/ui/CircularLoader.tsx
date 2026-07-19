// ─── Circular Loader ──────────────────────────────────────────────────────────
import React from 'react';
import { ActivityIndicator, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useColors } from '@/hooks/useColors';

export interface CircularLoaderProps {
  size?: 'small' | 'large' | number;
  color?: string;
  /** Render a full-screen overlay behind the loader */
  overlay?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function CircularLoader({
  size = 'large',
  color,
  overlay = false,
  style,
}: CircularLoaderProps) {
  const colors = useColors();
  const loaderColor = color ?? colors.primary;

  if (overlay) {
    return (
      <View style={styles.overlay}>
        <View style={[styles.overlayCard, { backgroundColor: colors.card }]}>
          <ActivityIndicator
            size={typeof size === 'number' ? size : size}
            color={loaderColor}
          />
        </View>
      </View>
    );
  }

  return (
    <ActivityIndicator
      size={typeof size === 'number' ? size : size}
      color={loaderColor}
      style={style}
    />
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  overlayCard: {
    width: 72,
    height: 72,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
});
