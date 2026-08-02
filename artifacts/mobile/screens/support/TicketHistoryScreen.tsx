// ─── Ticket History Screen ────────────────────────────────────────────────────
// Lists support tickets with status tabs, search, loading & empty states.

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
  ChevronRight,
  Plus,
  Search,
  TicketIcon,
  X,
} from 'lucide-react-native';
import { useColors } from '@/hooks/useColors';
import { PP } from '@/theme/poppins';
import { MOCK_TICKETS, SupportTicket, TicketStatus } from './supportData';

// ─── Props ────────────────────────────────────────────────────────────────────

interface TicketHistoryScreenProps {
  onBack?: () => void;
  onOpenTicket?: (ticketId: string) => void;
  onRaiseTicket?: () => void;
}

// ─── Status meta ─────────────────────────────────────────────────────────────

const STATUS_META: Record<
  TicketStatus,
  { label: string; color: string; bg: string; dot: string }
> = {
  pending: { label: 'Pending', color: '#F59E0B', bg: '#FFFBEB', dot: '#F59E0B' },
  open: { label: 'Open', color: '#3B82F6', bg: '#EFF6FF', dot: '#3B82F6' },
  resolved: { label: 'Resolved', color: '#22C55E', bg: '#F0FDF4', dot: '#22C55E' },
  closed: { label: 'Closed', color: '#6B7280', bg: '#F3F4F6', dot: '#6B7280' },
};

const ALL_STATUSES: Array<TicketStatus | 'all'> = ['all', 'pending', 'open', 'resolved', 'closed'];

// ─── Ticket card ─────────────────────────────────────────────────────────────

function TicketCard({
  ticket,
  onPress,
}: {
  ticket: SupportTicket;
  onPress: () => void;
}) {
  const colors = useColors();
  const meta = STATUS_META[ticket.status];
  const date = new Date(ticket.updatedAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={[cardStyles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
    >
      <View style={cardStyles.top}>
        <Text style={[PP.caption, { color: colors.mutedForeground }]}>{ticket.id}</Text>
        <View style={[cardStyles.badge, { backgroundColor: meta.bg }]}>
          <View style={[cardStyles.dot, { backgroundColor: meta.dot }]} />
          <Text style={[PP.caption, { color: meta.color, fontFamily: 'Poppins_600SemiBold' }]}>
            {meta.label}
          </Text>
        </View>
      </View>
      <Text
        style={[PP.label, { color: colors.foreground, marginTop: 4, marginBottom: 4 }]}
        numberOfLines={2}
      >
        {ticket.subject}
      </Text>
      <Text style={[PP.caption, { color: colors.mutedForeground }]}>
        {ticket.category} · Updated {date}
      </Text>
      <ChevronRight
        size={16}
        color={colors.mutedForeground}
        strokeWidth={1.8}
        style={cardStyles.chevron}
      />
    </TouchableOpacity>
  );
}

const cardStyles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 16,
    padding: 16,
    borderWidth: StyleSheet.hairlineWidth,
  },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  dot: { width: 6, height: 6, borderRadius: 3 },
  chevron: { position: 'absolute', right: 16, bottom: 16 },
});

// ─── Status tab ──────────────────────────────────────────────────────────────

