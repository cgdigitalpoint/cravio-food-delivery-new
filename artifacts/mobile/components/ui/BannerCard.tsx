// ─── Banner Card ──────────────────────────────────────────────────────────────
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useColors } from '@/hooks/useColors';
import { typography, borderRadius, spacing } from '@/theme';

export interface BannerCardProps {
  title: string;
  subtitle?: string;
  ctaText?: string;
  gradientColors?: readonly [string, string, ...string[]];
  imageUri?: string;
  onPress?: () => void;
  height?: number;
}

export function BannerCard({
  title,
  subtitle,
  ctaText,
  gradientColors = ['#111827', '#374151'],
  imageUri,
  onPress,
  height = 180,
}: BannerCardProps) {
  const colors = useColors();

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
      <View
        style={[
          styles.container,
          { height, borderRadius: borderRadius.xl, overflow: 'hidden' },
        ]}
      >
        {/* Background */}
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={StyleSheet.absoluteFillObject}
            contentFit="cover"
          />
        ) : (
          <LinearGradient
            colors={gradientColors}
            style={StyleSheet.absoluteFillObject}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        )}

        {/* Dark scrim for text legibility */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.65)']}
          style={[StyleSheet.absoluteFillObject, { top: '40%' }]}
        />

        {/* Decorative accent */}
        <View style={styles.circle} />

        {/* Content */}
        <View style={styles.content}>
          <Text
            style={[typography.heading2, { color: '#FFFFFF' }]}
            numberOfLines={2}
          >
            {title}
          </Text>

          {subtitle != null && (
            <Text
              style={[
                typography.body,
                { color: 'rgba(255,255,255,0.75)', marginTop: 4 },
              ]}
              numberOfLines={2}
            >
              {subtitle}
            </Text>
          )}

          {ctaText != null && (
            <View style={styles.cta}>
              <Text
                style={[
                  typography.buttonText,
                  { color: '#FFFFFF', marginRight: 4 },
                ]}
              >
                {ctaText}
              </Text>
              <Ionicons name="arrow-forward" size={14} color="#FFFFFF" />
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { justifyContent: 'flex-end' },
  circle: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.07)',
    top: -40,
    right: -20,
  },
  content: { padding: spacing.lg, gap: 4 },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
});
