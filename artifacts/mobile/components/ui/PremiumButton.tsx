// ─── Premium Button ───────────────────────────────────────────────────────────
// Poppins-based button with gradient primary, ghost, outline, and social variants.
// Used in Phase 3 screens. The Phase 2 Button component remains unchanged.

import React from 'react';
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { PP } from '@/theme/poppins';

export type PremiumButtonVariant =
  | 'primary'   // orange gradient, white text
  | 'dark'      // dark fill, white text  
  | 'ghost'     // transparent, white text (for dark bg)
  | 'outline'   // transparent, orange border + text
  | 'white'     // white fill, dark text
  | 'social';   // social auth (white border on dark bg)

export interface PremiumButtonProps {
  label: string;
  onPress?: () => void;
  variant?: PremiumButtonVariant;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isLoading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
  style?: StyleProp<ViewStyle>;
}

export function PremiumButton({
  label,
  onPress,
  variant = 'primary',
  leftIcon,
  rightIcon,
  isLoading = false,
  disabled = false,
  fullWidth = true,
  size = 'lg',
  style,
}: PremiumButtonProps) {
  const scale = useSharedValue(1);

  const height = { sm: 44, md: 50, lg: 56 }[size];
  const radius = { sm: 12, md: 14, lg: 16 }[size];

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 15, stiffness: 300 });
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 12, stiffness: 200 });
  };

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const textVariantStyle: Record<PremiumButtonVariant, object> = {
    primary: { color: '#FFFFFF' },
    dark: { color: '#FFFFFF' },
    ghost: { color: '#FFFFFF' },
    outline: { color: '#FF6B00' },
    white: { color: '#111827' },
    social: { color: '#FFFFFF' },
  };

  const isDisabled = disabled || isLoading;

  const content = (
    <View style={[styles.inner, { height }]}>
      {isLoading ? (
        <ActivityIndicator
          color={variant === 'outline' ? '#FF6B00' : '#FFFFFF'}
          size="small"
        />
      ) : (
        <>
          {leftIcon != null && (
            <View style={styles.iconLeft}>{leftIcon}</View>
          )}
          <Text style={[PP.button, textVariantStyle[variant]]}>
            {label}
          </Text>
          {rightIcon != null && (
            <View style={styles.iconRight}>{rightIcon}</View>
          )}
        </>
      )}
    </View>
  );

  return (
    <Animated.View
      style={[
        animStyle,
        fullWidth && styles.fullWidth,
        { opacity: isDisabled ? 0.5 : 1 },
        style,
      ]}
    >
      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        disabled={isDisabled}
        activeOpacity={1}
        style={[fullWidth && styles.fullWidth]}
      >
        {variant === 'primary' ? (
          <LinearGradient
            colors={['#FF8530', '#FF6B00', '#E85E00']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[
              styles.gradient,
              { borderRadius: radius },
              // Glow shadow
              {
                shadowColor: '#FF6B00',
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.35,
                shadowRadius: 12,
                elevation: 6,
              },
            ]}
          >
            {content}
          </LinearGradient>
        ) : variant === 'dark' ? (
          <View
            style={[
              styles.solidBtn,
              { backgroundColor: '#111827', borderRadius: radius },
            ]}
          >
            {content}
          </View>
        ) : variant === 'ghost' ? (
          <View
            style={[
              styles.solidBtn,
              {
                backgroundColor: 'rgba(255,255,255,0.14)',
                borderRadius: radius,
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.22)',
              },
            ]}
          >
            {content}
          </View>
        ) : variant === 'outline' ? (
          <View
            style={[
              styles.solidBtn,
              {
                backgroundColor: 'transparent',
                borderRadius: radius,
                borderWidth: 1.5,
                borderColor: '#FF6B00',
              },
            ]}
          >
            {content}
          </View>
        ) : variant === 'white' ? (
          <View
            style={[
              styles.solidBtn,
              {
                backgroundColor: '#FFFFFF',
                borderRadius: radius,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 8,
                elevation: 2,
              },
            ]}
          >
            {content}
          </View>
        ) : (
          // social
          <View
            style={[
              styles.solidBtn,
              {
                backgroundColor: 'rgba(255,255,255,0.08)',
                borderRadius: radius,
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.22)',
              },
            ]}
          >
            {content}
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  fullWidth: { alignSelf: 'stretch' },
  gradient: { overflow: 'hidden' },
  solidBtn: { overflow: 'hidden' },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 24,
  },
  iconLeft: {},
  iconRight: {},
});
