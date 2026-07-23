// ─── Checkout Screen — Phase 5 ────────────────────────────────────────────────
// Address · payment method · order notes · place order · success animation.

import React, { useState } from 'react';
import {
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
  type SharedValue,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  Edit3,
  MapPin,
  Plus,
  Wallet,
  Clock,
  Home,
  Briefcase,
  Star,
} from 'lucide-react-native';

import { useColors } from '@/hooks/useColors';
import { PP } from '@/theme/poppins';
import { useCartStore } from '@/store/useCartStore';

// ─── Types ────────────────────────────────────────────────────────────────────

type PaymentMethod = 'cod' | 'card' | 'wallet';

interface SavedAddress {
  id: string;
  label: 'Home' | 'Work' | 'Other';
  line1: string;
  line2: string;
  icon: React.ReactNode;
}

// ─── Success Overlay ──────────────────────────────────────────────────────────

function SuccessOverlay({ onDone }: { onDone: () => void }) {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  // Animation values
  const bgOpacity = useSharedValue(0);
  const circleScale = useSharedValue(0);
  const checkOpacity = useSharedValue(0);
  const titleY = useSharedValue(30);
  const titleOpacity = useSharedValue(0);
  const subtitleOpacity = useSharedValue(0);
  const btnOpacity = useSharedValue(0);

  // Confetti dots
  const dot1 = useSharedValue(0);
  const dot2 = useSharedValue(0);
  const dot3 = useSharedValue(0);
  const dot4 = useSharedValue(0);
  const dot5 = useSharedValue(0);

  React.useEffect(() => {
    bgOpacity.value = withTiming(1, { duration: 300 });
    circleScale.value = withDelay(200, withSpring(1, { damping: 12, stiffness: 140 }));
    checkOpacity.value = withDelay(500, withTiming(1, { duration: 400 }));
    titleY.value = withDelay(600, withSpring(0, { damping: 14, stiffness: 140 }));
    titleOpacity.value = withDelay(600, withTiming(1, { duration: 400 }));
    subtitleOpacity.value = withDelay(900, withTiming(1, { duration: 400 }));
    btnOpacity.value = withDelay(1200, withTiming(1, { duration: 400 }));

    // Confetti bursts
    [dot1, dot2, dot3, dot4, dot5].forEach((d, i) => {
      d.value = withDelay(
        300 + i * 80,
        withSequence(
          withTiming(1, { duration: 600 }),
          withTiming(0, { duration: 400 }),
        ),
      );
    });
  }, []);

  const bgStyle = useAnimatedStyle(() => ({ opacity: bgOpacity.value }));
  const circleStyle = useAnimatedStyle(() => ({ transform: [{ scale: circleScale.value }] }));
  const checkStyle = useAnimatedStyle(() => ({ opacity: checkOpacity.value }));
  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleY.value }],
  }));
  const subtitleStyle = useAnimatedStyle(() => ({ opacity: subtitleOpacity.value }));
  const btnStyle = useAnimatedStyle(() => ({ opacity: btnOpacity.value }));

  const makeDotStyle = (sv: SharedValue<number>, dx: number, dy: number) =>
    useAnimatedStyle(() => ({
      opacity: sv.value,
      transform: [
        { translateX: interpolate(sv.value, [0, 1], [0, dx]) },
        { translateY: interpolate(sv.value, [0, 1], [0, dy]) },
        { scale: interpolate(sv.value, [0, 0.5, 1], [0, 1.4, 0]) },
      ],
    }));

  const d1s = makeDotStyle(dot1, -60, -80);
  const d2s = makeDotStyle(dot2, 60, -80);
  const d3s = makeDotStyle(dot3, -90, -30);
  const d4s = makeDotStyle(dot4, 90, -30);
  const d5s = makeDotStyle(dot5, 0, -100);

  const confettiColors = ['#FF6B00', '#16A34A', '#6366F1', '#F59E0B', '#EC4899'];

  return (
    <Animated.View style={[soStyles.overlay, bgStyle, { paddingBottom: insets.bottom }]}>
      {/* Confetti dots */}
      {[d1s, d2s, d3s, d4s, d5s].map((s, i) => (
        <Animated.View
          key={i}
          style={[soStyles.confettiDot, s, { backgroundColor: confettiColors[i] }]}
        />
      ))}

      {/* Check circle */}
      <Animated.View style={[soStyles.circleWrap, circleStyle]}>
        <LinearGradient
          colors={['#22C55E', '#16A34A']}
          style={soStyles.circle}
        >
          <Animated.View style={checkStyle}>
            <CheckCircle2 size={56} color="#fff" strokeWidth={2} />
          </Animated.View>
        </LinearGradient>
      </Animated.View>

      <Animated.Text style={[PP.h2, soStyles.title, titleStyle]}>
        Order Placed! 🎉
      </Animated.Text>

      <Animated.Text style={[PP.body, soStyles.subtitle, subtitleStyle]}>
        Your order is confirmed and{'\n'}the kitchen is getting started.
      </Animated.Text>

      {/* Estimated time */}
      <Animated.View style={[soStyles.etaCard, subtitleStyle]}>
        <Clock size={18} color="#FF6B00" />
        <Text style={[PP.label, { color: '#111827', marginLeft: 10 }]}>
          Estimated delivery: <Text style={{ color: '#FF6B00' }}>30–40 min</Text>
        </Text>
      </Animated.View>

      <Animated.View style={[btnStyle, { width: '100%', paddingHorizontal: 32 }]}>
        <TouchableOpacity
          onPress={onDone}
          activeOpacity={0.9}
          style={soStyles.doneBtn}
        >
          <LinearGradient
            colors={['#FF8C38', '#FF6B00']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={soStyles.doneBtnInner}
          >
            <Text style={[PP.button, { color: '#fff' }]}>Track My Order</Text>
            <ChevronRight size={18} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
}

const soStyles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 200,
    paddingHorizontal: 32,
  },
  confettiDot: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  circleWrap: { marginBottom: 32 },
  circle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#16A34A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 10,
  },
  title: { color: '#111827', textAlign: 'center', marginBottom: 12 },
  subtitle: { color: '#6B7280', textAlign: 'center', lineHeight: 24, marginBottom: 24 },
  etaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    marginBottom: 36,
    width: '100%',
  },
  doneBtn: { borderRadius: 16, overflow: 'hidden' },
  doneBtnInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
  },
});

