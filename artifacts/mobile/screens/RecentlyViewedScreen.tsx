import React, { useEffect, useMemo } from 'react';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ArrowLeft, Clock3, Trash2 } from 'lucide-react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/ui';
import { RESTAURANTS } from '@/data/homeData';
import { useEngagementStore } from '@/store/useEngagementStore';
import { useColors } from '@/hooks/useColors';
import { PP } from '@/theme/poppins';

export function RecentlyViewedScreen({
  onBack,
  onRestaurantPress,
}: {
  onBack?: () => void;
  onRestaurantPress?: (id: string) => void;
}) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { viewedRestaurants, hydrate, clearRecentlyViewed } = useEngagementStore();

  useEffect(() => {
    hydrate();
  }, []);

  const restaurants = useMemo(
    () =>
      viewedRestaurants
        .map((viewed) => ({
          viewed,
          restaurant: RESTAURANTS.find((candidate) => candidate.id === viewed.restaurantId),
        }))
        .filter((entry): entry is { viewed: (typeof viewedRestaurants)[number]; restaurant: (typeof RESTAURANTS)[number] } => Boolean(entry.restaurant)),
    [viewedRestaurants],
  );

  const paddingTop = Platform.OS === 'web' ? 60 : insets.top;

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: paddingTop + 8, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={onBack} style={[styles.backButton, { backgroundColor: colors.muted }]}>
          <ArrowLeft size={20} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[PP.h3, { color: colors.foreground }]}>Recently Viewed</Text>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Clear recently viewed history"
          onPress={clearRecentlyViewed}
          disabled={restaurants.length === 0}
          style={styles.clearButton}
        >
          <Trash2 size={18} color={restaurants.length ? colors.primary : colors.mutedForeground} />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]} showsVerticalScrollIndicator={false}>
        {restaurants.length === 0 ? (
          <EmptyState variant="custom" title="Nothing viewed yet" subtitle="Restaurants you open will appear here." />
        ) : (
          restaurants.map(({ restaurant, viewed }) => (
            <TouchableOpacity
              key={restaurant.id}
              activeOpacity={0.85}
              onPress={() => onRestaurantPress?.(restaurant.id)}
              style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <Image source={{ uri: restaurant.imageUri }} style={styles.image} contentFit="cover" />
              <View style={styles.cardBody}>
                <Text numberOfLines={1} style={[PP.label, { color: colors.foreground }]}>{restaurant.name}</Text>
                <Text numberOfLines={1} style={[PP.caption, { color: colors.mutedForeground, marginTop: 3 }]}>{restaurant.cuisine}</Text>
                <View style={styles.meta}>
                  <Text style={styles.stars}>★</Text>
                  <Text style={[PP.caption, { color: colors.mutedForeground, marginLeft: 3 }]}>{restaurant.rating.toFixed(1)}</Text>
                  <Clock3 size={13} color={colors.mutedForeground} style={{ marginLeft: 10 }} />
                  <Text style={[PP.caption, { color: colors.mutedForeground, marginLeft: 3 }]}>
                    {new Date(viewed.viewedAt).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: StyleSheet.hairlineWidth },
  backButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 12 },
  clearButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  content: { padding: 16, gap: 12 },
  card: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 16, padding: 10 },
  image: { width: 76, height: 76, borderRadius: 12 },
  cardBody: { flex: 1, marginLeft: 12 },
  meta: { flexDirection: 'row', alignItems: 'center', marginTop: 9 },
  stars: { color: '#F59E0B', fontSize: 14 },
});