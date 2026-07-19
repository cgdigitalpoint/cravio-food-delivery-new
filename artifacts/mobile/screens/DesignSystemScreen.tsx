// ─── Design System Documentation ─────────────────────────────────────────────
// Interactive showcase of every Cravio UI component.
// Scroll through all sections to explore the full design system.

import React, { useState } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useColors } from '@/hooks/useColors';
import { typography, spacing, borderRadius } from '@/theme';
import {
  Avatar,
  Badge,
  BannerCard,
  BottomNavigation,
  Button,
  CategoryCard,
  Chip,
  CircularLoader,
  Dialog,
  Divider,
  EmptyState,
  FavoriteButton,
  FloatingActionButton,
  FoodCard,
  FoodCardSkeleton,
  IconButton,
  InputField,
  ListItemSkeleton,
  NotificationBadge,
  OfferCard,
  OTPInput,
  PasswordInput,
  QuantitySelector,
  RestaurantCard,
  RestaurantCardSkeleton,
  SearchBar,
  SectionHeader,
  Skeleton,
  Snackbar,
  Tag,
  Toast,
  TopAppBar,
} from '@/components/ui';

// ─── Section wrapper ──────────────────────────────────────────────────────────
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const colors = useColors();
  return (
    <View style={[styles.section, { borderBottomColor: colors.border }]}>
      <Text style={[typography.overline, { color: colors.mutedForeground, marginBottom: spacing.md }]}>
        {title}
      </Text>
      {children}
    </View>
  );
}

// ─── Color swatch ─────────────────────────────────────────────────────────────
function Swatch({ color, label }: { color: string; label: string }) {
  const colors = useColors();
  return (
    <View style={styles.swatch}>
      <View style={[styles.swatchBox, { backgroundColor: color, borderColor: colors.border }]} />
      <Text style={[typography.caption, { color: colors.mutedForeground, textAlign: 'center', marginTop: 4 }]} numberOfLines={1}>
        {label}
      </Text>
      <Text style={[typography.caption, { color: colors.mutedForeground, textAlign: 'center', fontSize: 9 }]} numberOfLines={1}>
        {color}
      </Text>
    </View>
  );
}

