// ─── Restaurant Card ──────────────────────────────────────────────────────────
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useColors } from '@/hooks/useColors';
import { typography, borderRadius, spacing } from '@/theme';

export interface RestaurantCardProps {
  name: string;
  cuisine: string;
  rating: number;
  deliveryTime: number;
  deliveryFee?: number;
  distance?: string;
  isVeg?: boolean;
  imageUri?: string;
  isNew?: boolean;
  offerText?: string;
  isFavorite?: boolean;
  onPress?: () => void;
  onFavoritePress?: () => void;
}

export function RestaurantCard({
  name,
  cuisine,
  rating,
  deliveryTime,
  deliveryFee = 0,
  distance,
  isVeg,
  imageUri,
  isNew,
  offerText,
  isFavorite,
  onPress,
  onFavoritePress,
}: RestaurantCardProps) {
  const colors = useColors();

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={[
        styles.card,
        { backgroundColor: colors.card, borderRadius: borderRadius.xl },
      ]}
    >
      {/* Image area */}
      <View style={styles.imageWrapper}>
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={styles.image}
            contentFit="cover"
          />
        ) : (
          <LinearGradient
            colors={['#FF6B00', '#FF9A4D']}
            style={styles.image}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="restaurant" size={40} color="rgba(255,255,255,0.6)" />
          </LinearGradient>
        )}

        {/* Offer badge */}
        {offerText != null && (
          <View style={[styles.offerBadge, { backgroundColor: colors.primary }]}>
            <Text style={[typography.caption, styles.offerText]}>{offerText}</Text>
          </View>
        )}

        {/* New badge */}
        {isNew === true && (
          <View style={[styles.newBadge, { backgroundColor: colors.secondary }]}>
            <Text style={[typography.caption, styles.offerText]}>NEW</Text>
          </View>
        )}

        {/* Favorite */}
        <TouchableOpacity
          onPress={onFavoritePress}
          style={[styles.favBtn, { backgroundColor: 'rgba(0,0,0,0.35)' }]}
          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
        >
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={18}
            color={isFavorite ? '#EF4444' : '#FFFFFF'}
          />
        </TouchableOpacity>
      </View>

      {/* Info area */}
      <View style={styles.info}>
        {/* Name row with veg/non-veg indicator */}
        <View style={styles.nameRow}>
          {isVeg !== undefined && (
            <View
              style={[
                styles.vegIndicator,
                { borderColor: isVeg ? '#22C55E' : '#EF4444' },
              ]}
            >
              <View
                style={[
                  styles.vegDot,
                  { backgroundColor: isVeg ? '#22C55E' : '#EF4444' },
                ]}
              />
            </View>
          )}
          <Text
            style={[typography.title, { color: colors.foreground, flex: 1 }]}
            numberOfLines={1}
          >
            {name}
          </Text>
        </View>

        <Text
          style={[typography.caption, { color: colors.mutedForeground, marginTop: 2 }]}
          numberOfLines={1}
        >
          {cuisine}
        </Text>

        {/* Meta row */}
        <View style={styles.meta}>
          {/* Rating */}
          <View style={[styles.ratingPill, { backgroundColor: '#22C55E' }]}>
            <Ionicons name="star" size={10} color="#FFFFFF" />
            <Text style={[typography.caption, { color: '#FFFFFF', fontFamily: 'Inter_600SemiBold', marginLeft: 3 }]}>
              {rating.toFixed(1)}
            </Text>
          </View>

          <View style={[styles.dot, { backgroundColor: colors.border }]} />

          <Ionicons name="time-outline" size={13} color={colors.mutedForeground} />
          <Text style={[typography.caption, { color: colors.mutedForeground, marginLeft: 2 }]}>
            {deliveryTime} min
          </Text>

          {distance != null && (
            <>
              <View style={[styles.dot, { backgroundColor: colors.border }]} />
              <Ionicons name="location-outline" size={13} color={colors.mutedForeground} />
              <Text style={[typography.caption, { color: colors.mutedForeground, marginLeft: 2 }]}>
                {distance}
              </Text>
            </>
          )}

          <View style={[styles.dot, { backgroundColor: colors.border }]} />

          <Text style={[typography.caption, { color: colors.mutedForeground }]}>
            {deliveryFee === 0 ? 'Free delivery' : `$${deliveryFee.toFixed(2)} del`}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  imageWrapper: {
    height: 160,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  offerBadge: {
    position: 'absolute',
    bottom: spacing.sm,
    left: spacing.sm,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.sm,
  },
  newBadge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.sm,
  },
  offerText: { color: '#FFFFFF', fontFamily: 'Inter_600SemiBold' },
  favBtn: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { padding: spacing.md, gap: 4 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  vegIndicator: {
    width: 14,
    height: 14,
    borderRadius: 2,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  vegDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 5,
    marginTop: spacing.sm,
  },
  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.pill,
  },
  dot: { width: 3, height: 3, borderRadius: 2 },
});
