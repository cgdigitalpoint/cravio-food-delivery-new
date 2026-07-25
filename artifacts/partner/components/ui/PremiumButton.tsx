// ─── PremiumButton ────────────────────────────────────────────────────────────
import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { PP } from '@/theme/poppins';

type Variant = 'primary' | 'dark' | 'ghost' | 'outline' | 'white' | 'destructive';

interface Props {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  fullWidth?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  size?: 'sm' | 'md' | 'lg';
}

const CFG: Record<Variant, { gradient?: [string, string]; bg?: string; border?: string; text: string }> = {
  primary:     { gradient: ['#FF8530', '#FF6B00'], text: '#FFFFFF' },
  dark:        { bg: '#111827', text: '#FFFFFF' },
  ghost:       { bg: 'transparent', text: '#FF6B00' },
  outline:     { bg: 'transparent', border: '#FF6B00', text: '#FF6B00' },
  white:       { bg: '#FFFFFF', text: '#111827' },
  destructive: { gradient: ['#F87171', '#EF4444'], text: '#FFFFFF' },
};

export function PremiumButton({
  label,
  onPress,
  variant = 'primary',
  fullWidth = false,
  isLoading = false,
  disabled = false,
  style,
  size = 'md',
}: Props) {
  const cfg = CFG[variant];
  const heights: Record<typeof size, number> = { sm: 42, md: 52, lg: 60 };
  const h = heights[size];
  const radius = 14;

  const handlePress = () => {
    if (disabled || isLoading) return;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.();
  };

  const inner = (
    <View
      style={[
        styles.inner,
        { height: h, borderRadius: radius },
        cfg.border ? { borderWidth: 1.5, borderColor: cfg.border } : null,
        !cfg.gradient && cfg.bg ? { backgroundColor: cfg.bg } : null,
        (disabled || isLoading) && styles.disabled,
      ]}
    >
      {isLoading ? (
        <ActivityIndicator color={cfg.text} size="small" />
      ) : (
        <Text style={[PP.label, { color: cfg.text, letterSpacing: 0.3 }]}>{label}</Text>
      )}
    </View>
  );

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.85}
      disabled={disabled || isLoading}
      style={[fullWidth && styles.full, style]}
    >
      {cfg.gradient ? (
        <LinearGradient
          colors={cfg.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.gradient, { height: h, borderRadius: radius }, (disabled || isLoading) && styles.disabled]}
        >
          {isLoading ? (
            <ActivityIndicator color={cfg.text} size="small" />
          ) : (
            <Text style={[PP.label, { color: cfg.text, letterSpacing: 0.3 }]}>{label}</Text>
          )}
        </LinearGradient>
      ) : inner}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  full: { alignSelf: 'stretch' },
  inner: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  gradient: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  disabled: { opacity: 0.5 },
});
