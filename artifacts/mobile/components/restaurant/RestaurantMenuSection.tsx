import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { RestaurantMenuItemCard } from './RestaurantMenuItemCard';
import { useColors } from '@/hooks/useColors';
import { PP } from '@/theme/poppins';
import type { MenuCategory, RestaurantMenuItem } from '@/data/restaurantData';

interface RestaurantMenuSectionProps {
  category: MenuCategory;
  items: RestaurantMenuItem[];
  quantities: Record<string, number>;
  onAdd: (item: RestaurantMenuItem) => void;
  onIncrease: (item: RestaurantMenuItem) => void;
  onDecrease: (item: RestaurantMenuItem) => void;
  onLayout?: (y: number) => void;
}

export function RestaurantMenuSection({
  category,
  items,
  quantities,
  onAdd,
  onIncrease,
  onDecrease,
  onLayout,
}: RestaurantMenuSectionProps) {
  const colors = useColors();

  return (
    <View onLayout={(event) => onLayout?.(event.nativeEvent.layout.y)}>
      <View style={[styles.heading, { borderColor: colors.border }]}>
        <View className="flex-row items-center">
          <Text style={styles.emoji}>{category.emoji}</Text>
          <Text style={[PP.title, { color: colors.foreground, marginLeft: 7 }]}>
            {category.name}
          </Text>
        </View>
        <Text style={[PP.caption, { color: colors.mutedForeground }]}>
          {items.length} {items.length === 1 ? 'item' : 'items'}
        </Text>
      </View>

      {items.map((item) => (
        <RestaurantMenuItemCard
          key={item.id}
          item={item}
          quantity={quantities[item.id] ?? 0}
          onAdd={() => onAdd(item)}
          onIncrease={() => onIncrease(item)}
          onDecrease={() => onDecrease(item)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 22,
    marginBottom: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  emoji: { fontSize: 17 },
});