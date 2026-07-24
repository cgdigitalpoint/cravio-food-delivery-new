// ─── Price Summary ────────────────────────────────────────────────────────────
// Full auto-updating price breakdown: subtotal → grand total.

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useColors } from '@/hooks/useColors';
import { PP } from '@/theme/poppins';
import { borderRadius, spacing } from '@/theme';

export interface PriceSummaryProps {
  subtotal: number;
  discount: number;
  couponDiscount: number;
  deliveryFee: number;
  platformFee: number;
  gst: number;
  grandTotal: number;
}

interface RowProps {
  label: string;
  value: string;
  isTotal?: boolean;
  isSaving?: boolean;
  dimmed?: boolean;
}

function Row({ label, value, isTotal, isSaving, dimmed }: RowProps) {
  const colors = useColors();
  const labelColor = isSaving
    ? '#16A34A'
    : dimmed
    ? colors.mutedForeground
    : colors.foreground;
  const valueColor = isSaving ? '#16A34A' : isTotal ? colors.primary : dimmed ? colors.mutedForeground : colors.foreground;

  return (
    <View style={[styles.row, isTotal && styles.totalRowSpacing]}>
      <Text
        style={[
          isTotal ? PP.label : PP.bodySM,
          { color: labelColor },
        ]}
      >
        {label}
      </Text>
      <Text
        style={[
          isTotal ? PP.label : PP.bodySM,
          {
            color: valueColor,
            fontFamily: isTotal ? 'Poppins_700Bold' : 'Poppins_400Regular',
          },
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

export function PriceSummary({
  subtotal,
  discount,
  couponDiscount,
  deliveryFee,
  platformFee,
  gst,
  grandTotal,
}: PriceSummaryProps) {
  const colors = useColors();
  const totalSavings = discount + couponDiscount;

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Row label="Subtotal" value={`$${subtotal.toFixed(2)}`} />
      {discount > 0 && (
        <Row label="Discount" value={`-$${discount.toFixed(2)}`} isSaving />
      )}
      {couponDiscount > 0 && (
        <Row label="Coupon Discount" value={`-$${couponDiscount.toFixed(2)}`} isSaving />
      )}
      <Row
        label="Delivery Fee"
        value={deliveryFee === 0 ? 'Free' : `$${deliveryFee.toFixed(2)}`}
        dimmed
      />
      <Row label="Platform Fee" value={`$${platformFee.toFixed(2)}`} dimmed />
      <Row label="GST (5%)" value={`$${gst.toFixed(2)}`} dimmed />

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      <Row label="Grand Total" value={`$${grandTotal.toFixed(2)}`} isTotal />

      {totalSavings > 0 && (
        <View style={styles.savingChip}>
          <Text style={[PP.caption, { color: '#16A34A', fontFamily: 'Poppins_600SemiBold' }]}>
            🎉 You save ${totalSavings.toFixed(2)} on this order
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    padding: spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  totalRowSpacing: { marginTop: 2 },
  divider: { height: 1, marginVertical: spacing.sm },
  savingChip: {
    alignItems: 'center',
    marginTop: spacing.sm,
    paddingVertical: 8,
    borderRadius: borderRadius.md,
    backgroundColor: '#F0FDF4',
  },
});
