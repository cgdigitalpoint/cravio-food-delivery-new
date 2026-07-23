// ─── Search Screen ────────────────────────────────────────────────────────────
// Phase 7 — Premium Search & Discovery
// Sections: Header · Suggestions · Idle (Recent + Trending + Popular) · Results

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  EmptyState,
  FoodCard,
  FoodCardSkeleton,
  RestaurantCard,
  RestaurantCardSkeleton,
  SectionHeader,
  Skeleton,
} from '@/components/ui';
import { useColors } from '@/hooks/useColors';
import { PP } from '@/theme/poppins';
import { borderRadius, spacing } from '@/theme';
import {
  CATEGORIES,
  FOOD_ITEMS,
  POPULAR_RESTAURANTS,
  type Category,
  type FoodItem,
  type Restaurant,
} from '@/data/homeData';
import {
  getSuggestions,
  searchAll,
  type SearchSuggestion,
} from '@/services/searchService';

// ─── Constants ────────────────────────────────────────────────────────────────
const STORAGE_KEY = '@cravio/recent-searches';
const MAX_RECENT = 8;
const DEBOUNCE_MS = 300;

const TRENDING: { label: string; emoji: string }[] = [
  { label: 'Biryani', emoji: '🍛' },
  { label: 'Pizza', emoji: '🍕' },
  { label: 'Burger', emoji: '🍔' },
  { label: 'Sushi', emoji: '🍱' },
  { label: 'Coffee', emoji: '☕' },
  { label: 'Desserts', emoji: '🧁' },
  { label: 'Healthy', emoji: '🥗' },
  { label: 'Noodles', emoji: '🍜' },
];

const POPULAR_DISHES = FOOD_ITEMS.filter((f) => f.isPopular);

type SearchPhase = 'idle' | 'suggestions' | 'searching' | 'results' | 'error';
type ResultTab = 'all' | 'restaurants' | 'food' | 'categories';

// ─── Search Header ────────────────────────────────────────────────────────────
interface SearchHeaderProps {
  value: string;
  onChangeText: (t: string) => void;
  onClear: () => void;
  onBack: () => void;
  onSubmit: () => void;
  inputRef: React.RefObject<TextInput | null>;
}

function SearchHeader({
  value,
  onChangeText,
  onClear,
  onBack,
  onSubmit,
  inputRef,
}: SearchHeaderProps) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const paddingTop = Platform.OS === 'web' ? 16 : insets.top + 8;

  return (
    <View
      style={[
        hdrStyles.wrap,
        {
          paddingTop,
          backgroundColor: colors.background,
          borderBottomColor: colors.border,
        },
      ]}
    >
      {/* Back */}
      <TouchableOpacity onPress={onBack} style={hdrStyles.backBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
        <Ionicons name="arrow-back" size={22} color={colors.foreground} />
      </TouchableOpacity>

      {/* Input container */}
      <View
        style={[
          hdrStyles.inputWrap,
          { backgroundColor: colors.surfaceVariant, borderColor: colors.border },
        ]}
      >
        <Ionicons name="search-outline" size={18} color={colors.mutedForeground} />
        <TextInput
          ref={inputRef}
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmit}
          placeholder="Restaurants, food, dishes..."
          placeholderTextColor={colors.mutedForeground}
          returnKeyType="search"
          autoFocus
          autoCorrect={false}
          autoCapitalize="none"
          style={[
            hdrStyles.input,
            PP.body,
            { color: colors.foreground },
          ]}
        />
        {value.length > 0 && (
          <TouchableOpacity onPress={onClear} hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
            <View style={[hdrStyles.clearBtn, { backgroundColor: colors.mutedForeground + '33' }]}>
              <Ionicons name="close" size={12} color={colors.mutedForeground} />
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const hdrStyles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    gap: spacing.md12,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md12,
    height: 44,
    borderRadius: borderRadius.pill,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    padding: 0,
    margin: 0,
  },
  clearBtn: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

// ─── Suggestion Row ───────────────────────────────────────────────────────────
function SuggestionRow({
  item,
  onPress,
}: {
  item: SearchSuggestion;
  onPress: (label: string) => void;
}) {
  const colors = useColors();
  const icon =
    item.type === 'restaurant'
      ? 'storefront-outline'
      : item.type === 'category'
        ? 'grid-outline'
        : 'fast-food-outline';

  return (
    <TouchableOpacity
      onPress={() => onPress(item.label)}
      activeOpacity={0.75}
      style={[suggStyles.row, { borderBottomColor: colors.border }]}
    >
      {item.emoji ? (
        <Text style={suggStyles.emoji}>{item.emoji}</Text>
      ) : (
        <Ionicons name={icon as any} size={16} color={colors.mutedForeground} />
      )}
      <Text style={[PP.body, { color: colors.foreground, flex: 1 }]}>{item.label}</Text>
      <Ionicons name="arrow-back-outline" size={14} color={colors.mutedForeground} />
    </TouchableOpacity>
  );
}

const suggStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  emoji: { fontSize: 16, width: 16, textAlign: 'center' },
});

