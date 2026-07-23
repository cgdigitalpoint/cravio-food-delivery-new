// ─── Order Details Screen ─────────────────────────────────────────────────────
import React, { useEffect } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, MapPin, Navigation } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useColors } from '@/hooks/useColors';
import { PP } from '@/theme/poppins';
import { useOrderStore } from '@/store/useOrderStore';
import type { DbOrder, DbOrderItem, OrderStatus } from '@/types/db.types';

const STATUS_STEPS: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered'];
const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Order Placed',
  confirmed: 'Confirmed',
  preparing: 'Preparing',
  out_for_delivery: 'On the Way',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

interface OrderDetailsScreenProps {
  orderId: string;
  onBack?: () => void;
}

export function OrderDetailsScreen({ orderId, onBack }: OrderDetailsScreenProps) {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { selectedOrder, isLoading, fetchOrderById } = useOrderStore();

  const paddingTop = Platform.OS === 'web' ? 60 : insets.top;
  const paddingBottom = Platform.OS === 'web' ? 34 : insets.bottom;

  useEffect(() => {
    fetchOrderById(orderId);
  }, [orderId]);

  const order: DbOrder | null = selectedOrder?.id === orderId ? selectedOrder : null;

  const currentStep = order ? STATUS_STEPS.indexOf(order.status as OrderStatus) : -1;
  const isCancelled = order?.status === 'cancelled';

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: paddingTop + 8, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={onBack} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <View style={[styles.backBtn, { backgroundColor: colors.muted }]}>
            <ArrowLeft size={20} color={colors.foreground} strokeWidth={2} />
          </View>
        </TouchableOpacity>
        <Text style={[PP.h3, { color: colors.foreground }]}>Order Details</Text>
        <View style={{ width: 40 }} />
      </View>

      {isLoading || !order ? (
        <View style={styles.centered}>
          <Text style={[PP.body, { color: colors.mutedForeground }]}>Loading order…</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={{ paddingBottom: paddingBottom + 24 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Restaurant + date */}
          <View style={[styles.section, { backgroundColor: colors.card }]}>
            <Text style={[PP.h3, { color: colors.foreground }]}>{order.restaurant_name}</Text>
            <Text style={[PP.caption, { color: colors.mutedForeground, marginTop: 4 }]}>
              Order #{order.id.slice(0, 8).toUpperCase()} ·{' '}
              {new Date(order.created_at).toLocaleDateString('en-US', {
                day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
              })}
            </Text>
          </View>

          {/* Status tracker */}
          {!isCancelled && (
            <View style={[styles.section, { backgroundColor: colors.card }]}>
              <Text style={[PP.label, { color: colors.foreground, marginBottom: 20 }]}>Order Status</Text>
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
                              backgroundColor: done ? '#FF6B00' : colors.border,
                              borderColor: active ? '#FF6B00' : done ? '#FF6B00' : colors.border,
                            },
                          ]}
                        >
                          {done && <View style={styles.trackerDotInner} />}
                        </View>
                        {index < STATUS_STEPS.length - 1 && (
                          <View style={[styles.trackerLine, { backgroundColor: currentStep > index ? '#FF6B00' : colors.border }]} />
                        )}
                      </View>
                      <Text
                        style={[
                          PP.bodySM,
                          {
                            color: done ? colors.foreground : colors.mutedForeground,
                            fontFamily: active ? 'Poppins_600SemiBold' : 'Poppins_400Regular',
                            paddingTop: 2,
                          },
                        ]}
                      >
                        {STATUS_LABELS[step]}
                      </Text>
                    </View>
                  );
                })}
              </View>

              {/* Track placeholder */}
              <TouchableOpacity style={[styles.trackBtn, { backgroundColor: '#FF6B0015' }]} activeOpacity={0.8}>
                <Navigation size={16} color="#FF6B00" />
                <Text style={[PP.label, { color: '#FF6B00' }]}>Track Order (Coming Soon)</Text>
              </TouchableOpacity>
            </View>
          )}

          {isCancelled && (
            <View style={[styles.section, { backgroundColor: '#FEF2F2' }]}>
              <Text style={[PP.label, { color: '#DC2626' }]}>❌ This order was cancelled.</Text>
            </View>
          )}

          {/* Items */}
          <View style={[styles.section, { backgroundColor: colors.card }]}>
            <Text style={[PP.label, { color: colors.foreground, marginBottom: 12 }]}>
              Items ({order.order_items?.length ?? 0})
            </Text>
            {(order.order_items ?? []).map((item: DbOrderItem) => (
              <View key={item.id} style={[styles.itemRow, { borderBottomColor: colors.border }]}>
                <View style={styles.itemLeft}>
                  <Text style={[PP.bodySM, { color: colors.mutedForeground }]}>{item.quantity}×</Text>
                  <Text style={[PP.bodySM, { color: colors.foreground }]}>{item.food_name}</Text>
                </View>
                <Text style={[PP.bodySM, { color: colors.foreground }]}>
                  ${(item.price * item.quantity).toFixed(2)}
                </Text>
              </View>
            ))}
          </View>

          {/* Bill summary */}
          <View style={[styles.section, { backgroundColor: colors.card }]}>
            <Text style={[PP.label, { color: colors.foreground, marginBottom: 12 }]}>Bill Summary</Text>
            <View style={styles.billRow}>
              <Text style={[PP.bodySM, { color: colors.mutedForeground }]}>Subtotal</Text>
              <Text style={[PP.bodySM, { color: colors.foreground }]}>${order.total.toFixed(2)}</Text>
            </View>
            <View style={styles.billRow}>
              <Text style={[PP.bodySM, { color: colors.mutedForeground }]}>Payment</Text>
              <Text style={[PP.bodySM, { color: colors.foreground }]}>{order.payment_method}</Text>
            </View>
            <View style={[styles.billRow, styles.billTotal]}>
              <Text style={[PP.label, { color: colors.foreground }]}>Total</Text>
              <Text style={[PP.label, { color: '#FF6B00' }]}>${order.total.toFixed(2)}</Text>
            </View>
          </View>
        </ScrollView>
      )}
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
  backBtn: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  scroll: { flex: 1 },
  section: { margin: 16, marginBottom: 0, borderRadius: 16, padding: 16 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  tracker: { gap: 0 },
  trackerStep: { flexDirection: 'row', alignItems: 'flex-start', gap: 14, minHeight: 44 },
  trackerLeft: { alignItems: 'center', width: 20 },
  trackerDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackerDotInner: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#FFFFFF' },
  trackerLine: { width: 2, flex: 1, minHeight: 24 },
  trackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  itemLeft: { flexDirection: 'row', gap: 8, flex: 1 },
  billRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  billTotal: { borderTopWidth: StyleSheet.hairlineWidth, marginTop: 4, paddingTop: 12 },
});
