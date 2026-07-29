// ─── Profile Screen — Redesigned ─────────────────────────────────────────────
// Layout reference: Zomato profile screenshot (attached_assets/1000551329_1785303604129.jpg)
// Branding: Cravio (#FF6B00 primary, #16A34A green). No Zomato branding.

import React from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ChevronRight,
  CreditCard,
  Clock3,
  Crown,
  Globe,
  Heart,
  HelpCircle,
  LogOut,
  MapPin,
  Package,
  Palette,
  Receipt,
  RefreshCw,
  Settings,
  ShieldCheck,
  Star,
  Tag,
  Ticket,
  User,
  Wallet,
} from 'lucide-react-native';
import { useColors } from '@/hooks/useColors';
import { PP } from '@/theme/poppins';
import { useAuthStore } from '@/store/useAuthStore';
import { Avatar, CircularLoader } from '@/components/ui';

// ─── Props ────────────────────────────────────────────────────────────────────

interface ProfileScreenProps {
  onOrders?: () => void;
  onFavorites?: () => void;
  onAddresses?: () => void;
  onRecentlyViewed?: () => void;
  onDonations?: () => void;
  onEditProfile?: () => void;
  onLogout?: () => void;
}

// ─── Section group with left accent bar ──────────────────────────────────────

function SectionGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const colors = useColors();
  return (
    <View style={[groupStyles.wrap, { backgroundColor: colors.card }]}>
      <View style={groupStyles.titleRow}>
        <View style={[groupStyles.accent, { backgroundColor: colors.primary }]} />
        <Text style={[PP.label, groupStyles.title, { color: colors.foreground }]}>
          {title}
        </Text>
      </View>
      {children}
    </View>
  );
}

const groupStyles = StyleSheet.create({
  wrap: {
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 16,
    overflow: 'hidden',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 10,
    gap: 10,
  },
  accent: {
    width: 3,
    height: 16,
    borderRadius: 2,
  },
  title: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 13,
    letterSpacing: 0.1,
  },
});

// ─── Single row ───────────────────────────────────────────────────────────────

interface RowProps {
  icon: React.ReactNode;
  iconBg?: string;
  label: string;
  value?: string;
  onPress?: () => void;
  danger?: boolean;
  right?: React.ReactNode;
  hideChevron?: boolean;
}

function Row({ icon, iconBg, label, value, onPress, danger = false, right, hideChevron = false }: RowProps) {
  const colors = useColors();
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress && !danger}
      activeOpacity={onPress || danger ? 0.7 : 1}
      style={[rowStyles.row, { borderTopColor: colors.border }]}
    >
      <View style={[rowStyles.iconWrap, { backgroundColor: iconBg ?? colors.muted }]}>
        {icon}
      </View>
      <Text style={[PP.body, rowStyles.label, { color: danger ? colors.destructive : colors.foreground }]}>
        {label}
      </Text>
      {right ? (
        right
      ) : (
        <View style={rowStyles.rightSide}>
          {value ? (
            <Text style={[PP.bodySM, { color: colors.mutedForeground }]}>{value}</Text>
          ) : null}
          {!hideChevron && (
            <ChevronRight size={16} color={colors.mutedForeground} strokeWidth={1.8} />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

const rowStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: 14,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  label: { flex: 1 },
  rightSide: { flexDirection: 'row', alignItems: 'center', gap: 6 },
});

// ─── Wallet + Coupons tile grid ───────────────────────────────────────────────

function TileGrid() {
  const colors = useColors();
  return (
    <View style={[tileStyles.grid, { backgroundColor: colors.card }]}>
      {/* Wallet */}
      <TouchableOpacity
        activeOpacity={0.8}
        style={[tileStyles.tile, { borderColor: colors.border }]}
      >
        <View style={[tileStyles.iconWrap, { backgroundColor: '#EFF6FF' }]}>
          <Wallet size={20} color="#3B82F6" />
        </View>
        <Text style={[PP.label, { color: colors.foreground }]}>Cravio Wallet</Text>
        <Text style={[PP.caption, { color: colors.mutedForeground }]}>$0.00</Text>
      </TouchableOpacity>

      {/* Divider */}
      <View style={[tileStyles.divider, { backgroundColor: colors.border }]} />

      {/* Coupons */}
      <TouchableOpacity
        activeOpacity={0.8}
        style={[tileStyles.tile, { borderColor: colors.border }]}
      >
        <View style={[tileStyles.iconWrap, { backgroundColor: '#FFF7ED' }]}>
          <Ticket size={20} color="#FF6B00" />
        </View>
        <Text style={[PP.label, { color: colors.foreground }]}>Your coupons</Text>
        <Text style={[PP.caption, { color: colors.mutedForeground }]}>View all</Text>
      </TouchableOpacity>
    </View>
  );
}

const tileStyles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 10,
  },
  tile: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 18,
    gap: 6,
  },
  divider: { width: StyleSheet.hairlineWidth },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
});