// ─── Recent Searches ──────────────────────────────────────────────────────────
function RecentSearches({
  items,
  onSelect,
  onRemove,
  onClearAll,
}: {
  items: string[];
  onSelect: (q: string) => void;
  onRemove: (q: string) => void;
  onClearAll: () => void;
}) {
  const colors = useColors();
  if (items.length === 0) return null;

  return (
    <View style={recentStyles.section}>
      <View style={recentStyles.header}>
        <Text style={[PP.subtitle, { color: colors.foreground }]}>Recent</Text>
        <TouchableOpacity onPress={onClearAll}>
          <Text style={[PP.bodySM, { color: colors.primary }]}>Clear all</Text>
        </TouchableOpacity>
      </View>
      {items.map((q) => (
        <TouchableOpacity
          key={q}
          onPress={() => onSelect(q)}
          activeOpacity={0.75}
          style={[recentStyles.row, { borderBottomColor: colors.border }]}
        >
          <Ionicons name="time-outline" size={16} color={colors.mutedForeground} />
          <Text style={[PP.body, { color: colors.foreground, flex: 1 }]} numberOfLines={1}>
            {q}
          </Text>
          <TouchableOpacity
            onPress={() => onRemove(q)}
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          >
            <Ionicons name="close-outline" size={18} color={colors.mutedForeground} />
          </TouchableOpacity>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const recentStyles = StyleSheet.create({
  section: { marginBottom: spacing.xl },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});

// ─── Trending Chip ────────────────────────────────────────────────────────────
function TrendingChip({
  emoji,
  label,
  onPress,
}: {
  emoji: string;
  label: string;
  onPress: (label: string) => void;
}) {
  const colors = useColors();
  return (
    <TouchableOpacity
      onPress={() => onPress(label)}
      activeOpacity={0.8}
      style={[
        trendStyles.chip,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <Text style={trendStyles.emoji}>{emoji}</Text>
      <Text style={[PP.bodySM, { color: colors.foreground }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const trendStyles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.md12,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.pill,
    borderWidth: 1,
  },
  emoji: { fontSize: 15 },
});

// ─── Trending Section ─────────────────────────────────────────────────────────
function TrendingSection({ onSelect }: { onSelect: (label: string) => void }) {
  const colors = useColors();
  return (
    <View style={trendSectionStyles.section}>
      <View style={trendSectionStyles.titleRow}>
        <Ionicons name="flame" size={16} color={colors.primary} />
        <Text style={[PP.subtitle, { color: colors.foreground, marginLeft: 6 }]}>
          Trending
        </Text>
      </View>
      <View style={trendSectionStyles.chips}>
        {TRENDING.map((t) => (
          <TrendingChip key={t.label} emoji={t.emoji} label={t.label} onPress={onSelect} />
        ))}
      </View>
    </View>
  );
}

const trendSectionStyles = StyleSheet.create({
  section: { paddingHorizontal: spacing.md, marginBottom: spacing.xl },
  titleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md12 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
});

// ─── Popular Restaurant Card (compact) ────────────────────────────────────────
function PopularRestaurantChip({
  restaurant,
  onPress,
}: {
  restaurant: Restaurant;
  onPress: () => void;
}) {
  const colors = useColors();
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[
        popRestStyles.card,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <View style={popRestStyles.imgWrap}>
        {restaurant.imageUri ? (
          <Image source={{ uri: restaurant.imageUri }} style={popRestStyles.img} contentFit="cover" />
        ) : (
          <LinearGradient colors={['#FF6B00', '#FF9A4D']} style={popRestStyles.img} />
        )}
      </View>
      <View style={popRestStyles.info}>
        <Text style={[PP.label, { color: colors.foreground }]} numberOfLines={1}>
          {restaurant.name}
        </Text>
        <Text style={[PP.caption, { color: colors.mutedForeground }]} numberOfLines={1}>
          {restaurant.cuisine}
        </Text>
        <View style={popRestStyles.meta}>
          <View style={[popRestStyles.ratingPill, { backgroundColor: '#22C55E' }]}>
            <Ionicons name="star" size={9} color="#FFF" />
            <Text style={[PP.caption, { color: '#FFF', marginLeft: 2 }]}>
              {restaurant.rating.toFixed(1)}
            </Text>
          </View>
          <Text style={[PP.caption, { color: colors.mutedForeground }]}>
            {restaurant.deliveryTime} min
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const popRestStyles = StyleSheet.create({
  card: {
    width: 160,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    overflow: 'hidden',
    flexShrink: 0,
  },
  imgWrap: { height: 90 },
  img: { width: '100%', height: '100%' },
  info: { padding: spacing.sm, gap: 3 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 },
  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: borderRadius.pill,
  },
});

// ─── Skeleton for popular restaurant chip ────────────────────────────────────
function PopularRestaurantChipSkeleton() {
  const colors = useColors();
  return (
    <View
      style={[
        popRestStyles.card,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <Skeleton height={90} radius={0} />
      <View style={{ padding: spacing.sm, gap: 6 }}>
        <Skeleton height={13} width="70%" />
        <Skeleton height={11} width="50%" />
      </View>
    </View>
  );
}

// ─── Idle Content (no query) ──────────────────────────────────────────────────
function IdleContent({
  recentSearches,
  onSelectRecent,
  onRemoveRecent,
  onClearRecent,
  onSelectTrending,
  onRestaurantPress,
}: {
  recentSearches: string[];
  onSelectRecent: (q: string) => void;
  onRemoveRecent: (q: string) => void;
  onClearRecent: () => void;
  onSelectTrending: (q: string) => void;
  onRestaurantPress: (id: string) => void;
}) {
  const router = useRouter();
  const [loadingPopular, setLoadingPopular] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoadingPopular(false), 800);
    return () => clearTimeout(t);
  }, []);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ paddingTop: spacing.md, paddingBottom: spacing.xxxl }}
    >
      <RecentSearches
        items={recentSearches}
        onSelect={onSelectRecent}
        onRemove={onRemoveRecent}
        onClearAll={onClearRecent}
      />

      <TrendingSection onSelect={onSelectTrending} />

      {/* Popular Restaurants */}
      <View style={{ marginBottom: spacing.xl }}>
        <View style={{ paddingHorizontal: spacing.md, marginBottom: spacing.md12 }}>
          <SectionHeader title="Popular Near You" subtitle="Most ordered today" />
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: spacing.md,
            gap: spacing.md12,
          }}
        >
          {loadingPopular
            ? Array.from({ length: 4 }).map((_, i) => (
                <PopularRestaurantChipSkeleton key={i} />
              ))
            : POPULAR_RESTAURANTS.map((r) => (
                <PopularRestaurantChip
                  key={r.id}
                  restaurant={r}
                  onPress={() => onRestaurantPress(r.id)}
                />
              ))}
        </ScrollView>
      </View>

      {/* Popular Dishes */}
      <View style={{ paddingHorizontal: spacing.md }}>
        <View style={{ marginBottom: spacing.md12 }}>
          <SectionHeader title="Popular Dishes" subtitle="Everyone's ordering these" />
        </View>
        {loadingPopular
          ? Array.from({ length: 3 }).map((_, i) => (
              <View key={i} style={{ marginBottom: spacing.md12 }}>
                <FoodCardSkeleton />
              </View>
            ))
          : POPULAR_DISHES.map((f) => (
              <View key={f.id} style={{ marginBottom: spacing.md12 }}>
                <FoodCard
                  name={f.name}
                  description={f.description}
                  price={f.price}
                  rating={f.rating}
                  restaurantName={f.restaurantName}
                  imageUri={f.imageUri}
                  isVeg={f.isVeg}
                  isPopular={f.isPopular}
                  isNew={f.isNew}
                  onPress={() => {}}
                  onAddPress={() => {}}
                />
              </View>
            ))}
      </View>
    </ScrollView>
  );
}

// ─── Result Tabs ──────────────────────────────────────────────────────────────
function ResultTabs({
  active,
  counts,
  onSelect,
}: {
  active: ResultTab;
  counts: { all: number; restaurants: number; food: number; categories: number };
  onSelect: (t: ResultTab) => void;
}) {
  const colors = useColors();
  const tabs: { key: ResultTab; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: counts.all },
    { key: 'restaurants', label: 'Restaurants', count: counts.restaurants },
    { key: 'food', label: 'Food', count: counts.food },
    { key: 'categories', label: 'Categories', count: counts.categories },
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={tabStyles.row}
    >
      {tabs.map((t) => {
        const isActive = t.key === active;
        return (
          <TouchableOpacity
            key={t.key}
            onPress={() => onSelect(t.key)}
            activeOpacity={0.8}
            style={[
              tabStyles.tab,
              {
                backgroundColor: isActive ? colors.primary : colors.card,
                borderColor: isActive ? colors.primary : colors.border,
              },
            ]}
          >
            <Text
              style={[
                PP.buttonSM,
                { color: isActive ? '#FFFFFF' : colors.foreground },
              ]}
            >
              {t.label}
            </Text>
            {t.count > 0 && (
              <View
                style={[
                  tabStyles.badge,
                  { backgroundColor: isActive ? 'rgba(255,255,255,0.25)' : colors.primary + '20' },
                ]}
              >
                <Text
                  style={[
                    PP.caption,
                    { color: isActive ? '#FFFFFF' : colors.primary, fontSize: 10 },
                  ]}
                >
                  {t.count}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const tabStyles = StyleSheet.create({
  row: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md12,
    gap: spacing.sm,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md12,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.pill,
    borderWidth: 1,
    gap: 5,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: borderRadius.pill,
    minWidth: 18,
    alignItems: 'center',
  },
});

// ─── Category Grid Item ───────────────────────────────────────────────────────
function CategoryGridItem({
  category,
  onPress,
}: {
  category: Category;
  onPress: () => void;
}) {
  const colors = useColors();
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[
        catGridStyles.item,
        { backgroundColor: category.color + '18', borderColor: category.color + '40' },
      ]}
    >
      <Text style={catGridStyles.emoji}>{category.emoji}</Text>
      <Text style={[PP.label, { color: colors.foreground }]}>{category.name}</Text>
    </TouchableOpacity>
  );
}

const catGridStyles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md12,
    paddingVertical: spacing.md12,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    flex: 1,
  },
  emoji: { fontSize: 20 },
});

// ─── Results Content ──────────────────────────────────────────────────────────
function ResultsContent({
  restaurants,
  foods,
  categories,
  activeTab,
  query,
  onTabChange,
  onRestaurantPress,
}: {
  restaurants: Restaurant[];
  foods: FoodItem[];
  categories: Category[];
  activeTab: ResultTab;
  query: string;
  onTabChange: (t: ResultTab) => void;
  onRestaurantPress: (id: string) => void;
}) {
  const colors = useColors();
  const total = restaurants.length + foods.length + categories.length;
  const hasResults = total > 0;

  const counts = {
    all: total,
    restaurants: restaurants.length,
    food: foods.length,
    categories: categories.length,
  };

  const showRestaurants =
    activeTab === 'all' || activeTab === 'restaurants';
  const showFood = activeTab === 'all' || activeTab === 'food';
  const showCategories = activeTab === 'all' || activeTab === 'categories';

  if (!hasResults) {
    return (
      <View style={{ flex: 1 }}>
        <ResultTabs active={activeTab} counts={counts} onSelect={onTabChange} />
        <EmptyState
          variant="noSearchResult"
          title={`No results for "${query}"`}
          subtitle="Try a different keyword, or browse trending searches above."
        />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ResultTabs active={activeTab} counts={counts} onSelect={onTabChange} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingHorizontal: spacing.md, paddingBottom: spacing.xxxl }}
      >
        {/* ── Restaurants ── */}
        {showRestaurants && restaurants.length > 0 && (
          <View style={{ marginBottom: spacing.xl }}>
            {activeTab === 'all' && (
              <View style={{ marginBottom: spacing.md12 }}>
                <SectionHeader
                  title="Restaurants"
                  subtitle={`${restaurants.length} found`}
                />
              </View>
            )}
            {restaurants.map((r) => (
              <View key={r.id} style={{ marginBottom: spacing.md12 }}>
                <RestaurantCard
                  name={r.name}
                  cuisine={r.cuisine}
                  rating={r.rating}
                  deliveryTime={r.deliveryTime}
                  deliveryFee={r.deliveryFee}
                  distance={r.distance}
                  isVeg={r.isVeg}
                  imageUri={r.imageUri}
                  isNew={r.isNew}
                  offerText={r.offerText}
                  onPress={() => onRestaurantPress(r.id)}
                />
              </View>
            ))}
          </View>
        )}

        {/* ── Food ── */}
        {showFood && foods.length > 0 && (
          <View style={{ marginBottom: spacing.xl }}>
            {activeTab === 'all' && (
              <View style={{ marginBottom: spacing.md12 }}>
                <SectionHeader title="Food Items" subtitle={`${foods.length} found`} />
              </View>
            )}
            {foods.map((f) => (
              <View key={f.id} style={{ marginBottom: spacing.md12 }}>
                <FoodCard
                  name={f.name}
                  description={f.description}
                  price={f.price}
                  rating={f.rating}
                  restaurantName={f.restaurantName}
                  imageUri={f.imageUri}
                  isVeg={f.isVeg}
                  isPopular={f.isPopular}
                  isNew={f.isNew}
                  onPress={() => {}}
                  onAddPress={() => {}}
                />
              </View>
            ))}
          </View>
        )}

        {/* ── Categories ── */}
        {showCategories && categories.length > 0 && (
          <View style={{ marginBottom: spacing.xl }}>
            {activeTab === 'all' && (
              <View style={{ marginBottom: spacing.md12 }}>
                <SectionHeader title="Categories" subtitle={`${categories.length} found`} />
              </View>
            )}
            <View style={resultsStyles.catGrid}>
              {categories.map((c) => (
                <CategoryGridItem key={c.id} category={c} onPress={() => {}} />
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const resultsStyles = StyleSheet.create({
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
});

// ─── Searching Skeletons ──────────────────────────────────────────────────────
function SearchingSkeletons() {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ padding: spacing.md, gap: spacing.md12 }}
    >
      {Array.from({ length: 3 }).map((_, i) => (
        <RestaurantCardSkeleton key={`r-${i}`} />
      ))}
      <View style={{ height: spacing.lg }} />
      {Array.from({ length: 3 }).map((_, i) => (
        <FoodCardSkeleton key={`f-${i}`} />
      ))}
    </ScrollView>
  );
}

// ─── Error State ──────────────────────────────────────────────────────────────
function ErrorContent({ onRetry }: { onRetry: () => void }) {
  return (
    <EmptyState
      variant="noInternet"
      title="Something went wrong"
      subtitle="We couldn't complete your search. Check your connection and try again."
      ctaText="Retry"
      onCtaPress={onRetry}
    />
  );
}

// ─── SearchScreen ─────────────────────────────────────────────────────────────
export function SearchScreen() {
  const colors = useColors();
  const router = useRouter();

  const inputRef = useRef<TextInput>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [query, setQuery] = useState('');
  const [committedQuery, setCommittedQuery] = useState('');
  const [phase, setPhase] = useState<SearchPhase>('idle');
  const [activeTab, setActiveTab] = useState<ResultTab>('all');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // ── Load recent searches on mount ────────────────────────────────────────────
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) setRecentSearches(JSON.parse(raw) as string[]);
      })
      .catch(() => {});
  }, []);

  // ── Persist recent searches ───────────────────────────────────────────────────
  const saveRecent = useCallback(async (updated: string[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {}
  }, []);

  const addRecentSearch = useCallback(
    (q: string) => {
      const trimmed = q.trim();
      if (!trimmed) return;
      setRecentSearches((prev) => {
        const filtered = prev.filter((s) => s.toLowerCase() !== trimmed.toLowerCase());
        const updated = [trimmed, ...filtered].slice(0, MAX_RECENT);
        saveRecent(updated);
        return updated;
      });
    },
    [saveRecent],
  );

  const removeRecentSearch = useCallback(
    (q: string) => {
      setRecentSearches((prev) => {
        const updated = prev.filter((s) => s !== q);
        saveRecent(updated);
        return updated;
      });
    },
    [saveRecent],
  );

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    saveRecent([]);
  }, [saveRecent]);

  // ── Text change: instant suggestions + debounced search ───────────────────────
  const handleChangeText = useCallback((text: string) => {
    setQuery(text);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!text.trim()) {
      setSuggestions([]);
      setPhase('idle');
      return;
    }

    // Instant suggestions (local, synchronous)
    setSuggestions(getSuggestions(text));
    setPhase('suggestions');

    // Debounced full search
    debounceRef.current = setTimeout(() => {
      runSearch(text);
    }, DEBOUNCE_MS);
  }, []);

  // ── Full search ───────────────────────────────────────────────────────────────
  const runSearch = useCallback(async (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;

    setPhase('searching');
    setCommittedQuery(trimmed);
    setActiveTab('all');

    try {
      const results = await searchAll(trimmed);
      setRestaurants(results.restaurants);
      setFoods(results.foods);
      setCategories(results.categories);
      setPhase('results');
      addRecentSearch(trimmed);
    } catch {
      setPhase('error');
    }
  }, [addRecentSearch]);

  // ── Submit (keyboard or suggestion tap) ──────────────────────────────────────
  const handleSubmit = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    runSearch(query);
  }, [query, runSearch]);

  const handleSuggestionSelect = useCallback(
    (label: string) => {
      setQuery(label);
      setSuggestions([]);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      runSearch(label);
    },
    [runSearch],
  );

  const handleClear = useCallback(() => {
    setQuery('');
    setSuggestions([]);
    setPhase('idle');
    inputRef.current?.focus();
  }, []);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleRestaurantPress = useCallback(
    (id: string) => {
      router.push(`/restaurant/${id}` as any);
    },
    [router],
  );

  // ── Cleanup debounce on unmount ───────────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return (
    <View style={[screenStyles.container, { backgroundColor: colors.background }]}>
      <SearchHeader
        value={query}
        onChangeText={handleChangeText}
        onClear={handleClear}
        onBack={handleBack}
        onSubmit={handleSubmit}
        inputRef={inputRef}
      />

      {/* ── Suggestions overlay ── */}
      {phase === 'suggestions' && suggestions.length > 0 && (
        <Animated.View
          entering={FadeIn.duration(120)}
          exiting={FadeOut.duration(80)}
          style={[screenStyles.suggOverlay, { backgroundColor: colors.background }]}
        >
          {suggestions.map((s) => (
            <SuggestionRow key={s.id} item={s} onPress={handleSuggestionSelect} />
          ))}
        </Animated.View>
      )}

      {/* ── Main content area ── */}
      <View style={{ flex: 1 }}>
        {phase === 'idle' && (
          <Animated.View entering={FadeIn.duration(200)} style={{ flex: 1 }}>
            <IdleContent
              recentSearches={recentSearches}
              onSelectRecent={handleSuggestionSelect}
              onRemoveRecent={removeRecentSearch}
              onClearRecent={clearRecentSearches}
              onSelectTrending={handleSuggestionSelect}
              onRestaurantPress={handleRestaurantPress}
            />
          </Animated.View>
        )}

        {phase === 'searching' && (
          <Animated.View entering={FadeIn.duration(150)} style={{ flex: 1 }}>
            <SearchingSkeletons />
          </Animated.View>
        )}

        {phase === 'results' && (
          <Animated.View entering={FadeIn.duration(200)} style={{ flex: 1 }}>
            <ResultsContent
              restaurants={restaurants}
              foods={foods}
              categories={categories}
              activeTab={activeTab}
              query={committedQuery}
              onTabChange={setActiveTab}
              onRestaurantPress={handleRestaurantPress}
            />
          </Animated.View>
        )}

        {phase === 'error' && (
          <Animated.View entering={FadeIn.duration(200)} style={{ flex: 1 }}>
            <ErrorContent onRetry={() => runSearch(query)} />
          </Animated.View>
        )}
      </View>
    </View>
  );
}

const screenStyles = StyleSheet.create({
  container: { flex: 1 },
  suggOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    // offset below header — approximate
    marginTop: Platform.OS === 'web' ? 76 : 90,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
  },
});
