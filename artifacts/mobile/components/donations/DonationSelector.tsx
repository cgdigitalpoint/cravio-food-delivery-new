// ─── Checkout Donation Selector ──────────────────────────────────────────────
import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Heart } from 'lucide-react-native';
import { useColors } from '@/hooks/useColors';
import { PP } from '@/theme/poppins';
import { borderRadius, spacing } from '@/theme';

export const DONATION_OPTIONS = [10, 20, 50, 100, 200, 500] as const;

interface DonationSelectorProps {
  selectedAmount: number | null;
  customAmount: string;
  onSelect: (amount: number | null) => void;
  onCustomAmountChange: (value: string) => void;
}

export function DonationSelector({
  selectedAmount,
  customAmount,
  onSelect,
  onCustomAmountChange,
}: DonationSelectorProps) {
  const colors = useColors();
  const isCustomSelected = selectedAmount !== null && !DONATION_OPTIONS.includes(selectedAmount as (typeof DONATION_OPTIONS)[number]);

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <View style={styles.headingRow}>
        <View style={[styles.iconWrap, { backgroundColor: `${colors.primary}15` }]}>
          <Heart size={17} color={colors.primary} fill={`${colors.primary}25`} />
        </View>
        <View style={styles.headingText}>
          <Text style={[PP.label, { color: colors.foreground }]}>Feed Someone Today</Text>
          <Text style={[PP.caption, { color: colors.mutedForeground, marginTop: 2 }]}>
            Your small contribution can help provide food to hungry people.
          </Text>
        </View>
      </View>

      <View style={styles.options}>
        {DONATION_OPTIONS.map((amount) => {
          const selected = selectedAmount === amount;
          return (
            <TouchableOpacity
              key={amount}
              onPress={() => onSelect(amount)}
              activeOpacity={0.8}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              accessibilityLabel={`Donate ₹${amount}`}
              style={[
                styles.option,
                {
                  backgroundColor: selected ? `${colors.primary}12` : colors.surfaceVariant,
                  borderColor: selected ? colors.primary : colors.border,
                },
              ]}
            >
              <Text
                style={[
                  PP.label,
                  { color: selected ? colors.primary : colors.foreground },
                ]}
              >
                ₹{amount}
              </Text>
            </TouchableOpacity>
          );
        })}
        <TouchableOpacity
          onPress={() => onSelect(isCustomSelected ? null : 1)}
          activeOpacity={0.8}
          accessibilityRole="radio"
          accessibilityState={{ selected: isCustomSelected }}
          accessibilityLabel="Donate a custom amount"
          style={[
            styles.option,
            styles.customOption,
            {
              backgroundColor: isCustomSelected ? `${colors.primary}12` : colors.surfaceVariant,
              borderColor: isCustomSelected ? colors.primary : colors.border,
            },
          ]}
        >
          <Text style={[PP.label, { color: isCustomSelected ? colors.primary : colors.foreground }]}>
            Custom
          </Text>
        </TouchableOpacity>
      </View>

      {isCustomSelected && (
        <TextInput
          value={customAmount}
          onChangeText={(value) => onCustomAmountChange(value.replace(/[^0-9]/g, ''))}
          placeholder="Enter amount"
          placeholderTextColor={colors.mutedForeground}
          keyboardType="number-pad"
          accessibilityLabel="Custom donation amount"
          style={[
            styles.input,
            { color: colors.foreground, borderColor: colors.primary, backgroundColor: colors.background },
          ]}
        />
      )}

      <TouchableOpacity
        onPress={() => onSelect(null)}
        activeOpacity={0.8}
        accessibilityRole="radio"
        accessibilityState={{ selected: selectedAmount === null }}
        accessibilityLabel="Skip donation"
        style={styles.skipButton}
      >
        <Text
          style={[
            PP.caption,
            {
              color: selectedAmount === null ? colors.primary : colors.mutedForeground,
              fontFamily: selectedAmount === null ? 'Poppins_600SemiBold' : 'Poppins_400Regular',
            },
          ]}
        >
          {selectedAmount === null ? '✓ ' : ''}Skip Donation
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    padding: spacing.md,
  },
  headingRow: { flexDirection: 'row', alignItems: 'center' },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  headingText: { flex: 1 },
  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  option: {
    minWidth: 65,
    paddingHorizontal: 10,
    paddingVertical: 9,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    alignItems: 'center',
  },
  customOption: { minWidth: 82 },
  input: {
    height: 44,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    paddingHorizontal: spacing.md12,
    marginTop: spacing.sm,
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
  },
  skipButton: { alignSelf: 'flex-start', marginTop: spacing.md12, paddingVertical: 3 },
});