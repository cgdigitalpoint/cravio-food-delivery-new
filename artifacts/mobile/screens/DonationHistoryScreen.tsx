// ─── Customer Donation History ────────────────────────────────────────────────
import React, { useEffect } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Heart, WalletCards } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { PP } from '@/theme/poppins';
import { borderRadius, spacing } from '@/theme';
import { useAuthStore } from '@/store/useAuthStore';
import { useDonationStore } from '@/store/useDonationStore';

export function DonationHistoryScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { supabaseUserId } = useAuthStore();
  const { donations, isLoading, error, fetchDonations } = useDonationStore();

  useEffect(() => {
    if (supabaseUserId) fetchDonations(supabaseUserId);
  }, [supabaseUserId, fetchDonations]);

  const total = donations.reduce(
    (sum, donation) => sum + (donation.payment_status === 'failed' ? 0 : donation.amount),
    0,
  );

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          { paddingTop: insets.top + 8, backgroundColor: colors.card, borderBottomColor: colors.border },
        ]}
      >
        <Heart size={20} color={colors.primary} fill={`${colors.primary}25`} />
        <Text style={[PP.title, { color: colors.foreground, marginLeft: 9 }]}>Hunger Relief</Text>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: spacing.md, paddingBottom: insets.bottom + 32 }}
      >
        <View style={[styles.walletCard, { backgroundColor: colors.primary }]}>
          <WalletCards size={24} color="#fff" />
          <Text style={[PP.caption, { color: 'rgba(255,255,255,0.82)', marginTop: spacing.sm }]}>
            Your donation wallet contribution
          </Text>
          <Text style={[PP.h2, { color: '#fff', marginTop: 2 }]}>₹{total.toFixed(2)}</Text>
        </View>

        <Text style={[PP.overline, { color: colors.mutedForeground, marginTop: spacing.xl, marginBottom: spacing.sm }]}>
          DONATION HISTORY
        </Text>
        {isLoading && donations.length === 0 ? (
          <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />
        ) : error ? (
          <Text style={[PP.bodySM, { color: colors.destructive }]}>{error}</Text>
        ) : donations.length === 0 ? (
          <View style={[styles.empty, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Heart size={28} color={colors.mutedForeground} />
            <Text style={[PP.bodySM, { color: colors.mutedForeground, textAlign: 'center', marginTop: spacing.sm }]}>
              Your optional checkout donations will appear here.
            </Text>
          </View>
        ) : (
          <View style={[styles.list, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {donations.map((donation) => (
              <View key={donation.id} style={[styles.row, { borderBottomColor: colors.border }]}>
                <View style={{ flex: 1 }}>
                  <Text style={[PP.label, { color: colors.foreground }]}>₹{donation.amount.toFixed(2)}</Text>
                  <Text style={[PP.caption, { color: colors.mutedForeground }]}>
                    Order {donation.order_id.slice(0, 8).toUpperCase()} · {new Date(donation.created_at).toLocaleDateString()}
                  </Text>
                </View>
                <Text style={[PP.caption, { color: donation.payment_status === 'paid' ? colors.success : colors.warning }]}>
                  {donation.payment_status}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md12,
    borderBottomWidth: 1,
  },
  walletCard: {
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  empty: {
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    alignItems: 'center',
    padding: spacing.xl,
  },
  list: { borderRadius: borderRadius.lg, borderWidth: 1, overflow: 'hidden' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});