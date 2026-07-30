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
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Bell, Check, ChevronDown, Clock3, Leaf, MapPin, ShoppingBasket, ShoppingCart } from 'lucide-react-native';

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
import { useAuthStore } from '@/store/useAuthStore';
import { useFavoriteStore } from '@/store/useFavoriteStore';
import { useAddressStore } from '@/store/useAddressStore';
import { useNotificationStore } from '@/store/useNotificationStore';
import { Alert } from 'react-native';
import { getMenuItems, type RestaurantMenuItem } from '@/data/restaurantData';
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
const CARD_W = SCREEN_W * 0.44;    // approx 2.2 cards on screen
const FOOD_W = SCREEN_W * 0.44;    // horizontal scroll food cards
const H_GAP = 12;
const FOOD_LAUNCH_LABEL = 'Launching 13 September 2026';
const GROCERY_LAUNCH_DATE = new Date(2027, 0, 1);

// ─── Bottom Nav Items (static — badge injected dynamically in component) ──────
const BASE_NAV_ITEMS: BottomNavItem[] = [
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
  },
  {
    label: 'Profile',
    icon: (active, c) => <Ionicons name={active ? 'person' : 'person-outline'} size={22} color={c} />,
  },
];

// ─── Home Header ──────────────────────────────────────────────────────────────
function HomeHeader({ onNotificationsPress }: { onNotificationsPress?: () => void }) {
  const colors = useColors();
  const { user } = useAuthStore();
  const { getDefault } = useAddressStore();
  const { unreadCount } = useNotificationStore();

  const defaultAddr = getDefault();
  const locationLabel = defaultAddr
    ? `${defaultAddr.house}, ${defaultAddr.city}`
    : 'Set delivery location';
  const displayName = user?.name ?? 'Cravio User';

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
            {locationLabel}
          </Text>
          <ChevronDown size={16} color={colors.primary} strokeWidth={2.5} />
        </TouchableOpacity>
      </View>

      {/* Right: notification + avatar */}
      <View style={hdrStyles.right}>
        <TouchableOpacity
          onPress={onNotificationsPress}
          style={[hdrStyles.iconBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <NotificationBadge count={unreadCount}>
            <Bell size={20} color={colors.foreground} strokeWidth={1.8} />
          </NotificationBadge>
        </TouchableOpacity>
        <Avatar name={displayName} size="sm" />
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

// ─── Category Strip — Zomato-style stacked layout ─────────────────────────────
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
            style={catStyles.item}
          >
            {/* Emoji circle */}
            <View
              style={[
                catStyles.emojiCircle,
                {
                  backgroundColor: active ? `${cat.color}22` : colors.surfaceVariant,
                  borderColor: active ? cat.color : 'transparent',
                  borderWidth: active ? 2 : 0,
                },
              ]}
            >
              <Text style={catStyles.emoji}>{cat.emoji}</Text>
            </View>

            {/* Category name */}
            <Text
              style={[
                catStyles.catLabel,
                {
                  color: active ? cat.color : colors.foreground,
                  fontFamily: active ? 'Poppins_600SemiBold' : 'Poppins_400Regular',
                },
              ]}
              numberOfLines={1}
            >
              {cat.name}
            </Text>

            {/* Active underline */}
            {active && (
              <View style={[catStyles.underline, { backgroundColor: cat.color }]} />
            )}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const catStyles = StyleSheet.create({
  list: { paddingHorizontal: 12, gap: 2, paddingVertical: 10, alignItems: 'flex-start' },
  item: {
    alignItems: 'center',
    paddingHorizontal: 6,
    minWidth: 64,
    gap: 5,
  },
  emojiCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: { fontSize: 24 },
  catLabel: {
    fontSize: 11,
    textAlign: 'center',
    maxWidth: 64,
  },
  underline: {
    height: 2.5,
    width: 24,
    borderRadius: 2,
    marginTop: 1,
  },
});

// ─── Filter Chips Row — Zomato-style ──────────────────────────────────────────
function FilterChipsRow({
  nearFast,
  under200,
  onNearFast,
  onUnder200,
}: {
  nearFast: boolean;
  under200: boolean;
  onNearFast: () => void;
  onUnder200: () => void;
}) {
  const colors = useColors();
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={chipRowStyles.list}
    >
      {/* Filters */}
      <TouchableOpacity
        activeOpacity={0.75}
        style={[chipRowStyles.chip, { backgroundColor: colors.card, borderColor: colors.border }]}
      >
        <Ionicons name="options-outline" size={13} color={colors.mutedForeground} />
        <Text style={[PP.caption, { color: colors.foreground, fontFamily: 'Poppins_500Medium' }]}>
          Filters
        </Text>
        <Ionicons name="chevron-down" size={12} color={colors.mutedForeground} />
      </TouchableOpacity>

      {/* Near & Fast */}
      <TouchableOpacity
        onPress={onNearFast}
        activeOpacity={0.75}
        style={[
          chipRowStyles.chip,
          nearFast
            ? { backgroundColor: '#EFF9FF', borderColor: '#0EA5E9', borderWidth: 1.5 }
            : { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <Ionicons name="flash" size={13} color={nearFast ? '#0EA5E9' : '#22C55E'} />
        <Text
          style={[
            PP.caption,
            {
              color: nearFast ? '#0EA5E9' : colors.foreground,
              fontFamily: nearFast ? 'Poppins_600SemiBold' : 'Poppins_400Regular',
            },
          ]}
        >
          Near & Fast
        </Text>
      </TouchableOpacity>

      {/* Under ₹200 */}
      <TouchableOpacity
        onPress={onUnder200}
        activeOpacity={0.75}
        style={[
          chipRowStyles.chip,
          under200
            ? { backgroundColor: '#FFF7ED', borderColor: '#FF6B00', borderWidth: 1.5 }
            : { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <Text
          style={[
            PP.caption,
            {
              color: under200 ? '#FF6B00' : colors.foreground,
              fontFamily: under200 ? 'Poppins_600SemiBold' : 'Poppins_400Regular',
            },
          ]}
        >
          Under ₹200
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const chipRowStyles = StyleSheet.create({
  list: { paddingHorizontal: 16, gap: 8, paddingVertical: 4 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
});

// ─── Service switch ────────────────────────────────────────────────────────────
type ServiceMode = 'food' | 'grocery';

function ServiceSwitcher({
  mode,
  onChange,
  vegOnly,
  onVegOnlyChange,
}: {
  mode: ServiceMode;
  onChange: (mode: ServiceMode) => void;
  vegOnly: boolean;
  onVegOnlyChange: (enabled: boolean) => void;
}) {
  const colors = useColors();

  return (
    <View style={serviceStyles.wrap}>
      <View style={[serviceStyles.segmented, { backgroundColor: colors.muted, borderColor: colors.border }]}>
        <TouchableOpacity
          testID="food-delivery-toggle"
          activeOpacity={0.8}
          onPress={() => onChange('food')}
          style={[
            serviceStyles.segment,
            mode === 'food' && { backgroundColor: colors.card, shadowColor: colors.primary },
          ]}
        >
          <Leaf size={16} color={mode === 'food' ? colors.primary : colors.mutedForeground} strokeWidth={2.2} />
          <View style={serviceStyles.segmentText}>
            <Text style={[PP.buttonSM, { color: mode === 'food' ? colors.foreground : colors.mutedForeground }]}>
              Food Delivery
            </Text>
            <Text style={[PP.overline, { color: mode === 'food' ? colors.success : colors.mutedForeground }]}>
              {FOOD_LAUNCH_LABEL}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          testID="grocery-toggle"
          activeOpacity={0.8}
          onPress={() => onChange('grocery')}
          style={[
            serviceStyles.segment,
            mode === 'grocery' && { backgroundColor: colors.card, shadowColor: colors.success },
          ]}
        >
          <ShoppingBasket size={16} color={mode === 'grocery' ? colors.success : colors.mutedForeground} strokeWidth={2.2} />
          <View style={serviceStyles.segmentText}>
            <Text style={[PP.buttonSM, { color: mode === 'grocery' ? colors.foreground : colors.mutedForeground }]}>
              Grocery
            </Text>
            <Text style={[PP.overline, { color: mode === 'grocery' ? colors.success : colors.mutedForeground }]}>
              Launching 1 Jan 2027
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {mode === 'food' && (
        <TouchableOpacity
          testID="veg-only-toggle"
          activeOpacity={0.8}
          onPress={() => onVegOnlyChange(!vegOnly)}
          style={[
            serviceStyles.vegButton,
            {
              backgroundColor: vegOnly ? `${colors.success}18` : colors.card,
              borderColor: vegOnly ? colors.success : colors.border,
            },
          ]}
        >
          <View style={[serviceStyles.vegIcon, { backgroundColor: vegOnly ? colors.success : colors.muted }]}>
            {vegOnly ? (
              <Check size={13} color="#FFFFFF" strokeWidth={3} />
            ) : (
              <Leaf size={13} color={colors.mutedForeground} strokeWidth={2.3} />
            )}
          </View>
          <Text style={[PP.caption, { color: vegOnly ? colors.success : colors.foreground, fontFamily: 'Poppins_600SemiBold' }]}>
            Veg Only
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const serviceStyles = StyleSheet.create({
  wrap: { paddingHorizontal: 16, paddingTop: 12, gap: 10 },
  segmented: {
    flexDirection: 'row',
    borderRadius: 16,
    borderWidth: 1,
    padding: 3,
    gap: 3,
  },
  segment: {
    flex: 1,
    minHeight: 52,
    borderRadius: 13,
    paddingHorizontal: 9,
    paddingVertical: 7,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 2,
  },
  segmentText: { flex: 1 },
  vegButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  vegIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

function getCountdown(target: Date) {
  const totalSeconds = Math.max(0, Math.floor((target.getTime() - Date.now()) / 1000));
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

function GroceryCountdown() {
  const colors = useColors();
  const [remaining, setRemaining] = useState(() => getCountdown(GROCERY_LAUNCH_DATE));

  useEffect(() => {
    const timer = setInterval(() => setRemaining(getCountdown(GROCERY_LAUNCH_DATE)), 1000);
    return () => clearInterval(timer);
  }, []);

  const units = [
    ['Days', remaining.days],
    ['Hours', remaining.hours],
    ['Minutes', remaining.minutes],
    ['Seconds', remaining.seconds],
  ] as const;

  return (
    <View style={groceryStyles.timerRow}>
      {units.map(([label, value]) => (
        <View key={label} style={[groceryStyles.timerUnit, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[PP.h2, { color: colors.foreground }]}>{String(value).padStart(2, '0')}</Text>
          <Text style={[PP.overline, { color: colors.mutedForeground }]}>{label}</Text>
        </View>
      ))}
    </View>
  );
}

function GroceryComingSoonScreen({
  isNotified,
  onNotify,
}: {
  isNotified: boolean;
  onNotify: () => void;
}) {
  const colors = useColors();

  return (
    <View style={groceryStyles.content}>
      <LinearGradient
        colors={[`${colors.success}20`, `${colors.success}08`]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[groceryStyles.hero, { borderColor: `${colors.success}35` }]}
      >
        <View style={[groceryStyles.heroIcon, { backgroundColor: `${colors.success}20` }]}>
          <ShoppingBasket size={34} color={colors.success} strokeWidth={1.8} />
        </View>
        <Text style={[PP.h1, { color: colors.foreground, textAlign: 'center', marginTop: 16 }]}>
          Grocery is coming soon
        </Text>
        <Text style={[PP.body, { color: colors.mutedForeground, textAlign: 'center', marginTop: 8, maxWidth: 300 }]}>
          Fresh groceries and everyday essentials, delivered to your door by Cravio.
        </Text>
        <View style={groceryStyles.launchRow}>
          <Clock3 size={15} color={colors.success} strokeWidth={2.2} />
          <Text style={[PP.buttonSM, { color: colors.success }]}>Launching 1 January 2027</Text>
        </View>
        <GroceryCountdown />
        <TouchableOpacity
          testID="grocery-notify-me"
          activeOpacity={0.85}
          onPress={onNotify}
          style={[
            groceryStyles.notifyButton,
            { backgroundColor: isNotified ? colors.card : colors.success, borderColor: colors.success },
          ]}
        >
          {isNotified && <Check size={17} color={colors.success} strokeWidth={2.5} />}
          <Text style={[PP.button, { color: isNotified ? colors.success : '#FFFFFF' }]}>
            {isNotified ? 'You’re on the list' : 'Notify Me'}
          </Text>
        </TouchableOpacity>
      </LinearGradient>
      <Text style={[PP.caption, { color: colors.mutedForeground, textAlign: 'center', marginTop: 18 }]}>
        We’ll remind you when grocery delivery goes live.
      </Text>
    </View>
  );
}

const groceryStyles = StyleSheet.create({
  content: { paddingHorizontal: 16, paddingTop: 28, paddingBottom: 48 },
  hero: {
    alignItems: 'center',
    borderRadius: 24,
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 28,
    overflow: 'hidden',
  },
  heroIcon: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  launchRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 18 },
  timerRow: { flexDirection: 'row', gap: 7, marginTop: 20, width: '100%' },
  timerUnit: {
    flex: 1,
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 9,
  },
  notifyButton: {
    minHeight: 50,
    minWidth: 170,
    borderRadius: 15,
    borderWidth: 1,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    marginTop: 22,
  },
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
function FoodRecommendationScroll({
  data,
  onAdd,
  onPress,
}: {
  data: FoodItem[];
  onAdd: (item: FoodItem) => void;
  onPress: (item: FoodItem) => void;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16, gap: H_GAP, paddingTop: 4, paddingBottom: 24 }}
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
            onAddPress={() => onAdd(item)}
            onPress={() => onPress(item)}
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
    <View style={{ gap: 16 }}>
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
              ₹{Math.round(total)}
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
  const {
    itemCount,
    totalAmount,
    restaurantId: cartRestaurantId,
    restaurantName: cartRestaurantName,
    addItem,
    clearCart,
  } = useCartStore();
  const { supabaseUserId } = useAuthStore();
  const {
    favoriteIds: storedFavoriteIds,
    fetchFavorites,
    toggleFavorite: toggleStoredFavorite,
  } = useFavoriteStore();

  const paddingTop = Platform.OS === 'web' ? 67 : insets.top;
  const paddingBottom = Platform.OS === 'web' ? 34 : insets.bottom;
  const BOTTOM_NAV_H = 56 + paddingBottom;

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeTab, setActiveTab] = useState(0);
  const [serviceMode, setServiceMode] = useState<ServiceMode>('food');
  const [vegOnly, setVegOnly] = useState(false);
  const [nearFast, setNearFast] = useState(false);
  const [under200, setUnder200] = useState(false);
  const [groceryNotified, setGroceryNotified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const favorites = storedFavoriteIds;

  // Simulate network load
  useEffect(() => {
    const t = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (supabaseUserId) fetchFavorites(supabaseUserId);
  }, [supabaseUserId]);

  const toggleFavorite = async (id: string) => {
    if (!supabaseUserId) {
      Alert.alert('Sign in to save favorites', 'Your saved restaurants sync across devices when you sign in.');
      return;
    }
    try {
      await toggleStoredFavorite(supabaseUserId, id);
    } catch {
      Alert.alert('Could not update favorite', 'Please try again.');
    }
  };

  const getFoodRestaurant = (food: FoodItem) =>
    RESTAURANTS.find((restaurant) => restaurant.name === food.restaurantName);

  const getCartMenuItem = (food: FoodItem): RestaurantMenuItem | null => {
    const restaurant = getFoodRestaurant(food);
    if (!restaurant) return null;
    return (
      getMenuItems(restaurant.id).find((item) => item.name === food.name) ?? {
        id: food.id,
        restaurantId: restaurant.id,
        name: food.name,
        description: food.description,
        price: food.price,
        imageUrl: food.imageUri ?? '',
        category: 'popular',
        tags: [],
        isAvailable: true,
        isPopular: food.isPopular ?? false,
        isVeg: food.isVeg,
        rating: food.rating,
      }
    );
  };

  const addFoodToCart = (food: FoodItem) => {
    const restaurant = getFoodRestaurant(food);
    const menuItem = getCartMenuItem(food);
    if (!restaurant || !menuItem) {
      Alert.alert('Dish unavailable', 'This dish is not available right now.');
      return;
    }
    if (cartRestaurantId && cartRestaurantId !== restaurant.id) {
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
              addItem(menuItem, 1, undefined, restaurant.name);
            },
          },
        ],
      );
      return;
    }
    addItem(menuItem, 1, undefined, restaurant.name);
  };

  const handleGroceryNotify = () => {
    if (groceryNotified) return;
    setGroceryNotified(true);
    Alert.alert('You’re on the list', 'We’ll remind you when Grocery launches on 1 January 2027.');
  };

  // Category filter — when a category is selected, search all restaurants (not just the top-5 slice).
  // Veg Only is intentionally applied after each curated subset so the existing
  // Phase 11C-1 ordering and section composition remain unchanged.
  const matchesRestaurantFilter = (restaurant: Restaurant) =>
    (activeCategory === 'all' || restaurant.category === activeCategory) &&
    (!vegOnly || restaurant.isVeg === true) &&
    (!nearFast || restaurant.deliveryTime <= 25) &&
    (!under200 || restaurant.deliveryFee === 0);

  const filteredPopular =
    activeCategory === 'all'
      ? POPULAR_RESTAURANTS.filter(matchesRestaurantFilter)
      : RESTAURANTS.filter((r) => r.isOpen && matchesRestaurantFilter(r));

  // Also filter horizontal sections by category when one is selected
  const filteredFeatured =
    activeCategory === 'all'
      ? FEATURED_RESTAURANTS.filter(matchesRestaurantFilter)
      : FEATURED_RESTAURANTS.filter(matchesRestaurantFilter);

  const filteredFastDelivery =
    activeCategory === 'all'
      ? FAST_DELIVERY_RESTAURANTS.filter(matchesRestaurantFilter)
      : FAST_DELIVERY_RESTAURANTS.filter(matchesRestaurantFilter);

  const filteredTopRated =
    activeCategory === 'all'
      ? TOP_RATED_RESTAURANTS.filter(matchesRestaurantFilter)
      : TOP_RATED_RESTAURANTS.filter(matchesRestaurantFilter);

  // Smart recommendation: sort all open restaurants by a composite score
  const recommendedRestaurants = React.useMemo(() => {
    const scored = RESTAURANTS.filter((r) => r.isOpen && matchesRestaurantFilter(r)).map((r) => ({
      r,
      score:
        r.rating * 20 +
        (r.offerText ? 15 : 0) +
        (r.isNew ? 10 : 0) +
        Math.max(0, 30 - r.deliveryTime) * 0.5 +
        (r.deliveryFee === 0 ? 8 : 0) +
        (r.isVeg ? 3 : 0),
    }));
    return scored.sort((a, b) => b.score - a.score).map((x) => x.r);
  }, [activeCategory, vegOnly, nearFast, under200]);

  const quickPickFood = FOOD_ITEMS.slice(2).filter((item) => !vegOnly || item.isVeg);

  // ── Home Tab Content ────────────────────────────────────────────────────────
  const HomeContent = (
    <View>
      <ServiceSwitcher
        mode={serviceMode}
        onChange={setServiceMode}
        vegOnly={vegOnly}
        onVegOnlyChange={setVegOnly}
      />

      {/* Search bar with mic */}
      <View style={{ paddingHorizontal: 16, paddingTop: 14, paddingBottom: 4 }}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search restaurants, food, dishes..."
          onSubmitEditing={() =>
            router.push({
              pathname: '/search',
              params: searchQuery.trim() ? { query: searchQuery.trim() } : undefined,
            })
          }
          onFilterPress={() => router.push('/search')}
        />
      </View>

      {/* Category strip */}
      <CategoryStrip activeId={activeCategory} onSelect={setActiveCategory} />

      {/* Filter chips — Filters | Near & Fast | Under ₹200 */}
      <FilterChipsRow
        nearFast={nearFast}
        under200={under200}
        onNearFast={() => setNearFast((prev) => !prev)}
        onUnder200={() => setUnder200((prev) => !prev)}
      />

      {/* Offer Banners */}
      <BannerCarousel />

      {/* ── Featured Restaurants ── */}
      {filteredFeatured.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHead}>
            <SectionHeader
              title="Featured Restaurants"
              subtitle="Handpicked for you"
              onSeeAllPress={() => router.push('/search')}
            />
          </View>
          <HorizontalRestaurantScroll
            data={filteredFeatured}
            favorites={favorites}
            onFavoriteToggle={toggleFavorite}
            onRestaurantPress={(id) => router.push(`/restaurant/${id}`)}
          />
        </View>
      )}


      {/* ── Popular Near You (vertical, filterable by category) ── */}
      <View style={styles.section}>
        <View style={styles.sectionHead}>
          <SectionHeader
            title="Popular Near You"
            subtitle="Most ordered in your area"
            onSeeAllPress={() => router.push('/search')}
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
      {filteredFastDelivery.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHead}>
            <SectionHeader
              title="Fast Delivery ⚡"
              subtitle="Arrives in 30 min or less"
              onSeeAllPress={() => router.push('/search')}
            />
          </View>
          <HorizontalRestaurantScroll
            data={filteredFastDelivery}
            favorites={favorites}
            onFavoriteToggle={toggleFavorite}
            onRestaurantPress={(id) => router.push(`/restaurant/${id}`)}
          />
        </View>
      )}

      {/* ── Top Rated ── */}
      {filteredTopRated.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHead}>
            <SectionHeader
              title="Top Rated ⭐"
              subtitle="Highly reviewed by the community"
              onSeeAllPress={() => router.push('/search')}
            />
          </View>
          <HorizontalRestaurantScroll
            data={filteredTopRated}
            favorites={favorites}
            onFavoriteToggle={toggleFavorite}
            onRestaurantPress={(id) => router.push(`/restaurant/${id}`)}
          />
        </View>
      )}

      {/* ── Recommended (smart-sorted, category-aware) ── */}
      {activeCategory === 'all' && (
        <View style={styles.section}>
          <View style={styles.sectionHead}>
            <SectionHeader
              title="Recommended For You"
              subtitle="Top picks based on rating, speed & offers"
              onSeeAllPress={() => router.push('/search')}
            />
          </View>
          <HorizontalRestaurantScroll
            data={recommendedRestaurants.slice(0, 5)}
            favorites={favorites}
            onFavoriteToggle={toggleFavorite}
            onRestaurantPress={(id) => router.push(`/restaurant/${id}`)}
          />
        </View>
      )}

      {/* ── Quick Picks (food) ── keep visible always ── */}
      {activeCategory === 'all' && (
        <View style={styles.section}>
          <View style={styles.sectionHead}>
            <SectionHeader
              title="Quick Picks 🍽️"
              subtitle="Trending dishes right now"
              onSeeAllPress={() => router.push('/search')}
            />
          </View>
           <FoodRecommendationScroll
             data={quickPickFood}
             onAdd={addFoodToCart}
             onPress={(food) => {
               const restaurant = getFoodRestaurant(food);
               if (restaurant) router.push(`/restaurant/${restaurant.id}`);
             }}
           />
        </View>
      )}
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
            {isLoading ? (
              <View>
                <ServiceSwitcher
                  mode={serviceMode}
                  onChange={setServiceMode}
                  vegOnly={vegOnly}
                  onVegOnlyChange={setVegOnly}
                />
                <HomeSkeletons />
              </View>
            ) : serviceMode === 'grocery' ? (
              <View>
                <ServiceSwitcher
                  mode={serviceMode}
                  onChange={setServiceMode}
                  vegOnly={vegOnly}
                  onVegOnlyChange={setVegOnly}
                />
                <GroceryComingSoonScreen
                  isNotified={groceryNotified}
                  onNotify={handleGroceryNotify}
                />
              </View>
            ) : HomeContent}
          </ScrollView>
        );
      case 1:
        return null; // navigates away — handled in onPress below
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
        <HomeHeader onNotificationsPress={() => router.push('/notifications')} />
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
        items={BASE_NAV_ITEMS}
        activeIndex={activeTab}
        onPress={(index: number) => {
          if (index === 1) { router.push('/search'); return; }
          if (index === 2) { router.push('/orders'); return; }
          if (index === 3) { router.push('/profile'); return; }
          setActiveTab(index);
        }}
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
