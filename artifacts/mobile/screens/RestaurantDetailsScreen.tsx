import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Share,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Check,
  ChevronDown,
  Clock3,
  Heart,
  MapPin,
  Search,
  Share2,
  ShoppingCart,
  Star,
  Tag,
  Truck,
  UtensilsCrossed,
  X,
} from 'lucide-react-native';

import {
  EmptyState,
} from '@/components/ui';
import {
  RatingSummary,
  RecommendedFoodCarousel,
  ReviewSection,
  SimilarRestaurantCarousel,
} from '@/components/engagement';
import { RestaurantLogo } from '@/components/restaurant/RestaurantLogo';
import { RestaurantMenuSection } from '@/components/restaurant/RestaurantMenuSection';
import { RestaurantSkeleton } from '@/components/restaurant/RestaurantSkeleton';
import { RESTAURANTS } from '@/data/homeData';
import {
  getMenuByCategory,
  getRestaurantCategories,
  type MenuCategory,
  type RestaurantMenuItem,
} from '@/data/restaurantData';
import { useColors } from '@/hooks/useColors';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useFavoriteStore } from '@/store/useFavoriteStore';
import { useEngagementStore } from '@/store/useEngagementStore';
import {
  getAverageRating,
  getFoodReviewHighlights,
  getRestaurantReviews,
  getRecommendedItems,
  getSimilarRestaurants,
} from '@/data/engagementData';
import type { MenuItem } from '@/types';
import { PP } from '@/theme/poppins';

const COVER_HEIGHT = 252;
const TOP_BAR_HEIGHT = 56;
const STICKY_TABS_HEIGHT = 52;

function VegIndicator({ isVeg }: { isVeg: boolean }) {
  const color = isVeg ? '#16A34A' : '#DC2626';
  return (
    <View style={[styles.vegBox, { borderColor: color }]}>
      <View style={[styles.vegDot, { backgroundColor: color }]} />
    </View>
  );
}

