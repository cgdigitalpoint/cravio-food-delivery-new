// ─── Legal Center Screen ───────────────────────────────────────────────────────
// Hub screen listing all 9 legal policy documents.

import React from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, ChevronRight, Scale } from 'lucide-react-native';
import { useColors } from '@/hooks/useColors';
import { PP } from '@/theme/poppins';
import { LEGAL_CENTER_ENTRIES, LegalEntry } from './legalContent';

// ─── Props ────────────────────────────────────────────────────────────────────

interface LegalCenterScreenProps {
  onBack?: () => void;
  onOpenDoc?: (docId: string) => void;
}

// ─── Doc Row ─────────────────────────────────────────────────────────────────

function DocRow({
  entry,
  onPress,
  isFirst,
}: {
  entry: LegalEntry;
  onPress: () => void;
  isFirst: boolean;
}) {
  const colors = useColors();
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        docRowStyles.row,
        { borderTopColor: colors.border },
        isFirst && docRowStyles.firstRow,
      ]}
    >
      <View style={[docRowStyles.emojiWrap, { backgroundColor: colors.muted }]}>
        <Text style={docRowStyles.emoji}>{entry.emoji}</Text>
      </View>
      <View style={docRowStyles.text}>
        <Text style={[PP.label, { color: colors.foreground }]}>{entry.title}</Text>
        <Text style={[PP.caption, { color: colors.mutedForeground, marginTop: 1 }]}>
          {entry.subtitle}
        </Text>
      </View>
      <ChevronRight size={16} color={colors.mutedForeground} strokeWidth={1.8} />
    </TouchableOpacity>
  );
}

const docRowStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: 14,
  },
  firstRow: { borderTopWidth: 0 },
  emojiWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  emoji: { fontSize: 18 },
  text: { flex: 1 },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────

export function LegalCenterScreen({ onBack, onOpenDoc }: LegalCenterScreenProps) {
  const insets = useSafeAreaInsets();
  const colors = useColors();

  const paddingTop = Platform.OS === 'web' ? 56 : insets.top;
  const paddingBottom = Platform.OS === 'web' ? 34 : insets.bottom;

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      {/* ── Top bar ── */}
      <View
        style={[
          styles.topBar,
          { paddingTop: paddingTop + 4, backgroundColor: colors.card, borderBottomColor: colors.border },
        ]}
      >
        <TouchableOpacity onPress={onBack} activeOpacity={0.7} style={styles.backBtn}>
          <ArrowLeft size={22} color={colors.foreground} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={[PP.title, styles.topTitle, { color: colors.foreground }]}>
          Legal Center
        </Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: paddingBottom + 32, paddingTop: 16 }}
      >
        {/* ── Hero ── */}
        <View style={[styles.hero, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.heroIcon, { backgroundColor: colors.accent }]}>
            <Scale size={28} color={colors.primary} strokeWidth={1.8} />
          </View>
          <Text style={[PP.h3, { color: colors.foreground, textAlign: 'center' }]}>
            Legal Center
          </Text>
          <Text
            style={[
              PP.body,
              { color: colors.mutedForeground, textAlign: 'center', marginTop: 6, lineHeight: 22 },
            ]}
          >
            All Cravio policies and legal documents in one place. Last reviewed July 2026.
          </Text>
        </View>

        {/* ── Documents list ── */}
        <View style={[styles.listCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {LEGAL_CENTER_ENTRIES.map((entry, i) => (
            <DocRow
              key={entry.id}
              entry={entry}
              onPress={() => onOpenDoc?.(entry.id)}
              isFirst={i === 0}
            />
          ))}
        </View>

        {/* ── Contact card ── */}
        <View style={[styles.contactCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[PP.label, { color: colors.foreground, marginBottom: 4 }]}>
            Legal Inquiries
          </Text>
          <Text style={[PP.bodySM, { color: colors.mutedForeground, lineHeight: 20 }]}>
            For legal questions or data requests, contact us at{' '}
            <Text style={{ color: colors.primary }}>legal@cravioapp.in</Text>
          </Text>
          <Text style={[PP.caption, { color: colors.mutedForeground, marginTop: 10 }]}>
            © 2026 CG Digital Point · Cravio Food Delivery
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 8,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topTitle: {
    flex: 1,
    textAlign: 'center',
  },

  hero: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    gap: 8,
  },
  heroIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },

  listCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
  },

  contactCard: {
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 18,
    borderWidth: StyleSheet.hairlineWidth,
  },
});