// ─── Row wrapper ──────────────────────────────────────────────────────────────
function Row({ children, wrap }: { children: React.ReactNode; wrap?: boolean }) {
  return (
    <View style={[styles.row, wrap === true && styles.rowWrap]}>
      {children}
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
interface DesignSystemScreenProps {
  onBack?: () => void;
}

export function DesignSystemScreen({ onBack }: DesignSystemScreenProps) {
  const colors = useColors();

  // Interactive state
  const [activeTab, setActiveTab] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarType, setSnackbarType] = useState<'default' | 'success' | 'error' | 'warning'>('success');
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState<'default' | 'success' | 'error' | 'warning'>('default');

  const navItems = [
    { label: 'Home', icon: (a: boolean, c: string) => <Ionicons name={a ? 'home' : 'home-outline'} size={24} color={c} /> },
    { label: 'Search', icon: (a: boolean, c: string) => <Ionicons name="search" size={24} color={c} />, badge: 0 },
    { label: 'Orders', icon: (a: boolean, c: string) => <Ionicons name={a ? 'receipt' : 'receipt-outline'} size={24} color={c} />, badge: 3 },
    { label: 'Cart', icon: (a: boolean, c: string) => <Ionicons name={a ? 'cart' : 'cart-outline'} size={24} color={c} />, badge: 2 },
    { label: 'Profile', icon: (a: boolean, c: string) => <Ionicons name={a ? 'person' : 'person-outline'} size={24} color={c} /> },
  ];

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      {/* TopAppBar */}
      <TopAppBar
        title="Design System"
        subtitle="Cravio v1.0"
        onBackPress={onBack}
        rightActions={[
          <IconButton
            key="info"
            icon={<Ionicons name="information-circle-outline" size={22} color={colors.primary} />}
            variant="ghost"
          />,
        ]}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >

        {/* ── 1. Colors ──────────────────────────────────────────────────────── */}
        <Section title="Colors — Brand Palette">
          <Row wrap>
            <Swatch color="#FF6B00" label="Primary" />
            <Swatch color="#16A34A" label="Secondary" />
            <Swatch color="#F8F9FB" label="Background" />
            <Swatch color="#111827" label="Text" />
            <Swatch color="#6B7280" label="Text Secondary" />
            <Swatch color="#22C55E" label="Success" />
            <Swatch color="#F59E0B" label="Warning" />
            <Swatch color="#EF4444" label="Error" />
            <Swatch color="#E5E7EB" label="Border" />
          </Row>
        </Section>

        {/* ── 2. Typography ──────────────────────────────────────────────────── */}
        <Section title="Typography">
          <View style={styles.typeStack}>
            <Text style={[typography.display, { color: colors.foreground }]}>Display</Text>
            <Text style={[typography.heading1, { color: colors.foreground }]}>Heading 1</Text>
            <Text style={[typography.heading2, { color: colors.foreground }]}>Heading 2</Text>
            <Text style={[typography.heading3, { color: colors.foreground }]}>Heading 3</Text>
            <Text style={[typography.title, { color: colors.foreground }]}>Title</Text>
            <Text style={[typography.subtitle, { color: colors.foreground }]}>Subtitle</Text>
            <Text style={[typography.body, { color: colors.foreground }]}>Body — The quick brown fox jumps over the lazy dog.</Text>
            <Text style={[typography.caption, { color: colors.mutedForeground }]}>Caption — 12pt · Inter Regular</Text>
            <Text style={[typography.buttonText, { color: colors.primary }]}>Button Text</Text>
          </View>
        </Section>

        {/* ── 3. Buttons ─────────────────────────────────────────────────────── */}
        <Section title="Buttons">
          <Row wrap>
            <Button label="Order Now" variant="primary" />
            <Button label="View Menu" variant="secondary" />
            <Button label="Browse" variant="outline" />
            <Button label="Ghost" variant="ghost" />
            <Button label="Remove" variant="destructive" />
          </Row>
          <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          <Text style={[typography.caption, { color: colors.mutedForeground, marginBottom: spacing.sm }]}>Sizes</Text>
          <Row wrap>
            <Button label="Small" size="sm" />
            <Button label="Medium" size="md" />
            <Button label="Large" size="lg" />
          </Row>
          <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          <Text style={[typography.caption, { color: colors.mutedForeground, marginBottom: spacing.sm }]}>Icon Buttons & FAB</Text>
          <Row>
            <IconButton icon={<Ionicons name="heart" size={20} color="#EF4444" />} variant="secondary" />
            <IconButton icon={<Ionicons name="search" size={20} color={colors.primary} />} variant="outline" />
            <IconButton icon={<Ionicons name="share-outline" size={20} color={colors.foreground} />} variant="ghost" />
            <FloatingActionButton
              icon={<Ionicons name="add" size={24} color="#FFFFFF" />}
              onPress={() => {}}
              size="normal"
            />
            <FloatingActionButton
              icon={<Ionicons name="cart" size={18} color="#FFFFFF" />}
              onPress={() => {}}
              label="Add to cart"
            />
          </Row>
          <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          <Text style={[typography.caption, { color: colors.mutedForeground, marginBottom: spacing.sm }]}>States</Text>
          <Row>
            <Button label="Loading" isLoading />
            <Button label="Disabled" disabled />
          </Row>
        </Section>

        {/* ── 4. Inputs ──────────────────────────────────────────────────────── */}
        <Section title="Inputs">
          <View style={styles.inputStack}>
            <SearchBar
              value={searchValue}
              onChangeText={setSearchValue}
              onFilterPress={() => {}}
            />
            <InputField
              label="Full Name"
              placeholder="Enter your name"
              value={inputValue}
              onChangeText={setInputValue}
              leftIcon={<Ionicons name="person-outline" size={18} color={colors.mutedForeground} />}
            />
            <InputField
              label="Email (with error)"
              placeholder="email@example.com"
              value=""
              onChangeText={() => {}}
              error="Please enter a valid email address"
              leftIcon={<Ionicons name="mail-outline" size={18} color={colors.mutedForeground} />}
              keyboardType="email-address"
            />
            <PasswordInput
              label="Password"
              value={passwordValue}
              onChangeText={setPasswordValue}
              placeholder="Enter password"
              helperText="Minimum 8 characters"
            />
            <View>
              <Text style={[typography.label, { color: colors.foreground, marginBottom: spacing.md }]}>OTP Input (6-digit)</Text>
              <OTPInput length={6} value={otpValue} onChangeText={setOtpValue} />
            </View>
          </View>
        </Section>

        {/* ── 5. Cards ───────────────────────────────────────────────────────── */}
        <Section title="Cards — Restaurant">
          <RestaurantCard
            name="Burger Republic"
            cuisine="American · Burgers · Fast Food"
            rating={4.7}
            deliveryTime={25}
            deliveryFee={0}
            isNew
            offerText="20% OFF"
            isFavorite={isFavorite}
            onFavoritePress={() => setIsFavorite((f) => !f)}
          />
        </Section>

        <Section title="Cards — Food Item">
          <FoodCard
            name="Spicy Chicken Burger"
            description="Crispy chicken fillet, jalapeños, sriracha mayo, pickles"
            price={12.99}
            isVeg={false}
            isPopular
            onAddPress={() => {}}
          />
          <View style={{ marginTop: spacing.sm }}>
            <FoodCard
              name="Garden Veggie Bowl"
              description="Fresh greens, roasted veg, tahini, quinoa"
              price={9.99}
              isVeg
              isNew
              onAddPress={() => {}}
            />
          </View>
        </Section>

        <Section title="Cards — Offer">
          <OfferCard
            title="Free Delivery"
            subtitle="On your first 3 orders"
            code="FIRSTFREE"
            discount="100%"
            gradientColors={['#FF6B00', '#FF9A4D']}
          />
          <View style={{ marginTop: spacing.sm }}>
            <OfferCard
              title="Flat ₹50 Off"
              subtitle="On orders above ₹299"
              code="CRAVIO50"
              discount="₹50"
              gradientColors={['#16A34A', '#4ADE80']}
            />
          </View>
        </Section>

        <Section title="Cards — Category">
          <Row wrap>
            {[
              { name: 'Pizza', icon: 'pizza', color: '#FF6B00' },
              { name: 'Burgers', icon: 'fast-food', color: '#16A34A' },
              { name: 'Sushi', icon: 'fish', color: '#2563EB' },
              { name: 'Desserts', icon: 'ice-cream', color: '#DB2777' },
              { name: 'Coffee', icon: 'cafe', color: '#92400E' },
            ].map((cat) => (
              <CategoryCard
                key={cat.name}
                name={cat.name}
                color={cat.color}
                icon={<Ionicons name={cat.icon as any} size={28} color={cat.color} />}
                onPress={() => {}}
              />
            ))}
          </Row>
        </Section>

        <Section title="Cards — Banner">
          <BannerCard
            title="Cravio Plus"
            subtitle="Unlimited free delivery & exclusive offers"
            ctaText="Try 30 days free"
            gradientColors={['#1E1B4B', '#3730A3']}
            height={160}
          />
        </Section>

        {/* ── 6. Chips & Badges ──────────────────────────────────────────────── */}
        <Section title="Chips">
          <Row wrap>
            <Chip variant="veg" />
            <Chip variant="nonVeg" />
            <Chip variant="popular" />
            <Chip variant="discount" label="20% OFF" />
            <Chip variant="new" />
            <Chip variant="filter" label="Fast Delivery" selected />
            <Chip variant="filter" label="Free Delivery" />
            <Chip variant="filter" label="Top Rated" />
          </Row>
        </Section>

        <Section title="Badges">
          <Row wrap>
            <Badge variant="rating" value={4.7} />
            <Badge variant="deliveryTime" value={25} />
            <Badge variant="offer" value="30% OFF" />
            <Badge variant="freeDelivery" />
          </Row>
        </Section>

        {/* ── 7. Navigation ──────────────────────────────────────────────────── */}
        <Section title="Navigation — Section Header">
          <SectionHeader
            title="Popular Near You"
            subtitle="Based on your location"
            onSeeAllPress={() => {}}
          />
          <View style={{ marginTop: spacing.md }}>
            <SectionHeader title="Categories" />
          </View>
        </Section>

        <Section title="Navigation — Bottom Navigation">
          <Text style={[typography.caption, { color: colors.mutedForeground, marginBottom: spacing.sm }]}>
            Tap tabs to switch active state
          </Text>
          <View style={[styles.navPreview, { borderRadius: borderRadius.xl, overflow: 'hidden', borderColor: colors.border }]}>
            <BottomNavigation
              items={navItems}
              activeIndex={activeTab}
              onPress={setActiveTab}
            />
          </View>
        </Section>

        {/* ── 8. Other Components ────────────────────────────────────────────── */}
        <Section title="Avatar">
          <Row>
            {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
              <Avatar key={size} name="John Doe" size={size} />
            ))}
            <Avatar name="Sarah Kim" size="lg" />
            <Avatar
              name="Admin"
              size="lg"
              badge={
                <View style={[styles.onlineDot, { borderColor: colors.card }]} />
              }
            />
          </Row>
        </Section>

        <Section title="Tag">
          <Row wrap>
            <Tag label="Italian" />
            <Tag label="New" color="#EFF6FF" textColor="#2563EB" />
            <Tag label="Trending" color="#FFF7ED" textColor="#FF6B00" icon={<Ionicons name="flame" size={12} color="#FF6B00" />} />
            <Tag label="Spicy" color="#FFF1F2" textColor="#E11D48" onClose={() => {}} />
          </Row>
        </Section>

        <Section title="Quantity Selector">
          <Row>
            <QuantitySelector
              value={quantity}
              onIncrement={() => setQuantity((q) => q + 1)}
              onDecrement={() => setQuantity((q) => Math.max(0, q - 1))}
              size="sm"
            />
            <QuantitySelector
              value={quantity}
              onIncrement={() => setQuantity((q) => q + 1)}
              onDecrement={() => setQuantity((q) => Math.max(0, q - 1))}
              size="md"
            />
            <QuantitySelector
              value={quantity}
              onIncrement={() => setQuantity((q) => q + 1)}
              onDecrement={() => setQuantity((q) => Math.max(0, q - 1))}
              size="lg"
            />
          </Row>
        </Section>

        <Section title="Favorite Button">
          <Row>
            <FavoriteButton isFavorite={false} onToggle={() => {}} size="sm" />
            <FavoriteButton isFavorite={isFavorite} onToggle={() => setIsFavorite((f) => !f)} size="md" />
            <FavoriteButton isFavorite onToggle={() => {}} size="lg" backgroundColor={`${colors.primary}18`} />
          </Row>
        </Section>

        <Section title="Notification Badge">
          <Row>
            <NotificationBadge count={3}>
              <IconButton icon={<Ionicons name="notifications-outline" size={22} color={colors.foreground} />} variant="outline" />
            </NotificationBadge>
            <NotificationBadge count={99} maxCount={99}>
              <IconButton icon={<Ionicons name="cart-outline" size={22} color={colors.foreground} />} variant="outline" />
            </NotificationBadge>
            <NotificationBadge dot>
              <IconButton icon={<Ionicons name="mail-outline" size={22} color={colors.foreground} />} variant="outline" />
            </NotificationBadge>
          </Row>
        </Section>

        <Section title="Divider">
          <View style={[styles.dividerDemo, { backgroundColor: colors.card, borderRadius: borderRadius.lg }]}>
            <Text style={[typography.body, { color: colors.foreground }]}>Above divider</Text>
            <Divider style={{ marginVertical: spacing.md }} />
            <Text style={[typography.body, { color: colors.foreground }]}>Below divider</Text>
            <Divider inset={16} style={{ marginTop: spacing.md }} />
            <Text style={[typography.body, { color: colors.mutedForeground }]}>Inset divider</Text>
          </View>
        </Section>

        {/* ── 9. Loading States ──────────────────────────────────────────────── */}
        <Section title="Loading States — Skeleton">
          <RestaurantCardSkeleton />
          <View style={{ marginTop: spacing.md }}>
            <FoodCardSkeleton />
          </View>
          <View style={{ marginTop: spacing.md }}>
            <ListItemSkeleton />
            <ListItemSkeleton />
          </View>
          <View style={{ marginTop: spacing.md, gap: spacing.sm }}>
            <Skeleton height={14} width="75%" />
            <Skeleton height={14} width="55%" />
            <Skeleton height={14} width="65%" />
          </View>
        </Section>

        <Section title="Loading States — Circular Loader">
          <Row>
            <CircularLoader size="small" />
            <CircularLoader size="large" />
            <CircularLoader size={48} color={colors.secondary} />
          </Row>
        </Section>

        {/* ── 10. Empty States ───────────────────────────────────────────────── */}
        <Section title="Empty States">
          {(['noOrders', 'noSearchResult', 'emptyCart', 'noInternet'] as const).map((variant) => (
            <View key={variant} style={[styles.emptyCard, { backgroundColor: colors.card, borderRadius: borderRadius.xl, borderColor: colors.border }]}>
              <EmptyState
                variant={variant}
                ctaText={variant === 'noOrders' ? 'Browse Restaurants' : variant === 'emptyCart' ? 'Order Food' : undefined}
                style={{ paddingVertical: spacing.xl }}
              />
            </View>
          ))}
        </Section>

        {/* ── 11. Dialogs ────────────────────────────────────────────────────── */}
        <Section title="Dialogs">
          <Row wrap>
            <Button
              label="Confirmation"
              variant="outline"
              onPress={() => setShowConfirm(true)}
            />
            <Button
              label="Success"
              variant="outline"
              onPress={() => setShowSuccess(true)}
            />
            <Button
              label="Error"
              variant="destructive"
              onPress={() => setShowError(true)}
            />
          </Row>
        </Section>

        {/* ── 12. Snackbars & Toasts ─────────────────────────────────────────── */}
        <Section title="Snackbars">
          <Row wrap>
            {(['default', 'success', 'error', 'warning'] as const).map((t) => (
              <Button
                key={t}
                label={t.charAt(0).toUpperCase() + t.slice(1)}
                variant="outline"
                size="sm"
                onPress={() => {
                  setSnackbarType(t);
                  setShowSnackbar(true);
                }}
              />
            ))}
          </Row>
        </Section>

        <Section title="Toast Messages">
          <Row wrap>
            {(['default', 'success', 'error', 'warning'] as const).map((t) => (
              <Button
                key={t}
                label={t.charAt(0).toUpperCase() + t.slice(1)}
                variant="outline"
                size="sm"
                onPress={() => {
                  setToastType(t);
                  setShowToast(true);
                }}
              />
            ))}
          </Row>
        </Section>

        {/* Bottom padding */}
        <View style={{ height: spacing.xxxl }} />
      </ScrollView>

      {/* ── Dialogs ──────────────────────────────────────────────────────────── */}
      <Dialog
        visible={showConfirm}
        variant="confirmation"
        title="Remove Item?"
        message="Are you sure you want to remove this item from your cart? This action cannot be undone."
        confirmText="Remove"
        cancelText="Keep it"
        onConfirm={() => setShowConfirm(false)}
        onCancel={() => setShowConfirm(false)}
        onDismiss={() => setShowConfirm(false)}
      />
      <Dialog
        visible={showSuccess}
        variant="success"
        title="Order Placed!"
        message="Your order has been placed successfully. Estimated delivery: 30–40 min."
        confirmText="Track Order"
        onConfirm={() => setShowSuccess(false)}
        onDismiss={() => setShowSuccess(false)}
      />
      <Dialog
        visible={showError}
        variant="error"
        title="Payment Failed"
        message="We couldn't process your payment. Please check your card details and try again."
        confirmText="Try Again"
        onConfirm={() => setShowError(false)}
        onDismiss={() => setShowError(false)}
      />

      {/* ── Snackbar ─────────────────────────────────────────────────────────── */}
      <Snackbar
        visible={showSnackbar}
        message={
          snackbarType === 'success' ? 'Item added to cart!' :
          snackbarType === 'error' ? 'Failed to update cart' :
          snackbarType === 'warning' ? 'Minimum order amount is $5' :
          'Your session will expire soon'
        }
        type={snackbarType}
        actionText={snackbarType === 'error' ? 'Retry' : undefined}
        onAction={() => setShowSnackbar(false)}
        onDismiss={() => setShowSnackbar(false)}
      />

      {/* ── Toast ────────────────────────────────────────────────────────────── */}
      <Toast
        visible={showToast}
        title={
          toastType === 'success' ? 'Order Confirmed' :
          toastType === 'error' ? 'Something went wrong' :
          toastType === 'warning' ? 'Restaurant closing soon' :
          'New offer available'
        }
        message={
          toastType === 'success' ? 'Your food is being prepared.' :
          toastType === 'error' ? 'Please try again in a moment.' :
          toastType === 'warning' ? 'Place your order before 10 PM.' :
          'Get 30% off on your next order.'
        }
        type={toastType}
        onDismiss={() => setShowToast(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  scroll: { flex: 1 },
  content: { paddingBottom: spacing.xxxl },
  section: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  rowWrap: { flexWrap: 'wrap' },
  swatch: { alignItems: 'center', width: 72 },
  swatchBox: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.md,
    borderWidth: 1,
  },
  typeStack: { gap: spacing.sm },
  inputStack: { gap: spacing.md },
  dividerLine: { height: 1, marginVertical: spacing.md },
  navPreview: { borderWidth: 1 },
  emptyCard: { marginBottom: spacing.sm, borderWidth: 1, overflow: 'hidden' },
  dividerDemo: { padding: spacing.md },
  onlineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#22C55E',
    borderWidth: 2,
  },
});
