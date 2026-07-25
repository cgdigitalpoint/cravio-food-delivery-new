// ─── Dashboard Screen ─────────────────────────────────────────────────────────
import React, { useEffect } from 'react';
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
  Clock,
  CreditCard,
  FileText,
  Receipt,
  Store,
  ChevronRight,
  Bell,
  Building2,
} from 'lucide-react-native';
import { StatusBadge } from '@/components/ui';
import { PP } from '@/theme/poppins';
import { usePartnerAuthStore } from '@/store/usePartnerAuthStore';
import { useRestaurantStore } from '@/store/useRestaurantStore';

interface QuickAction {
  icon: React.ReactNode;
  label: string;
  sublabel: string;
  onPress: () => void;
  badge?: string;
}

interface Props {
  onNavigate: (route: string) => void;
}

export function DashboardScreen({ onNavigate }: Props) {
  const insets = useSafeAreaInsets();
  const partner = usePartnerAuthStore((s) => s.partner);
  const { restaurant, isLoading, loadRestaurant, toggleOpen } = useRestaurantStore();

  const paddingTop = Platform.OS === 'web' ? 67 : insets.top;
  const paddingBottom = Platform.OS === 'web' ? 34 : insets.bottom;

  useEffect(() => {
    if (partner?.id) {
      void loadRestaurant(partner.id);
    }
  }, [partner?.id]);

  const approvalStatus = partner?.approval_status ?? 'pending';
  const isApproved = approvalStatus === 'approved';

  const handleToggle = (value: boolean) => {
    if (!isApproved) {
      Alert.alert('Not Approved', 'Your restaurant must be approved before you can open it.');
      return;
    }
    if (!restaurant) {
      Alert.alert('No Restaurant', 'Please complete your restaurant profile first.');
      return;
    }
    void toggleOpen(value);
  };

  const quickActions: QuickAction[] = [
    {
      icon: <Store size={22} color="#FF6B00" strokeWidth={1.8} />,
      label: 'Restaurant Profile',
      sublabel: restaurant ? 'Manage details' : 'Set up profile',
      onPress: () => onNavigate('restaurant-profile'),
      badge: !restaurant ? 'Required' : undefined,
    },
    {
      icon: <Bell size={22} color="#3B82F6" strokeWidth={1.8} />,
      label: 'Approval Status',
      sublabel: approvalStatus.replace('_', ' '),
      onPress: () => onNavigate('approval-status'),
    },
    {
      icon: <FileText size={22} color="#8B5CF6" strokeWidth={1.8} />,
      label: 'Documents',
      sublabel: 'FSSAI, GST & more',
      onPress: () => onNavigate('documents'),
    },
    {
      icon: <CreditCard size={22} color="#10B981" strokeWidth={1.8} />,
      label: 'Bank Details',
      sublabel: 'Payout account',
      onPress: () => onNavigate('bank-details'),
    },
    {
      icon: <Receipt size={22} color="#F59E0B" strokeWidth={1.8} />,
      label: 'GST Details',
      sublabel: 'Tax information',
      onPress: () => onNavigate('gst-details'),
    },
    {
      icon: <Clock size={22} color="#EF4444" strokeWidth={1.8} />,
      label: 'Business Hours',
      sublabel: 'Set open/close times',
      onPress: () => onNavigate('business-hours'),
    },
  ];

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.content, { paddingTop: paddingTop + 8, paddingBottom: paddingBottom + 20 }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={[PP.caption, { color: '#FF6B00', letterSpacing: 1.5 }]}>CRAVIO PARTNER</Text>
          <Text style={[PP.h3, { color: '#111827' }]}>{greeting()},</Text>
          <Text style={[PP.title, { color: '#374151' }]} numberOfLines={1}>
            {partner?.name ?? 'Partner'}
          </Text>
        </View>
        <View style={styles.avatarCircle}>
          <Building2 size={28} color="#FF6B00" strokeWidth={1.5} />
        </View>
      </View>

      {/* Approval Status Card */}
      <View style={styles.statusCard}>
        <View style={styles.statusCardRow}>
          <View style={{ flex: 1 }}>
            <Text style={[PP.label, { color: '#111827' }]}>Account Status</Text>
            <Text style={[PP.caption, { color: '#6B7280', marginTop: 2 }]}>
              {approvalStatus === 'pending' && 'Application submitted — awaiting review'}
              {approvalStatus === 'under_review' && 'Your documents are being reviewed'}
              {approvalStatus === 'approved' && 'Your restaurant is verified and active'}
              {approvalStatus === 'rejected' && 'Your application was rejected'}
              {approvalStatus === 'suspended' && 'Your account is temporarily suspended'}
            </Text>
          </View>
          <StatusBadge status={approvalStatus} />
        </View>
        {approvalStatus !== 'approved' && (
          <TouchableOpacity
            style={styles.statusCta}
            onPress={() => onNavigate('approval-status')}
            activeOpacity={0.7}
          >
            <Text style={[PP.caption, { color: '#FF6B00' }]}>View details</Text>
            <ChevronRight size={14} color="#FF6B00" strokeWidth={2} />
          </TouchableOpacity>
        )}
      </View>

      {/* Open / Close Toggle */}
      {restaurant != null && (
        <View style={[styles.toggleCard, !isApproved && styles.toggleCardDisabled]}>
          <View style={{ flex: 1 }}>
            <Text style={[PP.label, { color: isApproved ? '#111827' : '#9CA3AF' }]}>
              Restaurant Status
            </Text>
            <Text style={[PP.caption, { color: isApproved ? '#6B7280' : '#9CA3AF', marginTop: 2 }]}>
              {!isApproved
                ? 'Available after approval'
                : restaurant.is_open
                ? 'Accepting orders now'
                : 'Not accepting orders'}
            </Text>
          </View>
          <View style={styles.toggleRight}>
            <StatusBadge status={restaurant.is_open ? 'open' : 'closed'} size="sm" />
            <Switch
              value={isApproved ? restaurant.is_open : false}
              onValueChange={handleToggle}
              trackColor={{ false: '#E5E7EB', true: '#34D399' }}
              thumbColor={restaurant.is_open ? '#FFFFFF' : '#FFFFFF'}
              ios_backgroundColor="#E5E7EB"
              disabled={!isApproved || isLoading}
            />
          </View>
        </View>
      )}

      {/* Quick Actions */}
      <View style={styles.sectionHeader}>
        <Text style={[PP.title, { color: '#111827' }]}>Manage</Text>
      </View>

      <View style={styles.grid}>
        {quickActions.map((action) => (
          <TouchableOpacity
            key={action.label}
            style={styles.actionCard}
            onPress={action.onPress}
            activeOpacity={0.75}
          >
            <View style={styles.actionIcon}>{action.icon}</View>
            <View style={styles.actionText}>
              <Text style={[PP.label, { color: '#111827', fontSize: 13 }]} numberOfLines={1}>
                {action.label}
              </Text>
              <Text style={[PP.captionSM, { color: '#6B7280' }]} numberOfLines={1}>
                {action.sublabel}
              </Text>
            </View>
            {action.badge ? (
              <View style={styles.requiredBadge}>
                <Text style={[PP.captionSM, { color: '#92400E', fontSize: 9 }]}>
                  {action.badge}
                </Text>
              </View>
            ) : (
              <ChevronRight size={14} color="#D1D5DB" strokeWidth={2} />
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Onboarding checklist for new partners */}
      {!restaurant && (
        <View style={styles.onboardCard}>
          <Text style={[PP.label, { color: '#1E40AF' }]}>📋 Complete your onboarding</Text>
          <Text style={[PP.caption, { color: '#3730A3', marginTop: 4 }]}>
            Set up your restaurant profile, upload documents, add bank details, and configure business hours to go live.
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F8F9FB' },
  content: { paddingHorizontal: 20, gap: 16 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  headerLeft: { flex: 1, gap: 2 },
  avatarCircle: {
    width: 52, height: 52, borderRadius: 16,
    backgroundColor: '#FFF7ED',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: '#FFEDD5',
  },
  statusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statusCardRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  statusCta: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start' },
  toggleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  toggleCardDisabled: { backgroundColor: '#FAFAFA' },
  toggleRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionHeader: { marginTop: 4 },
  grid: { gap: 10 },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  actionIcon: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: '#F8F9FB',
    alignItems: 'center', justifyContent: 'center',
  },
  actionText: { flex: 1, gap: 1 },
  requiredBadge: {
    backgroundColor: '#FEF3C7',
    borderRadius: 6,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  onboardCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
});
