// ─── Help Center Screen ───────────────────────────────────────────────────────
// FAQ categories, search, expand/collapse, loading & empty states.

import React, { useState, useMemo } from 'react';
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  HelpCircle,
  Search,
  X,
} from 'lucide-react-native';
import { useColors } from '@/hooks/useColors';
import { PP } from '@/theme/poppins';
import { FAQ_CATEGORIES, FAQCategory, FAQItem } from './supportData';

// ─── Props ────────────────────────────────────────────────────────────────────

interface HelpCenterScreenProps {
  onBack?: () => void;
  onContactSupport?: () => void;
  onRaiseTicket?: () => void;
  onTicketHistory?: () => void;
}

// ─── Category chip ────────────────────────────────────────────────────────────

function CategoryChip({
  category,
  selected,
  onPress,
}: {
  category: FAQCategory;
  selected: boolean;
  onPress: () => void;
}) {
  const colors = useColors();
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        chipStyles.chip,
        {
          backgroundColor: selected ? colors.primary : colors.card,
          borderColor: selected ? colors.primary : colors.border,
        },
      ]}
    >
      <Text style={chipStyles.emoji}>{category.emoji}</Text>
      <Text
        style={[
          PP.bodySM,
          chipStyles.label,
          { color: selected ? '#FFFFFF' : colors.foreground },
        ]}
      >
        {category.label}
      </Text>
    </TouchableOpacity>
  );
}

const chipStyles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
    marginRight: 8,
  },
  emoji: { fontSize: 14 },
  label: { fontFamily: 'Poppins_500Medium' },
});

// ─── FAQ Item row (expand / collapse) ────────────────────────────────────────