// ─── Address Card ─────────────────────────────────────────────────────────────

function AddressCard({
  address,
  selected,
  onSelect,
}: {
  address: SavedAddress;
  selected: boolean;
  onSelect: () => void;
}) {
  const colors = useColors();
  return (
    <TouchableOpacity
      onPress={onSelect}
      activeOpacity={0.8}
      style={[
        addrStyles.card,
        {
          backgroundColor: selected ? `${colors.primary}0D` : colors.card,
          borderColor: selected ? colors.primary : colors.border,
        },
      ]}
    >
      <View style={[addrStyles.iconWrap, { backgroundColor: selected ? `${colors.primary}18` : colors.surfaceVariant }]}>
        {address.icon}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[PP.label, { color: colors.foreground }]}>{address.label}</Text>
        <Text style={[PP.bodySM, { color: colors.mutedForeground, marginTop: 2 }]}>{address.line1}</Text>
        <Text style={[PP.bodySM, { color: colors.mutedForeground }]}>{address.line2}</Text>
      </View>
      {selected ? (
        <View style={[addrStyles.radio, { borderColor: colors.primary, backgroundColor: colors.primary }]}>
          <View style={addrStyles.radioDot} />
        </View>
      ) : (
        <View style={[addrStyles.radio, { borderColor: colors.border }]} />
      )}
    </TouchableOpacity>
  );
}

const addrStyles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 1.5,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  iconWrap: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  radioDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#fff' },
});

// ─── Payment Option ───────────────────────────────────────────────────────────

function PaymentOption({
  id,
  icon,
  label,
  subtitle,
  selected,
  onSelect,
  disabled,
}: {
  id: PaymentMethod;
  icon: React.ReactNode;
  label: string;
  subtitle?: string;
  selected: boolean;
  onSelect: () => void;
  disabled?: boolean;
}) {
  const colors = useColors();
  return (
    <TouchableOpacity
      onPress={disabled ? undefined : onSelect}
      activeOpacity={disabled ? 1 : 0.8}
      style={[
        payStyles.card,
        {
          backgroundColor: selected ? `${colors.primary}0D` : colors.card,
          borderColor: selected ? colors.primary : colors.border,
          opacity: disabled ? 0.5 : 1,
        },
      ]}
    >
      <View style={[payStyles.iconWrap, { backgroundColor: selected ? `${colors.primary}18` : colors.surfaceVariant }]}>
        {icon}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[PP.label, { color: colors.foreground }]}>{label}</Text>
        {subtitle && (
          <Text style={[PP.caption, { color: colors.mutedForeground, marginTop: 2 }]}>{subtitle}</Text>
        )}
      </View>
      {disabled ? (
        <View style={[payStyles.comingSoon, { backgroundColor: colors.surfaceVariant }]}>
          <Text style={[PP.caption, { color: colors.mutedForeground, fontSize: 10 }]}>Soon</Text>
        </View>
      ) : selected ? (
        <View style={[payStyles.radio, { borderColor: colors.primary, backgroundColor: colors.primary }]}>
          <View style={payStyles.radioDot} />
        </View>
      ) : (
        <View style={[payStyles.radio, { borderColor: colors.border }]} />
      )}
    </TouchableOpacity>
  );
}

