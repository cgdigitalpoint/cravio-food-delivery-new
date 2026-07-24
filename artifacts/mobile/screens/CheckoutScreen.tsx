// ─── Checkout Screen — Phase 10A ──────────────────────────────────────────────
// Full pre-order checkout: items · address · delivery options · coupon ·
// payment · price summary · validation.
// Phase ends at "Place Order" validation step — no order is created here.

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  AlertCircle,
  ArrowLeft,
  ChevronRight,
  Clock,
  Edit3,
  MapPin,
  Plus,
} from 'lucide-react-native';

import { useColors } from '@/hooks/useColors';
import { PP } from '@/theme/poppins';
import { borderRadius, spacing } from '@/theme';
import { useCartStore } from '@/store/useCartStore';
import { useAddressStore } from '@/store/useAddressStore';
import { useAuthStore } from '@/store/useAuthStore';
import { EmptyState, Skeleton } from '@/components/ui';
import {
  CheckoutItemRow,
  CouponInput,
  DeliveryOptions,
  PaymentSelector,
  PriceSummary,
} from '@/components/checkout';
import type { DeliveryOptionsValue, PaymentMethod } from '@/components/checkout';
import type { DbAddress } from '@/types/db.types';
import { RESTAURANTS } from '@/data/homeData';

// ─── Constants ────────────────────────────────────────────────────────────────
const PLATFORM_FEE = 0.99;
const GST_RATE = 0.05;
const DEFAULT_DELIVERY_FEE = 2.99;

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

