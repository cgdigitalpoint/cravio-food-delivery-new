// ─── Address List Screen ──────────────────────────────────────────────────────
import React, { useEffect } from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, CheckCircle, Edit3, MapPin, Plus, Trash2 } from 'lucide-react-native';
import { useColors } from '@/hooks/useColors';
import { PP } from '@/theme/poppins';
import { useAuthStore } from '@/store/useAuthStore';
import { useAddressStore } from '@/store/useAddressStore';
import { PremiumButton } from '@/components/ui';
import type { DbAddress } from '@/types/db.types';

interface AddressListScreenProps {
  onBack?: () => void;
  onAddAddress?: () => void;
  onEditAddress?: (address: DbAddress) => void;
}

export function AddressListScreen({ onBack, onAddAddress, onEditAddress }: AddressListScreenProps) {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { supabaseUserId } = useAuthStore();
  const { addresses, isLoading, fetchAddresses, deleteAddress, setDefault } = useAddressStore();

  const paddingTop = Platform.OS === 'web' ? 60 : insets.top;
  const paddingBottom = Platform.OS === 'web' ? 34 : insets.bottom;

  useEffect(() => {
    if (supabaseUserId) fetchAddresses(supabaseUserId);
  }, [supabaseUserId]);

  const handleDelete = (addr: DbAddress) => {
    Alert.alert('Delete Address', `Remove "${addr.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          if (supabaseUserId) deleteAddress(addr.id, supabaseUserId);
        },
      },
    ]);
  };

  const handleSetDefault = (addr: DbAddress) => {
    if (!supabaseUserId || addr.is_default) return;
    setDefault(addr.id, supabaseUserId);
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: paddingTop + 8, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={onBack} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <View style={[styles.backBtn, { backgroundColor: colors.muted }]}>
            <ArrowLeft size={20} color={colors.foreground} strokeWidth={2} />
          </View>
        </TouchableOpacity>
        <Text style={[PP.h3, { color: colors.foreground }]}>Saved Addresses</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.list, { paddingBottom: paddingBottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <View style={styles.centered}>
            <Text style={[PP.body, { color: colors.mutedForeground }]}>Loading…</Text>
          </View>
        ) : addresses.length === 0 ? (
          <View style={styles.empty}>
            <MapPin size={48} color={colors.mutedForeground} />
            <Text style={[PP.h3, { color: colors.foreground, marginTop: 16 }]}>No addresses yet</Text>
            <Text style={[PP.body, { color: colors.mutedForeground, textAlign: 'center', marginTop: 8 }]}>
              Add a delivery address to get started
            </Text>
          </View>
        ) : (
          addresses.map((addr) => (
            <View key={addr.id} style={[styles.card, { backgroundColor: colors.card, borderColor: addr.is_default ? '#FF6B00' : colors.border }]}>
              <View style={styles.cardTop}>
                <View style={[styles.iconWrap, { backgroundColor: addr.is_default ? '#FF6B0015' : colors.muted }]}>
                  <MapPin size={18} color={addr.is_default ? '#FF6B00' : colors.mutedForeground} />
                </View>
                <View style={styles.cardInfo}>
                  <View style={styles.titleRow}>
                    <Text style={[PP.label, { color: colors.foreground }]}>{addr.title}</Text>
                    {addr.is_default && (
                      <View style={styles.defaultBadge}>
                        <Text style={[PP.caption, { color: '#FF6B00', fontFamily: 'Poppins_600SemiBold' }]}>Default</Text>
                      </View>
                    )}
                  </View>
                  <Text style={[PP.caption, { color: colors.mutedForeground, marginTop: 2 }]}>
                    {addr.house}, {addr.street}
                  </Text>
                  <Text style={[PP.caption, { color: colors.mutedForeground }]}>
                    {addr.city}, {addr.state} {addr.pincode}
                  </Text>
                </View>
              </View>

              <View style={[styles.cardActions, { borderTopColor: colors.border }]}>
                {!addr.is_default && (
                  <TouchableOpacity onPress={() => handleSetDefault(addr)} style={styles.actionBtn}>
                    <CheckCircle size={15} color="#10B981" />
                    <Text style={[PP.caption, { color: '#10B981', fontFamily: 'Poppins_500Medium' }]}>Set Default</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity onPress={() => onEditAddress?.(addr)} style={styles.actionBtn}>
                  <Edit3 size={15} color={colors.mutedForeground} />
                  <Text style={[PP.caption, { color: colors.mutedForeground }]}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(addr)} style={styles.actionBtn}>
                  <Trash2 size={15} color="#EF4444" />
                  <Text style={[PP.caption, { color: '#EF4444' }]}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Floating add button */}
      <View style={[styles.fab, { paddingBottom: paddingBottom + 16 }]}>
        <PremiumButton
          label="Add New Address"
          onPress={onAddAddress}
          variant="primary"
          fullWidth
        />
      </View>
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
  scroll: { flex: 1 },
  list: { padding: 16, gap: 12 },
  card: { borderRadius: 16, borderWidth: 1.5, overflow: 'hidden' },
  cardTop: { flexDirection: 'row', gap: 12, padding: 16 },
  iconWrap: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  cardInfo: { flex: 1 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  defaultBadge: {
    backgroundColor: '#FF6B0015',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  cardActions: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 20,
  },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80, paddingHorizontal: 32 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 60 },
  fab: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: 'transparent',
  },
});
