// ─── Checkout Item Row ────────────────────────────────────────────────────────
// A single cart item in checkout: image, name, qty controls, cooking instructions.

import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from 'react-native-reanimated';
import {
  ChevronDown,
  ChevronUp,
  Minus,
  Plus,
  Trash2,
  UtensilsCrossed,
} from 'lucide-react-native';
import { useColors } from '@/hooks/useColors';
import { PP } from '@/theme/poppins';
import { borderRadius, spacing } from '@/theme';

export interface CheckoutItemRowProps {
  cartItemId: string;
  name: string;
  imageUrl: string;
  price: number;
  quantity: number;
  isVeg?: boolean;
  cookingNote: string;
  onCookingNoteChange: (cartItemId: string, note: string) => void;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
}

export function CheckoutItemRow({
  cartItemId,
  name,
  imageUrl,
  price,
  quantity,
  isVeg,
  cookingNote,
  onCookingNoteChange,
  onIncrease,
  onDecrease,
  onRemove,
}: CheckoutItemRowProps) {
  const colors = useColors();
  const [showNote, setShowNote] = useState(false);

  return (
    <Animated.View
      layout={LinearTransition.springify().damping(18).stiffness(200)}
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
    >
      {/* Main row */}
      <View style={styles.row}>
        {/* Veg / Non-veg indicator */}
        {isVeg !== undefined && (
          <View style={[styles.vegBox, { borderColor: isVeg ? '#16A34A' : '#DC2626' }]}>
            <View style={[styles.vegDot, { backgroundColor: isVeg ? '#16A34A' : '#DC2626' }]} />
          </View>
        )}

        {/* Image */}
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.img} contentFit="cover" />
        ) : (
          <View style={[styles.imgPlaceholder, { backgroundColor: colors.surfaceVariant }]} />
        )}

        {/* Name + price */}
        <View style={styles.info}>
          <Text style={[PP.label, { color: colors.foreground }]} numberOfLines={2}>
            {name}
          </Text>
          <Text style={[PP.bodySM, { color: colors.primary, fontFamily: 'Poppins_600SemiBold', marginTop: 2 }]}>
            ${(price * quantity).toFixed(2)}
          </Text>
          <Text style={[PP.caption, { color: colors.mutedForeground }]}>
            ${price.toFixed(2)} × {quantity}
          </Text>
        </View>

        {/* Qty controls */}
        <View style={styles.qtyRow}>
          <TouchableOpacity
            onPress={quantity <= 1 ? onRemove : onDecrease}
            style={[
              styles.qtyBtn,
              { borderColor: quantity <= 1 ? '#EF4444' : colors.border },
            ]}
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            accessibilityLabel={quantity <= 1 ? 'Remove item' : 'Decrease quantity'}
          >
            {quantity <= 1 ? (
              <Trash2 size={13} color="#EF4444" />
            ) : (
              <Minus size={13} color={colors.foreground} />
            )}
          </TouchableOpacity>
          <Text style={[PP.label, { color: colors.foreground, minWidth: 22, textAlign: 'center' }]}>
            {quantity}
          </Text>
          <TouchableOpacity
            onPress={onIncrease}
            style={[
              styles.qtyBtn,
              { borderColor: colors.primary, backgroundColor: `${colors.primary}12` },
            ]}
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            accessibilityLabel="Increase quantity"
          >
            <Plus size={13} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Cooking instructions toggle */}
      <TouchableOpacity
        onPress={() => setShowNote((v) => !v)}
        style={[styles.noteToggle, { borderTopColor: colors.border }]}
        activeOpacity={0.7}
        accessibilityLabel="Add cooking instructions"
      >
        <UtensilsCrossed size={13} color={colors.mutedForeground} />
        <Text
          style={[
            PP.caption,
            {
              color: cookingNote ? colors.primary : colors.mutedForeground,
              flex: 1,
              marginLeft: 6,
            },
          ]}
          numberOfLines={1}
        >
          {cookingNote
            ? `"${cookingNote.slice(0, 40)}${cookingNote.length > 40 ? '…' : ''}"`
            : 'Add cooking instructions'}
        </Text>
        {showNote ? (
          <ChevronUp size={14} color={colors.mutedForeground} />
        ) : (
          <ChevronDown size={14} color={colors.mutedForeground} />
        )}
      </TouchableOpacity>

      {/* Cooking note input */}
      {showNote && (
        <Animated.View
          entering={FadeIn.duration(180)}
          exiting={FadeOut.duration(120)}
          style={styles.noteWrap}
        >
          <TextInput
            value={cookingNote}
            onChangeText={(t) => onCookingNoteChange(cartItemId, t)}
            placeholder="e.g. Extra spicy, no onions, less salt…"
            placeholderTextColor={colors.mutedForeground}
            multiline
            maxLength={120}
            style={[
              styles.noteInput,
              {
                color: colors.foreground,
                backgroundColor: colors.surfaceVariant,
                borderColor: colors.border,
              },
            ]}
          />
          <Text style={[PP.caption, { color: colors.mutedForeground, textAlign: 'right', marginTop: 4 }]}>
            {cookingNote.length}/120
          </Text>
        </Animated.View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: spacing.md12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md12,
    padding: spacing.md12,
  },
  vegBox: {
    width: 14,
    height: 14,
    borderRadius: 2,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  vegDot: { width: 6, height: 6, borderRadius: 3 },
  img: { width: 56, height: 56, borderRadius: borderRadius.md, flexShrink: 0 },
  imgPlaceholder: { width: 56, height: 56, borderRadius: borderRadius.md, flexShrink: 0 },
  info: { flex: 1, gap: 1 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noteToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md12,
    paddingVertical: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  noteWrap: {
    paddingHorizontal: spacing.md12,
    paddingBottom: spacing.md12,
  },
  noteInput: {
    borderWidth: 1,
    borderRadius: borderRadius.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
    textAlignVertical: 'top',
    minHeight: 64,
  },
});
