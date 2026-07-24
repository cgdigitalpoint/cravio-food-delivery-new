// ─── Favorites Screen ─────────────────────────────────────────────────────────
import React, { useEffect, useState } from 'react';
import {
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { useColors } from '@/hooks/useColors';
import { PP } from '@/theme/poppins';
import { useAuthStore } from '@/store/useAuthStore';
import { useFavoriteStore } from '@/store/useFavoriteStore';
import { EmptyState, FavoriteButton } from '@/components/ui';
import { RESTAURANTS } from '@/data/homeData';
import { getMenuItems, type RestaurantMenuItem } from '@/data/restaurantData';
import { useEngagementStore } from '@/store/useEngagementStore';
import { RestaurantMenuItemCard } from '@/components/restaurant/RestaurantMenuItemCard';

interface FavoritesScreenProps {
  onBack?: () => void;
  onRestaurantPress?: (id: string) => void;
}

export function FavoritesScreen({ onBack, onRestaurantPress }: FavoritesScreenProps) {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { supabaseUserId } = useAuthStore();
  const { favorites, isLoading, fetchFavorites, removeFavorite } = useFavoriteStore();
  const { favoriteFoodIds, hydrate, toggleFoodFavorite } = useEngagementStore();
  const [activeTab, setActiveTab] = useState<'restaurants' | 'dishes'>('restaurants');
  const [refreshing, setRefreshing] = useState(false);

  const paddingTop = Platform.OS === 'web' ? 60 : insets.top;
  const paddingBottom = Platform.OS === 'web' ? 34 : insets.bottom;

  useEffect(() => {
    if (supabaseUserId) fetchFavorites(supabaseUserId);
    hydrate();
  }, [supabaseUserId]);

  const handleRefresh = async () => {
    if (!supabaseUserId) return;
    setRefreshing(true);
    await fetchFavorites(supabaseUserId);
    setRefreshing(false);
  };

  const handleUnfavorite = async (restaurantId: string) => {
    if (!supabaseUserId) return;
    await removeFavorite(supabaseUserId, restaurantId);
  };

  // Find restaurant data for each favorite (from local data; Phase 6+ will query DB)
  const favoriteRestaurants = favorites.map((fav) => ({
    fav,
    restaurant: RESTAURANTS.find((r) => r.id === fav.restaurant_id),
  }));
  const favoriteFoods: RestaurantMenuItem[] = RESTAURANTS.flatMap((restaurant) =>
    getMenuItems(restaurant.id).filter((item) => favoriteFoodIds.has(item.id)),
  );

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: paddingTop + 8, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={onBack} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <View style={[styles.backBtn, { backgroundColor: colors.muted }]}>
            <ArrowLeft size={20} color={colors.foreground} strokeWidth={2} />
          </View>
        </TouchableOpacity>
        <Text style={[PP.h3, { color: colors.foreground }]}>Favorites</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.list, { paddingBottom: paddingBottom + 24 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#FF6B00" />
        }
      >
        <View style={[styles.tabs, { backgroundColor: colors.surfaceVariant }]}>
          {(['restaurants', 'dishes'] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[styles.tab, activeTab === tab && { backgroundColor: colors.card }]}
            >
              <Text style={[PP.label, { color: activeTab === tab ? colors.foreground : colors.mutedForeground }]}>
                {tab === 'restaurants' ? 'Restaurants' : 'Dishes'}
              </Text>
              <View style={[styles.countBadge, { backgroundColor: activeTab === tab ? colors.primary : colors.muted }]}>
                <Text style={[PP.caption, { color: activeTab === tab ? '#FFFFFF' : colors.mutedForeground }]}>
                  {tab === 'restaurants' ? favoriteRestaurants.length : favoriteFoods.length}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        {activeTab === 'restaurants' && isLoading && !refreshing ? (
          <View style={styles.centered}>
            <Text style={[PP.body, { color: colors.mutedForeground }]}>Loading favorites…</Text>
          </View>
        ) : activeTab === 'restaurants' && favoriteRestaurants.length === 0 ? (
          <EmptyState
            variant="custom"
            title="No favorites yet"
            subtitle="Heart a restaurant on the home screen to save it here"
          />
        ) : activeTab === 'restaurants' ? (
          favoriteRestaurants.map(({ fav, restaurant }) => (
            <TouchableOpacity
              key={fav.id}
              onPress={() => restaurant && onRestaurantPress?.(restaurant.id)}
              style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
              activeOpacity={0.8}
            >
              <View style={styles.cardBody}>
                {restaurant?.imageUri ? (
                  <Image source={{ uri: restaurant.imageUri }} style={styles.restaurantImage} contentFit="cover" />
                ) : null}
                <View style={styles.cardInfo}>
                  <Text style={[PP.label, { color: colors.foreground }]}>
                    {restaurant?.name ?? fav.restaurant_id}
                  </Text>
                  {restaurant && (
                    <>
                      <Text style={[PP.caption, { color: colors.mutedForeground, marginTop: 2 }]}>
                        ⭐ {restaurant.rating} · {restaurant.deliveryTime} min
                      </Text>
                      <Text style={[PP.caption, { color: colors.mutedForeground }]}>
                        {restaurant.isOpen ? '🟢 Open now' : '🔴 Closed'}
                      </Text>
                    </>
                  )}
                </View>
                <FavoriteButton
                  isFavorite
                  onToggle={() => handleUnfavorite(fav.restaurant_id)}
                />
              </View>
            </TouchableOpacity>
          ))
        ) : favoriteFoods.length === 0 ? (
          <EmptyState
            variant="custom"
            title="No favorite dishes yet"
            subtitle="Tap the heart beside a dish to save it here"
          />
        ) : (
          favoriteFoods.map((item) => (
            <RestaurantMenuItemCard
              key={item.id}
              item={item}
              quantity={0}
              onAdd={() => {}}
              onIncrease={() => {}}
              onDecrease={() => {}}
              isFavorite
              onFavorite={() => toggleFoodFavorite(item.id)}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backBtn: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  scroll: { flex: 1 },
  list: { padding: 16, gap: 12 },
  card: { borderRadius: 16, borderWidth: 1, padding: 16 },
  cardBody: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardInfo: { flex: 1, marginRight: 12 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 60 },
  tabs: { flexDirection: 'row', borderRadius: 14, padding: 4, marginBottom: 16 },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, paddingVertical: 10, borderRadius: 11 },
  countBadge: { minWidth: 22, alignItems: 'center', paddingHorizontal: 5, paddingVertical: 2, borderRadius: 10 },
  restaurantImage: { width: 62, height: 62, borderRadius: 12, marginRight: 12 },
});
