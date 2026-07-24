import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Clock3,
  Heart,
  MapPin,
  Search,
  Share2,
  ShoppingCart,
  Star,
  Truck,
  X,
} from 'lucide-react-native';

import {
  EmptyState,
  QuantitySelector,
  Skeleton,
} from '@/components/ui';
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
}: {
  restaurant: (typeof RESTAURANTS)[number];
  isFavorite: boolean;
  onBack: () => void;
  onFavorite: () => void;
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

      {restaurant.offerText ? (
        <View style={styles.offerBanner}>
          <Text style={styles.offerIcon}>%</Text>
          <Text style={[PP.caption, { color: colors.primary, fontFamily: 'Poppins_600SemiBold' }]}>
            {restaurant.offerText} on this order
          </Text>
        </View>
      ) : null}
    </View>
  );
}

function FloatingCartButton({
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
  const colors = useColors();

  if (count === 0) return null;

  return (
    <View style={[styles.cartButtonWrap, { bottom: bottom + 16 }]}>
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel={`View cart with ${count} items`}
        onPress={onPress}
        activeOpacity={0.9}
        style={styles.cartButton}
      >
        <LinearGradient
          colors={['#FF8C38', colors.primary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.cartGradient}
        >
          <View style={styles.cartCount}>
            <Text style={[PP.buttonSM, { color: colors.primary }]}>{count}</Text>
          </View>
          <View className="flex-1" style={styles.cartLabel}>
            <ShoppingCart size={17} color="#FFFFFF" />
            <Text style={[PP.button, { color: '#FFFFFF', marginLeft: 7 }]}>View Cart</Text>
          </View>
          <Text style={[PP.button, { color: '#FFFFFF' }]}>${total.toFixed(2)}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
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
  const [activeCategory, setActiveCategory] = useState('popular');
  const [isFavorite, setIsFavorite] = useState(restaurant?.isFavorite ?? false);
  const [showStickyTabs, setShowStickyTabs] = useState(false);

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
            if (!menuQuery) return true;
            return [item.name, item.description, ...item.tags]
              .join(' ')
              .toLowerCase()
              .includes(menuQuery);
          }),
        }))
        .filter((section) => section.items.length > 0),
    [allSections, menuQuery],
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
                addItem(item as unknown as MenuItem);
              },
            },
          ],
        );
        return;
      }
      addItem(item as unknown as MenuItem);
    },
    [addItem, cartRestaurantId, cartRestaurantName, clearCart, restaurantId],
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

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

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
        onScroll={(event) => {
          scrollHandler(event);
          handleScroll(event.nativeEvent.contentOffset.y);
        }}
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
      </Animated.ScrollView>

      <RestaurantHeader
        restaurant={restaurant}
        isFavorite={isFavorite}
        onBack={() => router.back()}
        onFavorite={() => setIsFavorite((value) => !value)}
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

      <FloatingCartButton
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
  offerIcon: {
    width: 17,
    height: 17,
    borderRadius: 9,
    color: '#FFFFFF',
    backgroundColor: '#FF6B00',
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '700',
    lineHeight: 17,
  },
  searchWrap: { paddingHorizontal: 16, paddingBottom: 14 },
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
  cartButtonWrap: { position: 'absolute', left: 20, right: 20, zIndex: 50 },
  cartButton: {
    overflow: 'hidden',
    borderRadius: 16,
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  cartGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  cartCount: {
    minWidth: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
  },
  cartLabel: { alignItems: 'center', marginLeft: 12 },
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