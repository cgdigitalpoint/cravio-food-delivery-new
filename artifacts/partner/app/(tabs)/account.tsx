// ─── Account Tab ──────────────────────────────────────────────────────────────
import React, { useState } from 'react';
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
import { useRouter } from 'expo-router';
import {
  ChevronRight,
  HelpCircle,
  LogOut,
  Mail,
  Phone,
  Shield,
  User,
} from 'lucide-react-native';
import { PremiumButton, StatusBadge } from '@/components/ui';
import { PP } from '@/theme/poppins';
import { usePartnerAuthStore } from '@/store/usePartnerAuthStore';
import { useRestaurantStore } from '@/store/useRestaurantStore';

export default function AccountTab() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { partner, logout, isLoading } = usePartnerAuthStore();
  const reset = useRestaurantStore((s) => s.reset);

  const paddingTop = Platform.OS === 'web' ? 67 : insets.top;
  const paddingBottom = Platform.OS === 'web' ? 34 : insets.bottom;

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            reset();
            await logout();
            router.replace('/auth/login');
          },
        },
      ]
    );
  };

  const initials = partner?.name
    ? partner.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
    : 'P';

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingTop: paddingTop + 16, paddingBottom: paddingBottom + 20 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Profile header */}
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={[PP.h3, { color: '#FFFFFF' }]}>{initials}</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={[PP.title, { color: '#111827' }]} numberOfLines={1}>
            {partner?.name ?? 'Restaurant Partner'}
          </Text>
          <Text style={[PP.caption, { color: '#6B7280' }]} numberOfLines={1}>
            {partner?.email ?? ''}
          </Text>
          <View style={{ marginTop: 6 }}>
            <StatusBadge status={partner?.approval_status ?? 'pending'} size="sm" />
          </View>
        </View>
      </View>

      {/* Account details */}
      <View style={styles.section}>
        <Text style={[PP.label, styles.sectionTitle]}>Account Details</Text>
        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <View style={styles.detailIcon}><User size={18} color="#6B7280" strokeWidth={1.8} /></View>
            <View style={styles.detailText}>
              <Text style={[PP.captionSM, { color: '#9CA3AF' }]}>Full Name</Text>
              <Text style={[PP.label, { color: '#111827', fontSize: 14 }]}>{partner?.name ?? '—'}</Text>
            </View>
          </View>
          <View style={[styles.detailRow, styles.rowBorder]}>
            <View style={styles.detailIcon}><Mail size={18} color="#6B7280" strokeWidth={1.8} /></View>
            <View style={styles.detailText}>
              <Text style={[PP.captionSM, { color: '#9CA3AF' }]}>Email Address</Text>
              <Text style={[PP.label, { color: '#111827', fontSize: 14 }]}>{partner?.email ?? '—'}</Text>
            </View>
          </View>
          <View style={styles.detailRow}>
            <View style={styles.detailIcon}><Phone size={18} color="#6B7280" strokeWidth={1.8} /></View>
            <View style={styles.detailText}>
              <Text style={[PP.captionSM, { color: '#9CA3AF' }]}>Phone Number</Text>
              <Text style={[PP.label, { color: '#111827', fontSize: 14 }]}>{partner?.phone ?? '—'}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Support links */}
      <View style={styles.section}>
        <Text style={[PP.label, styles.sectionTitle]}>Help & Support</Text>
        <View style={styles.linksCard}>
          {[
            { icon: <Shield size={18} color="#6B7280" strokeWidth={1.8} />, label: 'Privacy Policy' },
            { icon: <HelpCircle size={18} color="#6B7280" strokeWidth={1.8} />, label: 'Partner Support' },
          ].map((item, idx) => (
            <TouchableOpacity
              key={item.label}
              style={[styles.linkRow, idx > 0 && styles.rowBorder]}
              activeOpacity={0.7}
            >
              <View style={styles.detailIcon}>{item.icon}</View>
              <Text style={[PP.label, { color: '#374151', flex: 1, fontSize: 14 }]}>{item.label}</Text>
              <ChevronRight size={16} color="#D1D5DB" strokeWidth={2} />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* App version */}
      <Text style={[PP.captionSM, styles.version]}>Cravio Partner v1.0.0 · Phase 11A</Text>

      {/* Logout */}
      <PremiumButton
        label="Sign Out"
        onPress={handleLogout}
        variant="destructive"
        fullWidth
        isLoading={isLoading}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F8F9FB' },
  content: { paddingHorizontal: 20, gap: 20 },
  profileCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: '#F3F4F6',
  },
  avatar: {
    width: 60, height: 60, borderRadius: 18,
    backgroundColor: '#FF6B00', alignItems: 'center', justifyContent: 'center',
  },
  profileInfo: { flex: 1 },
  section: { gap: 8 },
  sectionTitle: { color: '#6B7280', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase' },
  detailsCard: {
    backgroundColor: '#FFFFFF', borderRadius: 16,
    borderWidth: 1, borderColor: '#F3F4F6', overflow: 'hidden',
  },
  linksCard: {
    backgroundColor: '#FFFFFF', borderRadius: 16,
    borderWidth: 1, borderColor: '#F3F4F6', overflow: 'hidden',
  },
  detailRow: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  linkRow: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  rowBorder: { borderTopWidth: 1, borderTopColor: '#F9FAFB' },
  detailIcon: { width: 34, height: 34, borderRadius: 10, backgroundColor: '#F9FAFB', alignItems: 'center', justifyContent: 'center' },
  detailText: { flex: 1, gap: 1 },
  version: { color: '#D1D5DB', textAlign: 'center' },
});
