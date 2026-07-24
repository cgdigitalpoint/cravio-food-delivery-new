import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Heart, MapPin, Star } from 'lucide-react-native';
import { Image } from 'expo-image';

import { FavoriteButton } from '@/components/ui';
import type { Restaurant } from '@/data/homeData';
import type { RestaurantMenuItem } from '@/data/restaurantData';
import { useColors } from '@/hooks/useColors';
import { PP } from '@/theme/poppins';

export function RecommendedFoodCarousel({
  items,
  favoriteIds,
  onFoodPress,
  onFavorite,
}: {
  items: RestaurantMenuItem[];
  favoriteIds: Set<string>;
  onFoodPress?: (item: RestaurantMenuItem) => void;
  onFavorite: (item: RestaurantMenuItem) => void;
}) {
  const colors = useColors();
  return (
    <View style={styles.section}>
      <Text style={[PP.h3, { color: colors.foreground }]}>Recommended for you</Text>
      <Text style={[PP.bodySM, { color: colors.mutedForeground, marginTop: 2 }]}>Popular picks based on your taste</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carousel}>
        {items.map((item) => (
          <TouchableOpacity key={item.id} onPress={() => onFoodPress?.(item)} activeOpacity={0.85} style={[styles.foodCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Image source={{ uri: item.imageUrl }} style={styles.foodImage} contentFit="cover" />
            <FavoriteButton isFavorite={favoriteIds.has(item.id)} onToggle={() => onFavorite(item)} size="sm" backgroundColor="rgba(255,255,255,0.9)" style={styles.favorite} />
            <View style={styles.cardBody}>
              <Text numberOfLines={1} style={[PP.label, { color: colors.foreground }]}>{item.name}</Text>
              <View style={styles.cardMeta}>
                <Star size={12} color="#F59E0B" fill="#F59E0B" />
                <Text style={[PP.caption, { color: colors.mutedForeground, marginLeft: 4 }]}>{item.rating.toFixed(1)}</Text>
                <Text style={[PP.subtitle, { color: colors.foreground, marginLeft: 'auto' }]}>${item.price.toFixed(2)}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

export function SimilarRestaurantCarousel({
  restaurants,
  onRestaurantPress,
}: {
  restaurants: Restaurant[];
  onRestaurantPress: (restaurant: Restaurant) => void;
}) {
  const colors = useColors();
  return (
    <View style={styles.section}>
      <Text style={[PP.h3, { color: colors.foreground }]}>You may also like</Text>
      <Text style={[PP.bodySM, { color: colors.mutedForeground, marginTop: 2 }]}>Similar restaurants nearby</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carousel}>
        {restaurants.map((restaurant) => (
          <TouchableOpacity key={restaurant.id} onPress={() => onRestaurantPress(restaurant)} activeOpacity={0.85} style={[styles.restaurantCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Image source={{ uri: restaurant.imageUri }} style={styles.restaurantImage} contentFit="cover" />
            <View style={styles.cardBody}>
              <Text numberOfLines={1} style={[PP.label, { color: colors.foreground }]}>{restaurant.name}</Text>
              <Text numberOfLines={1} style={[PP.caption, { color: colors.mutedForeground, marginTop: 3 }]}>{restaurant.cuisine}</Text>
              <View style={styles.cardMeta}>
                <Star size={12} color="#F59E0B" fill="#F59E0B" />
                <Text style={[PP.caption, { color: colors.mutedForeground, marginLeft: 4 }]}>{restaurant.rating.toFixed(1)}</Text>
                <MapPin size={12} color={colors.mutedForeground} style={{ marginLeft: 8 }} />
                <Text style={[PP.caption, { color: colors.mutedForeground, marginLeft: 3 }]}>{restaurant.distance}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginTop: 25, paddingHorizontal: 16 },
  carousel: { gap: 12, paddingTop: 12, paddingBottom: 2 },
  foodCard: { width: 190, overflow: 'hidden', borderWidth: 1, borderRadius: 16 },
  foodImage: { width: '100%', height: 112 },
  favorite: { position: 'absolute', top: 8, right: 8 },
  cardBody: { padding: 11 },
  cardMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 7 },
  restaurantCard: { width: 210, overflow: 'hidden', borderWidth: 1, borderRadius: 16 },
  restaurantImage: { width: '100%', height: 112 },
});