function StatusTab({
  status,
  active,
  count,
  onPress,
}: {
  status: TicketStatus | 'all';
  active: boolean;
  count: number;
  onPress: () => void;
}) {
  const colors = useColors();
  const label = status === 'all' ? 'All' : STATUS_META[status].label;
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        tabStyles.tab,
        {
          backgroundColor: active ? colors.primary : colors.card,
          borderColor: active ? colors.primary : colors.border,
        },
      ]}
    >
      <Text
        style={[
          PP.bodySM,
          { color: active ? '#FFFFFF' : colors.foreground, fontFamily: 'Poppins_500Medium' },
        ]}
      >
        {label}
      </Text>
      {count > 0 && (
        <View
          style={[
            tabStyles.countBadge,
            { backgroundColor: active ? 'rgba(255,255,255,0.25)' : colors.muted },
          ]}
        >
          <Text style={[PP.caption, { color: active ? '#FFFFFF' : colors.mutedForeground }]}>
            {count}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const tabStyles = StyleSheet.create({
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  countBadge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
});

// ─── Main screen ──────────────────────────────────────────────────────────────

export function TicketHistoryScreen({
  onBack,
  onOpenTicket,
  onRaiseTicket,
}: TicketHistoryScreenProps) {
  const insets = useSafeAreaInsets();
  const colors = useColors();

  const paddingTop = Platform.OS === 'web' ? 56 : insets.top;
  const paddingBottom = Platform.OS === 'web' ? 34 : insets.bottom;

  const [query, setQuery] = useState('');
  const [activeStatus, setActiveStatus] = useState<TicketStatus | 'all'>('all');
  const [isLoading] = useState(false);

  const tickets = MOCK_TICKETS; // Replace with Supabase fetch when ready

  const filtered = useMemo(() => {
    let list = tickets;
    if (activeStatus !== 'all') list = list.filter((t) => t.status === activeStatus);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (t) =>
          t.id.toLowerCase().includes(q) ||
          t.subject.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q),
      );
    }
    return list;
  }, [tickets, activeStatus, query]);

  const countForStatus = (s: TicketStatus | 'all') =>
    s === 'all'
      ? tickets.length
      : tickets.filter((t) => t.status === s).length;

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      {/* ── Top bar ── */}
      <View
        style={[
          styles.topBar,
          {
            paddingTop: paddingTop + 4,
            backgroundColor: colors.card,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <TouchableOpacity onPress={onBack} activeOpacity={0.7} style={styles.iconBtn}>
          <ArrowLeft size={22} color={colors.foreground} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={[PP.title, styles.topTitle, { color: colors.foreground }]}>
          My Tickets
        </Text>
        <TouchableOpacity onPress={onRaiseTicket} activeOpacity={0.7} style={styles.iconBtn}>
          <Plus size={22} color={colors.primary} strokeWidth={2.2} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: paddingBottom + 32, paddingTop: 14 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Search ── */}
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
            placeholder="Search tickets…"
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

        {/* ── Status tabs ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabScroll}
        >
          {ALL_STATUSES.map((s) => (
            <StatusTab
              key={s}
              status={s}
              active={activeStatus === s}
              count={countForStatus(s)}
              onPress={() => setActiveStatus(s)}
            />
          ))}
        </ScrollView>

        {/* ── Loading ── */}
        {isLoading && (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[PP.body, { color: colors.mutedForeground, marginTop: 12 }]}>
              Loading tickets…
            </Text>
          </View>
        )}

        {/* ── Empty state ── */}
        {!isLoading && filtered.length === 0 && (
          <View style={styles.center}>
            <View style={[styles.emptyIcon, { backgroundColor: colors.accent }]}>
              <TicketIcon size={32} color={colors.primary} strokeWidth={1.6} />
            </View>
            <Text style={[PP.subtitle, { color: colors.foreground, marginTop: 12 }]}>
              {query || activeStatus !== 'all' ? 'No tickets found' : 'No tickets yet'}
            </Text>
            <Text
              style={[
                PP.body,
                { color: colors.mutedForeground, textAlign: 'center', marginTop: 6 },
              ]}
            >
              {query || activeStatus !== 'all'
                ? 'Try adjusting your search or filters.'
                : 'Raise a ticket to get help from our support team.'}
            </Text>
            {!query && activeStatus === 'all' && (
              <TouchableOpacity
                onPress={onRaiseTicket}
                activeOpacity={0.8}
                style={[styles.emptyBtn, { backgroundColor: colors.primary }]}
              >
                <Text style={[PP.buttonSM, { color: '#FFFFFF' }]}>Raise a Ticket</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* ── Ticket list ── */}
        {!isLoading &&
          filtered.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              onPress={() => onOpenTicket?.(ticket.id)}
            />
          ))}
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

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 10,
  },
  searchInput: { flex: 1, padding: 0, margin: 0 },

  tabScroll: {
    paddingHorizontal: 16,
    paddingBottom: 14,
  },

  center: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyBtn: {
    marginTop: 18,
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 12,
  },
});
