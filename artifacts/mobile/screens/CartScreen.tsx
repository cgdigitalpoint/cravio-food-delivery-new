// ─── Cart Screen — Phase 5 ────────────────────────────────────────────────────
// Items · quantity controls · coupon · bill breakdown · checkout CTA.

import React, { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  ChevronRight,
  Info,
  Minus,
  Plus,
  ShoppingCart,
  Tag,
  Trash2,
  X,
} from 'lucide-react-native';

import { useColors } from '@/hooks/useColors';
import { PP } from '@/theme/poppins';
import { useCartStore } from '@/store/useCartStore';
import { PROMO_CODES } from '@/data/restaurantData';

// ─── Cart Item Row ─────────────────────────────────────────────────────────────

function CartItemRow({
  cartId,
  name,
  imageUrl,
  price,
  quantity,
  isVeg,
  onIncrease,
  onDecrease,
  onRemove,
}: {
  cartId: string;
  name: string;
  imageUrl: string;
  price: number;
  quantity: number;
  isVeg?: boolean;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
}) {
  const colors = useColors();
  const [note, setNote] = useState('');
  const [showNote, setShowNote] = useState(false);

  return (
    <View style={[cirStyles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={cirStyles.row}>
        {/* Veg dot */}
        <View style={[cirStyles.vegBox, { borderColor: isVeg ? '#16A34A' : '#DC2626' }]}>
          <View style={[cirStyles.vegDot, { backgroundColor: isVeg ? '#16A34A' : '#DC2626' }]} />
        </View>

        <Image source={{ uri: imageUrl }} style={cirStyles.img} resizeMode="cover" />

        <View style={cirStyles.info}>
          <Text style={[PP.label, { color: colors.foreground }]} numberOfLines={2}>
            {name}
          </Text>
          <Text style={[PP.subtitle, { color: colors.primary, fontFamily: 'Poppins_700Bold', marginTop: 4 }]}>
            ${(price * quantity).toFixed(2)}
          </Text>
          <Text style={[PP.caption, { color: colors.mutedForeground }]}>
            ${price.toFixed(2)} each
          </Text>
        </View>

        {/* Qty controls */}
        <View style={cirStyles.qtyCol}>
          <TouchableOpacity
            onPress={onRemove}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={cirStyles.removeBtn}
          >
            <Trash2 size={14} color={colors.mutedForeground} />
          </TouchableOpacity>
          <View style={[cirStyles.qtyRow, { borderColor: colors.border }]}>
            <TouchableOpacity onPress={onDecrease} style={cirStyles.qtyBtn} hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
              <Minus size={14} color={colors.primary} strokeWidth={2.5} />
            </TouchableOpacity>
            <Text style={[PP.label, { color: colors.foreground, minWidth: 22, textAlign: 'center' }]}>
              {quantity}
            </Text>
            <TouchableOpacity onPress={onIncrease} style={cirStyles.qtyBtn} hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
              <Plus size={14} color={colors.primary} strokeWidth={2.5} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Special instructions */}
      <TouchableOpacity
        onPress={() => setShowNote((v) => !v)}
        style={cirStyles.noteToggle}
        activeOpacity={0.7}
      >
        <Text style={[PP.caption, { color: colors.primary }]}>
          {showNote ? 'Hide instructions' : '+ Add special instructions'}
        </Text>
      </TouchableOpacity>

      {showNote && (
        <TextInput
          value={note}
          onChangeText={setNote}
          placeholder="e.g. No onions, extra sauce..."
          placeholderTextColor={colors.mutedForeground}
          style={[
            cirStyles.noteInput,
            { color: colors.foreground, backgroundColor: colors.surfaceVariant, borderColor: colors.border },
          ]}
          multiline
          numberOfLines={2}
        />
      )}
    </View>
  );
}

const cirStyles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
  },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  vegBox: { width: 14, height: 14, borderWidth: 1.5, borderRadius: 2, alignItems: 'center', justifyContent: 'center', marginTop: 3 },
  vegDot: { width: 7, height: 7, borderRadius: 4 },
  img: { width: 70, height: 70, borderRadius: 10 },
  info: { flex: 1 },
  qtyCol: { alignItems: 'center', gap: 8 },
  removeBtn: { padding: 4 },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    overflow: 'hidden',
  },
  qtyBtn: { padding: 8 },
  noteToggle: { marginTop: 10 },
  noteInput: {
    marginTop: 8,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    fontFamily: 'Poppins_400Regular',
    textAlignVertical: 'top',
    minHeight: 56,
  },
});

// ─── Bill Row ──────────────────────────────────────────────────────────────────