function FAQRow({
  item,
  isFirst,
}: {
  item: FAQItem;
  isFirst: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const colors = useColors();
  return (
    <View style={[faqStyles.wrap, { borderTopColor: colors.border }, isFirst && faqStyles.first]}>
      <TouchableOpacity
        onPress={() => setExpanded((v) => !v)}
        activeOpacity={0.7}
        style={faqStyles.question}
      >
        <Text
          style={[PP.label, { color: colors.foreground, flex: 1, lineHeight: 22 }]}
        >
          {item.question}
        </Text>
        {expanded ? (
          <ChevronUp size={16} color={colors.mutedForeground} strokeWidth={2} />
        ) : (
          <ChevronDown size={16} color={colors.mutedForeground} strokeWidth={2} />
        )}
      </TouchableOpacity>
      {expanded && (
        <Text
          style={[
            PP.bodySM,
            faqStyles.answer,
            { color: colors.mutedForeground, borderTopColor: colors.border },
          ]}
        >
          {item.answer}
        </Text>
      )}
    </View>
  );
}

const faqStyles = StyleSheet.create({
  wrap: { borderTopWidth: StyleSheet.hairlineWidth },
  first: { borderTopWidth: 0 },
  question: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  answer: {
    paddingHorizontal: 16,
    paddingBottom: 14,
    lineHeight: 20,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 10,
  },
});

// ─── Main screen ──────────────────────────────────────────────────────────────

export function HelpCenterScreen({
  onBack,
  onContactSupport,
  onRaiseTicket,
  onTicketHistory,
}: HelpCenterScreenProps) {
  const insets = useSafeAreaInsets();
  const colors = useColors();

  const paddingTop = Platform.OS === 'web' ? 56 : insets.top;
  const paddingBottom = Platform.OS === 'web' ? 34 : insets.bottom;

  const [query, setQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [isLoading] = useState(false);

  // Filter by search + category
  const filteredCategories = useMemo(() => {
    let cats = FAQ_CATEGORIES;
    if (selectedCategoryId) {
      cats = cats.filter((c) => c.id === selectedCategoryId);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      cats = cats
        .map((cat) => ({
          ...cat,
          items: cat.items.filter(
            (item) =>
              item.question.toLowerCase().includes(q) ||
              item.answer.toLowerCase().includes(q),
          ),
        }))
        .filter((cat) => cat.items.length > 0);
    }
    return cats;
  }, [query, selectedCategoryId]);

  const isEmpty = !isLoading && filteredCategories.length === 0;

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      {/* ── Top bar ── */}
      <View
        style={[
          styles.topBar,
          { paddingTop: paddingTop + 4, backgroundColor: colors.card, borderBottomColor: colors.border },
        ]}
      >
        <TouchableOpacity onPress={onBack} activeOpacity={0.7} style={styles.iconBtn}>
          <ArrowLeft size={22} color={colors.foreground} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={[PP.title, styles.topTitle, { color: colors.foreground }]}>
          Help Center
        </Text>
        <View style={styles.iconBtn} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: paddingBottom + 32, paddingTop: 16 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Hero ── */}
        <View style={[styles.hero, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.heroIcon, { backgroundColor: colors.accent }]}>
            <HelpCircle size={28} color={colors.primary} strokeWidth={1.8} />
          </View>
          <Text style={[PP.h3, { color: colors.foreground, textAlign: 'center' }]}>
            How can we help?
          </Text>
          <Text
            style={[PP.body, { color: colors.mutedForeground, textAlign: 'center', lineHeight: 22 }]}
          >
            Search our FAQ or browse by category.
          </Text>
        </View>

        {/* ── Search bar ── */}
        <View
          style={[
            styles.searchBar,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Search size={18} color={colors.mutedForeground} strokeWidth={2} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search FAQs…"
            placeholderTextColor={colors.mutedForeground}
            style={[PP.body, styles.searchInput, { color: colors.foreground }]}
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')} activeOpacity={0.7}>
              <X size={16} color={colors.mutedForeground} />
            </TouchableOpacity>
          )}
        </View>

        {/* ── Category chips ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipScroll}
        >
          {/* "All" chip */}
          <TouchableOpacity
            onPress={() => setSelectedCategoryId(null)}
            activeOpacity={0.7}
            style={[
              chipStyles.chip,
              {
                backgroundColor: !selectedCategoryId ? colors.primary : colors.card,
                borderColor: !selectedCategoryId ? colors.primary : colors.border,
              },
            ]}
          >
            <Text
              style={[
                PP.bodySM,
                chipStyles.label,
                { color: !selectedCategoryId ? '#FFFFFF' : colors.foreground },
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
          {FAQ_CATEGORIES.map((cat) => (
            <CategoryChip
              key={cat.id}
              category={cat}
              selected={selectedCategoryId === cat.id}
              onPress={() =>
                setSelectedCategoryId((id) => (id === cat.id ? null : cat.id))
              }
            />
          ))}
        </ScrollView>

        {/* ── Loading ── */}
        {isLoading && (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[PP.body, { color: colors.mutedForeground, marginTop: 12 }]}>
              Loading FAQs…
            </Text>
          </View>
        )}

        {/* ── Empty state ── */}
        {isEmpty && !isLoading && (
          <View style={styles.center}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={[PP.subtitle, { color: colors.foreground, marginTop: 12 }]}>
              No results found
            </Text>
            <Text
              style={[PP.body, { color: colors.mutedForeground, textAlign: 'center', marginTop: 6 }]}
            >
              Try a different search or browse all categories.
            </Text>
          </View>
        )}

        {/* ── FAQ sections ── */}
        {!isLoading &&
          filteredCategories.map((cat) => (
            <View key={cat.id} style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionEmoji}>{cat.emoji}</Text>
                <Text style={[PP.label, { color: colors.foreground }]}>{cat.label}</Text>
              </View>
              <View
                style={[
                  styles.card,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
              >
                {cat.items.map((item, i) => (
                  <FAQRow key={item.id} item={item} isFirst={i === 0} />
                ))}
              </View>
            </View>
          ))}

        {/* ── Still need help? ── */}
        {!isLoading && (
          <View
            style={[
              styles.needHelpCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Text style={[PP.label, { color: colors.foreground, marginBottom: 4 }]}>
              Still need help?
            </Text>
            <Text
              style={[PP.bodySM, { color: colors.mutedForeground, marginBottom: 14 }]}
            >
              Our support team is here for you.
            </Text>
            <View style={styles.needHelpRow}>
              <TouchableOpacity
                onPress={onContactSupport}
                activeOpacity={0.8}
                style={[
                  styles.needHelpBtn,
                  { backgroundColor: colors.primary },
                ]}
              >
                <Text style={[PP.buttonSM, { color: '#FFFFFF' }]}>Contact Support</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onRaiseTicket}
                activeOpacity={0.8}
                style={[
                  styles.needHelpBtn,
                  styles.needHelpBtnOutline,
                  { borderColor: colors.primary },
                ]}
              >
                <Text style={[PP.buttonSM, { color: colors.primary }]}>Raise Ticket</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={onTicketHistory}
              activeOpacity={0.7}
              style={styles.viewTickets}
            >
              <Text style={[PP.bodySM, { color: colors.primary, fontFamily: 'Poppins_500Medium' }]}>
                View my tickets
              </Text>
              <ChevronRight size={14} color={colors.primary} />
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 8,
  },
  iconBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  topTitle: { flex: 1, textAlign: 'center' },

  hero: {
    marginHorizontal: 16,
    marginBottom: 14,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    gap: 8,
  },
  heroIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 14,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 10,
  },
  searchInput: { flex: 1, padding: 0, margin: 0 },

  chipScroll: {
    paddingHorizontal: 16,
    paddingBottom: 14,
  },

  center: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 32,
  },
  emptyEmoji: { fontSize: 48 },

  section: { marginBottom: 12 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginBottom: 6,
  },
  sectionEmoji: { fontSize: 16 },

  card: {
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
  },

  needHelpCard: {
    marginHorizontal: 16,
    marginTop: 4,
    borderRadius: 16,
    padding: 18,
    borderWidth: StyleSheet.hairlineWidth,
  },
  needHelpRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  needHelpBtn: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 10,
    alignItems: 'center',
  },
  needHelpBtnOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
  },
  viewTickets: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});
