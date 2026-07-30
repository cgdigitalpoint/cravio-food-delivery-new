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
import { AlertCircle, ArrowLeft, ChevronRight, Clock3, Package, RefreshCw, Search, X } from 'lucide-react-native';
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
  const orderNum = `#${order.id.slice(0, 8).toUpperCase()}`;

  const itemNames = order.order_items
    ?.slice(0, 2)
    .map((i: any) => i.item_name ?? i.name ?? '')
    .filter(Boolean)
    .join(', ');

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
      activeOpacity={0.8}
    >
      {/* Header row: restaurant name + status badge */}
      <View style={styles.cardHeader}>
        <View style={styles.cardRestaurantRow}>
          <View style={[styles.cardIconWrap, { backgroundColor: '#FFF7ED' }]}>
            <Package size={16} color="#FF6B00" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[PP.label, { color: colors.foreground }]} numberOfLines={1}>
              {order.restaurant_name}
            </Text>
            <Text style={[PP.caption, { color: colors.mutedForeground }]}>
              {orderNum}
            </Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusColor + '18' }]}>
          <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
          <Text style={[PP.caption, { color: statusColor, fontFamily: 'Poppins_600SemiBold' }]}>
            {STATUS_LABELS[order.status]}
          </Text>
        </View>
      </View>

      <View style={[styles.cardDivider, { backgroundColor: colors.border }]} />

      {/* Items summary */}
      {itemNames ? (
        <Text style={[PP.caption, { color: colors.mutedForeground, marginBottom: 10 }]} numberOfLines={1}>
          {itemNames}{itemCount > 2 ? ` +${itemCount - 2} more` : ''}
        </Text>
      ) : null}

      {/* Footer row: date · items count · total */}
      <View style={styles.cardFooter}>
        <View style={styles.cardDateRow}>
          <Clock3 size={12} color={colors.mutedForeground} strokeWidth={1.8} />
          <Text style={[PP.caption, { color: colors.mutedForeground, marginLeft: 4 }]}>
            {new Date(order.created_at).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </Text>
          <Text style={[PP.caption, { color: colors.mutedForeground }]}>
            · {itemCount} {itemCount === 1 ? 'item' : 'items'}
          </Text>
        </View>
        <View style={styles.cardTotalRow}>
          <Text style={[PP.label, { color: colors.foreground, fontFamily: 'Poppins_700Bold' }]}>
            ₹{order.total.toFixed(2)}
          </Text>
          <ChevronRight size={14} color={colors.mutedForeground} strokeWidth={2} />
        </View>
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
  const { orders, isLoading, error, fetchOrders } = useOrderStore();
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
        ) : error && !refreshing ? (
          <View style={styles.centered}>
            <AlertCircle size={36} color="#EF4444" strokeWidth={1.5} />
            <Text style={[PP.label, { color: colors.foreground, marginTop: 12, textAlign: 'center' }]}>
              Could not load orders
            </Text>
            <Text style={[PP.caption, { color: colors.mutedForeground, marginTop: 4, textAlign: 'center', paddingHorizontal: 24 }]}>
              {error}
            </Text>
            <TouchableOpacity
              onPress={handleRefresh}
              activeOpacity={0.8}
              style={[styles.retryBtn, { backgroundColor: colors.primary }]}
            >
              <RefreshCw size={15} color="#fff" />
              <Text style={[PP.label, { color: '#fff', marginLeft: 6 }]}>Retry</Text>
            </TouchableOpacity>
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 8,
  },
  cardRestaurantRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cardIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    flexShrink: 0,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  cardDivider: { height: StyleSheet.hairlineWidth, marginBottom: 10 },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTotalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 60 },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
});
