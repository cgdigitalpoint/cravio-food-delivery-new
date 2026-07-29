// ─── Restaurant Menu Item Card — Redesigned ──────────────────────────────────
// Layout reference: Zomato food menu horizontal card (screenshots provided).
// Branding: Cravio (#FF6B00 primary, #16A34A green).
//
// Structure
//   LEFT (flex 1): veg indicator → name → reorder/bestseller badge →
//                  price → description → bookmark + share row
//   RIGHT (110 px): square image with overlaid ADD pill;
//                   ADD animates into −qty+ when qty > 0

import React, { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { Bookmark, BookmarkCheck, Minus, Plus, Share2 } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import { useColors } from '@/hooks/useColors';
import { PP } from '@/theme/poppins';
import type { RestaurantMenuItem } from '@/data/restaurantData';

// ─── Props ────────────────────────────────────────────────────────────────────

interface RestaurantMenuItemCardProps {
  item: RestaurantMenuItem;
  quantity: number;
  onAdd: () => void;
  onIncrease: () => void;
  onDecrease: () => void;
  isFavorite?: boolean;
  onFavorite?: () => void;
  onShare?: () => void;
}

// ─── Veg / Non-veg dot ───────────────────────────────────────────────────────

function VegIndicator({ isVeg }: { isVeg: boolean }) {
  const color = isVeg ? '#16A34A' : '#DC2626';
  return (
    <View style={[styles.vegBox, { borderColor: color }]}>
      <View style={[styles.vegDot, { backgroundColor: color }]} />
    </View>
  );
}

// ─── "Highly reordered" bar badge ────────────────────────────────────────────

function ReorderBadge() {
  return (
    <View style={styles.reorderRow}>
      <View style={styles.reorderTrack}>
        <View style={styles.reorderFill} />
      </View>
      <Text style={styles.reorderText}>Highly reordered</Text>
    </View>
  );
}

// ─── "Best Seller" pill badge ────────────────────────────────────────────────

function BestSellerBadge() {
  return (
    <View style={styles.bestSellerPill}>
      <Text style={styles.bestSellerText}>Best Seller</Text>
    </View>
  );
}

// ─── Main card ───────────────────────────────────────────────────────────────

export function RestaurantMenuItemCard({
  item,
  quantity,
  onAdd,
  onIncrease,
  onDecrease,
  isFavorite = false,
  onFavorite,
  onShare,
}: RestaurantMenuItemCardProps) {
  const colors = useColors();

  // 0 = ADD visible, 1 = qty selector visible
  const progress = useSharedValue(quantity > 0 ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(quantity > 0 ? 1 : 0, { duration: 220 });
  }, [quantity, progress]);

  const addStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.5], [1, 0], Extrapolation.CLAMP),
    transform: [
      {
        scale: interpolate(
          progress.value,
          [0, 0.4],
          [1, 0.82],
          Extrapolation.CLAMP,
        ),
      },
    ],
  }));

  const qtyStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0.5, 1], [0, 1], Extrapolation.CLAMP),
    transform: [
      {
        scale: interpolate(
          progress.value,
          [0.6, 1],
          [0.82, 1],
          Extrapolation.CLAMP,
        ),
      },
    ],
  }));

  const discountedPrice = item.discount
    ? item.price * (1 - item.discount / 100)
    : item.price;

  const handleAdd = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onAdd();
  };

  const handleIncrease = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onIncrease();
  };

  const handleDecrease = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onDecrease();
  };

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.card, borderBottomColor: colors.border },
      ]}
    >
      {/* ── Left content ───────────────────────────────────────────────── */}
      <View style={styles.leftCol}>
        {/* Veg indicator */}
        <VegIndicator isVeg={item.isVeg} />

        {/* Name */}
        <Text
          numberOfLines={2}
          style={[styles.name, { color: colors.foreground }]}
        >
          {item.name}
        </Text>

        {/* Badge row */}
        {item.isBestSeller ? (
          <BestSellerBadge />
        ) : item.isPopular ? (
          <ReorderBadge />
        ) : null}

        {/* Price row */}
        <View style={styles.priceRow}>
          <Text style={[styles.price, { color: colors.foreground }]}>
            ${discountedPrice.toFixed(2)}
          </Text>
          {item.discount ? (
            <Text style={[styles.strikePrice, { color: colors.mutedForeground }]}>
              ${item.price.toFixed(2)}
            </Text>
          ) : null}
          {item.discount ? (
            <View style={[styles.discountPill, { backgroundColor: colors.accent }]}>
              <Text style={[styles.discountPillText, { color: colors.primary }]}>
                {item.discount}% off
              </Text>
            </View>
          ) : null}
        </View>

        {/* Description */}
        <Text
          numberOfLines={2}
          style={[styles.description, { color: colors.mutedForeground }]}
        >
          {item.description}
        </Text>

        {/* Action buttons */}
        <View style={styles.actionRow}>
          {onFavorite ? (
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onFavorite();
              }}
              style={[styles.iconBtn, { borderColor: colors.border }]}
              accessibilityRole="button"
              accessibilityLabel={
                isFavorite
                  ? `Remove ${item.name} from saved`
                  : `Save ${item.name}`
              }
            >
              {isFavorite ? (
                <BookmarkCheck size={15} color={colors.primary} strokeWidth={2} />
              ) : (
                <Bookmark size={15} color={colors.mutedForeground} strokeWidth={1.8} />
              )}
            </TouchableOpacity>
          ) : null}

          {onShare ? (
            <TouchableOpacity
              onPress={() => onShare()}
              style={[styles.iconBtn, { borderColor: colors.border, marginLeft: 8 }]}
              accessibilityRole="button"
              accessibilityLabel={`Share ${item.name}`}
            >
              <Share2 size={15} color={colors.mutedForeground} strokeWidth={1.8} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* ── Right: image + ADD/qty ──────────────────────────────────────── */}
      <View style={styles.rightCol}>
        <Image
          source={{ uri: item.imageUrl }}
          contentFit="cover"
          style={styles.image}
          transition={200}
        />

        {/* ADD button — fades out when qty > 0 */}
        <Animated.View
          style={[styles.ctaOverlay, addStyle]}
          pointerEvents={quantity === 0 ? 'auto' : 'none'}
        >
          <TouchableOpacity
            onPress={handleAdd}
            activeOpacity={0.85}
            style={[styles.addBtn, { backgroundColor: colors.card }]}
            accessibilityRole="button"
            accessibilityLabel={`Add ${item.name} to cart`}
          >
            <Text style={[styles.addBtnText, { color: colors.primary }]}>
              ADD
            </Text>
            <Plus size={13} color={colors.primary} strokeWidth={3} style={styles.addIcon} />
          </TouchableOpacity>
        </Animated.View>

        {/* Quantity selector — fades in when qty > 0 */}
        <Animated.View
          style={[styles.ctaOverlay, qtyStyle]}
          pointerEvents={quantity > 0 ? 'auto' : 'none'}
        >
          <View style={[styles.qtyPill, { backgroundColor: colors.primary }]}>
            <TouchableOpacity
              onPress={handleDecrease}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 4 }}
              accessibilityRole="button"
              accessibilityLabel="Decrease quantity"
            >
              <Minus size={14} color="#FFFFFF" strokeWidth={3} />
            </TouchableOpacity>

            <Text style={styles.qtyText}>{quantity}</Text>

            <TouchableOpacity
              onPress={handleIncrease}
              hitSlop={{ top: 8, bottom: 8, left: 4, right: 8 }}
              accessibilityRole="button"
              accessibilityLabel="Increase quantity"
            >
              <Plus size={14} color="#FFFFFF" strokeWidth={3} />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const IMAGE_SIZE = 108;

