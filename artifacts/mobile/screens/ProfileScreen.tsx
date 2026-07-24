// ─── Profile Screen ───────────────────────────────────────────────────────────
import React, { useEffect } from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ChevronRight,
  CreditCard,
  Clock3,
  Heart,
  LogOut,
  MapPin,
  Package,
  Settings,
  User,
} from 'lucide-react-native';
import { useColors } from '@/hooks/useColors';
import { PP } from '@/theme/poppins';
import { useAuthStore } from '@/store/useAuthStore';
import { Avatar } from '@/components/ui';
import { CircularLoader } from '@/components/ui';

interface ProfileScreenProps {
  onOrders?: () => void;
  onFavorites?: () => void;
  onAddresses?: () => void;
  onRecentlyViewed?: () => void;
  onLogout?: () => void;
}

interface MenuRowProps {
  icon: React.ReactNode;
  label: string;
  subtitle?: string;
  onPress?: () => void;
  isDanger?: boolean;
}

function MenuRow({ icon, label, subtitle, onPress, isDanger = false }: MenuRowProps) {
  const colors = useColors();
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.menuRow, { borderBottomColor: colors.border }]}
      activeOpacity={0.7}
    >
      <View style={[styles.menuIcon, { backgroundColor: isDanger ? '#FEE2E2' : colors.muted }]}>
        {icon}
      </View>
      <View style={styles.menuText}>
        <Text style={[PP.label, { color: isDanger ? '#DC2626' : colors.foreground }]}>{label}</Text>
        {subtitle ? (
          <Text style={[PP.caption, { color: colors.mutedForeground }]}>{subtitle}</Text>
        ) : null}
      </View>
      {!isDanger && <ChevronRight size={18} color={colors.mutedForeground} />}
    </TouchableOpacity>
  );
}

export function ProfileScreen({ onOrders, onFavorites, onAddresses, onRecentlyViewed, onLogout }: ProfileScreenProps) {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { user, supabaseUserId, isLoading, logout } = useAuthStore();

  const paddingTop = Platform.OS === 'web' ? 60 : insets.top;
  const paddingBottom = Platform.OS === 'web' ? 34 : insets.bottom;

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

  const displayName = user?.name ?? 'Cravio User';
  const displayEmail = user?.email ?? '';
  const displayPhone = user?.phone ?? '';

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: paddingTop + 8, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Text style={[PP.h2, { color: colors.foreground }]}>Profile</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: paddingBottom + 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar + info */}
        <View style={[styles.heroCard, { backgroundColor: colors.card }]}>
          <Avatar
            name={displayName}
            size="xl"
            style={styles.avatar}
          />
          <View style={styles.heroText}>
            <Text style={[PP.h3, { color: colors.foreground }]}>{displayName}</Text>
            {displayEmail ? (
              <Text style={[PP.bodySM, { color: colors.mutedForeground, marginTop: 2 }]}>{displayEmail}</Text>
            ) : null}
            {displayPhone ? (
              <Text style={[PP.caption, { color: colors.mutedForeground }]}>{displayPhone}</Text>
            ) : null}
          </View>
        </View>

        {/* Menu sections */}
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[PP.caption, styles.sectionLabel, { color: colors.mutedForeground }]}>ACCOUNT</Text>
          <MenuRow
            icon={<Package size={18} color="#FF6B00" />}
            label="My Orders"
            subtitle="Track and view order history"
            onPress={onOrders}
          />
          <MenuRow
            icon={<Heart size={18} color="#EC4899" />}
            label="Favorites"
            subtitle="Your saved restaurants and dishes"
            onPress={onFavorites}
          />
          <MenuRow
            icon={<Clock3 size={18} color="#F97316" />}
            label="Recently Viewed"
            subtitle="Restaurants you visited recently"
            onPress={onRecentlyViewed}
          />
          <MenuRow
            icon={<MapPin size={18} color="#6366F1" />}
            label="Saved Addresses"
            subtitle="Manage delivery addresses"
            onPress={onAddresses}
          />
          <MenuRow
            icon={<CreditCard size={18} color="#10B981" />}
            label="Payment Methods"
            subtitle="Coming soon"
          />
        </View>

        <View style={[styles.section, { backgroundColor: colors.card, marginTop: 12 }]}>
          <Text style={[PP.caption, styles.sectionLabel, { color: colors.mutedForeground }]}>PREFERENCES</Text>
          <MenuRow
            icon={<Settings size={18} color="#6B7280" />}
            label="Settings"
            subtitle="App preferences & notifications"
          />
        </View>

        <View style={[styles.section, { backgroundColor: colors.card, marginTop: 12 }]}>
          <MenuRow
            icon={<LogOut size={18} color="#DC2626" />}
            label="Log Out"
            onPress={handleLogout}
            isDanger
          />
        </View>

        <Text style={[PP.caption, styles.version, { color: colors.mutedForeground }]}>
          Cravio v1.0 · Phase 6
        </Text>
      </ScrollView>

      {isLoading && <CircularLoader overlay />}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  scroll: { flex: 1 },
  heroCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    margin: 16,
    padding: 20,
    borderRadius: 20,
  },
  avatar: { flexShrink: 0 },
  heroText: { flex: 1 },
  section: {
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  sectionLabel: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 4,
    letterSpacing: 0.8,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  menuIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuText: { flex: 1 },
  version: { textAlign: 'center', marginTop: 32, marginBottom: 8 },
});
