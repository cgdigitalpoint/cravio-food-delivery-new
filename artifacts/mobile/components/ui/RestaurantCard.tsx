// ─── Restaurant Card — Zomato-quality ─────────────────────────────────────────
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { Star, Clock3, MapPin, Truck } from 'lucide-react-native';
import { useColors } from '@/hooks/useColors';
import { PP } from '@/theme/poppins';

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
      activeOpacity={0.92}
      onPress={onPress}
      style={[styles.card, { backgroundColor: colors.card }]}
    >
      {/* ── Image area ── */}
      <View style={styles.imageWrapper}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} contentFit="cover" />
        ) : (
          <LinearGradient
            colors={['#FF8C38', '#FF6B00']}
            style={[styles.image, styles.imagePlaceholder]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        )}

        {/* Bottom scrim for offer text legibility */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.52)']}
          style={StyleSheet.absoluteFillObject}
          start={{ x: 0, y: 0.4 }}
          end={{ x: 0, y: 1 }}
        />

        {/* Offer badge — top left (Zomato style: dark bg, compact) */}
        {offerText != null && (
          <View style={styles.offerBadge}>
            <Text style={styles.offerBadgeText} numberOfLines={2}>
              {offerText}
            </Text>
          </View>
        )}

        {/* NEW badge — top left below offer if no offer */}
        {isNew === true && offerText == null && (
          <View style={styles.newBadge}>
            <Text style={styles.newBadgeText}>NEW</Text>
          </View>
        )}

        {/* Favourite button — top right */}
        <TouchableOpacity
          onPress={onFavoritePress}
          style={styles.favBtn}
          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          accessibilityRole="button"
          accessibilityLabel={isFavorite ? 'Remove from favourites' : 'Add to favourites'}
        >
          <Text style={[styles.favIcon, { color: isFavorite ? '#EF4444' : '#FFFFFF' }]}>
            {isFavorite ? '♥' : '♡'}
          </Text>
        </TouchableOpacity>

        {/* Rating pill — bottom left */}
        <View style={styles.ratingPill}>
          <Star size={11} color="#FFFFFF" fill="#FFFFFF" />
          <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
        </View>
      </View>

      {/* ── Info area ── */}
      <View style={styles.info}>
        {/* Name row */}
        <View style={styles.nameRow}>
          {isVeg !== undefined && (
            <View style={[styles.vegBox, { borderColor: isVeg ? '#16A34A' : '#DC2626' }]}>
              <View style={[styles.vegDot, { backgroundColor: isVeg ? '#16A34A' : '#DC2626' }]} />
            </View>
          )}
          <Text
            style={[PP.subtitle, styles.name, { color: colors.foreground }]}
            numberOfLines={1}
          >
            {name}
          </Text>
        </View>

        {/* Cuisine */}
        <Text
          style={[PP.caption, { color: colors.mutedForeground, marginTop: 1 }]}
          numberOfLines={1}
        >
          {cuisine}
        </Text>

        {/* Meta row: time · distance · fee */}
        <View style={styles.meta}>
          <Clock3 size={12} color={colors.mutedForeground} />
          <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
            {deliveryTime} min
          </Text>
          {distance != null && (
            <>
              <View style={[styles.metaDot, { backgroundColor: colors.border }]} />
              <MapPin size={12} color={colors.mutedForeground} />
              <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
                {distance}
              </Text>
            </>
          )}
          <View style={[styles.metaDot, { backgroundColor: colors.border }]} />
          <Truck size={12} color={colors.mutedForeground} />
          <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
            {deliveryFee === 0 ? 'Free' : `₹${Math.round(deliveryFee)}`}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
  },
  imageWrapper: {
    height: 172,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Offer badge — top left, dark background (Zomato style)
  offerBadge: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,0.72)',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderBottomRightRadius: 10,
    maxWidth: 130,
  },
  offerBadgeText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 10,
    color: '#FFFFFF',
    lineHeight: 14,
  },
  newBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#16A34A',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  newBadgeText: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 9,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  favBtn: {
    position: 'absolute',
    top: 8,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.28)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  favIcon: {
    fontSize: 18,
    lineHeight: 22,
  },
  ratingPill: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#22C55E',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  ratingText: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 11,
    color: '#FFFFFF',
  },
  info: {
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 12,
    gap: 2,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  vegBox: {
    width: 13,
    height: 13,
    borderRadius: 2,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  vegDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  name: {
    flex: 1,
    fontFamily: 'Poppins_600SemiBold',
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'nowrap',
    gap: 4,
    marginTop: 6,
  },
  metaText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 11,
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
  },
});

