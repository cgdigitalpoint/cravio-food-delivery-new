// ─── Food Card ────────────────────────────────────────────────────────────────
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useColors } from '@/hooks/useColors';
import { typography, borderRadius, spacing } from '@/theme';
import { Chip } from './Chip';

export interface FoodCardProps {
  name: string;
  description?: string;
  price: number;
  imageUri?: string;
  isVeg?: boolean;
  isPopular?: boolean;
  isNew?: boolean;
  onAddPress?: () => void;
  onPress?: () => void;
}

export function FoodCard({
  name,
  description,
  price,
  imageUri,
  isVeg = true,
  isPopular,
  isNew,
  onAddPress,
  onPress,
}: FoodCardProps) {
  const colors = useColors();

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderRadius: borderRadius.lg,
          borderColor: colors.border,
        },
      ]}
    >
      {/* Left content */}
      <View style={styles.content}>
        {/* Veg / Non-veg indicator */}
        <View style={styles.chips}>
          <Chip variant={isVeg ? 'veg' : 'nonVeg'} />
          {isPopular === true && <Chip variant="popular" />}
          {isNew === true && <Chip variant="new" />}
        </View>

        <Text
          style={[typography.subtitle, { color: colors.foreground, marginTop: spacing.xs }]}
          numberOfLines={2}
        >
          {name}
        </Text>

        {description != null && (
          <Text
            style={[
              typography.caption,
              { color: colors.mutedForeground, marginTop: 2 },
            ]}
            numberOfLines={2}
          >
            {description}
          </Text>
        )}

        <View style={styles.priceRow}>
          <Text
            style={[
              typography.title,
              { color: colors.foreground, fontFamily: 'Inter_700Bold' },
            ]}
          >
            ${price.toFixed(2)}
          </Text>

          <TouchableOpacity
            onPress={onAddPress}
            style={[
              styles.addBtn,
              {
                borderColor: colors.primary,
                borderRadius: borderRadius.md,
              },
            ]}
          >
            <Ionicons name="add" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Right image */}
      <View style={[styles.imageWrapper, { borderRadius: borderRadius.md }]}>
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={styles.image}
            contentFit="cover"
          />
        ) : (
          <LinearGradient
            colors={['#16A34A', '#4ADE80']}
            style={styles.image}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="fast-food" size={28} color="rgba(255,255,255,0.7)" />
          </LinearGradient>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderWidth: 1,
    gap: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  content: { flex: 1, gap: 4 },
  chips: { flexDirection: 'row', gap: 6 },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  addBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  imageWrapper: {
    width: 100,
    height: 100,
    overflow: 'hidden',
    flexShrink: 0,
  },
  image: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
