// ─── Home Screen ──────────────────────────────────────────────────────────────
// Phase 4 — Premium Home Screen with dummy data.
// Layout: Header · Search · Categories · Banners · Restaurant sections ·
//         Food recommendations · Bottom Navigation · Floating Cart.

import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Bell, ChevronDown, MapPin, Mic, ShoppingCart } from 'lucide-react-native';

import {
  Avatar,
  BottomNavigation,
  EmptyState,
  FoodCard,
  FoodCardSkeleton,
  NotificationBadge,
  RestaurantCard,
  RestaurantCardSkeleton,
  SearchBar,
  SectionHeader,
  Skeleton,
  type BottomNavItem,
} from '@/components/ui';
import { useColors } from '@/hooks/useColors';
import { PP } from '@/theme/poppins';
import { useCartStore } from '@/store/useCartStore';
import {
  BANNERS,
  CATEGORIES,
  FAST_DELIVERY_RESTAURANTS,
  FEATURED_RESTAURANTS,
  FOOD_ITEMS,
  POPULAR_RESTAURANTS,
  RESTAURANTS,
  TOP_RATED_RESTAURANTS,
  type FoodItem,
  type Restaurant,
} from '@/data/homeData';

const { width: SCREEN_W } = Dimensions.get('window');
const BANNER_W = SCREEN_W - 48;  // slight peek to show next card
const CARD_W = SCREEN_W - 80;    // restaurant card in horizontal scroll
const FOOD_W = SCREEN_W - 48;    // food card in horizontal scroll
const H_GAP = 12;

// ─── Bottom Nav Items ─────────────────────────────────────────────────────────
const NAV_ITEMS: BottomNavItem[] = [
  {
    label: 'Home',
    icon: (active, c) => <Ionicons name={active ? 'home' : 'home-outline'} size={22} color={c} />,
  },
  {
    label: 'Search',
    icon: (active, c) => <Ionicons name={active ? 'search' : 'search-outline'} size={22} color={c} />,
  },
  {
    label: 'Orders',
    icon: (active, c) => <Ionicons name={active ? 'receipt' : 'receipt-outline'} size={22} color={c} />,
    badge: 1,
  },
  {
    label: 'Profile',
    icon: (active, c) => <Ionicons name={active ? 'person' : 'person-outline'} size={22} color={c} />,
  },
];

