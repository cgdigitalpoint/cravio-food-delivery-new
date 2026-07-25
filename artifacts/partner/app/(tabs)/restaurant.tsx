// ─── Restaurant Tab ───────────────────────────────────────────────────────────
import React from 'react';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ChevronRight,
  Clock,
  CreditCard,
  FileText,
  Receipt,
  Shield,
  Store,
} from 'lucide-react-native';
import { StatusBadge } from '@/components/ui';
import { PP } from '@/theme/poppins';
import { usePartnerAuthStore } from '@/store/usePartnerAuthStore';
import { useRestaurantStore } from '@/store/useRestaurantStore';

interface MenuRow {
  icon: React.ReactNode;
  label: string;
  sublabel: string;
  route: string;
  badge?: React.ReactNode;
}

export default function RestaurantTab() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const partner = usePartnerAuthStore((s) => s.partner);
  const restaurant = useRestaurantStore((s) => s.restaurant);

  const paddingTop = Platform.OS === 'web' ? 67 : insets.top;
  const paddingBottom = Platform.OS === 'web' ? 34 : insets.bottom;

  const rows: MenuRow[] = [
    {
      icon: <Store size={20} color="#FF6B00" strokeWidth={1.8} />,
      label: 'Restaurant Profile',
      sublabel: restaurant ? restaurant.name : 'Not set up yet',
      route: '/restaurant-profile',
      badge: !restaurant ? <View style={styles.redDot} /> : undefined,
    },
    {
      icon: <Shield size={20} color="#3B82F6" strokeWidth={1.8} />,
      label: 'Approval Status',
      sublabel: (partner?.approval_status ?? 'pending').replace('_', ' '),
      route: '/approval-status',
      badge: partner?.approval_status !== 'approved'
        ? <StatusBadge status={partner?.approval_status ?? 'pending'} size="sm" />
        : undefined,
    },
    {
      icon: <FileText size={20} color="#8B5CF6" strokeWidth={1.8} />,
      label: 'Documents',
      sublabel: 'FSSAI, GST certificate & more',
      route: '/documents',
    },
    {
      icon: <CreditCard size={20} color="#10B981" strokeWidth={1.8} />,
      label: 'Bank Details',
      sublabel: 'Payout account information',
      route: '/bank-details',
    },
    {
      icon: <Receipt size={20} color="#F59E0B" strokeWidth={1.8} />,
      label: 'GST Details',
      sublabel: 'Tax registration information',
      route: '/gst-details',
    },
    {
      icon: <Clock size={20} color="#EF4444" strokeWidth={1.8} />,
      label: 'Business Hours',
      sublabel: 'Operating hours per day',
      route: '/business-hours',
    },
  ];

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingTop: paddingTop + 16, paddingBottom: paddingBottom + 20 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[PP.h3, { color: '#111827' }]}>Restaurant</Text>
      <Text style={[PP.body, { color: '#6B7280', marginTop: 2 }]}>
        Manage your restaurant information
      </Text>

      <View style={styles.card}>
        {rows.map((row, idx) => (
          <TouchableOpacity
            key={row.route}
            style={[styles.row, idx < rows.length - 1 && styles.rowBorder]}
            onPress={() => router.push(row.route as Parameters<typeof router.push>[0])}
            activeOpacity={0.7}
          >
            <View style={styles.rowIcon}>{row.icon}</View>
            <View style={styles.rowText}>
              <Text style={[PP.label, { color: '#111827', fontSize: 14 }]}>{row.label}</Text>
              <Text style={[PP.captionSM, { color: '#6B7280' }]} numberOfLines={1}>
                {row.sublabel}
              </Text>
            </View>
            <View style={styles.rowRight}>
              {row.badge}
              <ChevronRight size={16} color="#D1D5DB" strokeWidth={2} />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F8F9FB' },
  content: { paddingHorizontal: 20, gap: 16 },
  card: {
    backgroundColor: '#FFFFFF', borderRadius: 16,
    borderWidth: 1, borderColor: '#F3F4F6',
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16,
    paddingVertical: 14, gap: 12,
  },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: '#F9FAFB' },
  rowIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#F9FAFB', alignItems: 'center', justifyContent: 'center' },
  rowText: { flex: 1, gap: 2 },
  rowRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  redDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444' },
});
