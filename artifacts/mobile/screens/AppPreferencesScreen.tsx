// ─── App Preferences Screen ───────────────────────────────────────────────────
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
import { ArrowLeft, Check, Globe, Moon, Smartphone, Sun } from 'lucide-react-native';
import { useColors } from '@/hooks/useColors';
import { PP } from '@/theme/poppins';
import { usePreferencesStore, type AppTheme } from '@/store/usePreferencesStore';

interface AppPreferencesScreenProps {
  onBack?: () => void;
}

const THEME_OPTIONS: { value: AppTheme; label: string; subtitle: string; icon: React.ReactNode }[] = [
  { value: 'light', label: 'Light', subtitle: 'Always use light mode', icon: null },
  { value: 'dark', label: 'Dark', subtitle: 'Always use dark mode', icon: null },
  { value: 'auto', label: 'System default', subtitle: 'Follows your device setting', icon: null },
];

const LANGUAGE_OPTIONS = [
  { code: 'en', label: 'English', native: 'English', available: true },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी', available: false },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்', available: false },
  { code: 'te', label: 'Telugu', native: 'తెలుగు', available: false },
];

export function AppPreferencesScreen({ onBack }: AppPreferencesScreenProps) {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { theme, language, setTheme } = usePreferencesStore();

  const paddingTop = Platform.OS === 'web' ? 60 : insets.top;
  const paddingBottom = Platform.OS === 'web' ? 34 : insets.bottom;

  const themeIcon = (value: AppTheme) => {
    if (value === 'light') return <Sun size={18} color="#F59E0B" />;
    if (value === 'dark') return <Moon size={18} color="#6366F1" />;
    return <Smartphone size={18} color={colors.mutedForeground} />;
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          { paddingTop: paddingTop + 8, backgroundColor: colors.card, borderBottomColor: colors.border },
        ]}
      >
        <TouchableOpacity onPress={onBack} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <View style={[styles.backBtn, { backgroundColor: colors.muted }]}>
            <ArrowLeft size={20} color={colors.foreground} strokeWidth={2} />
          </View>
        </TouchableOpacity>
        <Text style={[PP.h3, { color: colors.foreground }]}>App Preferences</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: paddingBottom + 32, paddingTop: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Theme ── */}
        <View style={[styles.sectionHeader, { paddingHorizontal: 20 }]}>
          <View style={[styles.sectionAccent, { backgroundColor: colors.primary }]} />
          <Text style={[PP.label, { color: colors.foreground, fontFamily: 'Poppins_700Bold' }]}>
            Appearance
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card }]}>
          {THEME_OPTIONS.map((opt, index) => {
            const selected = theme === opt.value;
            return (
              <React.Fragment key={opt.value}>
                {index > 0 && (
                  <View style={[styles.separator, { backgroundColor: colors.border }]} />
                )}
                <TouchableOpacity
                  onPress={() => setTheme(opt.value)}
                  activeOpacity={0.7}
                  style={styles.optionRow}
                >
                  <View style={[styles.iconWrap, { backgroundColor: selected ? '#FFF7ED' : colors.muted }]}>
                    {themeIcon(opt.value)}
                  </View>
                  <View style={styles.textWrap}>
                    <Text style={[PP.label, { color: colors.foreground }]}>{opt.label}</Text>
                    <Text style={[PP.caption, { color: colors.mutedForeground, marginTop: 1 }]}>
                      {opt.subtitle}
                    </Text>
                  </View>
                  {selected ? (
                    <View style={[styles.checkCircle, { backgroundColor: colors.primary }]}>
                      <Check size={12} color="#FFFFFF" strokeWidth={3} />
                    </View>
                  ) : (
                    <View style={[styles.emptyCircle, { borderColor: colors.border }]} />
                  )}
                </TouchableOpacity>
              </React.Fragment>
            );
          })}
        </View>

        {/* ── Language ── */}
        <View style={[styles.sectionHeader, { paddingHorizontal: 20, marginTop: 8 }]}>
          <View style={[styles.sectionAccent, { backgroundColor: colors.primary }]} />
          <Text style={[PP.label, { color: colors.foreground, fontFamily: 'Poppins_700Bold' }]}>
            Language
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card }]}>
          {LANGUAGE_OPTIONS.map((lang, index) => {
            const selected = language === lang.code;
            return (
              <React.Fragment key={lang.code}>
                {index > 0 && (
                  <View style={[styles.separator, { backgroundColor: colors.border }]} />
                )}
                <View style={[styles.optionRow, !lang.available && styles.disabledRow]}>
                  <View style={[styles.iconWrap, { backgroundColor: selected ? '#EFF6FF' : colors.muted }]}>
                    <Globe size={18} color={selected ? '#3B82F6' : colors.mutedForeground} />
                  </View>
                  <View style={styles.textWrap}>
                    <Text style={[PP.label, { color: lang.available ? colors.foreground : colors.mutedForeground }]}>
                      {lang.label}
                    </Text>
                    <Text style={[PP.caption, { color: colors.mutedForeground, marginTop: 1 }]}>
                      {lang.native}{!lang.available ? ' · Coming soon' : ''}
                    </Text>
                  </View>
                  {selected ? (
                    <View style={[styles.checkCircle, { backgroundColor: '#3B82F6' }]}>
                      <Check size={12} color="#FFFFFF" strokeWidth={3} />
                    </View>
                  ) : (
                    <View style={[styles.emptyCircle, { borderColor: colors.border }]} />
                  )}
                </View>
              </React.Fragment>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backBtn: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  sectionAccent: { width: 3, height: 16, borderRadius: 2 },
  card: {
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 10,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 13,
    gap: 14,
  },
  disabledRow: { opacity: 0.5 },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  textWrap: { flex: 1 },
  separator: { height: StyleSheet.hairlineWidth, marginLeft: 68 },
  checkCircle: { width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  emptyCircle: { width: 22, height: 22, borderRadius: 11, borderWidth: 2 },
});