function BillRow({
  label,
  value,
  isTotal,
  isSaving,
  info,
}: {
  label: string;
  value: string;
  isTotal?: boolean;
  isSaving?: boolean;
  info?: string;
}) {
  const colors = useColors();
  return (
    <View style={billStyles.row}>
      <View style={billStyles.labelWrap}>
        <Text
          style={[
            isTotal ? PP.subtitle : PP.bodySM,
            {
              color: isTotal ? colors.foreground : colors.mutedForeground,
              fontFamily: isTotal ? 'Poppins_600SemiBold' : 'Poppins_400Regular',
            },
          ]}
        >
          {label}
        </Text>
        {info && <Info size={12} color={colors.mutedForeground} style={{ marginLeft: 4 }} />}
      </View>
      <Text
        style={[
          isTotal ? PP.subtitle : PP.bodySM,
          {
            color: isSaving ? '#16A34A' : isTotal ? colors.foreground : colors.mutedForeground,
            fontFamily: isTotal ? 'Poppins_700Bold' : 'Poppins_500Medium',
          },
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

const billStyles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 7 },
  labelWrap: { flexDirection: 'row', alignItems: 'center' },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────

export function CartScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const {
    items,
    subtotal,
    totalAmount,
    itemCount,
    deliveryFee,
    promoCode,
    promoDiscount,
    restaurantName,
    removeItem,
    updateQuantity,
    applyPromoCode,
    removePromoCode,
  } = useCartStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponApplying, setCouponApplying] = useState(false);

  const DELIVERY = deliveryFee > 0 ? deliveryFee : 2.49;
  const PLATFORM_FEE = 0.99;
  const TAX_RATE = 0.05;
  const taxes = subtotal * TAX_RATE;
  const grandTotal = Math.max(0, subtotal - promoDiscount) + DELIVERY + PLATFORM_FEE + taxes;

  const handleApplyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    const discount = PROMO_CODES[code];
    if (discount !== undefined) {
      applyPromoCode(code, discount);
      setCouponError('');
      setCouponInput('');
    } else {
      setCouponError('Invalid coupon code. Try CRAVIO20 or FIRST50');
    }
  };

  const handleRemoveCoupon = () => {
    removePromoCode();
    setCouponError('');
  };

  if (items.length === 0) {
    return (
      <View style={[styles.screen, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { paddingTop: insets.top + 8, borderColor: colors.border, backgroundColor: colors.background }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <ArrowLeft size={22} color={colors.foreground} strokeWidth={2.5} />
          </TouchableOpacity>
          <Text style={[PP.title, { color: colors.foreground }]}>Your Cart</Text>
          <View style={{ width: 38 }} />
        </View>
        <View style={styles.empty}>
          <ShoppingCart size={64} color={colors.border} strokeWidth={1.5} />
          <Text style={[PP.h3, { color: colors.foreground, marginTop: 20, textAlign: 'center' }]}>
            Your cart is empty
          </Text>
          <Text style={[PP.body, { color: colors.mutedForeground, marginTop: 8, textAlign: 'center' }]}>
            Add items from a restaurant to get started
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            style={[styles.browseBtn, { backgroundColor: colors.primary }]}
          >
            <Text style={[PP.button, { color: '#fff' }]}>Browse Restaurants</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.screen, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8, borderColor: colors.border, backgroundColor: colors.background }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <ArrowLeft size={22} color={colors.foreground} strokeWidth={2.5} />
        </TouchableOpacity>
        <View style={{ alignItems: 'center' }}>
          <Text style={[PP.title, { color: colors.foreground }]}>Your Cart</Text>
          {restaurantName && (
            <Text style={[PP.caption, { color: colors.mutedForeground }]}>{restaurantName}</Text>
          )}
        </View>
        <View style={[styles.countBadge, { backgroundColor: colors.primary }]}>
          <Text style={[PP.caption, { color: '#fff', fontFamily: 'Poppins_600SemiBold' }]}>{itemCount}</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 + insets.bottom }}
      >
        {/* ── Items ── */}
        <Text style={[PP.overline, { color: colors.mutedForeground, marginHorizontal: 20, marginTop: 20, marginBottom: 12 }]}>
          Order Items
        </Text>

        {items.map((ci) => (
          <CartItemRow
            key={ci.id}
            cartId={ci.id}
            name={ci.menuItem.name}
            imageUrl={ci.menuItem.imageUrl}
            price={ci.menuItem.price}
            quantity={ci.quantity}
            isVeg={(ci.menuItem as any).isVeg}
            onIncrease={() => updateQuantity(ci.id, ci.quantity + 1)}
            onDecrease={() => {
              if (ci.quantity <= 1) {
                Alert.alert('Remove item?', `Remove ${ci.menuItem.name} from your cart?`, [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Remove', style: 'destructive', onPress: () => removeItem(ci.id) },
                ]);
              } else {
                updateQuantity(ci.id, ci.quantity - 1);
              }
            }}
            onRemove={() => {
              Alert.alert('Remove item?', `Remove ${ci.menuItem.name} from your cart?`, [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Remove', style: 'destructive', onPress: () => removeItem(ci.id) },
              ]);
            }}
          />
        ))}

        {/* ── Coupon ── */}
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.couponHeader}>
            <Tag size={16} color={colors.primary} />
            <Text style={[PP.label, { color: colors.foreground, marginLeft: 8 }]}>Coupon Code</Text>
          </View>

          {promoCode ? (
            <View style={[styles.couponApplied, { backgroundColor: '#F0FDF4', borderColor: '#BBF7D0' }]}>
              <View>
                <Text style={[PP.label, { color: '#16A34A' }]}>🎉 {promoCode} applied!</Text>
                <Text style={[PP.caption, { color: '#16A34A' }]}>You save ${promoDiscount.toFixed(2)}</Text>
              </View>
              <TouchableOpacity onPress={handleRemoveCoupon} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <X size={16} color="#16A34A" />
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <View style={styles.couponRow}>
                <TextInput
                  value={couponInput}
                  onChangeText={(t) => { setCouponInput(t); setCouponError(''); }}
                  placeholder="Enter coupon code"
                  placeholderTextColor={colors.mutedForeground}
                  autoCapitalize="characters"
                  style={[
                    styles.couponInput,
                    { color: colors.foreground, backgroundColor: colors.surfaceVariant, borderColor: couponError ? '#EF4444' : colors.border },
                  ]}
                />
                <TouchableOpacity
                  onPress={handleApplyCoupon}
                  style={[styles.applyBtn, { backgroundColor: couponInput.trim() ? colors.primary : colors.muted }]}
                  disabled={!couponInput.trim()}
                >
                  <Text style={[PP.buttonSM, { color: couponInput.trim() ? '#fff' : colors.mutedForeground }]}>Apply</Text>
                </TouchableOpacity>
              </View>
              {couponError ? (
                <Text style={[PP.caption, { color: '#EF4444', marginTop: 6 }]}>{couponError}</Text>
              ) : null}
              <Text style={[PP.caption, { color: colors.mutedForeground, marginTop: 6 }]}>
                Try: FIRST50 · CRAVIO20 · FREEDEL
              </Text>
            </>
          )}
        </View>

        {/* ── Bill Details ── */}
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[PP.label, { color: colors.foreground, marginBottom: 12 }]}>Bill Details</Text>

          <BillRow label="Item Total" value={`$${subtotal.toFixed(2)}`} />
          <BillRow label="Delivery Charges" value={`$${DELIVERY.toFixed(2)}`} info="Based on distance" />
          <BillRow label="Platform Fee" value={`$${PLATFORM_FEE.toFixed(2)}`} info="One-time charge" />
          <BillRow label="Taxes & Charges" value={`$${taxes.toFixed(2)}`} info="GST & local taxes" />

          {promoDiscount > 0 && (
            <BillRow
              label={`Coupon (${promoCode})`}
              value={`-$${promoDiscount.toFixed(2)}`}
              isSaving
            />
          )}

          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <BillRow label="Grand Total" value={`$${grandTotal.toFixed(2)}`} isTotal />
        </View>

        {/* ── Savings callout ── */}
        {promoDiscount > 0 && (
          <View style={[styles.savingsBar, { backgroundColor: '#F0FDF4' }]}>
            <Text style={[PP.label, { color: '#16A34A' }]}>
              🎉 You are saving ${promoDiscount.toFixed(2)} on this order!
            </Text>
          </View>
        )}
      </ScrollView>

      {/* ── Checkout CTA ── */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 12, backgroundColor: colors.background, borderColor: colors.border }]}>
        <View style={styles.footerTotal}>
          <Text style={[PP.caption, { color: colors.mutedForeground }]}>Total</Text>
          <Text style={[PP.title, { color: colors.foreground }]}>${grandTotal.toFixed(2)}</Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push('/checkout')}
          activeOpacity={0.9}
          style={styles.checkoutBtnWrap}
        >
          <LinearGradient
            colors={['#FF8C38', '#FF6B00']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.checkoutBtn}
          >
            <Text style={[PP.button, { color: '#fff' }]}>Proceed to Checkout</Text>
            <ChevronRight size={18} color="#fff" strokeWidth={2.5} />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  backBtn: { width: 38, alignItems: 'flex-start' },
  countBadge: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  section: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  couponHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  couponRow: { flexDirection: 'row', gap: 10 },
  couponInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontFamily: 'Poppins_500Medium',
    fontSize: 14,
    letterSpacing: 1,
  },
  applyBtn: {
    paddingHorizontal: 18,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  couponApplied: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  divider: { height: 1, marginVertical: 12 },
  savingsBar: {
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 14,
    borderTopWidth: 1,
  },
  footerTotal: { alignItems: 'flex-start' },
  checkoutBtnWrap: { flex: 1, borderRadius: 16, overflow: 'hidden' },
  checkoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 16,
  },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
  browseBtn: { marginTop: 24, paddingHorizontal: 32, paddingVertical: 14, borderRadius: 16 },
});
