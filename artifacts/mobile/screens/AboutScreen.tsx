// ─── About App Screen ──────────────────────────────────────────────────────────
// Displays app info, developer, company, and version details.

import React from 'react';
import {
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Building2,
  Code2,
  ExternalLink,
  Heart,
  Info,
  Mail,
  Shield,
  Smartphone,
} from 'lucide-react-native';
import { useColors } from '@/hooks/useColors';
import { PP } from '@/theme/poppins';

// ─── Props ────────────────────────────────────────────────────────────────────

interface AboutScreenProps {
  onBack?: () => void;
}

// ─── Info Row ─────────────────────────────────────────────────────────────────

function InfoRow({
  icon,
  iconBg,
  label,
  value,
  onPress,
  isFirst,
}: {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: string;
  onPress?: () => void;
  isFirst?: boolean;
}) {
  const colors = useColors();
  const Comp = onPress ? TouchableOpacity : View;
  return (
    <Comp
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      style={[
        infoRowStyles.row,
        { borderTopColor: colors.border },
        isFirst && infoRowStyles.firstRow,
      ]}
    >
      <View style={[infoRowStyles.iconWrap, { backgroundColor: iconBg }]}>{icon}</View>
      <Text style={[PP.body, infoRowStyles.label, { color: colors.mutedForeground }]}>
        {label}
      </Text>
      <View style={infoRowStyles.right}>
        <Text style={[PP.label, { color: colors.foreground }]}>{value}</Text>
        {onPress && (
          <ExternalLink size={14} color={colors.primary} strokeWidth={2} />
        )}
      </View>
    </Comp>
  );
}

const infoRowStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: 14,
  },
  firstRow: { borderTopWidth: 0 },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  label: { flex: 1 },
  right: { flexDirection: 'row', alignItems: 'center', gap: 6 },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────

export function AboutScreen({ onBack }: AboutScreenProps) {
  const insets = useSafeAreaInsets();
  const colors = useColors();

  const paddingTop = Platform.OS === 'web' ? 56 : insets.top;
  const paddingBottom = Platform.OS === 'web' ? 34 : insets.bottom;

  const openWebsite = () => {
    Linking.openURL('https://www.cravioapp.in').catch(() => {});
  };

  const openEmail = () => {
    Linking.openURL('mailto:support@cravioapp.in').catch(() => {});
  };

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
          About App
        </Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: paddingBottom + 32, paddingTop: 16 }}
      >
        {/* ── Brand hero ── */}
        <View style={[styles.brandCard, { backgroundColor: colors.primary }]}>
          <View style={styles.logoWrap}>
            <Text style={styles.logoEmoji}>🍽️</Text>
          </View>
          <Text style={[PP.h2, styles.brandName]}>Cravio</Text>
          <Text style={[PP.bodySM, styles.brandTagline]}>Food Delivery</Text>
          <View style={[styles.versionBadge, { backgroundColor: 'rgba(255,255,255,0.18)' }]}>
            <Text style={[PP.caption, styles.versionBadgeText]}>Version 1.0.0</Text>
          </View>
        </View>

        {/* ── App Info ── */}
        <View style={styles.sectionLabel}>
          <View style={[styles.sectionAccent, { backgroundColor: colors.primary }]} />
          <Text style={[PP.overline, { color: colors.mutedForeground }]}>App Information</Text>
        </View>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <InfoRow
            icon={<Smartphone size={17} color="#FF6B00" />}
            iconBg="#FFF7ED"
            label="Application"
            value="Cravio Food Delivery"
            isFirst
          />
          <InfoRow
            icon={<Info size={17} color="#3B82F6" />}
            iconBg="#EFF6FF"
            label="Version"
            value="1.0.0"
          />
          <InfoRow
            icon={<Shield size={17} color="#22C55E" />}
            iconBg="#F0FDF4"
            label="Platform"
            value={Platform.OS === 'ios' ? 'iOS' : Platform.OS === 'android' ? 'Android' : 'Web'}
          />
        </View>

        {/* ── Developer / Company ── */}
        <View style={styles.sectionLabel}>
          <View style={[styles.sectionAccent, { backgroundColor: colors.primary }]} />
          <Text style={[PP.overline, { color: colors.mutedForeground }]}>Developer & Company</Text>
        </View>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <InfoRow
            icon={<Code2 size={17} color="#8B5CF6" />}
            iconBg="#F5F3FF"
            label="Developer"
            value="Adil Altaf"
            isFirst
          />
          <InfoRow
            icon={<Heart size={17} color="#EC4899" />}
            iconBg="#FDF2F8"
            label="Founder & Owner"
            value="Adil Altaf"
          />
          <InfoRow
            icon={<Building2 size={17} color="#0EA5E9" />}
            iconBg="#F0F9FF"
            label="Company"
            value="CG Digital Point"
          />
          <InfoRow
            icon={<ExternalLink size={17} color="#14B8A6" />}
            iconBg="#F0FDFA"
            label="Website"
            value="cravioapp.in"
            onPress={openWebsite}
          />
          <InfoRow
            icon={<Mail size={17} color="#F59E0B" />}
            iconBg="#FFFBEB"
            label="Contact"
            value="support@cravioapp.in"
            onPress={openEmail}
          />
        </View>

        {/* ── Legal ── */}
        <View style={styles.sectionLabel}>
          <View style={[styles.sectionAccent, { backgroundColor: colors.primary }]} />
          <Text style={[PP.overline, { color: colors.mutedForeground }]}>Legal</Text>
        </View>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <InfoRow
            icon={<Shield size={17} color="#6B7280" />}
            iconBg={colors.muted}
            label="Copyright"
            value="© 2026 CG Digital Point"
            isFirst
          />
        </View>

        {/* ── Made with love ── */}
        <View style={styles.madeWith}>
          <Text style={[PP.caption, { color: colors.mutedForeground }]}>
            Made with{' '}
            <Text style={{ color: '#EF4444' }}>❤️</Text>
            {' '}in India by CG Digital Point
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

  brandCard: {
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 24,
    paddingVertical: 32,
    alignItems: 'center',
    gap: 4,
  },
  logoWrap: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  logoEmoji: { fontSize: 40 },
  brandName: {
    color: '#FFFFFF',
    fontFamily: 'Poppins_700Bold',
    letterSpacing: -0.5,
  },
  brandTagline: {
    color: 'rgba(255,255,255,0.8)',
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontFamily: 'Poppins_500Medium',
  },
  versionBadge: {
    marginTop: 10,
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
  },
  versionBadgeText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins_600SemiBold',
    letterSpacing: 0.5,
  },

  sectionLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 20,
    marginTop: 4,
    marginBottom: 8,
  },
  sectionAccent: { width: 3, height: 14, borderRadius: 2 },

  card: {
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
  },

  madeWith: {
    alignItems: 'center',
    marginTop: 12,
    paddingVertical: 8,
  },
});
