// ─── Restaurant Profile Screen ────────────────────────────────────────────────
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
import { TopAppBar, InputField, PremiumButton } from '@/components/ui';
import { PP } from '@/theme/poppins';
import { useRestaurantStore } from '@/store/useRestaurantStore';
import { usePartnerAuthStore } from '@/store/usePartnerAuthStore';
import type { PartnerRestaurant } from '@/types/restaurant.types';

const CUISINE_TYPES = [
  'Indian', 'Chinese', 'Italian', 'Mexican', 'Thai', 'Japanese',
  'American', 'Mediterranean', 'Fast Food', 'Cafe', 'Desserts', 'Biryani', 'Other',
];

interface Props {
  onBack: () => void;
}

type FormData = Partial<Omit<PartnerRestaurant, 'id' | 'partner_id' | 'created_at' | 'updated_at' | 'is_open'>>;

export function RestaurantProfileScreen({ onBack }: Props) {
  const partner = usePartnerAuthStore((s) => s.partner);
  const { restaurant, isLoading, saveRestaurant } = useRestaurantStore();

  const [form, setForm] = useState<FormData>({
    name: '',
    description: '',
    cuisine_type: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
    email: '',
    min_order: 100,
    avg_delivery_time: 30,
    delivery_fee: 0,
  });

  const [showCuisineList, setShowCuisineList] = useState(false);

  useEffect(() => {
    if (restaurant) {
      setForm({
        name: restaurant.name,
        description: restaurant.description ?? '',
        cuisine_type: restaurant.cuisine_type,
        address: restaurant.address,
        city: restaurant.city,
        state: restaurant.state,
        pincode: restaurant.pincode,
        phone: restaurant.phone,
        email: restaurant.email,
        min_order: restaurant.min_order,
        avg_delivery_time: restaurant.avg_delivery_time,
        delivery_fee: restaurant.delivery_fee,
      });
    }
  }, [restaurant]);

  const set = (key: keyof FormData, value: string | number) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSave = async () => {
    if (!form.name?.trim()) {
      Alert.alert('Missing Info', 'Restaurant name is required.');
      return;
    }
    if (!partner?.id) return;
    try {
      await saveRestaurant(partner.id, form);
      Alert.alert('Saved', 'Restaurant profile updated successfully.', [{ text: 'OK', onPress: onBack }]);
    } catch {
      Alert.alert('Error', 'Failed to save. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TopAppBar title="Restaurant Profile" subtitle="Basic information" onBack={onBack} />
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Basic Info */}
        <View style={styles.section}>
          <Text style={[PP.label, styles.sectionTitle]}>Basic Information</Text>
          <View style={styles.fields}>
            <InputField
              label="Restaurant Name *"
              placeholder="e.g. Spice Garden"
              value={form.name ?? ''}
              onChangeText={(v) => set('name', v)}
            />
            <InputField
              label="Description"
              placeholder="Brief description of your restaurant"
              value={form.description ?? ''}
              onChangeText={(v) => set('description', v)}
              multiline
              numberOfLines={3}
              style={styles.multiline}
            />

            {/* Cuisine Type */}
            <View>
              <Text style={[PP.caption, styles.fieldLabel]}>Cuisine Type</Text>
              <TouchableOpacity
                style={styles.selector}
                onPress={() => setShowCuisineList((v) => !v)}
                activeOpacity={0.7}
              >
                <Text style={[PP.body, { color: form.cuisine_type ? '#111827' : '#9CA3AF' }]}>
                  {form.cuisine_type || 'Select cuisine type'}
                </Text>
                <Text style={{ color: '#6B7280' }}>{showCuisineList ? '▲' : '▼'}</Text>
              </TouchableOpacity>
              {showCuisineList && (
                <View style={styles.cuisineList}>
                  {CUISINE_TYPES.map((c) => (
                    <TouchableOpacity
                      key={c}
                      style={[styles.cuisineItem, form.cuisine_type === c && styles.cuisineItemActive]}
                      onPress={() => { set('cuisine_type', c); setShowCuisineList(false); }}
                    >
                      <Text style={[PP.body, { color: form.cuisine_type === c ? '#FF6B00' : '#374151' }]}>{c}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Address */}
        <View style={styles.section}>
          <Text style={[PP.label, styles.sectionTitle]}>Address</Text>
          <View style={styles.fields}>
            <InputField
              label="Street Address"
              placeholder="Shop no., building, street"
              value={form.address ?? ''}
              onChangeText={(v) => set('address', v)}
            />
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <InputField
                  label="City"
                  placeholder="City"
                  value={form.city ?? ''}
                  onChangeText={(v) => set('city', v)}
                />
              </View>
              <View style={{ flex: 1 }}>
                <InputField
                  label="State"
                  placeholder="State"
                  value={form.state ?? ''}
                  onChangeText={(v) => set('state', v)}
                />
              </View>
            </View>
            <InputField
              label="Pincode"
              placeholder="6-digit pincode"
              value={form.pincode ?? ''}
              onChangeText={(v) => set('pincode', v)}
              keyboardType="numeric"
              maxLength={6}
            />
          </View>
        </View>

        {/* Contact */}
        <View style={styles.section}>
          <Text style={[PP.label, styles.sectionTitle]}>Contact</Text>
          <View style={styles.fields}>
            <InputField
              label="Phone Number"
              placeholder="+91 98765 43210"
              value={form.phone ?? ''}
              onChangeText={(v) => set('phone', v)}
              keyboardType="phone-pad"
            />
            <InputField
              label="Email Address"
              placeholder="restaurant@example.com"
              value={form.email ?? ''}
              onChangeText={(v) => set('email', v)}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>

        {/* Delivery Settings */}
        <View style={styles.section}>
          <Text style={[PP.label, styles.sectionTitle]}>Delivery Settings</Text>
          <View style={styles.fields}>
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <InputField
                  label="Min Order (₹)"
                  placeholder="100"
                  value={String(form.min_order ?? '')}
                  onChangeText={(v) => set('min_order', Number(v) || 0)}
                  keyboardType="numeric"
                />
              </View>
              <View style={{ flex: 1 }}>
                <InputField
                  label="Delivery Fee (₹)"
                  placeholder="0"
                  value={String(form.delivery_fee ?? '')}
                  onChangeText={(v) => set('delivery_fee', Number(v) || 0)}
                  keyboardType="numeric"
                />
              </View>
            </View>
            <InputField
              label="Avg. Delivery Time (mins)"
              placeholder="30"
              value={String(form.avg_delivery_time ?? '')}
              onChangeText={(v) => set('avg_delivery_time', Number(v) || 30)}
              keyboardType="numeric"
            />
          </View>
        </View>

        <PremiumButton
          label={restaurant ? 'Save Changes' : 'Create Restaurant Profile'}
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
  content: { padding: 20, gap: 20, paddingBottom: 40 },
  section: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, gap: 14, borderWidth: 1, borderColor: '#F3F4F6' },
  sectionTitle: { color: '#FF6B00', fontSize: 13, letterSpacing: 0.5 },
  fields: { gap: 12 },
  fieldLabel: { color: '#374151', fontFamily: 'Poppins_500Medium', marginBottom: 4 },
  row: { flexDirection: 'row', gap: 10 },
  multiline: { minHeight: 80, textAlignVertical: 'top', paddingTop: 12 },
  selector: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#F9FAFB', borderWidth: 1.5, borderColor: '#E5E7EB',
    borderRadius: 12, paddingHorizontal: 14, height: 52,
  },
  cuisineList: {
    marginTop: 4, backgroundColor: '#FFFFFF', borderRadius: 12,
    borderWidth: 1, borderColor: '#E5E7EB', overflow: 'hidden',
  },
  cuisineItem: { paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  cuisineItemActive: { backgroundColor: '#FFF7ED' },
});
