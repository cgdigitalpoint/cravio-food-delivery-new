// ─── Restaurant Details Screen — Phase 5 ─────────────────────────────────────
// Cover image · restaurant info · sticky category tabs · food items · floating cart.

import React, { useCallback, useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
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
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  ChevronDown,
  Clock,
  Heart,
  Info,
  MapPin,
  Share2,
  ShoppingCart,
  Star,
  Truck,
  Users,
  Zap,
} from 'lucide-react-native';

import { useColors } from '@/hooks/useColors';
import { PP } from '@/theme/poppins';
import { useCartStore } from '@/store/useCartStore';
import { RESTAURANTS } from '@/data/homeData';
import {
  getMenuByCategory,
  getRestaurantCategories,
  type RestaurantMenuItem,
} from '@/data/restaurantData';
import type { MenuItem } from '@/types';

const { width: SCREEN_W } = Dimensions.get('window');
const COVER_H = 260;
const STICKY_H = 52; // height of the sticky tab bar

// ─── Helpers ──────────────────────────────────────────────────────────────────

function VegDot({ isVeg }: { isVeg: boolean }) {
  return (
    <View
      style={[
        vegStyles.box,
        { borderColor: isVeg ? '#16A34A' : '#DC2626' },
      ]}
    >
      <View
        style={[
          vegStyles.dot,
          { backgroundColor: isVeg ? '#16A34A' : '#DC2626' },
        ]}
      />
    </View>
  );
}

