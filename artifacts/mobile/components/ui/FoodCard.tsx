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
  rating?: number;
  restaurantName?: string;
  imageUri?: string;
  isVeg?: boolean;
  isPopular?: boolean;
  isNew?: boolean;
  onAddPress?: () => void;
  onPress?: () => void;
  isFavorite?: boolean;
  onFavoritePress?: () => void;
}

export function FoodCard({
  name,
  description,
  price,
  rating,
  restaurantName,
  imageUri,
  isVeg = true,
  isPopular,
  isNew,
  onAddPress,
  onPress,
  isFavorite,
  onFavoritePress,
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
        {/* Veg / Non-veg + badges */}
        <View style={styles.chips}>
          <Chip variant={isVeg ? 'veg' : 'nonVeg'} />
          {isPopular === true && <Chip variant="popular" />}
          {isNew === true && <Chip variant="new" />}
        </View>

        <Text
          style={[typography.subtitle, { color: colors.foreground, marginTop: 6, fontFamily: 'Inter_600SemiBold', fontSize: 14 }]}
          numberOfLines={2}
        >
          {name}
        </Text>

        {/* Restaurant name */}
        {restaurantName != null && (
          <View style={styles.restaurantRow}>
            <Ionicons name="storefront-outline" size={11} color={colors.mutedForeground} />
            <Text
              style={[typography.caption, { color: colors.mutedForeground, marginLeft: 3, fontSize: 11 }]}
              numberOfLines={1}
            >
              {restaurantName}
            </Text>
          </View>
        )}

        {description != null && (
          <Text
            style={[
              typography.caption,
              { color: colors.mutedForeground, marginTop: 4, fontSize: 11, lineHeight: 15 },
            ]}
            numberOfLines={2}
          >
            {description}
          </Text>
        )}

        <View style={styles.priceRow}>
          <View style={styles.priceBlock}>
            <Text
              style={[
                typography.title,
                { color: colors.primary, fontFamily: 'Inter_700Bold', fontSize: 15 },
              ]}
            >
              ${price.toFixed(2)}
            </Text>
            {/* Rating */}
            {rating != null && (
              <View style={[styles.ratingPill, { backgroundColor: '#22C55E' }]}>
                <Ionicons name="star" size={9} color="#FFFFFF" />
                <Text
                  style={[
                    typography.caption,
                    { color: '#FFFFFF', fontFamily: 'Inter_600SemiBold', marginLeft: 2, fontSize: 10 },
                  ]}
                >
                  {rating.toFixed(1)}
                </Text>
              </View>
            )}
          </View>

          <TouchableOpacity
            onPress={onAddPress}
            style={[
              styles.addBtn,
              {
                backgroundColor: colors.primary,
                borderRadius: borderRadius.pill,
              },
            ]}
          >
            <Ionicons name="add" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Right image */}
      <View style={[styles.imageWrapper, { borderRadius: 12 }]}>
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
            <Ionicons name="fast-food" size={24} color="rgba(255,255,255,0.7)" />
          </LinearGradient>
        )}
        {/* Favorite button overlay */}
        {onFavoritePress != null && (
          <TouchableOpacity
            onPress={onFavoritePress}
            style={[styles.favBtn, { backgroundColor: 'rgba(255,255,255,0.2)' }]}
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          >
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={14}
              color={isFavorite ? '#EF4444' : '#FFFFFF'}
            />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  content: { flex: 1, gap: 1 },
  chips: { flexDirection: 'row', gap: 6 },
  restaurantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  priceBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 8,
  },
  addBtn: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageWrapper: {
    width: 80,
    height: 80,
    overflow: 'hidden',
    flexShrink: 0,
  },
  favBtn: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(4px)',
  },
  image: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
