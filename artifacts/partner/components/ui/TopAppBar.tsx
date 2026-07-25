// ─── TopAppBar ────────────────────────────────────────────────────────────────
import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { PP } from '@/theme/poppins';

interface Props {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightElement?: React.ReactNode;
  backgroundColor?: string;
}

export function TopAppBar({
  title,
  subtitle,
  onBack,
  rightElement,
  backgroundColor = '#FFFFFF',
}: Props) {
  const insets = useSafeAreaInsets();
  const paddingTop = Platform.OS === 'web' ? 67 : insets.top;

  return (
    <View style={[styles.bar, { backgroundColor, paddingTop: paddingTop + 8 }]}>
      <View style={styles.row}>
        {onBack != null ? (
          <TouchableOpacity
            onPress={onBack}
            style={styles.backBtn}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <View style={styles.backCircle}>
              <ArrowLeft size={20} color="#111827" strokeWidth={2} />
            </View>
          </TouchableOpacity>
        ) : (
          <View style={styles.sideSlot} />
        )}
        <View style={styles.titleWrap}>
          <Text style={[PP.title, styles.titleText]} numberOfLines={1}>
            {title}
          </Text>
          {subtitle ? (
            <Text style={[PP.captionSM, styles.subtitle]}>{subtitle}</Text>
          ) : null}
        </View>
        <View style={styles.sideSlot}>{rightElement}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  titleWrap: { flex: 1 },
  titleText: { color: '#111827', textAlign: 'center' },
  subtitle: { color: '#6B7280', textAlign: 'center' },
  backBtn: {},
  backCircle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sideSlot: { width: 36, alignItems: 'flex-end' },
});
