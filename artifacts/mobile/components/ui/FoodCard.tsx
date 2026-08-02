// ─── Food Card — Zomato-style ─────────────────────────────────────────────────
// Layout: text content left (flex 1) | image right (96×96) with ADD pill overlay
// Matches the restaurant menu item card style from the reference screenshots.

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { Bookmark, BookmarkCheck, Plus, Share2 } from 'lucide-react-native';
import { useColors } from '@/hooks/useColors';
import { PP } from '@/theme/poppins';

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

// ─── Veg / Non-veg indicator ─────────────────────────────────────────────────
const VegIndicator = React.memo(function VegIndicator({ isVeg }: { isVeg: boolean }) {
  const color = isVeg ? '#16A34A' : '#DC2626';
  return (
    <View style={[styles.vegBox, { borderColor: color }]}>
      <View style={[styles.vegDot, { backgroundColor: color }]} />
    </View>
  );
});

// ─── "Highly reordered" badge ────────────────────────────────────────────────
const ReorderBadge = React.memo(function ReorderBadge() {
  return (
    <View style={styles.reorderRow}>
      <View style={styles.reorderTrack}>
        <View style={styles.reorderFill} />
      </View>
      <Text style={styles.reorderText}>Highly reordered</Text>
    </View>
  );
});

// ─── Main FoodCard ────────────────────────────────────────────────────────────
export const FoodCard = React.memo(function FoodCard({
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
      style={[styles.card, { backgroundColor: colors.card, borderBottomColor: colors.border }]}
    >
      {/* ── Left content ─────────────────────────────────────────────────── */}
      <View style={styles.leftCol}>
        {/* Veg indicator */}
        <VegIndicator isVeg={isVeg} />

        {/* Name */}
        <Text
          style={[styles.name, { color: colors.foreground }]}
          numberOfLines={2}
        >
          {name}
        </Text>

        {/* Popular / new badge */}
        {isPopular ? <ReorderBadge /> : isNew ? (
          <View style={styles.newBadge}>
            <Text style={styles.newBadgeText}>New</Text>
          </View>
        ) : null}

        {/* Price row */}
        <View style={styles.priceRow}>
          <Text style={[styles.price, { color: colors.foreground }]}>
            ₹{Math.round(price)}
          </Text>
          {rating != null && (
            <View style={styles.ratingPill}>
              <Text style={styles.ratingText}>★ {rating.toFixed(1)}</Text>
            </View>
          )}
        </View>

        {/* Restaurant name */}
        {restaurantName != null && (
          <Text
            style={[styles.restaurantName, { color: colors.mutedForeground }]}
            numberOfLines={1}
          >
            {restaurantName}
          </Text>
        )}

        {/* Description */}
        {description != null && (
          <Text
            style={[styles.description, { color: colors.mutedForeground }]}
            numberOfLines={2}
          >
            {description}
          </Text>
        )}

        {/* Bookmark / share buttons */}
        <View style={styles.actionRow}>
          {onFavoritePress != null && (
            <TouchableOpacity
              onPress={onFavoritePress}
              style={[styles.iconBtn, { borderColor: colors.border }]}
              accessibilityRole="button"
              accessibilityLabel={isFavorite ? `Remove ${name} from saved` : `Save ${name}`}
            >
              {isFavorite ? (
                <BookmarkCheck size={14} color={colors.primary} strokeWidth={2} />
              ) : (
                <Bookmark size={14} color={colors.mutedForeground} strokeWidth={1.8} />
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* ── Right: image + ADD overlay ────────────────────────────────────── */}
      <View style={styles.rightCol}>
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={styles.image}
            contentFit="cover"
            transition={200}
          />
        ) : (
          <LinearGradient
            colors={['#FF8C38', '#FF6B00']}
            style={styles.image}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        )}

        {/* Favorite heart overlay — top right of image */}
        {onFavoritePress != null && (
          <TouchableOpacity
            onPress={onFavoritePress}
            style={styles.favOverlay}
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            accessibilityRole="button"
            accessibilityLabel={isFavorite ? `Remove ${name} from saved` : `Save ${name}`}
          >
            <Text style={{ fontSize: 16, color: isFavorite ? '#EF4444' : '#FFFFFF' }}>
              {isFavorite ? '♥' : '♡'}
            </Text>
          </TouchableOpacity>
        )}

        {/* ADD button — overlaid at bottom of image */}
        {onAddPress != null && (
          <TouchableOpacity
            onPress={onAddPress}
            activeOpacity={0.85}
            style={[styles.addBtn, { backgroundColor: colors.card }]}
            accessibilityRole="button"
            accessibilityLabel={`Add ${name} to cart`}
          >
            <Text style={[styles.addBtnText, { color: colors.primary }]}>ADD</Text>
            <Plus size={12} color={colors.primary} strokeWidth={3} />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
});

// ─── Styles ──────────────────────────────────────────────────────────────────

const IMAGE_SIZE = 96;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 14,
    backgroundColor: '#FFFFFF',
  },

  // Left column
  leftCol: { flex: 1, paddingRight: 4 },

  // Veg indicator
  vegBox: {
    width: 14,
    height: 14,
    borderWidth: 1.5,
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 7,
  },
  vegDot: { width: 7, height: 7, borderRadius: 3.5 },

  // Name
  name: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 6,
  },

  // Highly reordered
  reorderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 7,
    gap: 6,
  },
  reorderTrack: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E5E7EB',
    overflow: 'hidden',
  },
  reorderFill: {
    width: '75%',
    height: '100%',
    borderRadius: 2,
    backgroundColor: '#16A34A',
  },
  reorderText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 11,
    color: '#16A34A',
  },

  // New badge
  newBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#EFF9FF',
    borderRadius: 4,
    paddingHorizontal: 7,
    paddingVertical: 2,
    marginBottom: 7,
  },
  newBadgeText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 10,
    color: '#0EA5E9',
  },

  // Price row
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  price: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 15,
    lineHeight: 20,
  },
  ratingPill: {
    backgroundColor: '#22C55E',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  ratingText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 10,
    color: '#FFFFFF',
  },

  // Restaurant name
  restaurantName: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 11,
    marginBottom: 2,
  },

  // Description
  description: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 10,
  },

  // Action row
  actionRow: { flexDirection: 'row', alignItems: 'center' },
  iconBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Right column
  rightCol: {
    width: IMAGE_SIZE,
    alignItems: 'center',
  },
  image: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: 12,
  },

  // Favorite overlay
  favOverlay: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.28)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ADD button — overlaid at image bottom
  addBtn: {
    position: 'absolute',
    bottom: -14,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
    gap: 3,
  },
  addBtnText: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 12,
    letterSpacing: 0.5,
  },
});
