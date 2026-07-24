// ─── Order Details Screen — Phase 10B ────────────────────────────────────────
// Full order detail: restaurant, status tracker, map placeholder, items,
// address, payment, bill breakdown, reorder, invoice.

import React, { useEffect } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Clock,
  CreditCard,
  FileText,
  MapPin,
  Navigation,
  RefreshCw,
  XCircle,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useColors } from '@/hooks/useColors';
import { PP } from '@/theme/poppins';
import { borderRadius, spacing } from '@/theme';
import { useOrderStore } from '@/store/useOrderStore';
import { useCartStore } from '@/store/useCartStore';
import { Skeleton } from '@/components/ui';
import type { DbOrder, DbOrderItem, OrderStatus } from '@/types/db.types';
import type { MenuItem } from '@/types';

// ─── Constants ────────────────────────────────────────────────────────────────
const PLATFORM_FEE = 0.99;
const GST_RATE = 0.05;
const DEFAULT_DELIVERY_FEE = 2.99;

const STATUS_STEPS: OrderStatus[] = [
  'pending',
  'confirmed',
  'preparing',
  'out_for_delivery',
  'delivered',
];

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Order Placed',
  confirmed: 'Accepted',
  preparing: 'Preparing',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

const STATUS_DESCRIPTIONS: Record<OrderStatus, string> = {
  pending: 'Your order has been received',
  confirmed: 'Restaurant accepted your order',
  preparing: 'Your food is being prepared',
  out_for_delivery: 'Rider is on the way',
  delivered: 'Order delivered successfully',
  cancelled: 'Order was cancelled',
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: '#F59E0B',
  confirmed: '#3B82F6',
  preparing: '#8B5CF6',
  out_for_delivery: '#FF6B00',
  delivered: '#10B981',
  cancelled: '#EF4444',
};

// ─── Section Label ────────────────────────────────────────────────────────────
function SectionLabel({ children }: { children: string }) {
  const colors = useColors();
  return (
    <Text
      style={[
        PP.overline,
        {
          color: colors.mutedForeground,
          marginBottom: spacing.md12,
          letterSpacing: 0.8,
        },
      ]}
    >
      {children}
    </Text>
  );
}