const vegStyles = StyleSheet.create({
  box: {
    width: 14,
    height: 14,
    borderWidth: 1.5,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: { width: 7, height: 7, borderRadius: 4 },
});

// ─── Food Item Card ────────────────────────────────────────────────────────────

function FoodItemCard({
  item,
  quantity,
  onAdd,
  onIncrease,
  onDecrease,
}: {
  item: RestaurantMenuItem;
  quantity: number;
  onAdd: () => void;
  onIncrease: () => void;
  onDecrease: () => void;
}) {
  const colors = useColors();
  const scale = useSharedValue(1);

  const handleAdd = () => {
    scale.value = withSpring(0.92, { damping: 10, stiffness: 300 }, () => {
      scale.value = withSpring(1, { damping: 10, stiffness: 300 });
    });
    onAdd();
  };

  const animBtn = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const discountedPrice = item.discount
    ? item.price * (1 - item.discount / 100)
    : null;

  return (
    <View style={[ficStyles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      {/* Badges row */}
      {(item.isBestSeller || item.discount) && (
        <View style={ficStyles.badgeRow}>
          {item.isBestSeller && (
            <View style={[ficStyles.badge, { backgroundColor: '#FFF7ED' }]}>
              <Text style={[PP.caption, { color: '#FF6B00', fontFamily: 'Poppins_600SemiBold', fontSize: 10 }]}>
                🏆 Best Seller
              </Text>
            </View>
          )}
          {item.discount ? (
            <View style={[ficStyles.badge, { backgroundColor: '#F0FDF4' }]}>
              <Text style={[PP.caption, { color: '#16A34A', fontFamily: 'Poppins_600SemiBold', fontSize: 10 }]}>
                {item.discount}% OFF
              </Text>
            </View>
          ) : null}
        </View>
      )}

      <View style={ficStyles.row}>
        {/* Text side */}
        <View style={ficStyles.info}>
          <View style={ficStyles.nameRow}>
            <VegDot isVeg={item.isVeg} />
            <Text style={[PP.label, { color: colors.foreground, flex: 1, marginLeft: 6 }]} numberOfLines={2}>
              {item.name}
            </Text>
          </View>

          {item.isCustomizable && (
            <Text style={[PP.caption, { color: colors.mutedForeground, marginTop: 2, fontSize: 10 }]}>
              Customizable
            </Text>
          )}

          <Text style={[PP.bodySM, { color: colors.mutedForeground, marginTop: 4 }]} numberOfLines={2}>
            {item.description}
          </Text>

          <View style={ficStyles.metaRow}>
            <Star size={11} color="#F59E0B" fill="#F59E0B" />
            <Text style={[PP.caption, { color: colors.mutedForeground, marginLeft: 3 }]}>
              {item.rating.toFixed(1)}
            </Text>
            {item.calories ? (
              <>
                <Text style={[PP.caption, { color: colors.border, marginHorizontal: 6 }]}>·</Text>
                <Text style={[PP.caption, { color: colors.mutedForeground }]}>{item.calories} cal</Text>
              </>
            ) : null}
          </View>

          <View style={ficStyles.priceRow}>
            {discountedPrice ? (
              <>
                <Text style={[PP.subtitle, { color: colors.primary, fontFamily: 'Poppins_700Bold' }]}>
                  ${discountedPrice.toFixed(2)}
                </Text>
                <Text style={[PP.caption, { color: colors.mutedForeground, textDecorationLine: 'line-through', marginLeft: 6 }]}>
                  ${item.price.toFixed(2)}
                </Text>
              </>
            ) : (
              <Text style={[PP.subtitle, { color: colors.foreground, fontFamily: 'Poppins_700Bold' }]}>
                ${item.price.toFixed(2)}
              </Text>
            )}
          </View>
        </View>

        {/* Image + add button */}
        <View style={ficStyles.imgWrap}>
          <Image
            source={{ uri: item.imageUrl }}
            style={ficStyles.img}
            resizeMode="cover"
          />
          {quantity === 0 ? (
            <Animated.View style={[ficStyles.addBtn, animBtn]}>
              <TouchableOpacity
                onPress={handleAdd}
                activeOpacity={0.8}
                style={[ficStyles.addBtnInner, { backgroundColor: colors.primary }]}
              >
                <Text style={[PP.buttonSM, { color: '#fff' }]}>ADD</Text>
              </TouchableOpacity>
            </Animated.View>
          ) : (
            <View style={[ficStyles.qtyRow, { backgroundColor: colors.primary }]}>
              <TouchableOpacity onPress={onDecrease} style={ficStyles.qtyBtn}>
                <Text style={[PP.button, { color: '#fff', lineHeight: 20 }]}>−</Text>
              </TouchableOpacity>
              <Text style={[PP.label, { color: '#fff', minWidth: 18, textAlign: 'center' }]}>
                {quantity}
              </Text>
              <TouchableOpacity onPress={onIncrease} style={ficStyles.qtyBtn}>
                <Text style={[PP.button, { color: '#fff', lineHeight: 20 }]}>+</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const ficStyles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  badgeRow: { flexDirection: 'row', gap: 6, marginBottom: 8 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  row: { flexDirection: 'row', gap: 12 },
  info: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'flex-start' },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  priceRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  imgWrap: { width: 100, alignItems: 'center' },
  img: { width: 100, height: 100, borderRadius: 12 },
  addBtn: { marginTop: 8 },
  addBtnInner: {
    paddingHorizontal: 20,
    paddingVertical: 7,
    borderRadius: 10,
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 8,
    overflow: 'hidden',
  },
  qtyBtn: { paddingHorizontal: 10, paddingVertical: 6 },
});

// ─── Category Tab Strip ────────────────────────────────────────────────────────

function CategoryTabs({
  categories,
  activeId,
  onSelect,
  background,
}: {
  categories: { id: string; name: string; emoji: string }[];
  activeId: string;
  onSelect: (id: string) => void;
  background: string;
}) {
  const colors = useColors();
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{ backgroundColor: background }}
      contentContainerStyle={tabStyles.list}
    >
      {categories.map((cat) => {
        const active = cat.id === activeId;
        return (
          <TouchableOpacity
            key={cat.id}
            onPress={() => onSelect(cat.id)}
            activeOpacity={0.7}
            style={[
              tabStyles.tab,
              active && { borderBottomColor: colors.primary, borderBottomWidth: 2.5 },
            ]}
          >
            <Text style={tabStyles.emoji}>{cat.emoji}</Text>
            <Text
              style={[
                PP.bodySM,
                {
                  color: active ? colors.primary : colors.mutedForeground,
                  fontFamily: active ? 'Poppins_600SemiBold' : 'Poppins_400Regular',
                },
              ]}
            >
              {cat.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const tabStyles = StyleSheet.create({
  list: { paddingHorizontal: 16, gap: 4 },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 14,
    borderBottomWidth: 2.5,
    borderBottomColor: 'transparent',
  },
  emoji: { fontSize: 14 },
});

// ─── Floating Cart Bar ────────────────────────────────────────────────────────

function FloatingCartBar({
  itemCount,
  total,
  onPress,
  bottomOffset,
}: {
  itemCount: number;
  total: number;
  onPress: () => void;
  bottomOffset: number;
}) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  React.useEffect(() => {
    if (itemCount > 0) {
      scale.value = withSpring(1, { damping: 14, stiffness: 180 });
      opacity.value = withTiming(1, { duration: 200 });
    } else {
      scale.value = withSpring(0, { damping: 14, stiffness: 180 });
      opacity.value = withTiming(0, { duration: 150 });
    }
  }, [itemCount]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[fcbStyles.wrap, animStyle, { bottom: bottomOffset + 16 }]}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={fcbStyles.btn}>
        <LinearGradient
          colors={['#FF8C38', '#FF6B00']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={fcbStyles.gradient}
        >
          <View style={fcbStyles.countBubble}>
            <Text style={[PP.buttonSM, { color: '#FF6B00', fontSize: 12 }]}>{itemCount}</Text>
          </View>
          <Text style={[PP.button, { color: '#fff' }]}>View Cart</Text>
          <Text style={[PP.button, { color: '#fff', opacity: 0.85 }]}>${total.toFixed(2)}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

const fcbStyles = StyleSheet.create({
  wrap: { position: 'absolute', left: 20, right: 20, zIndex: 100 },
  btn: { borderRadius: 16, overflow: 'hidden', shadowColor: '#FF6B00', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.45, shadowRadius: 12, elevation: 8 },
  gradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16 },
  countBubble: { backgroundColor: '#fff', borderRadius: 10, minWidth: 28, height: 28, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6 },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────

export function RestaurantDetailsScreen({ restaurantId }: { restaurantId: string }) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // Data
  const restaurant = RESTAURANTS.find((r) => r.id === restaurantId);
  const categories = getRestaurantCategories(restaurantId);
  const sections = getMenuByCategory(restaurantId);

  // State
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id ?? 'popular');
  const [isFavorite, setIsFavorite] = useState(restaurant?.isFavorite ?? false);
  const [tabBarY, setTabBarY] = useState(COVER_H + 200); // rough default
  const [showStickyTabs, setShowStickyTabs] = useState(false);
  const sectionOffsets = useRef<Record<string, number>>({});
  const scrollRef = useRef<ScrollView>(null);
  const scrollY = useSharedValue(0);

  // Cart
  const { items: cartItems, itemCount, totalAmount, restaurantId: cartRestaurantId, addItem, removeItem, updateQuantity, clearCart, restaurantName } = useCartStore();

  // Per-menu-item quantity derived from cart
  const itemQuantities: Record<string, number> = {};
  const cartItemById: Record<string, { cartId: string; qty: number }> = {};
  for (const ci of cartItems) {
    const mid = ci.menuItem.id;
    itemQuantities[mid] = (itemQuantities[mid] ?? 0) + ci.quantity;
    cartItemById[mid] = { cartId: ci.id, qty: ci.quantity };
  }

  // Add / increase / decrease handlers
  const handleAdd = useCallback((item: RestaurantMenuItem) => {
    if (cartRestaurantId && cartRestaurantId !== restaurantId) {
      Alert.alert(
        'Start new cart?',
        `Your cart has items from ${restaurantName ?? 'another restaurant'}. Start a new cart?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Start New',
            style: 'destructive',
            onPress: () => {
              clearCart();
              addItem(item as unknown as MenuItem, 1);
            },
          },
        ],
      );
      return;
    }
    addItem(item as unknown as MenuItem, 1);
  }, [cartRestaurantId, restaurantId, restaurantName, clearCart, addItem]);

  const handleIncrease = useCallback((item: RestaurantMenuItem) => {
    const entry = cartItemById[item.id];
    if (entry) updateQuantity(entry.cartId, entry.qty + 1);
    else addItem(item as unknown as MenuItem, 1);
  }, [cartItems]);

  const handleDecrease = useCallback((item: RestaurantMenuItem) => {
    const entry = cartItemById[item.id];
    if (!entry) return;
    if (entry.qty <= 1) removeItem(entry.cartId);
    else updateQuantity(entry.cartId, entry.qty - 1);
  }, [cartItems]);

  // Scroll tracking
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const handleScrollMomentum = (y: number) => {
    setShowStickyTabs(y >= tabBarY - insets.top - STICKY_H);
    // Update active category
    const sorted = Object.entries(sectionOffsets.current).sort(([, a], [, b]) => a - b);
    for (let i = sorted.length - 1; i >= 0; i--) {
      if (y + insets.top + STICKY_H + 10 >= sorted[i][1]) {
        setActiveCategory(sorted[i][0]);
        break;
      }
    }
  };

  // Scroll to section when tab tapped
  const scrollToCategory = (catId: string) => {
    setActiveCategory(catId);
    const offset = sectionOffsets.current[catId];
    if (offset !== undefined && scrollRef.current) {
      scrollRef.current.scrollTo({
        y: Math.max(0, offset - insets.top - STICKY_H - 8),
        animated: true,
      });
    }
  };

  // Cover parallax
  const coverStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(scrollY.value, [-COVER_H, 0, COVER_H], [-COVER_H / 2, 0, COVER_H * 0.3]),
      },
    ],
  }));

  // Top bar fade-in on scroll
  const topBarStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [COVER_H - 80, COVER_H - 20], [0, 1]),
  }));

  if (!restaurant) return null;

  const reviewCount = 1200 + parseInt(restaurantId.slice(1)) * 143;

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      {/* ── Animated scroll area ── */}
      <Animated.ScrollView
        ref={scrollRef as any}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        onMomentumScrollEnd={(e) => handleScrollMomentum(e.nativeEvent.contentOffset.y)}
        onScrollEndDrag={(e) => handleScrollMomentum(e.nativeEvent.contentOffset.y)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* ── Cover image ── */}
        <View style={styles.coverWrap}>
          <Animated.Image
            source={{ uri: restaurant.imageUri ?? `https://picsum.photos/seed/${restaurantId}/800/500` }}
            style={[styles.cover, coverStyle]}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['rgba(0,0,0,0.55)', 'transparent', 'rgba(0,0,0,0.3)']}
            style={StyleSheet.absoluteFill}
          />
        </View>

        {/* ── Restaurant info card ── */}
        <View style={[styles.infoCard, { backgroundColor: colors.background }]}>
          {/* Restaurant name + open status */}
          <View style={styles.nameRow}>
            <View style={{ flex: 1 }}>
              <View style={styles.nameTagRow}>
                <VegDot isVeg={restaurant.isVeg ?? false} />
                <Text
                  style={[PP.h3, { color: colors.foreground, marginLeft: 8, flex: 1 }]}
                  numberOfLines={2}
                >
                  {restaurant.name}
                </Text>
              </View>
              <Text style={[PP.bodySM, { color: colors.mutedForeground, marginTop: 2 }]}>
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

          {/* Rating + reviews */}
          <View style={styles.ratingRow}>
            <Star size={16} color="#F59E0B" fill="#F59E0B" />
            <Text style={[PP.label, { color: colors.foreground, marginLeft: 4 }]}>
              {restaurant.rating.toFixed(1)}
            </Text>
            <Text style={[PP.bodySM, { color: colors.mutedForeground, marginLeft: 4 }]}>
              ({reviewCount.toLocaleString()} reviews)
            </Text>
          </View>

          {/* Info pills */}
          <View style={styles.pillRow}>
            <View style={[styles.pill, { backgroundColor: colors.surfaceVariant }]}>
              <Clock size={13} color={colors.primary} />
              <Text style={[PP.caption, { color: colors.foreground, marginLeft: 5 }]}>
                {restaurant.deliveryTime} min
              </Text>
            </View>
            <View style={[styles.pill, { backgroundColor: colors.surfaceVariant }]}>
              <MapPin size={13} color={colors.primary} />
              <Text style={[PP.caption, { color: colors.foreground, marginLeft: 5 }]}>
                {restaurant.distance}
              </Text>
            </View>
            <View style={[styles.pill, { backgroundColor: colors.surfaceVariant }]}>
              <Truck size={13} color={colors.primary} />
              <Text style={[PP.caption, { color: colors.foreground, marginLeft: 5 }]}>
                {restaurant.deliveryFee === 0 ? 'Free delivery' : `$${restaurant.deliveryFee} delivery`}
              </Text>
            </View>
          </View>

          {/* Offer banner */}
          {restaurant.offerText && (
            <View style={[styles.offerBanner, { backgroundColor: '#FFF7ED' }]}>
              <Zap size={13} color="#FF6B00" fill="#FF6B00" />
              <Text style={[PP.caption, { color: '#FF6B00', fontFamily: 'Poppins_600SemiBold', marginLeft: 5 }]}>
                {restaurant.offerText} on this order
              </Text>
            </View>
          )}
        </View>

        {/* ── Inline category tabs ── */}
        <View
          style={[styles.tabBarWrap, { backgroundColor: colors.background, borderColor: colors.border }]}
          onLayout={(e) => setTabBarY(e.nativeEvent.layout.y)}
        >
          <CategoryTabs
            categories={categories}
            activeId={activeCategory}
            onSelect={scrollToCategory}
            background={colors.background}
          />
        </View>

        {/* ── Menu sections ── */}
        {sections.map(({ category, items }) => (
          <View
            key={category.id}
            onLayout={(e) => {
              sectionOffsets.current[category.id] = e.nativeEvent.layout.y;
            }}
          >
            <View style={[styles.sectionHead, { borderColor: colors.border }]}>
              <Text style={[PP.title, { color: colors.foreground }]}>
                {category.emoji} {category.name}
              </Text>
              <Text style={[PP.caption, { color: colors.mutedForeground }]}>
                {items.length} items
              </Text>
            </View>
            {items.map((item) => (
              <FoodItemCard
                key={item.id}
                item={item}
                quantity={itemQuantities[item.id] ?? 0}
                onAdd={() => handleAdd(item)}
                onIncrease={() => handleIncrease(item)}
                onDecrease={() => handleDecrease(item)}
              />
            ))}
          </View>
        ))}
      </Animated.ScrollView>

      {/* ── Fixed top bar (appears on scroll) ── */}
      <View
        style={[
          styles.topBar,
          { paddingTop: insets.top + 8, backgroundColor: colors.background },
        ]}
        pointerEvents="box-none"
      >
        {/* Back button (always visible) */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.topIconBtn, { backgroundColor: 'rgba(0,0,0,0.35)' }]}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <ArrowLeft size={20} color="#fff" strokeWidth={2.5} />
        </TouchableOpacity>

        {/* Animated title — only shown when scrolled */}
        <Animated.Text
          style={[PP.subtitle, { color: colors.foreground, flex: 1, textAlign: 'center' }, topBarStyle]}
          numberOfLines={1}
        >
          {restaurant.name}
        </Animated.Text>

        {/* Right actions */}
        <View style={styles.topRight}>
          <TouchableOpacity
            style={[styles.topIconBtn, { backgroundColor: 'rgba(0,0,0,0.35)' }]}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Share2 size={18} color="#fff" strokeWidth={2} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setIsFavorite((v) => !v)}
            style={[styles.topIconBtn, { backgroundColor: 'rgba(0,0,0,0.35)', marginLeft: 8 }]}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Heart
              size={18}
              color={isFavorite ? '#FF6B00' : '#fff'}
              fill={isFavorite ? '#FF6B00' : 'transparent'}
              strokeWidth={2}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Sticky category tab overlay (shown after scroll) ── */}
      {showStickyTabs && (
        <View
          style={[
            styles.stickyTabsOverlay,
            { top: insets.top + 52, backgroundColor: colors.background, borderColor: colors.border },
          ]}
        >
          <CategoryTabs
            categories={categories}
            activeId={activeCategory}
            onSelect={scrollToCategory}
            background={colors.background}
          />
        </View>
      )}

      {/* ── Floating cart bar ── */}
      {itemCount > 0 && (
        <FloatingCartBar
          itemCount={itemCount}
          total={totalAmount}
          onPress={() => router.push('/cart')}
          bottomOffset={insets.bottom}
        />
      )}
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  screen: { flex: 1 },
  coverWrap: { height: COVER_H, overflow: 'hidden' },
  cover: { width: SCREEN_W, height: COVER_H + 60, top: -30 },

  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 10,
    zIndex: 50,
  },
  topIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topRight: { flexDirection: 'row', alignItems: 'center' },

  infoCard: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  nameRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 8 },
  nameTagRow: { flexDirection: 'row', alignItems: 'center' },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 5,
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  statusDot: { width: 7, height: 7, borderRadius: 4 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  pillRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginBottom: 12 },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  offerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },

  tabBarWrap: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  stickyTabsOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 40,
    borderBottomWidth: 1,
  },

  sectionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
});
