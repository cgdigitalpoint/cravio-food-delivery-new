// ─── Bank Details Screen ──────────────────────────────────────────────────────
import React, { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { CheckCircle, ShieldCheck } from 'lucide-react-native';
import { TopAppBar, InputField, PremiumButton } from '@/components/ui';
import { PP } from '@/theme/poppins';
import { useRestaurantStore } from '@/store/useRestaurantStore';
import type { AccountType } from '@/types/restaurant.types';

interface Props {
  onBack: () => void;
}

interface FormState {
  account_holder_name: string;
  account_number: string;
  confirm_account_number: string;
  ifsc_code: string;
  bank_name: string;
  branch: string;
  account_type: AccountType;
}

export function BankDetailsScreen({ onBack }: Props) {
  const { restaurant, bankDetails, isLoading, loadBankDetails, saveBankDetails } = useRestaurantStore();

  const [form, setForm] = useState<FormState>({
    account_holder_name: '',
    account_number: '',
    confirm_account_number: '',
    ifsc_code: '',
    bank_name: '',
    branch: '',
    account_type: 'savings',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  useEffect(() => {
    if (restaurant) void loadBankDetails();
  }, [restaurant?.id]);

  useEffect(() => {
    if (bankDetails) {
      setForm({
        account_holder_name: bankDetails.account_holder_name,
        account_number: bankDetails.account_number,
        confirm_account_number: bankDetails.account_number,
        ifsc_code: bankDetails.ifsc_code,
        bank_name: bankDetails.bank_name,
        branch: bankDetails.branch,
        account_type: bankDetails.account_type,
      });
    }
  }, [bankDetails]);

  const set = (key: keyof FormState, value: string | AccountType) =>
    setForm((f) => ({ ...f, [key]: value }));

  const validate = (): boolean => {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (!form.account_holder_name.trim()) e.account_holder_name = 'Required';
    if (!form.account_number.trim())      e.account_number = 'Required';
    if (form.account_number !== form.confirm_account_number) e.confirm_account_number = 'Account numbers do not match';
    if (!form.ifsc_code.trim() || form.ifsc_code.length !== 11) e.ifsc_code = 'Valid 11-character IFSC required';
    if (!form.bank_name.trim()) e.bank_name = 'Required';
    if (!form.branch.trim())    e.branch = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!restaurant) {
      Alert.alert('No Restaurant', 'Please complete your restaurant profile first.');
      return;
    }
    if (!validate()) return;
    try {
      await saveBankDetails({
        account_holder_name: form.account_holder_name.trim(),
        account_number: form.account_number.trim(),
        ifsc_code: form.ifsc_code.trim().toUpperCase(),
        bank_name: form.bank_name.trim(),
        branch: form.branch.trim(),
        account_type: form.account_type,
      });
      Alert.alert('Saved', 'Bank details saved successfully.', [{ text: 'OK', onPress: onBack }]);
    } catch {
      Alert.alert('Error', 'Failed to save bank details. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TopAppBar title="Bank Details" subtitle="Payout account information" onBack={onBack} />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

        {bankDetails?.is_verified && (
          <View style={styles.verifiedBanner}>
            <ShieldCheck size={18} color="#10B981" strokeWidth={2} />
            <Text style={[PP.label, { color: '#065F46', fontSize: 13 }]}>Bank account verified</Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={[PP.label, styles.sectionTitle]}>Account Information</Text>
          <View style={styles.fields}>
            <InputField
              label="Account Holder Name *"
              placeholder="As per bank records"
              value={form.account_holder_name}
              onChangeText={(v) => set('account_holder_name', v)}
              autoCapitalize="words"
              error={errors.account_holder_name}
            />
            <InputField
              label="Account Number *"
              placeholder="Enter account number"
              value={form.account_number}
              onChangeText={(v) => set('account_number', v)}
              keyboardType="numeric"
              secureTextEntry={false}
              error={errors.account_number}
            />
            <InputField
              label="Confirm Account Number *"
              placeholder="Re-enter account number"
              value={form.confirm_account_number}
              onChangeText={(v) => set('confirm_account_number', v)}
              keyboardType="numeric"
              error={errors.confirm_account_number}
            />
            <InputField
              label="IFSC Code *"
              placeholder="e.g. SBIN0001234"
              value={form.ifsc_code}
              onChangeText={(v) => set('ifsc_code', v.toUpperCase())}
              autoCapitalize="characters"
              maxLength={11}
              error={errors.ifsc_code}
              helperText="11-character IFSC code on your cheque book"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[PP.label, styles.sectionTitle]}>Bank Information</Text>
          <View style={styles.fields}>
            <InputField
              label="Bank Name *"
              placeholder="e.g. State Bank of India"
              value={form.bank_name}
              onChangeText={(v) => set('bank_name', v)}
              error={errors.bank_name}
            />
            <InputField
              label="Branch *"
              placeholder="e.g. Andheri West"
              value={form.branch}
              onChangeText={(v) => set('branch', v)}
              error={errors.branch}
            />

            {/* Account Type */}
            <View>
              <Text style={[PP.caption, styles.fieldLabel]}>Account Type *</Text>
              <View style={styles.typeRow}>
                {(['savings', 'current'] as AccountType[]).map((t) => (
                  <TouchableOpacity
                    key={t}
                    style={[styles.typeOption, form.account_type === t && styles.typeOptionActive]}
                    onPress={() => set('account_type', t)}
                    activeOpacity={0.7}
                  >
                    {form.account_type === t && <CheckCircle size={16} color="#FF6B00" strokeWidth={2} />}
                    <Text style={[PP.label, { color: form.account_type === t ? '#FF6B00' : '#6B7280', fontSize: 13 }]}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>

        <View style={styles.noteCard}>
          <Text style={[PP.captionSM, { color: '#6B7280' }]}>
            🔒 Your bank details are encrypted and used only for payouts. Cravio never charges your account.
          </Text>
        </View>

        <PremiumButton
          label="Save Bank Details"
          onPress={handleSave}
          variant="primary"
          fullWidth
          isLoading={isLoading}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F8F9FB' },
  content: { padding: 20, gap: 16, paddingBottom: 40 },
  verifiedBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#D1FAE5', borderRadius: 12, padding: 12,
    borderWidth: 1, borderColor: '#6EE7B7',
  },
  section: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, gap: 14, borderWidth: 1, borderColor: '#F3F4F6' },
  sectionTitle: { color: '#FF6B00', fontSize: 13, letterSpacing: 0.5 },
  fields: { gap: 12 },
  fieldLabel: { color: '#374151', fontFamily: 'Poppins_500Medium', marginBottom: 6 },
  typeRow: { flexDirection: 'row', gap: 10 },
  typeOption: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, borderWidth: 1.5, borderColor: '#E5E7EB', borderRadius: 12,
    paddingVertical: 12, backgroundColor: '#F9FAFB',
  },
  typeOptionActive: { borderColor: '#FF6B00', backgroundColor: '#FFF7ED' },
  noteCard: { backgroundColor: '#F9FAFB', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#E5E7EB' },
});