// ─── Bill Row ─────────────────────────────────────────────────────────────────
function BillRow({
  label,
  value,
  isTotal,
  isSaving,
  dimmed,
}: {
  label: string;
  value: string;
  isTotal?: boolean;
  isSaving?: boolean;
  dimmed?: boolean;
}) {
  const colors = useColors();
  return (
    <View style={[styles.billRow, isTotal && styles.billRowTotal]}>
      <Text
        style={[
          isTotal ? PP.label : PP.bodySM,
          {
            color: isSaving
              ? '#16A34A'
              : dimmed
              ? colors.mutedForeground
              : colors.foreground,
          },
        ]}
      >
        {label}
      </Text>
      <Text
        style={[
          isTotal ? PP.label : PP.bodySM,
          {
            color: isSaving
              ? '#16A34A'
              : isTotal
              ? colors.primary
              : dimmed
              ? colors.mutedForeground
              : colors.foreground,
            fontFamily: isTotal ? 'Poppins_700Bold' : 'Poppins_400Regular',
          },
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────
export interface OrderDetailsScreenProps {
  orderId: string;
  onBack?: () => void;
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export function OrderDetailsScreen({ orderId, onBack }: OrderDetailsScreenProps) {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const router = useRouter();
  const { selectedOrder, isLoading, fetchOrderById } = useOrderStore();
  const { clearCart, addItem } = useCartStore();

  useEffect(() => {
    fetchOrderById(orderId);
  }, [orderId]);

  const order: DbOrder | null = selectedOrder?.id === orderId ? selectedOrder : null;
  const items: DbOrderItem[] = order?.order_items ?? [];

  // ── Bill computation ──────────────────────────────────────────────────────
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const gst = subtotal * GST_RATE;
  const grandTotal = order?.total ?? 0;
  const expectedNoDiscount = subtotal + DEFAULT_DELIVERY_FEE + PLATFORM_FEE + gst;
  const couponDiscount = Math.max(0, parseFloat((expectedNoDiscount - grandTotal).toFixed(2)));

  // ── Status ────────────────────────────────────────────────────────────────
  const currentStep = order ? STATUS_STEPS.indexOf(order.status as OrderStatus) : -1;
  const isCancelled = order?.status === 'cancelled';
  const isDelivered = order?.status === 'delivered';
  const statusColor = order ? (STATUS_COLORS[order.status as OrderStatus] ?? '#6B7280') : '#6B7280';

  const orderNumber = order ? `#${order.id.slice(0, 8).toUpperCase()}` : '—';
  const orderDate = order
    ? new Date(order.created_at).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '—';

  // ── Reorder ───────────────────────────────────────────────────────────────
  const handleReorder = () => {
    if (!order || items.length === 0) return;
    Alert.alert(
      'Reorder',
      `Add all items from this order to your cart and go to checkout?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reorder',
          onPress: () => {
            clearCart();
            items.forEach((item) => {
              const menuItem: MenuItem = {
                id: item.food_id,
                restaurantId: order.restaurant_id,
                name: item.food_name,
                description: '',
                price: item.price,
                imageUrl: item.food_image,
                category: '',
                tags: [],
                isAvailable: true,
                isPopular: false,
              };
              addItem(menuItem, item.quantity);
            });
            router.push('/checkout');
          },
        },
      ],
    );
  };

  // ── Loading skeleton ──────────────────────────────────────────────────────
  if (isLoading && !order) {
    return (
      <View style={[styles.screen, { backgroundColor: colors.background }]}>
        <View
          style={[
            styles.header,
            { paddingTop: insets.top + 8, backgroundColor: colors.card, borderBottomColor: colors.border },
          ]}
        >
          <TouchableOpacity onPress={onBack} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
            <View style={[styles.backBtn, { backgroundColor: colors.muted }]}>
              <ArrowLeft size={20} color={colors.foreground} strokeWidth={2} />
            </View>
          </TouchableOpacity>
          <Text style={[PP.h3, { color: colors.foreground }]}>Order Details</Text>
          <View style={{ width: 40 }} />
        </View>
        <ScrollView contentContainerStyle={{ padding: spacing.md, gap: spacing.md12 }}>
          <Skeleton height={80} radius={16} />
          <Skeleton height={200} radius={16} />
          <Skeleton height={140} radius={16} />
          <Skeleton height={120} radius={16} />
        </ScrollView>
      </View>
    );
  }

  if (!order) {
    return (
      <View style={[styles.screen, { backgroundColor: colors.background }]}>
        <View
          style={[
            styles.header,
            { paddingTop: insets.top + 8, backgroundColor: colors.card, borderBottomColor: colors.border },
          ]}
        >
          <TouchableOpacity onPress={onBack} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
            <View style={[styles.backBtn, { backgroundColor: colors.muted }]}>
              <ArrowLeft size={20} color={colors.foreground} strokeWidth={2} />
            </View>
          </TouchableOpacity>
          <Text style={[PP.h3, { color: colors.foreground }]}>Order Details</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.centered}>
          <XCircle size={40} color={colors.mutedForeground} />
          <Text style={[PP.label, { color: colors.mutedForeground, marginTop: 12 }]}>
            Order not found
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      {/* ── Header ── */}
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + 8,
            backgroundColor: colors.card,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <TouchableOpacity onPress={onBack} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <View style={[styles.backBtn, { backgroundColor: colors.muted }]}>
            <ArrowLeft size={20} color={colors.foreground} strokeWidth={2} />
          </View>
        </TouchableOpacity>
        <Text style={[PP.h3, { color: colors.foreground }]}>Order Details</Text>
        {/* Invoice shortcut */}
        <TouchableOpacity
          onPress={() => router.push(`/invoice/${order.id}` as any)}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          style={[styles.invoiceBtn, { backgroundColor: `${colors.primary}15` }]}
          accessibilityLabel="View invoice"
        >
          <FileText size={17} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
      >
        {/* ── Restaurant + order meta ── */}
        <Animated.View entering={FadeInDown.delay(0).duration(260).springify()}>
          <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.orderMeta}>
              <View style={{ flex: 1 }}>
                <Text style={[PP.title, { color: colors.foreground }]} numberOfLines={1}>
                  {order.restaurant_name}
                </Text>
                <Text style={[PP.caption, { color: colors.mutedForeground, marginTop: 4 }]}>
                  {orderNumber} · {orderDate}
                </Text>
              </View>
              <View style={[styles.statusChip, { backgroundColor: statusColor + '20' }]}>
                <Text style={[PP.caption, { color: statusColor, fontFamily: 'Poppins_600SemiBold' }]}>
                  {STATUS_LABELS[order.status as OrderStatus] ?? order.status}
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* ── Status tracker ── */}
        <Animated.View entering={FadeInDown.delay(60).duration(260).springify()}>
          {isCancelled ? (
            <View style={[styles.section, { backgroundColor: '#FEF2F2', borderColor: '#FECACA' }]}>
              <View style={styles.cancelledRow}>
                <XCircle size={20} color="#EF4444" />
                <Text style={[PP.label, { color: '#DC2626', marginLeft: 10 }]}>
                  This order was cancelled
                </Text>
              </View>
            </View>
          ) : (
            <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <SectionLabel>ORDER STATUS</SectionLabel>
              <View style={styles.tracker}>
                {STATUS_STEPS.map((step, index) => {
                  const done = currentStep >= index;
                  const active = currentStep === index;
                  return (
                    <View key={step} style={styles.trackerStep}>
                      <View style={styles.trackerLeft}>
                        <View
                          style={[
                            styles.trackerDot,
                            {
                              backgroundColor: done ? '#FF6B00' : colors.surfaceVariant,
                              borderColor: done ? '#FF6B00' : colors.border,
                            },
                          ]}
                        >
                          {done && isDelivered && index === STATUS_STEPS.length - 1 ? (
                            <CheckCircle2 size={12} color="#fff" />
                          ) : done ? (
                            <View style={styles.trackerDotInner} />
                          ) : null}
                        </View>
                        {index < STATUS_STEPS.length - 1 && (
                          <View
                            style={[
                              styles.trackerLine,
                              { backgroundColor: currentStep > index ? '#FF6B00' : colors.border },
                            ]}
                          />
                        )}
                      </View>
                      <View style={{ flex: 1, paddingTop: 1 }}>
                        <Text
                          style={[
                            PP.bodySM,
                            {
                              color: done ? colors.foreground : colors.mutedForeground,
                              fontFamily: active ? 'Poppins_600SemiBold' : 'Poppins_400Regular',
                            },
                          ]}
                        >
                          {STATUS_LABELS[step]}
                        </Text>
                        {active && (
                          <Text style={[PP.caption, { color: colors.primary, marginTop: 2 }]}>
                            {STATUS_DESCRIPTIONS[step]}
                          </Text>
                        )}
                      </View>
                      {active && !isDelivered && (
                        <View style={[styles.etaChip, { backgroundColor: '#FFF7ED' }]}>
                          <Clock size={10} color="#FF6B00" />
                          <Text style={[PP.caption, { color: '#FF6B00', marginLeft: 3, fontSize: 10 }]}>
                            ~30 min
                          </Text>
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>

              {/* Map placeholder */}
              <View style={[styles.mapPlaceholder, { backgroundColor: colors.surfaceVariant, borderColor: colors.border }]}>
                <Navigation size={24} color={colors.mutedForeground} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={[PP.label, { color: colors.foreground }]}>Live Order Tracking</Text>
                  <Text style={[PP.caption, { color: colors.mutedForeground, marginTop: 2 }]}>
                    Map view coming soon
                  </Text>
                </View>
                <View style={[styles.soonBadge, { backgroundColor: colors.muted }]}>
                  <Text style={[PP.caption, { color: colors.mutedForeground, fontSize: 10 }]}>
                    Soon
                  </Text>
                </View>
              </View>
            </View>
          )}
        </Animated.View>

        {/* ── Items ── */}
        <Animated.View entering={FadeInDown.delay(120).duration(260).springify()}>
          <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <SectionLabel>{`ITEMS (${items.length})`}</SectionLabel>
            {items.map((item: DbOrderItem, idx) => (
              <View
                key={item.id}
                style={[
                  styles.itemRow,
                  idx < items.length - 1 && {
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    borderBottomColor: colors.border,
                  },
                ]}
              >
                <View style={[styles.qtyBadge, { backgroundColor: `${colors.primary}15` }]}>
                  <Text style={[PP.caption, { color: colors.primary, fontFamily: 'Poppins_600SemiBold' }]}>
                    {item.quantity}×
                  </Text>
                </View>
                <Text style={[PP.bodySM, { color: colors.foreground, flex: 1 }]} numberOfLines={2}>
                  {item.food_name}
                </Text>
                <Text style={[PP.bodySM, { color: colors.foreground, fontFamily: 'Poppins_600SemiBold' }]}>
                  ${(item.price * item.quantity).toFixed(2)}
                </Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* ── Payment ── */}
        <Animated.View entering={FadeInDown.delay(160).duration(260).springify()}>
          <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <SectionLabel>PAYMENT</SectionLabel>
            <View style={styles.paymentRow}>
              <View style={[styles.paymentIcon, { backgroundColor: `${colors.primary}15` }]}>
                <CreditCard size={18} color={colors.primary} />
              </View>
              <Text style={[PP.label, { color: colors.foreground }]}>{order.payment_method}</Text>
              <View style={[styles.paidBadge, { backgroundColor: '#F0FDF4' }]}>
                <Text style={[PP.caption, { color: '#16A34A', fontFamily: 'Poppins_600SemiBold' }]}>
                  Paid
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* ── Delivery address placeholder ── */}
        <Animated.View entering={FadeInDown.delay(190).duration(260).springify()}>
          <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <SectionLabel>DELIVERY ADDRESS</SectionLabel>
            <View style={styles.addressRow}>
              <View style={[styles.addressIcon, { backgroundColor: `${colors.primary}15` }]}>
                <MapPin size={18} color={colors.primary} />
              </View>
              <Text style={[PP.bodySM, { color: colors.mutedForeground, flex: 1 }]}>
                Address saved at time of order
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* ── Bill summary ── */}
        <Animated.View entering={FadeInDown.delay(220).duration(260).springify()}>
          <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <SectionLabel>PRICE BREAKDOWN</SectionLabel>
            <BillRow label="Subtotal" value={`$${subtotal.toFixed(2)}`} />
            {couponDiscount > 0 && (
              <BillRow label="Coupon Discount" value={`-$${couponDiscount.toFixed(2)}`} isSaving />
            )}
            <BillRow label="Delivery Fee" value={`$${DEFAULT_DELIVERY_FEE.toFixed(2)}`} dimmed />
            <BillRow label="Platform Fee" value={`$${PLATFORM_FEE.toFixed(2)}`} dimmed />
            <BillRow label="GST (5%)" value={`$${gst.toFixed(2)}`} dimmed />
            <View style={[styles.billDivider, { backgroundColor: colors.border }]} />
            <BillRow label="Grand Total" value={`$${grandTotal.toFixed(2)}`} isTotal />
          </View>
        </Animated.View>

        {/* ── Action buttons ── */}
        <Animated.View
          entering={FadeInDown.delay(260).duration(260).springify()}
          style={styles.actionsSection}
        >
          {/* Reorder */}
          {(isDelivered || isCancelled) && items.length > 0 && (
            <TouchableOpacity
              onPress={handleReorder}
              activeOpacity={0.85}
              style={[styles.reorderBtn, { backgroundColor: colors.primary }]}
              accessibilityLabel="Reorder this order"
            >
              <RefreshCw size={17} color="#fff" />
              <Text style={[PP.label, { color: '#fff', marginLeft: 8 }]}>Reorder</Text>
            </TouchableOpacity>
          )}

          {/* Invoice */}
          <TouchableOpacity
            onPress={() => router.push(`/invoice/${order.id}` as any)}
            activeOpacity={0.85}
            style={[
              styles.invoiceFullBtn,
              { borderColor: colors.border, backgroundColor: colors.card },
            ]}
            accessibilityLabel="View invoice"
          >
            <FileText size={17} color={colors.foreground} />
            <Text style={[PP.label, { color: colors.foreground, marginLeft: 8 }]}>
              View Invoice
            </Text>
            <ChevronRight size={15} color={colors.mutedForeground} style={{ marginLeft: 'auto' }} />
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backBtn: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  invoiceBtn: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  scroll: { flex: 1 },
  section: {
    margin: spacing.md,
    marginBottom: 0,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    padding: spacing.md,
  },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },

  // Order meta
  orderMeta: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md12 },
  statusChip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },

  // Cancelled
  cancelledRow: { flexDirection: 'row', alignItems: 'center' },

  // Tracker
  tracker: { gap: 0, marginBottom: spacing.md12 },
  trackerStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    minHeight: 44,
  },
  trackerLeft: { alignItems: 'center', width: 22 },
  trackerDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackerDotInner: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#fff' },
  trackerLine: { width: 2, flex: 1, minHeight: 22 },
  etaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 2,
  },

  // Map placeholder
  mapPlaceholder: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.md,
    borderWidth: 1,
    padding: spacing.md12,
  },
  soonBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },

  // Items
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 9,
  },
  qtyBadge: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6, flexShrink: 0 },

  // Payment
  paymentRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md12 },
  paymentIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  paidBadge: { marginLeft: 'auto', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },

  // Address
  addressRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md12 },
  addressIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  // Bill
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  billRowTotal: { marginTop: 2 },
  billDivider: { height: 1, marginVertical: spacing.sm },

  // Actions
  actionsSection: {
    margin: spacing.md,
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  reorderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
  },
  invoiceFullBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
  },
});
