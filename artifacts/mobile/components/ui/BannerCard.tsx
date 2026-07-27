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
  height = 140,
}: BannerCardProps) {
  const colors = useColors();

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
      <View
        style={[
          styles.container,
          { height, borderRadius: 16, overflow: 'hidden' },
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
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={[StyleSheet.absoluteFillObject]}
          start={{ x: 0, y: 0.3 }}
          end={{ x: 0, y: 1 }}
        />

        {/* Decorative accent */}
        <View style={styles.circle} />
        <View style={styles.circle2} />

        {/* Content */}
        <View style={styles.content}>
          <Text
            style={[typography.heading2, { color: '#FFFFFF', fontSize: 20 }]}
            numberOfLines={2}
          >
            {title}
          </Text>

          {subtitle != null && (
            <Text
              style={[
                typography.body,
                { color: 'rgba(255,255,255,0.85)', marginTop: 2, fontSize: 13 },
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
                  { color: '#FFFFFF', marginRight: 4, fontSize: 13 },
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
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.08)',
    top: -30,
    right: -20,
  },
  circle2: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.05)',
    top: 40,
    right: 40,
  },
  content: { padding: 16, gap: 2 },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
});
