// ─── GST Details Screen ───────────────────────────────────────────────────────
import React, { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ShieldCheck } from 'lucide-react-native';
import { TopAppBar, InputField, PremiumButton } from '@/components/ui';
import { PP } from '@/theme/poppins';
import { useRestaurantStore } from '@/store/useRestaurantStore';

interface Props {
  onBack: () => void;
}

const GST_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

export function GSTDetailsScreen({ onBack }: Props) {
  const { restaurant, gstDetails, isLoading, loadGSTDetails, saveGSTDetails } = useRestaurantStore();

  const [gstNumber, setGstNumber] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [gstError, setGstError] = useState<string | null>(null);

  useEffect(() => {
    if (restaurant) void loadGSTDetails();
  }, [restaurant?.id]);

  useEffect(() => {
    if (gstDetails) {
      setGstNumber(gstDetails.gst_number);
      setBusinessName(gstDetails.business_name);
      setBusinessAddress(gstDetails.business_address);
    }
  }, [gstDetails]);

  const handleGSTChange = (v: string) => {
    const upper = v.toUpperCase().replace(/[^A-Z0-9]/g, '');
    setGstNumber(upper);
    if (upper.length === 15) {
      setGstError(GST_REGEX.test(upper) ? null : 'Invalid GST number format');
    } else {
      setGstError(null);
    }
  };

  const handleSave = async () => {
    if (!restaurant) {
      Alert.alert('No Restaurant', 'Please complete your restaurant profile first.');
      return;
    }
    if (!gstNumber.trim() || !businessName.trim() || !businessAddress.trim()) {
      Alert.alert('Missing Info', 'All fields are required.');
      return;
    }
    if (!GST_REGEX.test(gstNumber)) {
      setGstError('Invalid GST number format. Example: 22AAAAA0000A1Z5');
      return;
    }
    try {
      await saveGSTDetails({ gst_number: gstNumber, business_name: businessName.trim(), business_address: businessAddress.trim() });
      Alert.alert('Saved', 'GST details saved successfully.', [{ text: 'OK', onPress: onBack }]);
    } catch {
      Alert.alert('Error', 'Failed to save GST details. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TopAppBar title="GST Details" subtitle="Tax registration information" onBack={onBack} />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

        {gstDetails?.is_verified && (
          <View style={styles.verifiedBanner}>
            <ShieldCheck size={18} color="#10B981" strokeWidth={2} />
            <Text style={[PP.label, { color: '#065F46', fontSize: 13 }]}>GST details verified</Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={[PP.label, styles.sectionTitle]}>GST Information</Text>
          <View style={styles.fields}>
            <InputField
              label="GST Number *"
              placeholder="22AAAAA0000A1Z5"
              value={gstNumber}
              onChangeText={handleGSTChange}
              autoCapitalize="characters"
              maxLength={15}
              error={gstError ?? undefined}
              helperText="15-character GSTIN as on your GST certificate"
            />
            <InputField
              label="Business Name *"
              placeholder="As registered with GST"
              value={businessName}
              onChangeText={setBusinessName}
              autoCapitalize="words"
            />
            <InputField
              label="Registered Business Address *"
              placeholder="Full address as per GST registration"
              value={businessAddress}
              onChangeText={setBusinessAddress}
              multiline
              numberOfLines={3}
              style={styles.multiline}
            />
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={[PP.label, { color: '#1E40AF', fontSize: 13 }]}>📋 Why do we need this?</Text>
          <Text style={[PP.caption, { color: '#3730A3', marginTop: 6, lineHeight: 20 }]}>
            GST details are required for tax compliance and to generate proper invoices for your customers. Ensure the information matches your GST certificate exactly.
          </Text>
        </View>

        <View style={styles.noteCard}>
          <Text style={[PP.captionSM, { color: '#6B7280' }]}>
            🔒 Your GST information is used only for tax compliance purposes. It will be verified by our team before going live.
          </Text>
        </View>

        <PremiumButton
          label="Save GST Details"
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
  multiline: { minHeight: 80, textAlignVertical: 'top', paddingTop: 12 },
  infoCard: { backgroundColor: '#EFF6FF', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: '#BFDBFE' },
  noteCard: { backgroundColor: '#F9FAFB', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#E5E7EB' },
});
