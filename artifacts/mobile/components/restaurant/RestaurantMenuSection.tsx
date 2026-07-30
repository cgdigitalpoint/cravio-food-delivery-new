import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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
  favoriteIds?: Set<string>;
  onFavorite?: (item: RestaurantMenuItem) => void;
  onShare?: (item: RestaurantMenuItem) => void;
  onLayout?: (y: number) => void;
}

export function RestaurantMenuSection({
  category,
  items,
  quantities,
  onAdd,
  onIncrease,
  onDecrease,
  favoriteIds,
  onFavorite,
  onShare,
  onLayout,
}: RestaurantMenuSectionProps) {
  const colors = useColors();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <View onLayout={(event) => onLayout?.(event.nativeEvent.layout.y)}>
      {/* ── Section header with collapse toggle (▲/▼) — matches reference ── */}
      <TouchableOpacity
        activeOpacity={0.75}
        onPress={() => setCollapsed((prev) => !prev)}
        style={[styles.heading, { borderColor: colors.border }]}
        accessibilityRole="button"
        accessibilityLabel={collapsed ? `Expand ${category.name}` : `Collapse ${category.name}`}
      >
        <View style={styles.headingLeft}>
          <Text style={styles.emoji}>{category.emoji}</Text>
          <Text style={[PP.title, { color: colors.foreground, marginLeft: 7 }]}>
            {category.name}
          </Text>
        </View>
        <View style={styles.headingRight}>
          <Text style={[PP.caption, { color: colors.mutedForeground, marginRight: 8 }]}>
            {items.length} {items.length === 1 ? 'item' : 'items'}
          </Text>
          {/* ▲ collapsed, ▼ expanded — matches Zomato reference */}
          <Text style={[styles.collapseIcon, { color: colors.foreground }]}>
            {collapsed ? '▼' : '▲'}
          </Text>
        </View>
      </TouchableOpacity>

      {/* ── Items — hidden when collapsed ── */}
      {!collapsed && items.map((item) => (
        <RestaurantMenuItemCard
          key={item.id}
          item={item}
          quantity={quantities[item.id] ?? 0}
          onAdd={() => onAdd(item)}
          onIncrease={() => onIncrease(item)}
          onDecrease={() => onDecrease(item)}
          isFavorite={favoriteIds?.has(item.id)}
          onFavorite={onFavorite ? () => onFavorite(item) : undefined}
          onShare={onShare ? () => onShare(item) : undefined}
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
  headingLeft: { flexDirection: 'row', alignItems: 'center' },
  headingRight: { flexDirection: 'row', alignItems: 'center' },
  emoji: { fontSize: 17 },
  collapseIcon: { fontSize: 11, fontFamily: 'Poppins_600SemiBold' },
});