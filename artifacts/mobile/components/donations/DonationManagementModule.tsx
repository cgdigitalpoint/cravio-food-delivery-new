// ─── Standalone Donation Management Module ────────────────────────────────────
// Deliberately independent of the future Admin Panel shell.
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { BarChart3, CircleDollarSign, Clock3, Heart, WalletCards } from 'lucide-react-native';
import { useColors } from '@/hooks/useColors';
import { PP } from '@/theme/poppins';
import { borderRadius, spacing } from '@/theme';
import type { DonationManagementSnapshot } from '@/types/donation.types';

interface DonationManagementModuleProps {
  snapshot: DonationManagementSnapshot;
}

function formatAmount(value: number) {
  return `₹${value.toFixed(2)}`;
}

export function DonationManagementModule({ snapshot }: DonationManagementModuleProps) {
  const colors = useColors();
  const cards = [
    { label: 'Total Donations', value: snapshot.totalDonations.toString(), icon: Heart, color: '#EC4899' },
    { label: "Today's Donations", value: formatAmount(snapshot.todaysDonations), icon: Clock3, color: '#F97316' },
    { label: 'Monthly Donations', value: formatAmount(snapshot.monthlyDonations), icon: BarChart3, color: '#6366F1' },
    { label: 'Yearly Donations', value: formatAmount(snapshot.yearlyDonations), icon: CircleDollarSign, color: '#16A34A' },
    { label: 'Wallet Balance', value: formatAmount(snapshot.walletBalance), icon: WalletCards, color: colors.primary },
  ];

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      <View style={styles.cardGrid}>
        {cards.map(({ label, value, icon: Icon, color }) => (
          <View key={label} style={[styles.metricCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.metricIcon, { backgroundColor: `${color}18` }]}>
              <Icon size={17} color={color} />
            </View>
            <Text style={[PP.caption, { color: colors.mutedForeground }]}>{label}</Text>
            <Text style={[PP.title, { color: colors.foreground, marginTop: 2 }]}>{value}</Text>
          </View>
        ))}
      </View>

      <Text style={[PP.overline, { color: colors.mutedForeground, marginTop: spacing.xl }]}>
        FINANCIAL SUMMARY
      </Text>
      <View style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {[
          ['Donation Collection', snapshot.donationCollection],
          ['Donation Utilized', snapshot.donationUtilized],
          ['Remaining Balance', snapshot.remainingBalance],
        ].map(([label, value]) => (
          <View key={label as string} style={styles.summaryRow}>
            <Text style={[PP.bodySM, { color: colors.mutedForeground }]}>{label}</Text>
            <Text style={[PP.label, { color: colors.foreground }]}>{formatAmount(value as number)}</Text>
          </View>
        ))}
      </View>

      <Text style={[PP.overline, { color: colors.mutedForeground, marginTop: spacing.xl }]}>
        RECENT DONATIONS
      </Text>
      <View style={[styles.listCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {snapshot.recentDonations.length === 0 ? (
          <Text style={[PP.bodySM, { color: colors.mutedForeground, padding: spacing.md }]}>
            No donations have been collected yet.
          </Text>
        ) : (
          snapshot.recentDonations.map((donation) => (
            <View key={donation.id} style={[styles.donationRow, { borderBottomColor: colors.border }]}>
              <View style={styles.rowText}>
                <Text style={[PP.label, { color: colors.foreground }]}>
                  {donation.id.slice(0, 8).toUpperCase()}
                </Text>
                <Text style={[PP.caption, { color: colors.mutedForeground }]}>
                  {donation.customer_name ?? donation.customer_email ?? 'Customer'} ·{' '}
                  Order {donation.order_id.slice(0, 8).toUpperCase()} · {new Date(donation.created_at).toLocaleDateString()}
                </Text>
              </View>
              <View style={styles.rowAmount}>
                <Text style={[PP.label, { color: colors.foreground }]}>{formatAmount(donation.amount)}</Text>
                <Text style={[PP.caption, { color: donation.payment_status === 'paid' ? colors.success : colors.warning }]}>
                  {donation.payment_status}
                </Text>
              </View>
            </View>
          ))
        )}
      </View>

      <Text style={[PP.overline, { color: colors.mutedForeground, marginTop: spacing.xl }]}>
        WITHDRAWALS & UTILIZATION
      </Text>
      <View style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[PP.bodySM, { color: colors.mutedForeground }]}>
          Withdrawal history and utilization records are ready for future Hunger Relief operations.
        </Text>
        <Text style={[PP.caption, { color: colors.mutedForeground, marginTop: spacing.sm }]}>
          {snapshot.withdrawalHistory.length} withdrawals · {snapshot.utilizationRecords.length} utilization records
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.md, paddingBottom: 40 },
  cardGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  metricCard: {
    width: '31%',
    minWidth: 100,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    padding: spacing.md12,
  },
  metricIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  summaryCard: { borderRadius: borderRadius.lg, borderWidth: 1, padding: spacing.md },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  listCard: { borderRadius: borderRadius.lg, borderWidth: 1, overflow: 'hidden' },
  donationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowText: { flex: 1 },
  rowAmount: { alignItems: 'flex-end' },
});