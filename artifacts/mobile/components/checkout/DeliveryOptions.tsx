// ─── Delivery Options ─────────────────────────────────────────────────────────
// ASAP / Schedule, contactless toggle, delivery instructions text.

import React from 'react';
import {
  Platform,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { Bell, Calendar, Clock, Zap } from 'lucide-react-native';
import { useColors } from '@/hooks/useColors';
import { PP } from '@/theme/poppins';
import { borderRadius, spacing } from '@/theme';

export type DeliveryType = 'asap' | 'schedule';

export interface DeliveryOptionsValue {
  type: DeliveryType;
  contactless: boolean;
  note: string;
}

interface DeliveryOptionsProps {
  value: DeliveryOptionsValue;
  onChange: (value: DeliveryOptionsValue) => void;
}

export function DeliveryOptions({ value, onChange }: DeliveryOptionsProps) {
  const colors = useColors();

  const set = (patch: Partial<DeliveryOptionsValue>) =>
    onChange({ ...value, ...patch });

  return (
    <View style={styles.container}>
      {/* ── Delivery type selector ── */}
      <View style={[styles.typeRow, { backgroundColor: colors.surfaceVariant }]}>
        <TouchableOpacity
          onPress={() => set({ type: 'asap' })}
          style={[
            styles.typeOption,
            value.type === 'asap' && { backgroundColor: colors.card },
          ]}
          activeOpacity={0.8}
          accessibilityRole="radio"
          accessibilityState={{ selected: value.type === 'asap' }}
        >
          <Zap
            size={15}
            color={value.type === 'asap' ? colors.primary : colors.mutedForeground}
          />
          <Text
            style={[
              PP.label,
              {
                color: value.type === 'asap' ? colors.foreground : colors.mutedForeground,
                marginLeft: 6,
              },
            ]}
          >
            Deliver ASAP
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => set({ type: 'schedule' })}
          style={[
            styles.typeOption,
            value.type === 'schedule' && { backgroundColor: colors.card },
          ]}
          activeOpacity={0.8}
          accessibilityRole="radio"
          accessibilityState={{ selected: value.type === 'schedule' }}
        >
          <Calendar
            size={15}
            color={value.type === 'schedule' ? colors.primary : colors.mutedForeground}
          />
          <Text
            style={[
              PP.label,
              {
                color: value.type === 'schedule' ? colors.foreground : colors.mutedForeground,
                marginLeft: 6,
              },
            ]}
          >
            Schedule
          </Text>
        </TouchableOpacity>
      </View>

      {/* ── ASAP ETA ── */}
      {value.type === 'asap' && (
        <Animated.View
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(150)}
          style={[styles.etaChip, { backgroundColor: '#FFF7ED', borderColor: '#FED7AA' }]}
        >
          <Clock size={14} color="#FF6B00" />
          <Text
            style={[PP.bodySM, { color: '#FF6B00', marginLeft: 8, fontFamily: 'Poppins_500Medium' }]}
          >
            Estimated delivery: 30–45 min
          </Text>
        </Animated.View>
      )}

      {/* ── Schedule placeholder ── */}
      {value.type === 'schedule' && (
        <Animated.View
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(150)}
          style={[
            styles.schedulePlaceholder,
            { backgroundColor: colors.surfaceVariant, borderColor: colors.border },
          ]}
        >
          <Calendar size={20} color={colors.mutedForeground} />
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={[PP.label, { color: colors.foreground }]}>
              Schedule for later
            </Text>
            <Text style={[PP.caption, { color: colors.mutedForeground, marginTop: 2 }]}>
              Date & time picker — coming soon
            </Text>
          </View>
          <View style={[styles.soonBadge, { backgroundColor: colors.muted }]}>
            <Text style={[PP.caption, { color: colors.mutedForeground, fontSize: 10 }]}>
              Soon
            </Text>
          </View>
        </Animated.View>
      )}

      {/* ── Contactless delivery toggle ── */}
      <View
        style={[
          styles.toggleRow,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <Bell size={17} color={value.contactless ? colors.primary : colors.mutedForeground} />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={[PP.label, { color: colors.foreground }]}>
            Contactless Delivery
          </Text>
          <Text style={[PP.caption, { color: colors.mutedForeground, marginTop: 2 }]}>
            Leave order at door — avoid contact
          </Text>
        </View>
        <Switch
          value={value.contactless}
          onValueChange={(v) => set({ contactless: v })}
          trackColor={{ false: colors.border, true: `${colors.primary}60` }}
          thumbColor={value.contactless ? colors.primary : (Platform.OS === 'android' ? colors.surfaceVariant : undefined)}
          ios_backgroundColor={colors.border}
          accessibilityLabel="Contactless delivery"
        />
      </View>

      {/* ── Delivery instructions ── */}
      <TextInput
        value={value.note}
        onChangeText={(note) => set({ note })}
        placeholder="Delivery instructions (gate code, landmark, floor…)"
        placeholderTextColor={colors.mutedForeground}
        multiline
        numberOfLines={2}
        maxLength={200}
        style={[
          styles.noteInput,
          {
            color: colors.foreground,
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
        accessibilityLabel="Delivery instructions"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.md12 },
  typeRow: {
    flexDirection: 'row',
    borderRadius: borderRadius.lg,
    padding: 4,
  },
  typeOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: borderRadius.md,
  },
  etaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md12,
    paddingVertical: spacing.sm,
  },
  schedulePlaceholder: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: borderRadius.lg,
    padding: spacing.md12,
  },
  soonBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: borderRadius.lg,
    padding: spacing.md12,
  },
  noteInput: {
    borderWidth: 1,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md12,
    paddingVertical: spacing.md12,
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
    textAlignVertical: 'top',
    minHeight: 64,
  },
});
