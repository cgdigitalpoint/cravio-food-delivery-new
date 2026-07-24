// ─── Payment Selector ─────────────────────────────────────────────────────────
// COD · UPI · Credit/Debit Card (placeholder) · Wallet (placeholder).

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Banknote, CreditCard, Smartphone, Wallet } from 'lucide-react-native';
import { useColors } from '@/hooks/useColors';
import { PP } from '@/theme/poppins';
import { borderRadius, spacing } from '@/theme';

export type PaymentMethod = 'cod' | 'upi' | 'card' | 'wallet';

export interface PaymentSelectorProps {
  selected: PaymentMethod | null;
  onSelect: (method: PaymentMethod) => void;
}

interface OptionProps {
  id: PaymentMethod;
  icon: React.ReactNode;
  label: string;
  subtitle: string;
  selected: boolean;
  onSelect: () => void;
  disabled?: boolean;
}

function Option({
  id,
  icon,
  label,
  subtitle,
  selected,
  onSelect,
  disabled,
}: OptionProps) {
  const colors = useColors();
  return (
    <TouchableOpacity
      onPress={disabled ? undefined : onSelect}
      activeOpacity={disabled ? 1 : 0.8}
      style={[
        styles.option,
        {
          backgroundColor: selected ? `${colors.primary}0D` : colors.card,
          borderColor: selected ? colors.primary : colors.border,
          opacity: disabled ? 0.5 : 1,
        },
      ]}
      accessibilityRole="radio"
      accessibilityState={{ selected, disabled: !!disabled }}
      accessibilityLabel={label}
    >
      <View
        style={[
          styles.iconWrap,
          { backgroundColor: selected ? `${colors.primary}18` : colors.surfaceVariant },
        ]}
      >
        {icon}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[PP.label, { color: colors.foreground }]}>{label}</Text>
        <Text style={[PP.caption, { color: colors.mutedForeground, marginTop: 2 }]}>
          {subtitle}
        </Text>
      </View>
      {disabled ? (
        <View style={[styles.soonBadge, { backgroundColor: colors.surfaceVariant }]}>
          <Text style={[PP.caption, { color: colors.mutedForeground, fontSize: 10 }]}>
            Soon
          </Text>
        </View>
      ) : selected ? (
        <View style={[styles.radio, { borderColor: colors.primary, backgroundColor: colors.primary }]}>
          <View style={styles.radioDot} />
        </View>
      ) : (
        <View style={[styles.radio, { borderColor: colors.border }]} />
      )}
    </TouchableOpacity>
  );
}

export function PaymentSelector({ selected, onSelect }: PaymentSelectorProps) {
  const colors = useColors();

  const iconColor = (method: PaymentMethod) =>
    selected === method ? '#FF6B00' : colors.mutedForeground;

  return (
    <View style={styles.container}>
      <Option
        id="cod"
        icon={<Banknote size={18} color={iconColor('cod')} />}
        label="Cash on Delivery"
        subtitle="Pay when your order arrives"
        selected={selected === 'cod'}
        onSelect={() => onSelect('cod')}
      />
      <Option
        id="upi"
        icon={<Smartphone size={18} color={iconColor('upi')} />}
        label="UPI"
        subtitle="GPay, PhonePe, Paytm & more"
        selected={selected === 'upi'}
        onSelect={() => onSelect('upi')}
      />
      <Option
        id="card"
        icon={<CreditCard size={18} color={colors.mutedForeground} />}
        label="Credit / Debit Card"
        subtitle="Visa, Mastercard, Amex"
        selected={selected === 'card'}
        onSelect={() => onSelect('card')}
        disabled
      />
      <Option
        id="wallet"
        icon={<Wallet size={18} color={colors.mutedForeground} />}
        label="Cravio Wallet"
        subtitle="Instant payments & rewards"
        selected={selected === 'wallet'}
        onSelect={() => onSelect('wallet')}
        disabled
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.sm },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md12,
    borderWidth: 1.5,
    borderRadius: borderRadius.lg,
    padding: spacing.md12,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  soonBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#fff' },
});