// ─── Home Header ──────────────────────────────────────────────────────────────
function HomeHeader() {
  const colors = useColors();
  return (
    <View style={[hdrStyles.wrap, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
      {/* Left: location */}
      <View style={hdrStyles.left}>
        <View style={hdrStyles.labelRow}>
          <MapPin size={13} color={colors.primary} strokeWidth={2.5} />
          <Text style={[PP.overline, { color: colors.mutedForeground, marginLeft: 4 }]}>
            Delivering to
          </Text>
        </View>
        <TouchableOpacity style={hdrStyles.addressRow} activeOpacity={0.7}>
          <Text style={[PP.subtitle, { color: colors.foreground }]} numberOfLines={1}>
            123 Baker Street
          </Text>
          <ChevronDown size={16} color={colors.primary} strokeWidth={2.5} />
        </TouchableOpacity>
      </View>

      {/* Right: notification + avatar */}
      <View style={hdrStyles.right}>
        <TouchableOpacity
          style={[hdrStyles.iconBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <NotificationBadge count={3}>
            <Bell size={20} color={colors.foreground} strokeWidth={1.8} />
          </NotificationBadge>
        </TouchableOpacity>
        <Avatar name="Alex Johnson" size="sm" />
      </View>
    </View>
  );
}

const hdrStyles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  left: { flex: 1, gap: 2, marginRight: 12 },
  labelRow: { flexDirection: 'row', alignItems: 'center' },
  addressRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  right: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

// ─── Category Strip ───────────────────────────────────────────────────────────
function CategoryStrip({
  activeId,
  onSelect,
}: {
  activeId: string;
  onSelect: (id: string) => void;
}) {
  const colors = useColors();
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={catStyles.list}
    >
      {CATEGORIES.map((cat) => {
        const active = activeId === cat.id;
        return (
          <TouchableOpacity
            key={cat.id}
            onPress={() => onSelect(cat.id)}
            activeOpacity={0.75}
            style={[
              catStyles.chip,
              {
                backgroundColor: active ? `${colors.primary}18` : colors.card,
                borderColor: active ? colors.primary : colors.border,
                borderWidth: active ? 1.5 : 1,
              },
            ]}
          >
            <Text style={catStyles.emoji}>{cat.emoji}</Text>
            <Text
              style={[
                PP.caption,
                {
                  color: active ? colors.primary : colors.foreground,
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

const catStyles = StyleSheet.create({
  list: { paddingHorizontal: 16, gap: 8, paddingVertical: 6 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  emoji: { fontSize: 16 },
});

// ─── Banner Carousel ──────────────────────────────────────────────────────────
function BannerCarousel() {
  const colors = useColors();
  const scrollRef = useRef<ScrollView>(null);
  const [active, setActive] = useState(0);

  // Auto-advance every 3.2 s. Functional setter avoids stale closure.
  useEffect(() => {
    const id = setInterval(() => {
      setActive((prev) => {
        const next = (prev + 1) % BANNERS.length;
        scrollRef.current?.scrollTo({ x: next * (BANNER_W + H_GAP), animated: true });
        return next;
      });
    }, 3200);
    return () => clearInterval(id);
  }, []);

  const handleScrollEnd = (e: any) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / (BANNER_W + H_GAP));
    setActive(Math.max(0, Math.min(BANNERS.length - 1, idx)));
  };

  return (
    <View style={bannerStyles.section}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={BANNER_W + H_GAP}
        snapToAlignment="start"
        contentContainerStyle={bannerStyles.list}
        onMomentumScrollEnd={handleScrollEnd}
      >
        {BANNERS.map((b) => (
          <TouchableOpacity key={b.id} activeOpacity={0.9} style={{ width: BANNER_W }}>
            <LinearGradient
              colors={b.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={bannerStyles.card}
            >
              {/* Decorative circles */}
              <View style={bannerStyles.circle1} />
              <View style={bannerStyles.circle2} />

              <View style={bannerStyles.row}>
                <Text style={bannerStyles.emoji}>{b.emoji}</Text>
                <View style={bannerStyles.textCol}>
                  <Text style={[PP.h2, { color: '#FFFFFF', lineHeight: 32 }]}>{b.title}</Text>
                  <Text style={[PP.bodySM, { color: 'rgba(255,255,255,0.88)' }]}>
                    {b.subtitle}
                  </Text>
                  <View style={bannerStyles.bottom}>
                    <View style={bannerStyles.codeTag}>
                      <Text style={[PP.caption, { color: '#FFFFFF', fontFamily: 'Poppins_700Bold', letterSpacing: 0.8 }]}>
                        {b.code}
                      </Text>
                    </View>
                    <TouchableOpacity style={bannerStyles.ctaBtn}>
                      <Text style={[PP.buttonSM, { color: '#FFFFFF' }]}>{b.cta} →</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Dot indicator */}
      <View style={bannerStyles.dots}>
        {BANNERS.map((_, i) => (
          <View
            key={i}
            style={[
              bannerStyles.dot,
              {
                width: i === active ? 20 : 6,
                backgroundColor: i === active ? colors.primary : colors.border,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const bannerStyles = StyleSheet.create({
  section: {},
  list: { paddingHorizontal: 16, gap: H_GAP, paddingVertical: 4 },
  card: {
    height: 158,
    borderRadius: 20,
    padding: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  circle1: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.10)',
    top: -50,
    right: -40,
  },
  circle2: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.08)',
    bottom: -30,
    right: 40,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, flex: 1 },
  emoji: { fontSize: 52 },
  textCol: { flex: 1, gap: 2 },
  bottom: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 8 },
  codeTag: {
    backgroundColor: 'rgba(255,255,255,0.22)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ctaBtn: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
    marginTop: 10,
  },
  dot: { height: 6, borderRadius: 3 },
});

// ─── Horizontal Restaurant Scroll ─────────────────────────────────────────────
function HorizontalRestaurantScroll({
  data,
  favorites,
  onFavoriteToggle,
  onRestaurantPress,
}: {
  data: Restaurant[];
  favorites: Set<string>;
  onFavoriteToggle: (id: string) => void;
  onRestaurantPress: (id: string) => void;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16, gap: H_GAP, paddingVertical: 4 }}
      decelerationRate="fast"
      snapToInterval={CARD_W + H_GAP}
      snapToAlignment="start"
    >
      {data.map((r) => (
        <View key={r.id} style={{ width: CARD_W }}>
          <RestaurantCard
            name={r.name}
            cuisine={r.cuisine}
            rating={r.rating}
            deliveryTime={r.deliveryTime}
            deliveryFee={r.deliveryFee}
            distance={r.distance}
            isVeg={r.isVeg}
            imageUri={r.imageUri}
            offerText={r.offerText}
            isNew={r.isNew}
            isFavorite={favorites.has(r.id)}
            onFavoritePress={() => onFavoriteToggle(r.id)}
            onPress={() => onRestaurantPress(r.id)}
          />
        </View>
      ))}
    </ScrollView>
  );
}

// ─── Food Recommendation Scroll ────────────────────────────────────────────────
function FoodRecommendationScroll({ data }: { data: FoodItem[] }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16, gap: H_GAP, paddingVertical: 4 }}
      decelerationRate="fast"
      snapToInterval={FOOD_W + H_GAP}
    >
      {data.map((item) => (
        <View key={item.id} style={{ width: FOOD_W }}>
          <FoodCard
            name={item.name}
            description={item.description}
            price={item.price}
            rating={item.rating}
            restaurantName={item.restaurantName}
            imageUri={item.imageUri}
            isVeg={item.isVeg}
            isPopular={item.isPopular}
            isNew={item.isNew}
            onAddPress={() => {}}
            onPress={() => {}}
          />
        </View>
      ))}
    </ScrollView>
  );
}

// ─── Vertical Restaurant Section ──────────────────────────────────────────────
function VerticalRestaurantList({
  data,
  favorites,
  onFavoriteToggle,
  onRestaurantPress,
}: {
  data: Restaurant[];
  favorites: Set<string>;
  onFavoriteToggle: (id: string) => void;
  onRestaurantPress: (id: string) => void;
}) {
  return (
    <View style={{ gap: 12 }}>
      {data.map((r) => (
        <RestaurantCard
          key={r.id}
          name={r.name}
          cuisine={r.cuisine}
          rating={r.rating}
          deliveryTime={r.deliveryTime}
          deliveryFee={r.deliveryFee}
          distance={r.distance}
          isVeg={r.isVeg}
          imageUri={r.imageUri}
          offerText={r.offerText}
          isNew={r.isNew}
          isFavorite={favorites.has(r.id)}
          onFavoritePress={() => onFavoriteToggle(r.id)}
          onPress={() => onRestaurantPress(r.id)}
        />
      ))}
    </View>
  );
}

// ─── Loading Skeleton ─────────────────────────────────────────────────────────
function HomeSkeletons() {
  const colors = useColors();
  return (
    <View style={{ paddingHorizontal: 16, gap: 20 }}>
      {/* Search */}
      <Skeleton height={52} radius={999} />

      {/* Categories */}
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {[80, 72, 96, 72, 80].map((w, i) => (
          <Skeleton key={i} width={w} height={38} radius={12} />
        ))}
      </View>

      {/* Banner */}
      <Skeleton height={158} radius={20} />

      {/* Section title */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Skeleton width={180} height={20} />
        <Skeleton width={55} height={16} />
      </View>

      {/* Restaurant cards */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -16 }}>
        {[0, 1].map((i) => (
          <View key={i} style={{ width: CARD_W, marginLeft: i === 0 ? 16 : H_GAP }}>
            <RestaurantCardSkeleton />
          </View>
        ))}
      </ScrollView>

      {/* Food section title */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Skeleton width={150} height={20} />
        <Skeleton width={55} height={16} />
      </View>

      {/* Food cards */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -16 }}>
        {[0, 1].map((i) => (
          <View key={i} style={{ width: FOOD_W, marginLeft: i === 0 ? 16 : H_GAP }}>
            <FoodCardSkeleton />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

// ─── Placeholder (non-Home tabs) ──────────────────────────────────────────────
function PlaceholderTab({ iconName, title }: { iconName: string; title: string }) {
  const colors = useColors();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 }}>
      <Ionicons name={iconName as any} size={52} color={colors.border} />
      <Text style={[PP.h3, { color: colors.foreground }]}>{title}</Text>
      <Text style={[PP.body, { color: colors.mutedForeground, textAlign: 'center', maxWidth: 220 }]}>
        Coming in the next phase.
      </Text>
    </View>
  );
}

// ─── Floating Cart Button ─────────────────────────────────────────────────────
function FloatingCartButton({
  count,
  total,
  bottomOffset,
  onPress,
}: {
  count: number;
  total: number;
  bottomOffset: number;
  onPress: () => void;
}) {
  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = count > 0
      ? withSpring(1, { damping: 14, stiffness: 160 })
      : withTiming(0, { duration: 200 });
  }, [count]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  if (count === 0) return null;

  return (
    <Animated.View style={[cartStyles.wrap, { bottom: bottomOffset + 12 }, animStyle]}>
      <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
        <LinearGradient
          colors={['#FF8530', '#FF6B00']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={cartStyles.btn}
        >
          <View style={cartStyles.left}>
            <View style={cartStyles.badge}>
              <Text style={[PP.caption, { color: '#FF6B00', fontFamily: 'Poppins_700Bold' }]}>
                {count}
              </Text>
            </View>
            <Text style={[PP.button, { color: '#FFFFFF' }]}>View Cart</Text>
          </View>
          <View style={cartStyles.right}>
            <ShoppingCart size={18} color="#FFFFFF" strokeWidth={2} />
            <Text style={[PP.bodySM, { color: 'rgba(255,255,255,0.88)', marginLeft: 5 }]}>
              ${total.toFixed(2)}
            </Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

const cartStyles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 16,
    right: 16,
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 8,
  },
  btn: {
    height: 56,
    borderRadius: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  badge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  right: { flexDirection: 'row', alignItems: 'center' },
});

// ─── Main Home Screen ─────────────────────────────────────────────────────────
export function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { itemCount, totalAmount } = useCartStore();

  const paddingTop = Platform.OS === 'web' ? 67 : insets.top;
  const paddingBottom = Platform.OS === 'web' ? 34 : insets.bottom;
  const BOTTOM_NAV_H = 56 + paddingBottom;

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set(['r1', 'r3']));

  // Simulate network load
  useEffect(() => {
    const t = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(t);
  }, []);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // Category filter for "Popular Near You" vertical section
  const filteredPopular =
    activeCategory === 'all'
      ? POPULAR_RESTAURANTS
      : POPULAR_RESTAURANTS.filter((r) => r.category === activeCategory);

  // ── Home Tab Content ────────────────────────────────────────────────────────
  const HomeContent = (
    <View>
      {/* Search bar with mic */}
      <View style={{ paddingHorizontal: 16, paddingTop: 14, paddingBottom: 4 }}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search restaurants, food, dishes..."
          onFilterPress={() => {}}
        />
      </View>

      {/* Voice hint */}
      <TouchableOpacity style={styles.voiceHint} activeOpacity={0.7}>
        <Mic size={15} color={colors.primary} strokeWidth={2} />
        <Text style={[PP.caption, { color: colors.mutedForeground }]}>
          Try "Pizza near me" or "Best burgers"
        </Text>
      </TouchableOpacity>

      {/* Category strip */}
      <CategoryStrip activeId={activeCategory} onSelect={setActiveCategory} />

      {/* Offer Banners */}
      <BannerCarousel />

      {/* ── Featured Restaurants ── */}
      <View style={styles.section}>
        <View style={styles.sectionHead}>
          <SectionHeader
            title="Featured Restaurants"
            subtitle="Handpicked for you"
            onSeeAllPress={() => {}}
          />
        </View>
        <HorizontalRestaurantScroll
          data={FEATURED_RESTAURANTS}
          favorites={favorites}
          onFavoriteToggle={toggleFavorite}
          onRestaurantPress={(id) => router.push(`/restaurant/${id}`)}
        />
      </View>

      {/* ── Quick Picks (food items) ── */}
      <View style={styles.section}>
        <View style={styles.sectionHead}>
          <SectionHeader
            title="Quick Picks 🍽️"
            subtitle="Trending dishes right now"
            onSeeAllPress={() => {}}
          />
        </View>
        <FoodRecommendationScroll data={FOOD_ITEMS.slice(0, 4)} />
      </View>

      {/* ── Popular Near You (vertical, filterable by category) ── */}
      <View style={styles.section}>
        <View style={styles.sectionHead}>
          <SectionHeader
            title="Popular Near You"
            subtitle="Most ordered in your area"
            onSeeAllPress={() => {}}
          />
        </View>
        {filteredPopular.length === 0 ? (
          <View style={styles.sectionHead}>
            <EmptyState
              variant="noSearchResult"
              title="No restaurants found"
              subtitle="Try selecting a different category"
            />
          </View>
        ) : (
          <View style={styles.sectionHead}>
            <VerticalRestaurantList
              data={filteredPopular}
              favorites={favorites}
              onFavoriteToggle={toggleFavorite}
              onRestaurantPress={(id) => router.push(`/restaurant/${id}`)}
            />
          </View>
        )}
      </View>

      {/* ── Fast Delivery ── */}
      <View style={styles.section}>
        <View style={styles.sectionHead}>
          <SectionHeader
            title="Fast Delivery ⚡"
            subtitle="Arrives in 30 min or less"
            onSeeAllPress={() => {}}
          />
        </View>
        <HorizontalRestaurantScroll
          data={FAST_DELIVERY_RESTAURANTS}
          favorites={favorites}
          onFavoriteToggle={toggleFavorite}
          onRestaurantPress={(id) => router.push(`/restaurant/${id}`)}
        />
      </View>

      {/* ── Top Rated ── */}
      <View style={styles.section}>
        <View style={styles.sectionHead}>
          <SectionHeader
            title="Top Rated ⭐"
            subtitle="Highly reviewed by the community"
            onSeeAllPress={() => {}}
          />
        </View>
        <HorizontalRestaurantScroll
          data={TOP_RATED_RESTAURANTS}
          favorites={favorites}
          onFavoriteToggle={toggleFavorite}
          onRestaurantPress={(id) => router.push(`/restaurant/${id}`)}
        />
      </View>

      {/* ── Recommended ── */}
      <View style={styles.section}>
        <View style={styles.sectionHead}>
          <SectionHeader
            title="Recommended For You"
            subtitle="Based on your preferences"
            onSeeAllPress={() => {}}
          />
        </View>
        <FoodRecommendationScroll data={FOOD_ITEMS.slice(2)} />
      </View>
    </View>
  );

  // ── Tab Router ──────────────────────────────────────────────────────────────
  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: BOTTOM_NAV_H + 76 }}
          >
            {isLoading ? <HomeSkeletons /> : HomeContent}
          </ScrollView>
        );
      case 1:
        return <PlaceholderTab iconName="search-outline" title="Search" />;
      case 2:
        return <PlaceholderTab iconName="receipt-outline" title="Orders" />;
      case 3:
        return <PlaceholderTab iconName="person-outline" title="Profile" />;
      default:
        return null;
    }
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      {/* Fixed header + safe area top */}
      <View style={{ paddingTop }}>
        <HomeHeader />
      </View>

      {/* Main content area */}
      <View style={{ flex: 1 }}>
        {renderTabContent()}
      </View>

      {/* Floating cart — visible only on home tab when cart non-empty */}
      {activeTab === 0 && (
        <FloatingCartButton
          count={itemCount}
          total={totalAmount}
          bottomOffset={BOTTOM_NAV_H}
          onPress={() => router.push('/cart')}
        />
      )}

      {/* Bottom navigation — sits at bottom naturally as flex child */}
      <BottomNavigation
        items={NAV_ITEMS}
        activeIndex={activeTab}
        onPress={setActiveTab}
      />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  screen: { flex: 1 },
  voiceHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 20,
    paddingBottom: 4,
  },
  section: { marginTop: 24 },
  sectionHead: { paddingHorizontal: 16 },
});
