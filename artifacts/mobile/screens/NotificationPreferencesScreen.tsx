// ─── Notification Preferences Screen ─────────────────────────────────────────
import React from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Bell, Gift, Heart, Package } from 'lucide-react-native';
import { useColors } from '@/hooks/useColors';
import { PP } from '@/theme/poppins';
import { usePreferencesStore } from '@/store/usePreferencesStore';
import type { NotificationPrefs } from '@/store/usePreferencesStore';

interface NotificationPreferencesScreenProps {
  onBack?: () => void;
}

interface PrefRowProps {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  subtitle: string;
  prefKey: keyof NotificationPrefs;
}

export function NotificationPreferencesScreen({ onBack }: NotificationPreferencesScreenProps) {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { notifications, setNotificationPref } = usePreferencesStore();

  const paddingTop = Platform.OS === 'web' ? 60 : insets.top;
  const paddingBottom = Platform.OS === 'web' ? 34 : insets.bottom;

  const rows: PrefRowProps[] = [
    {
      icon: <Package size={18} color="#FF6B00" />,
      iconBg: '#FFF7ED',
      title: 'Order Updates',
      subtitle: 'Placement, preparation, delivery, and cancellation alerts.',
      prefKey: 'orderUpdates',
    },
    {
      icon: <Gift size={18} color="#8B5CF6" />,
      iconBg: '#F5F3FF',
      title: 'Offers & Discounts',
      subtitle: 'Exclusive deals and coupon codes tailored for you.',
      prefKey: 'offers',
    },
    {
      icon: <Bell size={18} color="#F59E0B" />,
      iconBg: '#FFFBEB',
      title: 'Promotions',
      subtitle: 'New restaurant launches, seasonal events, and campaigns.',
      prefKey: 'promotions',
    },
    {
      icon: <Heart size={18} color="#EC4899" />,
      iconBg: '#FDF2F8',
      title: 'Donation Notifications',
      subtitle: 'Updates about your Hunger Relief donations and impact.',
      prefKey: 'donations',
    },
  ];

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          { paddingTop: paddingTop + 8, backgroundColor: colors.card, borderBottomColor: colors.border },
        ]}
      >
        <TouchableOpacity onPress={onBack} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <View style={[styles.backBtn, { backgroundColor: colors.muted }]}>
            <ArrowLeft size={20} color={colors.foreground} strokeWidth={2} />
          </View>
        </TouchableOpacity>
        <Text style={[PP.h3, { color: colors.foreground }]}>Notifications</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: paddingBottom + 32, paddingTop: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Info banner */}
        <View style={[styles.infoBanner, { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' }]}>
          <Text style={[PP.bodySM, { color: '#1D4ED8' }]}>
            You can turn individual notification types on or off below. Order update alerts are recommended for a smooth delivery experience.
          </Text>
        </View>

        {/* Preference rows */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          {rows.map((row, index) => (
            <React.Fragment key={row.prefKey}>
              {index > 0 && (
                <View style={[styles.separator, { backgroundColor: colors.border }]} />
              )}
              <View style={styles.prefRow}>
                <View style={[styles.iconWrap, { backgroundColor: row.iconBg }]}>
                  {row.icon}
                </View>
                <View style={styles.textWrap}>
                  <Text style={[PP.label, { color: colors.foreground }]}>{row.title}</Text>
                  <Text style={[PP.caption, { color: colors.mutedForeground, marginTop: 2 }]}>
                    {row.subtitle}
                  </Text>
                </View>
                <Switch
                  value={notifications[row.prefKey]}
                  onValueChange={(val) => setNotificationPref(row.prefKey, val)}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </React.Fragment>
          ))}
        </View>

        <Text style={[PP.caption, styles.footerNote, { color: colors.mutedForeground }]}>
          Push notification delivery depends on your device settings. Ensure Cravio has notification permissions enabled in your system settings.
        </Text>
      </ScrollView>
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
  infoBanner: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
  },
  card: {
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  prefRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 14,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  textWrap: { flex: 1 },
  separator: { height: StyleSheet.hairlineWidth, marginLeft: 68 },
  footerNote: {
    marginHorizontal: 20,
    marginTop: 16,
    textAlign: 'center',
    lineHeight: 18,
  },
});
