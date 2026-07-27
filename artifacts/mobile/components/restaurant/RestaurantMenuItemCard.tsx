import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import { Plus, Share2, Star } from 'lucide-react-native';

import { FavoriteButton, QuantitySelector } from '@/components/ui';
import { useColors } from '@/hooks/useColors';
import { PP } from '@/theme/poppins';
import type { RestaurantMenuItem } from '@/data/restaurantData';

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

function VegIndicator({ isVeg }: { isVeg: boolean }) {
  const color = isVeg ? '#16A34A' : '#DC2626';
  return (
    <View style={[styles.vegBox, { borderColor: color }]}>
      <View style={[styles.vegDot, { backgroundColor: color }]} />
    </View>
  );
}

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
  const discountedPrice = item.discount
    ? item.price * (1 - item.discount / 100)
    : item.price;

  return (
    <View
      className="flex-row"
      style={[
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <View className="flex-1">
        <View className="flex-row items-center">
          <VegIndicator isVeg={item.isVeg} />
          <Text
            numberOfLines={2}
            style={[PP.label, { color: colors.foreground, marginLeft: 8, flex: 1, fontFamily: 'Poppins_600SemiBold', fontSize: 14 }]}
          >
            {item.name}
          </Text>
          {onFavorite ? (
            <FavoriteButton
              isFavorite={isFavorite}
              onToggle={onFavorite}
              size="sm"
              backgroundColor="transparent"
            />
          ) : null}
          {onShare ? (
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel={`Share ${item.name}`}
              onPress={onShare}
              style={styles.shareButton}
            >
              <Share2 size={16} color={colors.mutedForeground} />
            </TouchableOpacity>
          ) : null}
        </View>

        {item.isBestSeller ? (
          <Text style={[PP.caption, styles.badgeText, { color: colors.primary }]}>
            Best seller
          </Text>
        ) : null}

        <Text
          numberOfLines={2}
          style={[PP.bodySM, { color: colors.mutedForeground, marginTop: 4, fontSize: 12, lineHeight: 16 }]}
        >
          {item.description}
        </Text>

        <View className="flex-row items-center" style={styles.metaRow}>
          <Star size={12} color="#F59E0B" fill="#F59E0B" />
          <Text style={[PP.caption, { color: colors.mutedForeground, marginLeft: 4 }]}>
            {item.rating.toFixed(1)}
          </Text>
          {item.calories ? (
            <Text style={[PP.caption, { color: colors.mutedForeground, marginLeft: 8 }]}>
              {item.calories} cal
            </Text>
          ) : null}
        </View>

        <View className="flex-row items-center" style={styles.priceRow}>
          <Text style={[PP.subtitle, { color: colors.primary, fontFamily: 'Poppins_700Bold', fontSize: 15 }]}>
            ${discountedPrice.toFixed(2)}
          </Text>
          {item.discount ? (
            <Text
              style={[
                PP.caption,
                { color: colors.mutedForeground, textDecorationLine: 'line-through', marginLeft: 7 },
              ]}
            >
              ${item.price.toFixed(2)}
            </Text>
          ) : null}
        </View>
      </View>

      <View style={styles.imageColumn}>
        <Image source={{ uri: item.imageUrl }} contentFit="cover" style={styles.image} />
        {quantity === 0 ? (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={`Add ${item.name} to cart`}
            onPress={onAdd}
            activeOpacity={0.8}
            style={[styles.addButton, { backgroundColor: colors.primary }]}
          >
            <Plus size={16} color="#FFFFFF" strokeWidth={3} />
          </TouchableOpacity>
        ) : (
          <View style={styles.qtyWrap}>
            <QuantitySelector
              value={quantity}
              onIncrement={onIncrease}
              onDecrement={onDecrease}
              min={0}
              size="sm"
            />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  vegBox: {
    width: 12,
    height: 12,
    borderWidth: 1.5,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vegDot: { width: 6, height: 6, borderRadius: 3 },
  badgeText: {
    marginTop: 6,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 10,
  },
  metaRow: { marginTop: 6 },
  priceRow: { marginTop: 8 },
  imageColumn: { width: 88, alignItems: 'center' },
  image: { width: 88, height: 88, borderRadius: 10 },
  shareButton: { padding: 5 },
  addButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -14,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  qtyWrap: {
    marginTop: -16,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  }
});