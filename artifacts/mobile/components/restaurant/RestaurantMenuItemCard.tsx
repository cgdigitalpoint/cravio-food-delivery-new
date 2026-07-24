import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import { Minus, Plus, Star } from 'lucide-react-native';

import { QuantitySelector } from '@/components/ui';
import { useColors } from '@/hooks/useColors';
import { PP } from '@/theme/poppins';
import type { RestaurantMenuItem } from '@/data/restaurantData';

interface RestaurantMenuItemCardProps {
  item: RestaurantMenuItem;
  quantity: number;
  onAdd: () => void;
  onIncrease: () => void;
  onDecrease: () => void;
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
            style={[PP.label, { color: colors.foreground, marginLeft: 8, flex: 1 }]}
          >
            {item.name}
          </Text>
        </View>

        {item.isBestSeller ? (
          <Text style={[PP.caption, styles.badgeText, { color: colors.primary }]}>
            Best seller
          </Text>
        ) : null}

        <Text
          numberOfLines={2}
          style={[PP.bodySM, { color: colors.mutedForeground, marginTop: 5 }]}
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
          <Text style={[PP.subtitle, { color: colors.foreground, fontFamily: 'Poppins_700Bold' }]}>
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
            <Text style={[PP.buttonSM, { color: '#FFFFFF', marginLeft: 3 }]}>ADD</Text>
          </TouchableOpacity>
        ) : (
          <QuantitySelector
            value={quantity}
            onIncrement={onIncrease}
            onDecrement={onDecrease}
            min={0}
            size="sm"
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  vegBox: {
    width: 14,
    height: 14,
    borderWidth: 1.5,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vegDot: { width: 7, height: 7, borderRadius: 4 },
  badgeText: {
    marginTop: 7,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 10,
  },
  metaRow: { marginTop: 7 },
  priceRow: { marginTop: 8 },
  imageColumn: { width: 104, alignItems: 'center' },
  image: { width: 104, height: 104, borderRadius: 12 },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 82,
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
  },
});