function CategoryTabs({
  categories,
  activeId,
  onSelect,
  backgroundColor,
}: {
  categories: MenuCategory[];
  activeId: string;
  onSelect: (id: string) => void;
  backgroundColor: string;
}) {
  const colors = useColors();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{ backgroundColor }}
      contentContainerStyle={styles.categoryList}
    >
      {categories.map((category) => {
        const active = category.id === activeId;
        return (
          <TouchableOpacity
            key={category.id}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            onPress={() => onSelect(category.id)}
            activeOpacity={0.75}
            style={[
              styles.categoryTab,
              active && {
                borderBottomColor: colors.primary,
                borderBottomWidth: 2.5,
              },
            ]}
          >
            <Text style={styles.categoryEmoji}>{category.emoji}</Text>
            <Text
              style={[
                PP.bodySM,
                {
                  color: active ? colors.primary : colors.mutedForeground,
                  fontFamily: active ? 'Poppins_600SemiBold' : 'Poppins_400Regular',
                },
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

function RestaurantHeader({
  restaurant,
  isFavorite,
  onBack,
  onFavorite,
  onShare,
}: {
  restaurant: (typeof RESTAURANTS)[number];
  isFavorite: boolean;
  onBack: () => void;
  onFavorite: () => void;
  onShare: () => void;
}) {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.headerLayer, { paddingTop: insets.top + 10 }]}>
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel="Go back"
        onPress={onBack}
        style={styles.headerButton}
      >
        <ArrowLeft size={21} color="#FFFFFF" strokeWidth={2.5} />
      </TouchableOpacity>
      <View style={styles.headerActions}>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={`Share ${restaurant.name}`}
          onPress={onShare}
          style={styles.headerButton}
        >
          <Share2 size={18} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          onPress={onFavorite}
          style={[styles.headerButton, styles.headerButtonGap]}
        >
          <Heart
            size={19}
            color={isFavorite ? '#FF8C38' : '#FFFFFF'}
            fill={isFavorite ? '#FF8C38' : 'transparent'}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function RestaurantSummary({
  restaurant,
}: {
  restaurant: (typeof RESTAURANTS)[number];
}) {
  const colors = useColors();
  const reviewCount = 1200 + Number(restaurant.id.replace('r', '')) * 143;

  return (
    <View style={[styles.summary, { backgroundColor: colors.background }]}>
      <View className="flex-row items-start">
        <RestaurantLogo name={restaurant.name} imageUri={restaurant.imageUri} />
        <View className="flex-1" style={styles.summaryTitle}>
          <View className="flex-row items-center">
            <VegIndicator isVeg={restaurant.isVeg ?? false} />
            <Text
              numberOfLines={2}
              style={[PP.h3, { color: colors.foreground, flex: 1, marginLeft: 8 }]}
            >
              {restaurant.name}
            </Text>
          </View>
          <Text
            numberOfLines={2}
            style={[PP.bodySM, { color: colors.mutedForeground, marginTop: 4 }]}
          >
            {restaurant.cuisine}
          </Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: restaurant.isOpen ? '#F0FDF4' : '#FEF2F2' },
          ]}
        >
          <View
            style={[
              styles.statusDot,
              { backgroundColor: restaurant.isOpen ? '#16A34A' : '#DC2626' },
            ]}
          />
          <Text
            style={[
              PP.caption,
              {
                color: restaurant.isOpen ? '#16A34A' : '#DC2626',
                fontFamily: 'Poppins_600SemiBold',
              },
            ]}
          >
            {restaurant.isOpen ? 'Open' : 'Closed'}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center" style={styles.ratingRow}>
        <Star size={16} color="#F59E0B" fill="#F59E0B" />
        <Text style={[PP.label, { color: colors.foreground, marginLeft: 5 }]}>
          {restaurant.rating.toFixed(1)}
        </Text>
        <Text style={[PP.bodySM, { color: colors.mutedForeground, marginLeft: 4 }]}>
          ({reviewCount.toLocaleString()} reviews)
        </Text>
      </View>

      <View className="flex-row flex-wrap" style={styles.infoPills}>
        <View style={[styles.infoPill, { backgroundColor: colors.surfaceVariant }]}>
          <Clock3 size={13} color={colors.primary} />
          <Text style={[PP.caption, { color: colors.foreground, marginLeft: 5 }]}>
            {restaurant.deliveryTime} min
          </Text>
        </View>
        <View style={[styles.infoPill, { backgroundColor: colors.surfaceVariant }]}>
          <MapPin size={13} color={colors.primary} />
          <Text style={[PP.caption, { color: colors.foreground, marginLeft: 5 }]}>
            {restaurant.distance}
          </Text>
        </View>
        <View style={[styles.infoPill, { backgroundColor: colors.surfaceVariant }]}>
          <Truck size={13} color={colors.primary} />
          <Text style={[PP.caption, { color: colors.foreground, marginLeft: 5 }]}>
            {restaurant.deliveryFee === 0 ? 'Free delivery' : `$${restaurant.deliveryFee} delivery`}
          </Text>
        </View>
      </View>

      {/* Info badges — No packaging charges + Frequently reordered */}
      <View style={styles.infoBadgeRow}>
        <View style={styles.infoBadge}>
          <Check size={12} color="#16A34A" strokeWidth={2.5} />
          <Text style={[PP.caption, { color: colors.foreground, marginLeft: 5 }]}>
            No packaging charges
          </Text>
        </View>
        <View style={[styles.infoBadge, { marginLeft: 10 }]}>
          <Check size={12} color="#16A34A" strokeWidth={2.5} />
          <Text style={[PP.caption, { color: colors.foreground, marginLeft: 5 }]}>
            Frequently reordered
          </Text>
        </View>
      </View>

      {restaurant.offerText ? (
        <TouchableOpacity activeOpacity={0.8} style={styles.offerBanner}>
          <View style={styles.offerIconWrap}>
            <Tag size={12} color="#FF6B00" />
          </View>
          <Text style={[PP.caption, { color: colors.foreground, flex: 1, fontFamily: 'Poppins_500Medium' }]}>
            {restaurant.offerText} on this order
          </Text>
          <Text style={[PP.caption, { color: colors.primary, fontFamily: 'Poppins_600SemiBold' }]}>
            4 offers ›
          </Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

// ─── Floating Menu pill button ────────────────────────────────────────────────

function FloatingMenuButton({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityLabel="Jump to menu"
      style={styles.floatingMenuBtn}
    >
      <UtensilsCrossed size={15} color="#FFFFFF" strokeWidth={2} />
      <Text style={styles.floatingMenuText}>Menu</Text>
    </TouchableOpacity>
  );
}

// ─── Sticky cart bar (full-width, reference style) ───────────────────────────

function StickyCartBar({
  count,
  total,
  onPress,
  bottom,
}: {
  count: number;
  total: number;
  onPress: () => void;
  bottom: number;
}) {
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(count > 0 ? 1 : 0, { duration: 220 });
  }, [count, opacity]);

  const barStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: interpolate(opacity.value, [0, 1], [24, 0]) }],
  }));

  if (count === 0) return null;

  return (
    <Animated.View style={[styles.stickyCartWrap, { bottom: bottom }, barStyle]}>
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel={`View cart with ${count} items`}
        onPress={onPress}
        activeOpacity={0.92}
        style={styles.stickyCartBar}
      >
        {/* Food icon circles */}
        <View style={styles.stickyCartIconRow}>
          <View style={styles.stickyCartIcon}>
            <ShoppingCart size={14} color="#FF6B00" />
          </View>
        </View>
        <View style={styles.stickyCartCenter}>
          <Text style={styles.stickyCartCount}>
            {count} {count === 1 ? 'item' : 'items'} added
          </Text>
        </View>
        <View style={styles.stickyCartRight}>
          <Text style={styles.stickyCartContinue}>Continue</Text>
          <Text style={styles.stickyCartArrow}> ›</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

export function RestaurantDetailsScreen({ restaurantId }: { restaurantId: string }) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);
  const sectionOffsets = useRef<Record<string, number>>({});
  const scrollY = useSharedValue(0);

  const restaurant = useMemo(
    () => RESTAURANTS.find((candidate) => candidate.id === restaurantId),
    [restaurantId],
  );
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [vegFilter, setVegFilter] = useState<'all' | 'veg' | 'egg' | 'nonveg'>('all');
  const [activeCategory, setActiveCategory] = useState('popular');
  const [showStickyTabs, setShowStickyTabs] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const { supabaseUserId } = useAuthStore();
  const {
    favoriteIds: restaurantFavoriteIds,
    fetchFavorites,
    toggleFavorite: toggleFavoriteInStore,
  } = useFavoriteStore();
  const {
    favoriteFoodIds,
    hydrate,
    toggleFoodFavorite,
    addRecentlyViewed,
  } = useEngagementStore();

  const {
    items: cartItems,
    itemCount,
    totalAmount,
    restaurantId: cartRestaurantId,
    restaurantName: cartRestaurantName,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  } = useCartStore();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 320);
    return () => clearTimeout(timer);
  }, [restaurantId]);

  useEffect(() => {
    hydrate();
    addRecentlyViewed(restaurantId);
    if (supabaseUserId) fetchFavorites(supabaseUserId);
  }, [restaurantId, supabaseUserId]);

  const allSections = useMemo(
    () => (restaurant ? getMenuByCategory(restaurant.id) : []),
    [restaurant],
  );
  const menuQuery = query.trim().toLowerCase();
  const filteredSections = useMemo(
    () =>
      allSections
        .map((section) => ({
          ...section,
          items: section.items.filter((item) => {
            // text search
            if (menuQuery) {
              const match = [item.name, item.description, ...item.tags]
                .join(' ')
                .toLowerCase()
                .includes(menuQuery);
              if (!match) return false;
            }
            // veg / egg / non-veg filter
            if (vegFilter === 'veg') return item.isVeg === true && !item.isEgg;
            if (vegFilter === 'egg') return item.isEgg === true;
            if (vegFilter === 'nonveg') return item.isVeg === false && !item.isEgg;
            return true;
          }),
        }))
        .filter((section) => section.items.length > 0),
    [allSections, menuQuery, vegFilter],
  );
  const categories = useMemo(
    () =>
      (menuQuery
        ? filteredSections.map((section) => section.category)
        : getRestaurantCategories(restaurantId)),
    [filteredSections, menuQuery, restaurantId],
  );
  const quantities = useMemo(() => {
    const result: Record<string, number> = {};
    cartItems.forEach((item) => {
      result[item.menuItem.id] = (result[item.menuItem.id] ?? 0) + item.quantity;
    });
    return result;
  }, [cartItems]);

  const handleAdd = useCallback(
    (item: RestaurantMenuItem) => {
      if (cartRestaurantId && cartRestaurantId !== restaurantId) {
        Alert.alert(
          'Start a new cart?',
          `Your cart has items from ${cartRestaurantName ?? 'another restaurant'}.`,
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Start new',
              style: 'destructive',
              onPress: () => {
                clearCart();
                addItem(item as unknown as MenuItem, 1, undefined, restaurant?.name);
              },
            },
          ],
        );
        return;
      }
      addItem(item as unknown as MenuItem, 1, undefined, restaurant?.name);
    },
    [addItem, cartRestaurantId, cartRestaurantName, clearCart, restaurant, restaurantId],
  );

  const getCartEntry = useCallback(
    (item: RestaurantMenuItem) => {
      const entries = cartItems.filter((cartItem) => cartItem.menuItem.id === item.id);
      if (entries.length === 0) return undefined;
      return {
        id: entries[0].id,
        quantity: entries.reduce((sum, entry) => sum + entry.quantity, 0),
      };
    },
    [cartItems],
  );

  const handleIncrease = useCallback(
    (item: RestaurantMenuItem) => {
      const entry = getCartEntry(item);
      if (entry) updateQuantity(entry.id, entry.quantity + 1);
      else handleAdd(item);
    },
    [getCartEntry, handleAdd, updateQuantity],
  );

  const handleDecrease = useCallback(
    (item: RestaurantMenuItem) => {
      const entry = getCartEntry(item);
      if (!entry) return;
      if (entry.quantity <= 1) removeItem(entry.id);
      else updateQuantity(entry.id, entry.quantity - 1);
    },
    [getCartEntry, removeItem, updateQuantity],
  );

  const isFavorite = restaurantFavoriteIds.has(restaurantId);
  const reviews = useMemo(() => getRestaurantReviews(restaurantId), [restaurantId]);
  const foodReviews = useMemo(() => getFoodReviewHighlights(restaurantId), [restaurantId]);
  const recommendedItems = useMemo(
    () => getRecommendedItems(restaurantId, favoriteFoodIds),
    [restaurantId, favoriteFoodIds],
  );
  const similarRestaurants = useMemo(
    () => (restaurant ? getSimilarRestaurants(restaurant) : []),
    [restaurant],
  );

  const shareRestaurant = useCallback(async () => {
    if (!restaurant || isSharing) return;
    setIsSharing(true);
    try {
      await Share.share({
        title: restaurant.name,
        message: `Try ${restaurant.name} on Cravio — ${restaurant.cuisine}.`,
        url: `https://cravio.app/restaurant/${restaurant.id}`,
      });
    } finally {
      setIsSharing(false);
    }
  }, [isSharing, restaurant]);

  const shareFood = useCallback(async (item: RestaurantMenuItem) => {
    await Share.share({
      title: item.name,
      message: `Try ${item.name} from ${restaurant?.name ?? 'this restaurant'} on Cravio — $${item.price.toFixed(2)}.`,
      url: `https://cravio.app/food/${item.id}`,
    });
  }, [restaurant]);

  const toggleRestaurantFavorite = useCallback(async () => {
    if (!supabaseUserId) {
      Alert.alert('Sign in to save favorites', 'Your saved restaurants sync across devices when you sign in.');
      return;
    }
    try {
      await toggleFavoriteInStore(supabaseUserId, restaurantId);
    } catch {
      Alert.alert('Could not update favorite', 'Please try again.');
    }
  }, [restaurantId, supabaseUserId, toggleFavoriteInStore]);

  // JS-thread scroll handler — called from the UI thread worklet via runOnJS.
  // Must be stable (useCallback) so the worklet reference stays fresh.
  const handleScroll = useCallback(
    (offset: number) => {
      setShowStickyTabs(offset > COVER_HEIGHT - TOP_BAR_HEIGHT);
      const visibleSections = Object.entries(sectionOffsets.current).sort(
        ([, first], [, second]) => first - second,
      );
      for (let index = visibleSections.length - 1; index >= 0; index -= 1) {
        if (offset + insets.top + STICKY_TABS_HEIGHT + 12 >= visibleSections[index][1]) {
          setActiveCategory(visibleSections[index][0]);
          break;
        }
      }
    },
    [insets.top],
  );

  // Reanimated worklet: tracks scroll position on the UI thread AND calls the
  // JS-side handleScroll via runOnJS (safe cross-thread bridge).
  // Passing [handleScroll] as the dependency array re-creates the handler only
  // when insets change (i.e. on rotation), keeping it otherwise stable.
  const scrollHandler = useAnimatedScrollHandler(
    {
      onScroll: (event) => {
        scrollY.value = event.contentOffset.y;
        runOnJS(handleScroll)(event.contentOffset.y);
      },
    },
    [handleScroll],
  );

  const coverStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          scrollY.value,
          [-COVER_HEIGHT, 0, COVER_HEIGHT],
          [-COVER_HEIGHT / 2, 0, COVER_HEIGHT * 0.28],
        ),
      },
    ],
  }));

  const stickyTitleStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      [COVER_HEIGHT - TOP_BAR_HEIGHT - 30, COVER_HEIGHT - TOP_BAR_HEIGHT],
      [0, 1],
    ),
  }));

  const scrollToCategory = (categoryId: string) => {
    setActiveCategory(categoryId);
    const offset = sectionOffsets.current[categoryId];
    if (offset !== undefined) {
      scrollRef.current?.scrollTo({
        y: Math.max(0, offset - insets.top - STICKY_TABS_HEIGHT - 8),
        animated: true,
      });
    }
  };

  if (isLoading) return <RestaurantSkeleton />;

  if (!restaurant) {
    return (
      <View style={[styles.stateScreen, { backgroundColor: colors.background }]}>
        <EmptyState
          variant="custom"
          title="Restaurant unavailable"
          subtitle="We couldn't load this restaurant. Please go back and try another one."
          ctaText="Go back"
          onCtaPress={() => router.back()}
        />
      </View>
    );
  }

  const coverUri = restaurant.imageUri ?? `https://picsum.photos/seed/${restaurant.id}/800/500`;

  return (
    <KeyboardAvoidingView
      style={[styles.screen, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Animated.ScrollView
        ref={scrollRef as any}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 120 + insets.bottom }}
      >
        <View style={styles.coverWrap}>
          <Image source={{ uri: coverUri }} style={[styles.cover, coverStyle]} contentFit="cover" />
          <LinearGradient
            colors={['rgba(0,0,0,0.58)', 'transparent', 'rgba(0,0,0,0.28)']}
            style={StyleSheet.absoluteFill}
          />
        </View>

        <RestaurantSummary restaurant={restaurant} />

        <View style={[styles.searchWrap, { backgroundColor: colors.background }]}>
          <View
            className="flex-row items-center"
            style={[
              styles.searchInput,
              { backgroundColor: colors.surfaceVariant, borderColor: colors.border },
            ]}
          >
            <Search size={18} color={colors.mutedForeground} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search this menu"
              placeholderTextColor={colors.mutedForeground}
              accessibilityLabel="Search this menu"
              style={[styles.searchText, { color: colors.foreground }]}
              returnKeyType="search"
            />
            {query ? (
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel="Clear menu search"
                onPress={() => setQuery('')}
              >
                <X size={17} color={colors.mutedForeground} />
              </TouchableOpacity>
            ) : null}
          </View>

          {/* Filters / Veg / Egg / Non-veg chips — matches reference design */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterRow}
            contentContainerStyle={styles.filterRowContent}
          >
            {/* Filters dropdown */}
            <TouchableOpacity
              activeOpacity={0.75}
              style={[styles.filterChip, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <UtensilsCrossed size={12} color={colors.mutedForeground} />
              <Text style={[styles.filterLabel, { color: colors.foreground, fontFamily: 'Poppins_400Regular' }]}>
                Filters
              </Text>
              <ChevronDown size={12} color={colors.mutedForeground} />
            </TouchableOpacity>

            {/* Veg */}
            <TouchableOpacity
              onPress={() => setVegFilter(vegFilter === 'veg' ? 'all' : 'veg')}
              activeOpacity={0.75}
              style={[
                styles.filterChip,
                {
                  backgroundColor: vegFilter === 'veg' ? '#F0FDF4' : colors.card,
                  borderColor: vegFilter === 'veg' ? '#16A34A' : colors.border,
                  borderWidth: vegFilter === 'veg' ? 1.5 : 1,
                },
              ]}
            >
              <View style={[styles.filterDotBox, { borderColor: '#16A34A' }]}>
                <View style={[styles.filterDotInner, { backgroundColor: '#16A34A' }]} />
              </View>
              <Text style={[styles.filterLabel, { color: vegFilter === 'veg' ? '#16A34A' : colors.foreground, fontFamily: vegFilter === 'veg' ? 'Poppins_600SemiBold' : 'Poppins_400Regular' }]}>
                Veg
              </Text>
            </TouchableOpacity>

            {/* Egg */}
            <TouchableOpacity
              onPress={() => setVegFilter(vegFilter === 'egg' ? 'all' : 'egg')}
              activeOpacity={0.75}
              style={[
                styles.filterChip,
                {
                  backgroundColor: vegFilter === 'egg' ? '#FFFBEB' : colors.card,
                  borderColor: vegFilter === 'egg' ? '#F59E0B' : colors.border,
                  borderWidth: vegFilter === 'egg' ? 1.5 : 1,
                },
              ]}
            >
              <Text style={styles.filterEggIcon}>🥚</Text>
              <Text style={[styles.filterLabel, { color: vegFilter === 'egg' ? '#D97706' : colors.foreground, fontFamily: vegFilter === 'egg' ? 'Poppins_600SemiBold' : 'Poppins_400Regular' }]}>
                Egg
              </Text>
            </TouchableOpacity>

            {/* Non-veg */}
            <TouchableOpacity
              onPress={() => setVegFilter(vegFilter === 'nonveg' ? 'all' : 'nonveg')}
              activeOpacity={0.75}
              style={[
                styles.filterChip,
                {
                  backgroundColor: vegFilter === 'nonveg' ? '#FEF2F2' : colors.card,
                  borderColor: vegFilter === 'nonveg' ? '#DC2626' : colors.border,
                  borderWidth: vegFilter === 'nonveg' ? 1.5 : 1,
                },
              ]}
            >
              <View style={[styles.filterDotBox, { borderColor: '#DC2626' }]}>
                <View style={[styles.filterDotInner, { backgroundColor: '#DC2626' }]} />
              </View>
              <Text style={[styles.filterLabel, { color: vegFilter === 'nonveg' ? '#DC2626' : colors.foreground, fontFamily: vegFilter === 'nonveg' ? 'Poppins_600SemiBold' : 'Poppins_400Regular' }]}>
                Non-veg
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        <View
          style={[
            styles.tabsWrap,
            { backgroundColor: colors.background, borderColor: colors.border },
          ]}
        >
          <CategoryTabs
            categories={categories}
            activeId={activeCategory}
            onSelect={scrollToCategory}
            backgroundColor={colors.background}
          />
        </View>

        {filteredSections.length > 0 ? (
          filteredSections.map((section) => (
            <RestaurantMenuSection
              key={section.category.id}
              category={section.category}
              items={section.items}
              quantities={quantities}
              onAdd={handleAdd}
              onIncrease={handleIncrease}
              onDecrease={handleDecrease}
              favoriteIds={favoriteFoodIds}
              onFavorite={(item) => toggleFoodFavorite(item.id)}
              onShare={shareFood}
              onLayout={(y) => {
                sectionOffsets.current[section.category.id] = y;
              }}
            />
          ))
        ) : (
          <View style={styles.emptyMenu}>
            <EmptyState
              variant="noSearchResult"
              title="No dishes found"
              subtitle={query ? `No menu items match “${query}”.` : 'This menu is currently empty.'}
              ctaText={query ? 'Clear search' : undefined}
              onCtaPress={query ? () => setQuery('') : undefined}
            />
          </View>
        )}

        {/* Coupon unlock banner — shown when cart has items */}
        {itemCount > 0 && (
          <View style={styles.couponBanner}>
            <View style={styles.couponBadge}>
              <Tag size={12} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.couponTitle}>You have unlocked a discount!</Text>
              <Text style={styles.couponSubtitle}>Apply coupon on cart</Text>
            </View>
          </View>
        )}

        <RecommendedFoodCarousel
          items={recommendedItems}
          favoriteIds={favoriteFoodIds}
          onFavorite={(item) => toggleFoodFavorite(item.id)}
          onFoodPress={(item) => handleAdd(item)}
        />

        <RatingSummary
          average={getAverageRating(reviews, restaurant.rating)}
          total={1200 + reviews.length}
          reviews={reviews}
        />
        <ReviewSection title="Restaurant reviews" reviews={reviews} />

        <ReviewSection
          title="Food reviews"
          reviews={foodReviews}
          emptyTitle="No food reviews yet"
        />

        <SimilarRestaurantCarousel
          restaurants={similarRestaurants}
          onRestaurantPress={(candidate) => router.push(`/restaurant/${candidate.id}`)}
        />
      </Animated.ScrollView>

      <RestaurantHeader
        restaurant={restaurant}
        isFavorite={isFavorite}
        onBack={() => router.back()}
        onFavorite={toggleRestaurantFavorite}
        onShare={shareRestaurant}
      />

      {showStickyTabs ? (
        <View
          style={[
            styles.stickyTabs,
            {
              top: insets.top + TOP_BAR_HEIGHT,
              backgroundColor: colors.background,
              borderColor: colors.border,
            },
          ]}
        >
          <Animated.Text
            numberOfLines={1}
            style={[PP.subtitle, { color: colors.foreground, marginHorizontal: 16 }, stickyTitleStyle]}
          >
            {restaurant.name}
          </Animated.Text>
          <CategoryTabs
            categories={categories}
            activeId={activeCategory}
            onSelect={scrollToCategory}
            backgroundColor={colors.background}
          />
        </View>
      ) : null}

      {/* Floating Menu pill — bottom right, above cart bar */}
      <View style={[styles.floatingMenuWrap, { bottom: itemCount > 0 ? insets.bottom + 68 : insets.bottom + 16 }]}>
        <FloatingMenuButton onPress={() => {
          scrollRef.current?.scrollTo({ y: COVER_HEIGHT + 200, animated: true });
        }} />
      </View>

      {/* Full-width sticky cart bar */}
      <StickyCartBar
        count={itemCount}
        total={totalAmount}
        onPress={() => router.push('/cart')}
        bottom={insets.bottom}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  stateScreen: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 28 },
  coverWrap: { height: COVER_HEIGHT, overflow: 'hidden' },
  cover: { width: '100%', height: COVER_HEIGHT + 60, top: -30 },
  headerLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  headerActions: { flexDirection: 'row' },
  headerButton: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.36)',
  },
  headerButtonGap: { marginLeft: 8 },
  summary: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16 },
  summaryTitle: { marginLeft: 15, marginRight: 8 },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusDot: { width: 7, height: 7, borderRadius: 4 },
  ratingRow: { marginTop: 14 },
  infoPills: { gap: 8, marginTop: 14 },
  infoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 20,
  },
  offerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginTop: 13,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: '#FFF7ED',
  },
  searchWrap: { paddingHorizontal: 16, paddingBottom: 14, gap: 10 },
  filterRow: { paddingTop: 4 },
  filterRowContent: { flexDirection: 'row', gap: 8, paddingHorizontal: 0, paddingRight: 8 },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterDotBox: {
    width: 13,
    height: 13,
    borderRadius: 3,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterDotInner: { width: 6, height: 6, borderRadius: 3 },
  filterLabel: { fontFamily: 'Poppins_400Regular', fontSize: 13 },
  filterEggIcon: { fontSize: 12 },
  // Info badges below info pills
  infoBadgeRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 11, gap: 4 },
  infoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: '#F0FDF4',
  },
  // Updated offer banner
  offerIconWrap: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FFF7ED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Coupon unlock banner
  couponBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    gap: 12,
  },
  couponBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  couponTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 13,
    color: '#1D4ED8',
  },
  couponSubtitle: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 11,
    color: '#6B7280',
    marginTop: 1,
  },
  // Floating Menu pill
  floatingMenuWrap: { position: 'absolute', right: 16, zIndex: 40 },
  floatingMenuBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 22,
    backgroundColor: '#1C1C1E',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 8,
    elevation: 6,
  },
  floatingMenuText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 13,
    color: '#FFFFFF',
  },
  // Sticky full-width cart bar
  stickyCartWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 50,
  },
  stickyCartBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FF6B00',
    gap: 12,
  },
  stickyCartIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stickyCartIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stickyCartCenter: { flex: 1, alignItems: 'center' },
  stickyCartCount: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    color: '#FFFFFF',
  },
  stickyCartRight: { flexDirection: 'row', alignItems: 'center' },
  stickyCartContinue: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 15,
    color: '#FFFFFF',
  },
  stickyCartArrow: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 18,
    color: '#FFFFFF',
    marginTop: -1,
  },
  searchInput: {
    minHeight: 46,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 13,
  },
  searchText: {
    flex: 1,
    marginHorizontal: 9,
    paddingVertical: 0,
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
  },
  tabsWrap: { borderTopWidth: 1, borderBottomWidth: 1 },
  categoryList: { paddingHorizontal: 12, gap: 2 },
  categoryTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 14,
    borderBottomWidth: 2.5,
    borderBottomColor: 'transparent',
  },
  categoryEmoji: { fontSize: 14 },
  stickyTabs: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 20,
    borderBottomWidth: 1,
    paddingTop: 9,
  },
  emptyMenu: { minHeight: 300, alignItems: 'center', justifyContent: 'center' },
  vegBox: {
    width: 14,
    height: 14,
    borderWidth: 1.5,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vegDot: { width: 7, height: 7, borderRadius: 4 },
});