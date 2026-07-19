// ─── Offer Card ───────────────────────────────────────────────────────────────
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { typography, borderRadius, spacing } from '@/theme';

export interface OfferCardProps {
  title: string;
  subtitle?: string;
  code?: string;
  discount: string;
  gradientColors?: readonly [string, string, ...string[]];
  onPress?: () => void;
}

export function OfferCard({
  title,
  subtitle,
  code,
  discount,
  gradientColors = ['#FF6B00', '#FF9A4D'],
  onPress,
}: OfferCardProps) {
  const colors = useColors();

  return (
    <TouchableOpacity activeOpacity={0.88} onPress={onPress}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.card, { borderRadius: borderRadius.xl }]}
      >
        {/* Decorative circle */}
        <View style={styles.circleL} />
        <View style={styles.circleR} />

        {/* Content */}
        <View style={styles.content}>
          <View>
            <Text style={[typography.caption, { color: 'rgba(255,255,255,0.8)' }]}>
              {subtitle ?? 'Limited time offer'}
            </Text>
            <Text style={[typography.heading2, { color: '#FFFFFF', marginTop: 2 }]}>
              {title}
            </Text>
          </View>

          {code != null && (
            <View style={styles.codeRow}>
              <Ionicons name="pricetag" size={12} color="rgba(255,255,255,0.8)" />
              <Text style={[typography.caption, { color: 'rgba(255,255,255,0.9)', marginLeft: 4 }]}>
                Use code:{' '}
                <Text style={{ fontFamily: 'Inter_700Bold', color: '#FFFFFF' }}>
                  {code}
                </Text>
              </Text>
            </View>
          )}
        </View>

        {/* Discount badge */}
        <View style={styles.discountBadge}>
          <Text style={[typography.heading1, { color: '#FFFFFF' }]}>{discount}</Text>
          <Text style={[typography.caption, { color: 'rgba(255,255,255,0.8)' }]}>OFF</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 120,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    overflow: 'hidden',
  },
  circleL: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.08)',
    top: -30,
    left: -20,
  },
  circleR: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.06)',
    bottom: -20,
    right: 60,
  },
  content: { flex: 1, gap: spacing.sm },
  codeRow: { flexDirection: 'row', alignItems: 'center' },
  discountBadge: { alignItems: 'center' },
});