const styles = StyleSheet.create({
  // Card
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 14,
  },

  // Left column
  leftCol: {
    flex: 1,
    paddingRight: 4,
  },

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
  vegDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },

  // Name
  name: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 15,
    lineHeight: 21,
    marginBottom: 6,
  },

  // Reorder badge
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

  // Best Seller badge
  bestSellerPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFF7ED',
    borderRadius: 4,
    paddingHorizontal: 7,
    paddingVertical: 2,
    marginBottom: 7,
  },
  bestSellerText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 10,
    color: '#FF6B00',
    letterSpacing: 0.2,
  },

  // Price row
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  price: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 15,
    lineHeight: 20,
  },
  strikePrice: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    textDecorationLine: 'line-through',
  },
  discountPill: {
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  discountPillText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 10,
  },

  // Description
  description: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 12,
  },

  // Bookmark / share icon buttons
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
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

  // ADD / qty overlay (positioned just below image, centred)
  ctaOverlay: {
    position: 'absolute',
    bottom: -14,
    alignSelf: 'center',
  },

  // ADD button pill
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
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
    fontSize: 13,
    letterSpacing: 0.5,
  },
  addIcon: {
    marginTop: 1,
  },

  // Qty selector pill
  qtyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    gap: 14,
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 4,
  },
  qtyText: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 14,
    color: '#FFFFFF',
    minWidth: 16,
    textAlign: 'center',
  },
});