const payStyles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 1.5,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  iconWrap: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  comingSoon: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  radioDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#fff' },
});

// ─── Section Title ────────────────────────────────────────────────────────────

function SectionTitle({ children }: { children: string }) {
  const colors = useColors();
  return (
    <Text style={[PP.overline, { color: colors.mutedForeground, marginHorizontal: 20, marginTop: 24, marginBottom: 12 }]}>
      {children}
    </Text>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export function CheckoutScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const { totalAmount, subtotal, itemCount, deliveryFee, promoDiscount, clearCart } = useCartStore();

  const [selectedAddress, setSelectedAddress] = useState('addr1');
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('cod');
  const [orderNote, setOrderNote] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const DELIVERY = deliveryFee > 0 ? deliveryFee : 2.49;
  const PLATFORM_FEE = 0.99;
  const TAX_RATE = 0.05;
  const taxes = subtotal * TAX_RATE;
  const grandTotal = Math.max(0, subtotal - promoDiscount) + DELIVERY + PLATFORM_FEE + taxes;

  const ADDRESSES: SavedAddress[] = [
    {
      id: 'addr1',
      label: 'Home',
      line1: '123 Baker Street, Apt 4B',
      line2: 'London, W1U 6SY',
      icon: <Home size={18} color={selectedAddress === 'addr1' ? '#FF6B00' : colors.mutedForeground} />,
    },
    {
      id: 'addr2',
      label: 'Work',
      line1: '456 Oxford Circus, Floor 3',
      line2: 'London, W1B 1AP',
      icon: <Briefcase size={18} color={selectedAddress === 'addr2' ? '#FF6B00' : colors.mutedForeground} />,
    },
  ];

  const handlePlaceOrder = () => {
    setShowSuccess(true);
  };

  const handleSuccessDone = () => {
    clearCart();
    router.replace('/home');
  };

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
        <Text style={[PP.title, { color: colors.foreground }]}>Checkout</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 140 + insets.bottom }}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Delivery Address ── */}
        <SectionTitle>Delivery Address</SectionTitle>
        <View style={styles.sectionPad}>
          {ADDRESSES.map((addr) => (
            <AddressCard
              key={addr.id}
              address={addr}
              selected={selectedAddress === addr.id}
              onSelect={() => setSelectedAddress(addr.id)}
            />
          ))}
          <TouchableOpacity
            style={[styles.addAddressBtn, { borderColor: colors.border, backgroundColor: colors.card }]}
            activeOpacity={0.7}
          >
            <Plus size={16} color={colors.primary} />
            <Text style={[PP.label, { color: colors.primary, marginLeft: 8 }]}>Add New Address</Text>
          </TouchableOpacity>
        </View>

        {/* ── Estimated Time ── */}
        <View style={[styles.etaRow, { backgroundColor: colors.card, borderColor: colors.border, marginHorizontal: 20, marginTop: 16 }]}>
          <Clock size={18} color="#FF6B00" />
          <View style={{ marginLeft: 12 }}>
            <Text style={[PP.label, { color: colors.foreground }]}>Estimated Delivery</Text>
            <Text style={[PP.bodySM, { color: colors.mutedForeground, marginTop: 2 }]}>30–40 minutes</Text>
          </View>
          <View style={[styles.etaBadge, { backgroundColor: '#FFF7ED' }]}>
            <Text style={[PP.caption, { color: '#FF6B00', fontFamily: 'Poppins_600SemiBold' }]}>On Time</Text>
          </View>
        </View>

        {/* ── Payment Method ── */}
        <SectionTitle>Payment Method</SectionTitle>
        <View style={styles.sectionPad}>
          <PaymentOption
            id="cod"
            icon={<Wallet size={18} color={selectedPayment === 'cod' ? '#FF6B00' : colors.mutedForeground} />}
            label="Cash on Delivery"
            subtitle="Pay when your order arrives"
            selected={selectedPayment === 'cod'}
            onSelect={() => setSelectedPayment('cod')}
          />
          <PaymentOption
            id="card"
            icon={<CreditCard size={18} color={colors.mutedForeground} />}
            label="Credit / Debit Card"
            subtitle="Visa, Mastercard, Amex"
            selected={selectedPayment === 'card'}
            onSelect={() => setSelectedPayment('card')}
            disabled
          />
          <PaymentOption
            id="wallet"
            icon={<Star size={18} color={colors.mutedForeground} />}
            label="Cravio Wallet"
            subtitle="Instant payments & rewards"
            selected={selectedPayment === 'wallet'}
            onSelect={() => setSelectedPayment('wallet')}
            disabled
          />
        </View>

        {/* ── Order Notes ── */}
        <SectionTitle>Order Notes (Optional)</SectionTitle>
        <View style={[styles.sectionPad]}>
          <TextInput
            value={orderNote}
            onChangeText={setOrderNote}
            placeholder="Any instructions for the restaurant or delivery partner..."
            placeholderTextColor={colors.mutedForeground}
            multiline
            numberOfLines={3}
            style={[
              styles.noteInput,
              { color: colors.foreground, backgroundColor: colors.card, borderColor: colors.border },
            ]}
          />
        </View>

        {/* ── Order Summary ── */}
        <SectionTitle>Order Summary</SectionTitle>
        <View style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.summaryRow}>
            <Text style={[PP.bodySM, { color: colors.mutedForeground }]}>Items ({itemCount})</Text>
            <Text style={[PP.bodySM, { color: colors.mutedForeground }]}>${subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[PP.bodySM, { color: colors.mutedForeground }]}>Delivery</Text>
            <Text style={[PP.bodySM, { color: colors.mutedForeground }]}>${DELIVERY.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[PP.bodySM, { color: colors.mutedForeground }]}>Platform Fee</Text>
            <Text style={[PP.bodySM, { color: colors.mutedForeground }]}>${PLATFORM_FEE.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[PP.bodySM, { color: colors.mutedForeground }]}>Taxes (5%)</Text>
            <Text style={[PP.bodySM, { color: colors.mutedForeground }]}>${taxes.toFixed(2)}</Text>
          </View>
          {promoDiscount > 0 && (
            <View style={styles.summaryRow}>
              <Text style={[PP.bodySM, { color: '#16A34A' }]}>Discount</Text>
              <Text style={[PP.bodySM, { color: '#16A34A' }]}>-${promoDiscount.toFixed(2)}</Text>
            </View>
          )}
          <View style={[styles.summaryDivider, { backgroundColor: colors.border }]} />
          <View style={styles.summaryRow}>
            <Text style={[PP.label, { color: colors.foreground }]}>Total</Text>
            <Text style={[PP.label, { color: colors.primary, fontFamily: 'Poppins_700Bold' }]}>
              ${grandTotal.toFixed(2)}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* ── Place Order CTA ── */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 12, backgroundColor: colors.background, borderColor: colors.border }]}>
        <TouchableOpacity
          onPress={handlePlaceOrder}
          activeOpacity={0.9}
          style={styles.orderBtnWrap}
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
                ${grandTotal.toFixed(2)} · {selectedPayment === 'cod' ? 'Cash on Delivery' : 'Online'}
              </Text>
            </View>
            <ChevronRight size={22} color="#fff" strokeWidth={2.5} />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* ── Success overlay ── */}
      {showSuccess && <SuccessOverlay onDone={handleSuccessDone} />}
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
  sectionPad: { paddingHorizontal: 20 },
  addAddressBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 14,
    borderStyle: 'dashed',
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginTop: 4,
  },
  etaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
  },
  etaBadge: { marginLeft: 'auto', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  noteInput: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    textAlignVertical: 'top',
    minHeight: 80,
  },
  summaryCard: {
    marginHorizontal: 20,
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 },
  summaryDivider: { height: 1, marginVertical: 10 },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 14,
    borderTopWidth: 1,
  },
  orderBtnWrap: { borderRadius: 16, overflow: 'hidden' },
  orderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
});