// ─── Restaurant Banner ────────────────────────────────────────────────────────
function RestaurantBanner({
  restaurantId,
  restaurantName,
  itemCount,
}: {
  restaurantId: string | null;
  restaurantName: string | null;
  itemCount: number;
}) {
  const colors = useColors();
  const restaurant = restaurantId
    ? RESTAURANTS.find((r) => r.id === restaurantId)
    : null;

  return (
    <View
      style={[
        styles.restBanner,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      {restaurant?.imageUri ? (
        <Image
          source={{ uri: restaurant.imageUri }}
          style={styles.restImg}
          contentFit="cover"
        />
      ) : (
        <LinearGradient
          colors={['#FF8C38', '#FF6B00']}
          style={styles.restImg}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      )}
      <View style={{ flex: 1, marginLeft: spacing.md12 }}>
        <Text
          style={[PP.label, { color: colors.foreground }]}
          numberOfLines={1}
        >
          {restaurantName ?? 'Restaurant'}
        </Text>
        <Text style={[PP.caption, { color: colors.mutedForeground, marginTop: 2 }]}>
          {itemCount} {itemCount === 1 ? 'item' : 'items'} in your order
        </Text>
      </View>
      <View style={[styles.etaChipSmall, { backgroundColor: '#FFF7ED' }]}>
        <Clock size={12} color="#FF6B00" />
        <Text
          style={[PP.caption, { color: '#FF6B00', marginLeft: 4, fontFamily: 'Poppins_500Medium' }]}
        >
          30–45 min
        </Text>
      </View>
    </View>
  );
}

// ─── Address Row ──────────────────────────────────────────────────────────────
function AddressRow({
  address,
  selected,
  onSelect,
  onEdit,
}: {
  address: DbAddress;
  selected: boolean;
  onSelect: () => void;
  onEdit: () => void;
}) {
  const colors = useColors();
  return (
    <TouchableOpacity
      onPress={onSelect}
      activeOpacity={0.8}
      style={[
        styles.addrCard,
        {
          backgroundColor: selected ? `${colors.primary}0D` : colors.card,
          borderColor: selected ? colors.primary : colors.border,
        },
      ]}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={`${address.title}: ${address.house}, ${address.street}`}
    >
      <View
        style={[
          styles.addrIconWrap,
          { backgroundColor: selected ? `${colors.primary}18` : colors.surfaceVariant },
        ]}
      >
        <MapPin size={17} color={selected ? colors.primary : colors.mutedForeground} />
      </View>
      <View style={{ flex: 1 }}>
        <View style={styles.addrTitleRow}>
          <Text style={[PP.label, { color: colors.foreground }]}>{address.title}</Text>
          {address.is_default && (
            <View style={[styles.defaultBadge, { backgroundColor: `${colors.primary}18` }]}>
              <Text
                style={[PP.caption, { color: colors.primary, fontSize: 10, fontFamily: 'Poppins_600SemiBold' }]}
              >
                Default
              </Text>
            </View>
          )}
        </View>
        <Text
          style={[PP.caption, { color: colors.mutedForeground, marginTop: 2 }]}
          numberOfLines={1}
        >
          {address.house}, {address.street}
        </Text>
        <Text
          style={[PP.caption, { color: colors.mutedForeground }]}
          numberOfLines={1}
        >
          {address.city}, {address.state} {address.pincode}
        </Text>
      </View>
      <View style={styles.addrRight}>
        <TouchableOpacity
          onPress={onEdit}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityLabel={`Edit ${address.title} address`}
        >
          <Edit3 size={15} color={colors.mutedForeground} />
        </TouchableOpacity>
        {selected ? (
          <View style={[styles.radio, { borderColor: colors.primary, backgroundColor: colors.primary }]}>
            <View style={styles.radioDot} />
          </View>
        ) : (
          <View style={[styles.radio, { borderColor: colors.border }]} />
        )}
      </View>
    </TouchableOpacity>
  );
}

// ─── Validation Banner ────────────────────────────────────────────────────────
function ValidationBanner({ message }: { message: string }) {
  return (
    <Animated.View
      entering={FadeIn.duration(200)}
      style={styles.validationBanner}
    >
      <AlertCircle size={15} color="#EF4444" />
      <Text style={[PP.caption, { color: '#DC2626', marginLeft: 8, flex: 1 }]}>
        {message}
      </Text>
    </Animated.View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export function CheckoutScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const {
    items,
    restaurantId,
    restaurantName,
    subtotal,
    deliveryFee,
    promoCode,
    promoDiscount,
    itemCount,
    updateQuantity,
    removeItem,
    applyPromoCode,
    removePromoCode,
  } = useCartStore();

  const { addresses, isLoading: addressLoading, fetchAddresses } = useAddressStore();
  const { supabaseUserId } = useAuthStore();

  // ── Local state ───────────────────────────────────────────────────────────
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null);
  const [cookingNotes, setCookingNotes] = useState<Record<string, string>>({});
  const [deliveryOpts, setDeliveryOpts] = useState<DeliveryOptionsValue>({
    type: 'asap',
    contactless: false,
    note: '',
  });

  // ── Fetch addresses on mount and when userId changes ──────────────────────
  useEffect(() => {
    if (supabaseUserId) fetchAddresses(supabaseUserId);
  }, [supabaseUserId]);

  // ── Auto-select default (or first) address once addresses load ────────────
  useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId) {
      const def = addresses.find((a) => a.is_default) ?? addresses[0];
      setSelectedAddressId(def.id);
    }
  }, [addresses]);

  // ── Price calculation ─────────────────────────────────────────────────────
  const actualDeliveryFee = deliveryFee > 0 ? deliveryFee : DEFAULT_DELIVERY_FEE;
  const gst = subtotal * GST_RATE;
  const grandTotal =
    Math.max(0, subtotal - promoDiscount) +
    actualDeliveryFee +
    PLATFORM_FEE +
    gst;

  // ── Validation ────────────────────────────────────────────────────────────
  const validationError = useMemo(() => {
    if (itemCount === 0) return 'Your cart is empty. Add items before checkout.';
    if (!selectedAddressId) return 'Please select a delivery address.';
    if (!selectedPayment) return 'Please select a payment method.';
    return null;
  }, [itemCount, selectedAddressId, selectedPayment]);

  const handleCookingNote = useCallback(
    (cartItemId: string, note: string) => {
      setCookingNotes((prev) => ({ ...prev, [cartItemId]: note }));
    },
    [],
  );

  const handlePlaceOrder = () => {
    if (validationError) return;
    const selectedAddr = addresses.find((a) => a.id === selectedAddressId);
    const paymentLabel =
      selectedPayment === 'cod'
        ? 'Cash on Delivery'
        : selectedPayment === 'upi'
        ? 'UPI'
        : 'Online';

    Alert.alert(
      '✓ Ready to Place Order',
      `Delivering to: ${selectedAddr?.title ?? 'Selected Address'}\nPayment: ${paymentLabel}\nTotal: $${grandTotal.toFixed(2)}\n\nOrder placement will be completed in Phase 10B.`,
      [{ text: 'Got it', style: 'default' }],
    );
  };

  // ── Empty cart state ──────────────────────────────────────────────────────
  if (itemCount === 0) {
    return (
      <View style={[styles.screen, { backgroundColor: colors.background }]}>
        <View
          style={[
            styles.header,
            { paddingTop: insets.top + 8, borderBottomColor: colors.border, backgroundColor: colors.background },
          ]}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <ArrowLeft size={22} color={colors.foreground} strokeWidth={2.5} />
          </TouchableOpacity>
          <Text style={[PP.title, { color: colors.foreground }]}>Checkout</Text>
          <View style={{ width: 38 }} />
        </View>
        <EmptyState
          variant="emptyCart"
          title="Your cart is empty"
          subtitle="Add some items from a restaurant to start checkout."
          ctaText="Browse Restaurants"
          onCtaPress={() => router.replace('/home')}
        />
      </View>
    );
  }

  // ── Main checkout flow ────────────────────────────────────────────────────
  return (
    <KeyboardAvoidingView
      style={[styles.screen, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + 8,
            borderBottomColor: colors.border,
            backgroundColor: colors.background,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityLabel="Go back"
        >
          <ArrowLeft size={22} color={colors.foreground} strokeWidth={2.5} />
        </TouchableOpacity>
        <Text style={[PP.title, { color: colors.foreground }]}>Checkout</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingHorizontal: spacing.md,
          paddingTop: spacing.md,
          paddingBottom: 148 + insets.bottom,
        }}
      >
        {/* ── Restaurant summary ── */}
        <Animated.View entering={FadeInDown.delay(0).duration(280).springify()}>
          <RestaurantBanner
            restaurantId={restaurantId}
            restaurantName={restaurantName}
            itemCount={itemCount}
          />
        </Animated.View>

        {/* ── Order items ── */}
        <Animated.View
          entering={FadeInDown.delay(40).duration(280).springify()}
          style={styles.section}
        >
          <SectionLabel>YOUR ORDER</SectionLabel>
          {items.map((ci) => (
            <CheckoutItemRow
              key={ci.cartItemId}
              cartItemId={ci.cartItemId}
              name={ci.menuItem.name}
              imageUrl={
                (ci.menuItem as any).imageUrl ??
                (ci.menuItem as any).imageUri ??
                ''
              }
              price={ci.menuItem.price}
              quantity={ci.quantity}
              isVeg={(ci.menuItem as any).isVeg}
              cookingNote={cookingNotes[ci.cartItemId] ?? ''}
              onCookingNoteChange={handleCookingNote}
              onIncrease={() => updateQuantity(ci.cartItemId, ci.quantity + 1)}
              onDecrease={() => updateQuantity(ci.cartItemId, ci.quantity - 1)}
              onRemove={() => removeItem(ci.cartItemId)}
            />
          ))}
        </Animated.View>

        {/* ── Delivery Address ── */}
        <Animated.View
          entering={FadeInDown.delay(80).duration(280).springify()}
          style={styles.section}
        >
          <SectionLabel>DELIVERY ADDRESS</SectionLabel>

          {addressLoading && addresses.length === 0 ? (
            <View style={{ gap: spacing.md12 }}>
              <Skeleton height={90} radius={14} />
              <Skeleton height={90} radius={14} />
            </View>
          ) : addresses.length === 0 ? (
            <View
              style={[
                styles.addrEmpty,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <MapPin size={28} color={colors.mutedForeground} />
              <Text
                style={[PP.bodySM, { color: colors.mutedForeground, textAlign: 'center', marginTop: 8 }]}
              >
                No saved addresses yet.{'\n'}Add one below to continue.
              </Text>
            </View>
          ) : (
            addresses.map((addr) => (
              <AddressRow
                key={addr.id}
                address={addr}
                selected={selectedAddressId === addr.id}
                onSelect={() => setSelectedAddressId(addr.id)}
                onEdit={() => router.push(`/address/${addr.id}` as any)}
              />
            ))
          )}

          {/* Add new address */}
          <TouchableOpacity
            onPress={() => router.push('/address/new')}
            style={[
              styles.addAddrBtn,
              { borderColor: colors.primary, backgroundColor: colors.card },
            ]}
            activeOpacity={0.75}
            accessibilityLabel="Add new address"
          >
            <Plus size={16} color={colors.primary} />
            <Text style={[PP.label, { color: colors.primary, marginLeft: 8 }]}>
              Add New Address
            </Text>
          </TouchableOpacity>

          {/* Manage all */}
          <TouchableOpacity
            onPress={() => router.push('/address')}
            style={styles.manageLink}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityLabel="Manage all addresses"
          >
            <Text style={[PP.caption, { color: colors.primary }]}>
              Manage all addresses
            </Text>
            <ChevronRight size={13} color={colors.primary} />
          </TouchableOpacity>
        </Animated.View>

        {/* ── Delivery Options ── */}
        <Animated.View
          entering={FadeInDown.delay(120).duration(280).springify()}
          style={styles.section}
        >
          <SectionLabel>DELIVERY OPTIONS</SectionLabel>
          <DeliveryOptions value={deliveryOpts} onChange={setDeliveryOpts} />
        </Animated.View>

        {/* ── Coupon ── */}
        <Animated.View
          entering={FadeInDown.delay(160).duration(280).springify()}
          style={styles.section}
        >
          <SectionLabel>COUPON / PROMO CODE</SectionLabel>
          <CouponInput
            appliedCode={promoCode}
            appliedDiscount={promoDiscount}
            onApply={applyPromoCode}
            onRemove={removePromoCode}
          />
        </Animated.View>

        {/* ── Payment Method ── */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(280).springify()}
          style={styles.section}
        >
          <SectionLabel>PAYMENT METHOD</SectionLabel>
          <PaymentSelector
            selected={selectedPayment}
            onSelect={setSelectedPayment}
          />
        </Animated.View>

        {/* ── Price Summary ── */}
        <Animated.View
          entering={FadeInDown.delay(240).duration(280).springify()}
          style={styles.section}
        >
          <SectionLabel>PRICE BREAKDOWN</SectionLabel>
          <PriceSummary
            subtotal={subtotal}
            discount={0}
            couponDiscount={promoDiscount}
            deliveryFee={actualDeliveryFee}
            platformFee={PLATFORM_FEE}
            gst={gst}
            grandTotal={grandTotal}
          />
        </Animated.View>
      </ScrollView>

      {/* ── Sticky footer CTA ── */}
      <View
        style={[
          styles.footer,
          {
            paddingBottom: insets.bottom + 12,
            backgroundColor: colors.background,
            borderTopColor: colors.border,
          },
        ]}
      >
        {validationError && <ValidationBanner message={validationError} />}

        <TouchableOpacity
          onPress={handlePlaceOrder}
          disabled={!!validationError}
          activeOpacity={0.9}
          style={[styles.orderBtnWrap, { opacity: validationError ? 0.55 : 1 }]}
          accessibilityLabel="Place order"
          accessibilityState={{ disabled: !!validationError }}
        >
          <LinearGradient
            colors={['#FF8C38', '#FF6B00']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.orderBtn}
          >
            <View>
              <Text style={[PP.button, { color: '#fff' }]}>Place Order</Text>
              <Text style={[PP.caption, { color: 'rgba(255,255,255,0.8)', textAlign: 'center' }]}>
                ${grandTotal.toFixed(2)} ·{' '}
                {selectedPayment === 'cod'
                  ? 'Cash on Delivery'
                  : selectedPayment === 'upi'
                  ? 'UPI'
                  : selectedPayment
                  ? 'Online'
                  : 'Select payment'}
              </Text>
            </View>
            <ChevronRight size={22} color="#fff" strokeWidth={2.5} />
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
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md12,
    borderBottomWidth: 1,
  },
  backBtn: { width: 38, alignItems: 'flex-start' },
  section: { marginTop: spacing.xl },

  // Restaurant banner
  restBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    padding: spacing.md12,
  },
  restImg: {
    width: 52,
    height: 52,
    borderRadius: borderRadius.md,
    flexShrink: 0,
  },
  etaChipSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: borderRadius.pill,
  },

  // Address row
  addrCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md12,
    borderWidth: 1.5,
    borderRadius: borderRadius.lg,
    padding: spacing.md12,
    marginBottom: spacing.sm,
  },
  addrIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  addrTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  defaultBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 5,
  },
  addrRight: {
    alignItems: 'center',
    gap: spacing.sm,
    flexShrink: 0,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#fff' },
  addrEmpty: {
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    padding: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.md12,
  },
  addAddrBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: borderRadius.lg,
    borderStyle: 'dashed',
    paddingVertical: spacing.md12,
    paddingHorizontal: spacing.md,
    marginTop: spacing.xs,
  },
  manageLink: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginTop: spacing.sm,
    gap: 3,
  },

  // Validation
  validationBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md12,
    paddingVertical: spacing.sm,
    marginBottom: spacing.sm,
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md12,
    borderTopWidth: 1,
  },
  orderBtnWrap: { borderRadius: borderRadius.lg, overflow: 'hidden' },
  orderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
});
