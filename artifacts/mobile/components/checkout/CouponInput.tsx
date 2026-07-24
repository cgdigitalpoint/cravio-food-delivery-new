// ─── Coupon Input ─────────────────────────────────────────────────────────────
// Apply / remove a promo coupon with validation and animated feedback.

import React, { useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { CheckCircle2, Tag, X } from 'lucide-react-native';
import { useColors } from '@/hooks/useColors';
import { PP } from '@/theme/poppins';
import { borderRadius, spacing } from '@/theme';
import { PROMO_CODES } from '@/data/restaurantData';

export interface CouponInputProps {
  appliedCode: string | null;
  appliedDiscount: number;
  onApply: (code: string, discount: number) => void;
  onRemove: () => void;
}

type CouponState = 'idle' | 'checking' | 'valid' | 'invalid';

export function CouponInput({
  appliedCode,
  appliedDiscount,
  onApply,
  onRemove,
}: CouponInputProps) {
  const colors = useColors();
  const [inputCode, setInputCode] = useState('');
  const [couponState, setCouponState] = useState<CouponState>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleApply = () => {
    const trimmed = inputCode.trim().toUpperCase();
    if (!trimmed) return;
    setCouponState('checking');
    // Simulate brief lookup delay for UX feedback
    setTimeout(() => {
      const discount = PROMO_CODES[trimmed];
      if (discount !== undefined) {
        setCouponState('valid');
        setErrorMsg('');
        onApply(trimmed, discount);
        setInputCode('');
      } else {
        setCouponState('invalid');
        setErrorMsg(`"${trimmed}" is not a valid coupon code.`);
      }
    }, 600);
  };

  const handleRemove = () => {
    setCouponState('idle');
    setErrorMsg('');
    setInputCode('');
    onRemove();
  };

  // ── Applied state ──────────────────────────────────────────────────────────
  if (appliedCode) {
    return (
      <Animated.View
        entering={FadeIn.duration(200)}
        style={[styles.appliedRow, { backgroundColor: '#F0FDF4', borderColor: '#22C55E' }]}
      >
        <CheckCircle2 size={18} color="#16A34A" />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={[PP.label, { color: '#15803D' }]}>
            {appliedCode} applied!
          </Text>
          <Text style={[PP.caption, { color: '#16A34A' }]}>
            You save ${appliedDiscount.toFixed(2)}
          </Text>
        </View>
        <TouchableOpacity
          onPress={handleRemove}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityLabel="Remove coupon"
        >
          <X size={18} color="#16A34A" />
        </TouchableOpacity>
      </Animated.View>
    );
  }

  // ── Input state ────────────────────────────────────────────────────────────
  return (
    <View>
      <View
        style={[
          styles.inputRow,
          {
            backgroundColor: colors.card,
            borderColor: couponState === 'invalid' ? '#EF4444' : colors.border,
          },
        ]}
      >
        <Tag size={16} color={colors.mutedForeground} />
        <TextInput
          value={inputCode}
          onChangeText={(t) => {
            setInputCode(t.toUpperCase());
            setCouponState('idle');
            setErrorMsg('');
          }}
          onSubmitEditing={handleApply}
          placeholder="Enter coupon code"
          placeholderTextColor={colors.mutedForeground}
          autoCapitalize="characters"
          returnKeyType="done"
          style={[
            PP.body,
            { flex: 1, color: colors.foreground, marginLeft: 10, padding: 0 },
          ]}
          accessibilityLabel="Coupon code input"
        />
        <TouchableOpacity
          onPress={handleApply}
          disabled={!inputCode.trim() || couponState === 'checking'}
          style={[
            styles.applyBtn,
            { backgroundColor: inputCode.trim() ? colors.primary : colors.muted },
          ]}
          accessibilityLabel="Apply coupon"
        >
          {couponState === 'checking' ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={[PP.buttonSM, { color: '#fff' }]}>Apply</Text>
          )}
        </TouchableOpacity>
      </View>

      {couponState === 'invalid' && (
        <Animated.Text
          entering={FadeIn.duration(180)}
          exiting={FadeOut.duration(120)}
          style={[PP.caption, styles.errorText]}
        >
          {errorMsg}
        </Animated.Text>
      )}

      {/* Hint: available codes */}
      <Text style={[PP.caption, { color: colors.mutedForeground, marginTop: spacing.sm, marginLeft: 4 }]}>
        Try: FIRST50 · CRAVIO20 · FREEDEL · BOGO100
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: borderRadius.lg,
    paddingLeft: spacing.md12,
    paddingRight: 6,
    paddingVertical: 6,
  },
  applyBtn: {
    paddingHorizontal: spacing.md12,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 64,
    minHeight: 36,
  },
  appliedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: borderRadius.lg,
    padding: spacing.md12,
  },
  errorText: {
    color: '#EF4444',
    marginTop: 6,
    marginLeft: 4,
  },
});
