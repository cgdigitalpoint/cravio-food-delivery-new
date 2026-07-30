// ─── Legal Document Screen ─────────────────────────────────────────────────────
// Reusable screen that renders any legal policy document.
// Receives a `docId` and looks up content from legalContent.ts.

import React, { useCallback } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { useColors } from '@/hooks/useColors';
import { PP } from '@/theme/poppins';
import { LEGAL_DOCS } from './legalContent';

// ─── Props ────────────────────────────────────────────────────────────────────

interface LegalDocScreenProps {
  docId: string;
  onBack?: () => void;
}

// ─── Section Card ─────────────────────────────────────────────────────────────

function SectionCard({
  heading,
  paragraphs,
  isFirst,
}: {
  heading: string;
  paragraphs: string[];
  isFirst: boolean;
}) {
  const colors = useColors();
  return (
    <View
      style={[
        sectionStyles.card,
        { backgroundColor: colors.card, borderColor: colors.border },
        isFirst && sectionStyles.firstCard,
      ]}
    >
      <View style={sectionStyles.headingRow}>
        <View style={[sectionStyles.accent, { backgroundColor: colors.primary }]} />
        <Text style={[PP.label, sectionStyles.heading, { color: colors.foreground }]}>
          {heading}
        </Text>
      </View>
      {paragraphs.map((para, i) => (
        <Text
          key={i}
          style={[PP.body, sectionStyles.para, { color: colors.mutedForeground }]}
        >
          {para}
        </Text>
      ))}
    </View>
  );
}

const sectionStyles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 16,
    padding: 18,
    borderWidth: StyleSheet.hairlineWidth,
  },
  firstCard: { marginTop: 4 },
  headingRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 10,
  },
  accent: {
    width: 3,
    height: 18,
    borderRadius: 2,
    marginTop: 1,
    flexShrink: 0,
  },
  heading: {
    flex: 1,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 13.5,
  },
  para: {
    lineHeight: 22,
    marginTop: 4,
  },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────

export function LegalDocScreen({ docId, onBack }: LegalDocScreenProps) {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const doc = LEGAL_DOCS[docId];

  const paddingTop = Platform.OS === 'web' ? 56 : insets.top;
  const paddingBottom = Platform.OS === 'web' ? 34 : insets.bottom;

  if (!doc) {
    return (
      <View style={[styles.screen, { backgroundColor: colors.background }]}>
        <View
          style={[
            styles.topBar,
            { paddingTop: paddingTop + 4, backgroundColor: colors.card, borderBottomColor: colors.border },
          ]}
        >
          <TouchableOpacity onPress={onBack} activeOpacity={0.7} style={styles.backBtn}>
            <ArrowLeft size={22} color={colors.foreground} strokeWidth={2} />
          </TouchableOpacity>
          <Text style={[PP.title, { color: colors.foreground }]}>Not Found</Text>
          <View style={styles.backBtn} />
        </View>
        <View style={styles.notFound}>
          <Text style={[PP.body, { color: colors.mutedForeground, textAlign: 'center' }]}>
            This document is not available.
          </Text>
        </View>
      </View>
    );
  }

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
        <Text style={[PP.title, styles.topTitle, { color: colors.foreground }]} numberOfLines={1}>
          {doc.title}
        </Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: paddingBottom + 32, paddingTop: 16 }}
      >
        {/* ── Hero card ── */}
        <View style={[styles.heroCard, { backgroundColor: colors.primary }]}>
          <Text style={styles.heroEmoji}>{doc.emoji}</Text>
          <Text style={[PP.h3, styles.heroTitle]}>{doc.title}</Text>
          <Text style={[PP.bodySM, styles.heroIntro]}>{doc.intro}</Text>
          <View style={styles.heroMeta}>
            <Text style={[PP.caption, styles.heroMetaText]}>
              Last updated: {doc.lastUpdated}
            </Text>
            <Text style={[PP.caption, styles.heroMetaText]}>
              Effective: {doc.effectiveDate}
            </Text>
          </View>
        </View>

        {/* ── Sections ── */}
        {doc.sections.map((section, i) => (
          <SectionCard
            key={i}
            heading={section.heading}
            paragraphs={section.paragraphs}
            isFirst={i === 0}
          />
        ))}

        {/* ── Footer ── */}
        <View style={styles.footer}>
          <Text style={[PP.caption, { color: colors.mutedForeground, textAlign: 'center' }]}>
            © 2026 CG Digital Point · All rights reserved
          </Text>
          <Text style={[PP.caption, { color: colors.mutedForeground, textAlign: 'center', marginTop: 2 }]}>
            Cravio Food Delivery · v1.0.0
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

  heroCard: {
    marginHorizontal: 16,
    marginBottom: 14,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  heroEmoji: {
    fontSize: 36,
    marginBottom: 10,
  },
  heroTitle: {
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
  },
  heroIntro: {
    color: 'rgba(255,255,255,0.88)',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 16,
  },
  heroMeta: {
    gap: 2,
    alignItems: 'center',
  },
  heroMetaText: {
    color: 'rgba(255,255,255,0.7)',
  },

  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },

  footer: {
    marginHorizontal: 16,
    marginTop: 12,
    paddingVertical: 16,
    gap: 2,
  },
});