// ─── Membership card ──────────────────────────────────────────────────────────

function MembershipCard() {
  const colors = useColors();
  return (
    <TouchableOpacity
      activeOpacity={0.88}
      style={[memberStyles.card, { backgroundColor: colors.foreground }]}
    >
      <View style={memberStyles.row}>
        <Crown size={20} color="#F59E0B" fill="#F59E0B" />
        <Text style={[PP.subtitle, memberStyles.label]}>Join Cravio Plus</Text>
      </View>
      <ChevronRight size={18} color="rgba(255,255,255,0.7)" />
    </TouchableOpacity>
  );
}

const memberStyles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  label: { color: '#FFFFFF', fontFamily: 'Poppins_600SemiBold' },
});

// ─── App update row ───────────────────────────────────────────────────────────

function UpdateRow() {
  const colors = useColors();
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[
        updateStyles.row,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <View style={[updateStyles.iconWrap, { backgroundColor: '#F0FDF4' }]}>
        <RefreshCw size={18} color="#16A34A" />
      </View>
      <Text style={[PP.body, { color: colors.foreground, flex: 1 }]}>
        App update available
      </Text>
      <ChevronRight size={16} color={colors.mutedForeground} strokeWidth={1.8} />
    </TouchableOpacity>
  );
}

const updateStyles = StyleSheet.create({
  row: {
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: StyleSheet.hairlineWidth,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

// ─── Main ProfileScreen ───────────────────────────────────────────────────────

export function ProfileScreen({
  onOrders,
  onFavorites,
  onAddresses,
  onRecentlyViewed,
  onDonations,
  onEditProfile,
  onLogout,
}: ProfileScreenProps) {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { user, isLoading, logout } = useAuthStore();

  const paddingTop = Platform.OS === 'web' ? 56 : insets.top;
  const paddingBottom = Platform.OS === 'web' ? 34 : insets.bottom;

  const displayName = user?.name ?? 'Cravio User';
  const displayEmail = user?.email ?? '';

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          await logout();
          onLogout?.();
        },
      },
    ]);
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      {/* ── Sticky top bar ── */}
      <View
        style={[
          styles.topBar,
          { paddingTop: paddingTop + 4, backgroundColor: colors.card, borderBottomColor: colors.border },
        ]}
      >
        <Text style={[PP.title, { color: colors.foreground }]}>Profile</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: paddingBottom + 32, paddingTop: 16 }}
      >
        {/* ── Profile card ── */}
        <View style={[styles.profileCard, { backgroundColor: colors.card }]}>
          <Avatar name={displayName} size="xl" />
          <View style={styles.profileInfo}>
            <Text style={[PP.h3, { color: colors.foreground }]}>{displayName}</Text>
            {displayEmail ? (
              <Text style={[PP.caption, { color: colors.mutedForeground, marginTop: 1 }]}>
                {displayEmail}
              </Text>
            ) : null}
            <TouchableOpacity
              onPress={onEditProfile}
              activeOpacity={0.7}
              style={styles.editLink}
            >
              <Text style={[PP.bodySM, { color: colors.primary, fontFamily: 'Poppins_600SemiBold' }]}>
                Edit profile ›
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Membership card ── */}
        <MembershipCard />

        {/* ── Wallet + Coupons ── */}
        <TileGrid />

        {/* ── App update ── */}
        <UpdateRow />

        {/* ── Preferences ── */}
        <SectionGroup title="Your preferences">
          <Row
            icon={<View style={[prefStyles.vegDot, { borderColor: '#16A34A' }]}><View style={[prefStyles.vegInner, { backgroundColor: '#16A34A' }]} /></View>}
            iconBg="#F0FDF4"
            label="Veg Mode"
            value="Off"
            onPress={() => {}}
          />
          <Row
            icon={<Palette size={17} color="#8B5CF6" />}
            iconBg="#F5F3FF"
            label="Appearance"
            value="Light"
            onPress={() => {}}
          />
          <Row
            icon={<Globe size={17} color="#0EA5E9" />}
            iconBg="#F0F9FF"
            label="Language"
            value="English"
            onPress={() => {}}
          />
          <Row
            icon={<CreditCard size={17} color="#10B981" />}
            iconBg="#F0FDF4"
            label="Payment methods"
            onPress={() => {}}
          />
        </SectionGroup>

        {/* ── Food delivery ── */}
        <SectionGroup title="Food delivery">
          <Row
            icon={<Package size={17} color="#FF6B00" />}
            iconBg="#FFF7ED"
            label="Your orders"
            onPress={onOrders}
          />
          <Row
            icon={<Heart size={17} color="#EF4444" />}
            iconBg="#FFF1F2"
            label="Favourites"
            onPress={onFavorites}
          />
          <Row
            icon={<Clock3 size={17} color="#F59E0B" />}
            iconBg="#FFFBEB"
            label="Recently viewed"
            onPress={onRecentlyViewed}
          />
          <Row
            icon={<MapPin size={17} color="#6366F1" />}
            iconBg="#EEF2FF"
            label="Address book"
            onPress={onAddresses}
          />
        </SectionGroup>

        {/* ── Payments ── */}
        <SectionGroup title="Payments">
          <Row
            icon={<Wallet size={17} color="#3B82F6" />}
            iconBg="#EFF6FF"
            label="Cravio Wallet"
            value="$0.00"
            onPress={() => {}}
          />
          <Row
            icon={<Ticket size={17} color="#FF6B00" />}
            iconBg="#FFF7ED"
            label="Your coupons"
            onPress={() => {}}
          />
          <Row
            icon={<Tag size={17} color="#8B5CF6" />}
            iconBg="#F5F3FF"
            label="Gift cards"
            onPress={() => {}}
          />
          <Row
            icon={<Receipt size={17} color="#14B8A6" />}
            iconBg="#F0FDFA"
            label="Transaction history"
            onPress={() => {}}
          />
        </SectionGroup>

        {/* ── Help & Support ── */}
        <SectionGroup title="Help & support">
          <Row
            icon={<HelpCircle size={17} color="#6B7280" />}
            iconBg={colors.muted}
            label="Help centre"
            onPress={() => {}}
          />
          <Row
            icon={<ShieldCheck size={17} color="#6B7280" />}
            iconBg={colors.muted}
            label="Privacy policy"
            onPress={() => {}}
          />
          <Row
            icon={<Settings size={17} color="#6B7280" />}
            iconBg={colors.muted}
            label="Terms of service"
            onPress={() => {}}
          />
          <Row
            icon={<Star size={17} color="#F59E0B" />}
            iconBg="#FFFBEB"
            label="Rate the app"
            onPress={() => {}}
          />
        </SectionGroup>

        {/* ── Logout ── */}
        <View style={[styles.logoutCard, { backgroundColor: colors.card }]}>
          <TouchableOpacity
            onPress={handleLogout}
            activeOpacity={0.75}
            style={styles.logoutRow}
          >
            <LogOut size={18} color={colors.destructive} />
            <Text style={[PP.body, { color: colors.destructive, fontFamily: 'Poppins_600SemiBold' }]}>
              Log out
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {isLoading && <CircularLoader overlay />}
    </View>
  );
}

const prefStyles = StyleSheet.create({
  vegDot: {
    width: 16,
    height: 16,
    borderRadius: 3,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vegInner: { width: 8, height: 8, borderRadius: 4 },
});

const styles = StyleSheet.create({
  screen: { flex: 1 },

  // Top bar
  topBar: {
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },

  // Profile card
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
    marginHorizontal: 16,
    marginBottom: 10,
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 20,
  },
  profileInfo: { flex: 1 },
  editLink: { marginTop: 6 },

  // Logout
  logoutCard: {
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 16,
    overflow: 'hidden',
  },
  logoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
});
