// ─── Invoice Screen — Phase 10B ───────────────────────────────────────────────
// Full invoice summary for a placed order.

import React, { useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Download, FileText } from 'lucide-react-native';
import { useColors } from '@/hooks/useColors';
import { PP } from '@/theme/poppins';
import { borderRadius, spacing } from '@/theme';
import { useOrderStore } from '@/store/useOrderStore';
import { Skeleton } from '@/components/ui';
import type { DbOrderItem } from '@/types/db.types';

// ─── Constants ────────────────────────────────────────────────────────────────
const PLATFORM_FEE = 0.99;
const GST_RATE = 0.05;
const DEFAULT_DELIVERY_FEE = 2.99;

// ─── Row component ────────────────────────────────────────────────────────────
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
            color: isSaving ? '#16A34A' : isTotal ? colors.primary : dimmed ? colors.mutedForeground : colors.foreground,
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
export interface InvoiceScreenProps {
  orderId: string;
  onBack: () => void;
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export function InvoiceScreen({ orderId, onBack }: InvoiceScreenProps) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { selectedOrder, isLoading, fetchOrderById } = useOrderStore();

  useEffect(() => {
    fetchOrderById(orderId);
  }, [orderId]);

  const order = selectedOrder?.id === orderId ? selectedOrder : null;

  // Compute bill from items
  const items: DbOrderItem[] = order?.order_items ?? [];
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const gst = subtotal * GST_RATE;
  const grandTotal = order?.total ?? 0;
  // Reverse-engineer discount: grandTotal should equal subtotal + delivery + platform + gst - discount
  const expectedWithoutDiscount = subtotal + DEFAULT_DELIVERY_FEE + PLATFORM_FEE + gst;
  const couponDiscount = Math.max(0, parseFloat((expectedWithoutDiscount - grandTotal).toFixed(2)));

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

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      {/* Header */}
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
        <TouchableOpacity
          onPress={onBack}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          accessibilityLabel="Go back"
        >
          <View style={[styles.backBtn, { backgroundColor: colors.muted }]}>
            <ArrowLeft size={20} color={colors.foreground} strokeWidth={2} />
          </View>
        </TouchableOpacity>
        <Text style={[PP.h3, { color: colors.foreground }]}>Invoice</Text>
        {/* Download placeholder */}
        <TouchableOpacity
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          accessibilityLabel="Download invoice (coming soon)"
          style={[styles.downloadBtn, { backgroundColor: `${colors.primary}15` }]}
        >
          <Download size={17} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {isLoading || !order ? (
        <ScrollView contentContainerStyle={styles.skeleton}>
          <Skeleton height={24} radius={8} />
          <Skeleton height={16} radius={6} />
          <Skeleton height={120} radius={14} />
          <Skeleton height={180} radius={14} />
        </ScrollView>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: spacing.md, paddingBottom: insets.bottom + 32 }}
        >
          {/* ── Invoice header ── */}
          <View
            style={[
              styles.invoiceHeader,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <View style={[styles.invoiceIcon, { backgroundColor: `${colors.primary}15` }]}>
              <FileText size={24} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[PP.title, { color: colors.foreground }]}>Order Invoice</Text>
              <Text style={[PP.caption, { color: colors.mutedForeground, marginTop: 2 }]}>
                {orderNumber}
              </Text>
              <Text style={[PP.caption, { color: colors.mutedForeground }]}>{orderDate}</Text>
            </View>
          </View>

          {/* ── Restaurant ── */}
          <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[PP.overline, { color: colors.mutedForeground, marginBottom: spacing.sm }]}>
              FROM
            </Text>
            <Text style={[PP.label, { color: colors.foreground }]}>{order.restaurant_name}</Text>
          </View>

          {/* ── Items ── */}
          <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[PP.overline, { color: colors.mutedForeground, marginBottom: spacing.sm }]}>
              ITEMS ({items.length})
            </Text>
            {items.map((item, idx) => (
              <View
                key={item.id}
                style={[
                  styles.itemRow,
                  idx < items.length - 1 && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
                ]}
              >
                <View style={styles.itemLeft}>
                  <View style={[styles.qtyBadge, { backgroundColor: `${colors.primary}15` }]}>
                    <Text style={[PP.caption, { color: colors.primary, fontFamily: 'Poppins_600SemiBold' }]}>
                      {item.quantity}×
                    </Text>
                  </View>
                  <Text style={[PP.bodySM, { color: colors.foreground, flex: 1 }]} numberOfLines={2}>
                    {item.food_name}
                  </Text>
                </View>
                <Text style={[PP.bodySM, { color: colors.foreground, fontFamily: 'Poppins_600SemiBold' }]}>
                  ${(item.price * item.quantity).toFixed(2)}
                </Text>
              </View>
            ))}
          </View>

          {/* ── Price breakdown ── */}
          <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[PP.overline, { color: colors.mutedForeground, marginBottom: spacing.sm }]}>
              PRICE BREAKDOWN
            </Text>
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

          {/* ── Payment ── */}
          <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[PP.overline, { color: colors.mutedForeground, marginBottom: spacing.sm }]}>
              PAYMENT
            </Text>
            <BillRow label="Method" value={order.payment_method} />
            <BillRow label="Status" value="Paid" isSaving />
          </View>

          {/* ── Download placeholder ── */}
          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.downloadPlaceholder, { borderColor: colors.border, backgroundColor: colors.card }]}
            accessibilityLabel="Download invoice PDF (coming soon)"
          >
            <Download size={18} color={colors.mutedForeground} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={[PP.label, { color: colors.foreground }]}>Download Invoice</Text>
              <Text style={[PP.caption, { color: colors.mutedForeground }]}>PDF export — coming soon</Text>
            </View>
            <View style={[styles.soonBadge, { backgroundColor: colors.muted }]}>
              <Text style={[PP.caption, { color: colors.mutedForeground, fontSize: 10 }]}>Soon</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      )}
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
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  downloadBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Skeleton
  skeleton: { padding: spacing.md, gap: spacing.md12 },

  // Invoice header
  invoiceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md12,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    padding: spacing.md,
    marginBottom: spacing.md12,
  },
  invoiceIcon: {
    width: 52,
    height: 52,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  // Sections
  section: {
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    padding: spacing.md,
    marginBottom: spacing.md12,
  },

  // Items
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 9,
    gap: spacing.md12,
  },
  itemLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  qtyBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
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

  // Download
  downloadPlaceholder: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    padding: spacing.md,
    marginBottom: spacing.md12,
  },
  soonBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
});
