// ─── Orders Screen ────────────────────────────────────────────────────────────
import React, { useEffect, useMemo, useState } from 'react';
import {
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Search, X } from 'lucide-react-native';
import { useColors } from '@/hooks/useColors';
import { PP } from '@/theme/poppins';
import { borderRadius, spacing } from '@/theme';
import { useAuthStore } from '@/store/useAuthStore';
import { useOrderStore } from '@/store/useOrderStore';
import { EmptyState } from '@/components/ui';
import type { DbOrder, OrderStatus } from '@/types/db.types';

type TabKey = 'active' | 'completed' | 'cancelled';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'active', label: 'Active' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
];

const ACTIVE_STATUSES: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'out_for_delivery'];
const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  preparing: 'Preparing',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};
const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: '#F59E0B',
  confirmed: '#3B82F6',
  preparing: '#8B5CF6',
  out_for_delivery: '#FF6B00',
  delivered: '#10B981',
  cancelled: '#EF4444',
};

interface OrderCardProps {
  order: DbOrder;
  onPress?: () => void;
}

function OrderCard({ order, onPress }: OrderCardProps) {
  const colors = useColors();
  const statusColor = STATUS_COLORS[order.status] ?? '#6B7280';
  const itemCount = order.order_items?.length ?? 0;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
      activeOpacity={0.8}
    >
      <View style={styles.cardHeader}>
        <View>
          <Text style={[PP.label, { color: colors.foreground }]}>{order.restaurant_name}</Text>
          <Text style={[PP.caption, { color: colors.mutedForeground, marginTop: 2 }]}>
            {new Date(order.created_at).toLocaleDateString('en-US', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
          <Text style={[PP.caption, { color: statusColor, fontFamily: 'Poppins_600SemiBold' }]}>
            {STATUS_LABELS[order.status]}
          </Text>
        </View>
      </View>

      <View style={[styles.cardDivider, { backgroundColor: colors.border }]} />

      <View style={styles.cardFooter}>
        <Text style={[PP.caption, { color: colors.mutedForeground }]}>
          {itemCount} {itemCount === 1 ? 'item' : 'items'}
        </Text>
        <Text style={[PP.label, { color: colors.foreground }]}>
          ${order.total.toFixed(2)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

interface OrdersScreenProps {
  onBack?: () => void;
  onOrderPress?: (orderId: string) => void;
}

export function OrdersScreen({ onBack, onOrderPress }: OrdersScreenProps) {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { supabaseUserId } = useAuthStore();
  const { orders, isLoading, fetchOrders } = useOrderStore();
  const [activeTab, setActiveTab] = useState<TabKey>('active');
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const paddingTop = Platform.OS === 'web' ? 60 : insets.top;
  const paddingBottom = Platform.OS === 'web' ? 34 : insets.bottom;

  useEffect(() => {
    if (supabaseUserId) fetchOrders(supabaseUserId);
  }, [supabaseUserId]);

  const handleRefresh = async () => {
    if (!supabaseUserId) return;
    setRefreshing(true);
    await fetchOrders(supabaseUserId);
    setRefreshing(false);
  };

  const filteredOrders = useMemo(() => {
    const byTab = orders.filter((o) => {
      if (activeTab === 'active') return ACTIVE_STATUSES.includes(o.status);
      if (activeTab === 'completed') return o.status === 'delivered';
      return o.status === 'cancelled';
    });
    if (!searchQuery.trim()) return byTab;
    const q = searchQuery.trim().toLowerCase();
    return byTab.filter(
      (o) =>
        o.restaurant_name.toLowerCase().includes(q) ||
        o.id.slice(0, 8).toLowerCase().includes(q),
    );
  }, [orders, activeTab, searchQuery]);

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: paddingTop + 8, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={onBack} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <View style={[styles.backBtn, { backgroundColor: colors.muted }]}>
            <ArrowLeft size={20} color={colors.foreground} strokeWidth={2} />
          </View>
        </TouchableOpacity>
        <Text style={[PP.h3, { color: colors.foreground }]}>My Orders</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Search bar */}
      <View style={[styles.searchBar, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <View style={[styles.searchInput, { backgroundColor: colors.surfaceVariant, borderColor: colors.border }]}>
          <Search size={16} color={colors.mutedForeground} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search orders or restaurants…"
            placeholderTextColor={colors.mutedForeground}
            style={[PP.bodySM, { flex: 1, color: colors.foreground, marginLeft: 8, padding: 0 }]}
            returnKeyType="search"
            accessibilityLabel="Search orders"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <X size={15} color={colors.mutedForeground} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Tabs */}
      <View style={[styles.tabBar, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            onPress={() => setActiveTab(tab.key)}
            style={[styles.tab, activeTab === tab.key && { borderBottomColor: '#FF6B00', borderBottomWidth: 2 }]}
            activeOpacity={0.8}
          >
            <Text
              style={[
                PP.label,
                { color: activeTab === tab.key ? '#FF6B00' : colors.mutedForeground },
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.list, { paddingBottom: paddingBottom + 24 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#FF6B00" />}
      >
        {isLoading && !refreshing ? (
          <View style={styles.centered}>
            <Text style={[PP.body, { color: colors.mutedForeground }]}>Loading orders…</Text>
          </View>
        ) : filteredOrders.length === 0 ? (
          <EmptyState
            variant="noOrders"
            title={searchQuery ? 'No matching orders' : 'No orders yet'}
            subtitle={
              searchQuery
                ? `No orders matching "${searchQuery}"`
                : activeTab === 'active'
                ? 'Your active orders will appear here'
                : activeTab === 'completed'
                ? 'Completed orders will appear here'
                : 'Cancelled orders will appear here'
            }
          />
        ) : (
          filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onPress={() => onOrderPress?.(order.id)}
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
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  searchBar: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  searchInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.md,
    borderWidth: 1,
    paddingHorizontal: spacing.md12,
    paddingVertical: 9,
  },
  scroll: { flex: 1 },
  list: { padding: 16, gap: 12 },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  cardDivider: { height: StyleSheet.hairlineWidth, marginVertical: 12 },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 60 },
});
