// ─── Standalone future Admin donation module route ────────────────────────────
import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { PP } from '@/theme/poppins';
import { useDonationStore } from '@/store/useDonationStore';
import { DonationManagementModule } from '@/components/donations';

export function DonationManagementScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { managementSnapshot, isLoading, error, fetchManagementSnapshot } = useDonationStore();

  useEffect(() => {
    fetchManagementSnapshot();
  }, [fetchManagementSnapshot]);

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 8, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Text style={[PP.title, { color: colors.foreground }]}>Donation Management</Text>
        <Text style={[PP.caption, { color: colors.mutedForeground, marginTop: 2 }]}>
          Hunger Relief wallet operations
        </Text>
      </View>
      {isLoading && !managementSnapshot ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: 40 }} />
      ) : error ? (
        <Text style={[PP.bodySM, styles.error, { color: colors.destructive }]}>{error}</Text>
      ) : managementSnapshot ? (
        <DonationManagementModule snapshot={managementSnapshot} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  error: { padding: 20, textAlign: 'center' },
});