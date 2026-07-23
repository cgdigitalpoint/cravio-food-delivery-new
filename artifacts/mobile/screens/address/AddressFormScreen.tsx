// ─── Address Form Screen (Add / Edit) ────────────────────────────────────────
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { useColors } from '@/hooks/useColors';
import { PP } from '@/theme/poppins';
import { useAuthStore } from '@/store/useAuthStore';
import { useAddressStore } from '@/store/useAddressStore';
import { InputField, PremiumButton } from '@/components/ui';
import type { DbAddress } from '@/types/db.types';

interface AddressFormScreenProps {
  existingAddress?: DbAddress | null;
  onBack?: () => void;
  onSaved?: () => void;
}

export function AddressFormScreen({ existingAddress, onBack, onSaved }: AddressFormScreenProps) {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { supabaseUserId } = useAuthStore();
  const { createAddress, updateAddress, isLoading } = useAddressStore();

  const isEdit = existingAddress != null;

  const [title, setTitle] = useState(existingAddress?.title ?? '');
  const [house, setHouse] = useState(existingAddress?.house ?? '');
  const [street, setStreet] = useState(existingAddress?.street ?? '');
  const [city, setCity] = useState(existingAddress?.city ?? '');
  const [state, setState] = useState(existingAddress?.state ?? '');
  const [pincode, setPincode] = useState(existingAddress?.pincode ?? '');
  const [isDefault, setIsDefault] = useState(existingAddress?.is_default ?? false);
  const [error, setError] = useState<string | null>(null);

  const paddingTop = Platform.OS === 'web' ? 60 : insets.top;
  const paddingBottom = Platform.OS === 'web' ? 34 : insets.bottom;

  const isValid = title.trim() && house.trim() && street.trim() && city.trim() && state.trim() && pincode.trim();

  const handleSave = async () => {
    if (!supabaseUserId || !isValid) return;
    setError(null);
    const payload: Omit<DbAddress, 'id' | 'user_id'> = {
      title: title.trim(),
      house: house.trim(),
      street: street.trim(),
      city: city.trim(),
      state: state.trim(),
      pincode: pincode.trim(),
      latitude: null,
      longitude: null,
      is_default: isDefault,
    };

    try {
      if (isEdit && existingAddress) {
        await updateAddress(existingAddress.id, supabaseUserId, payload);
      } else {
        await createAddress(supabaseUserId, payload);
      }
      onSaved?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save address.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.screen, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={[styles.header, { paddingTop: paddingTop + 8, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={onBack} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <View style={[styles.backBtn, { backgroundColor: colors.muted }]}>
            <ArrowLeft size={20} color={colors.foreground} strokeWidth={2} />
          </View>
        </TouchableOpacity>
        <Text style={[PP.h3, { color: colors.foreground }]}>{isEdit ? 'Edit Address' : 'New Address'}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: paddingBottom + 24 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <InputField
          label="Label (e.g. Home, Work)"
          placeholder="Home"
          value={title}
          onChangeText={setTitle}
        />
        <InputField
          label="House / Flat No."
          placeholder="Apt 4B"
          value={house}
          onChangeText={setHouse}
        />
        <InputField
          label="Street"
          placeholder="123 Main Street"
          value={street}
          onChangeText={setStreet}
        />
        <InputField
          label="City"
          placeholder="San Francisco"
          value={city}
          onChangeText={setCity}
        />
        <InputField
          label="State"
          placeholder="California"
          value={state}
          onChangeText={setState}
        />
        <InputField
          label="Pincode / ZIP"
          placeholder="94105"
          value={pincode}
          onChangeText={setPincode}
          keyboardType="number-pad"
        />

        {/* Default toggle */}
        <View style={[styles.toggleRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[PP.label, { color: colors.foreground }]}>Set as default address</Text>
          <Switch
            value={isDefault}
            onValueChange={setIsDefault}
            trackColor={{ false: colors.border, true: '#FF6B00' }}
            thumbColor="#FFFFFF"
          />
        </View>

        {error ? (
          <View style={styles.errorBox}>
            <Text style={[PP.caption, { color: '#DC2626' }]}>{error}</Text>
          </View>
        ) : null}

        <PremiumButton
          label={isEdit ? 'Save Changes' : 'Add Address'}
          onPress={handleSave}
          variant="primary"
          fullWidth
          disabled={!isValid || isLoading}
          isLoading={isLoading}
        />
      </ScrollView>
    </KeyboardAvoidingView>
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
  content: { padding: 20, gap: 14 },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
  },
  errorBox: {
    backgroundColor: '#FEF2F2',
    borderRadius: 10,
    padding: 12,
  },
});
