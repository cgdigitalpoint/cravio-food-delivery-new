// ─── Edit Profile Screen ──────────────────────────────────────────────────────
import React, { useState } from 'react';
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Mail, Phone, User } from 'lucide-react-native';
import { useColors } from '@/hooks/useColors';
import { PP } from '@/theme/poppins';
import { useAuthStore } from '@/store/useAuthStore';
import { userService } from '@/services/userService';
import { InputField, PremiumButton, Avatar } from '@/components/ui';

interface EditProfileScreenProps {
  onBack?: () => void;
  onSaved?: () => void;
}

export function EditProfileScreen({ onBack, onSaved }: EditProfileScreenProps) {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { user, supabaseUserId, updateLocalUser } = useAuthStore();

  const [name, setName] = useState(user?.name ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const paddingTop = Platform.OS === 'web' ? 60 : insets.top;
  const paddingBottom = Platform.OS === 'web' ? 34 : insets.bottom;

  const isValid = name.trim().length >= 2;
  const hasChanges =
    name.trim() !== (user?.name ?? '') ||
    phone.trim() !== (user?.phone ?? '');

  const handleSave = async () => {
    if (!supabaseUserId || !isValid || !hasChanges) return;
    setError(null);
    setIsLoading(true);
    try {
      const updated = await userService.updateProfile(supabaseUserId, {
        name: name.trim(),
        phone: phone.trim() || null,
      });
      updateLocalUser(updated);
      Alert.alert('Profile Updated', 'Your profile has been saved successfully.', [
        { text: 'OK', onPress: onSaved },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update profile.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.screen, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: paddingTop + 8,
            backgroundColor: colors.card,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <TouchableOpacity onPress={onBack} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <View style={[styles.backBtn, { backgroundColor: colors.muted }]}>
            <ArrowLeft size={20} color={colors.foreground} strokeWidth={2} />
          </View>
        </TouchableOpacity>
        <Text style={[PP.h3, { color: colors.foreground }]}>Edit Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: paddingBottom + 24 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar */}
        <View style={styles.avatarWrap}>
          <Avatar name={name || user?.name || 'U'} size="xl" />
        </View>

        {/* Email (read-only) */}
        <View style={[styles.readonlyField, { backgroundColor: colors.muted, borderColor: colors.border }]}>
          <Mail size={18} color={colors.mutedForeground} strokeWidth={1.8} />
          <View style={styles.readonlyText}>
            <Text style={[PP.caption, { color: colors.mutedForeground }]}>Email Address</Text>
            <Text style={[PP.label, { color: colors.foreground }]}>{user?.email ?? '—'}</Text>
          </View>
          <View style={[styles.readonlyBadge, { backgroundColor: colors.card }]}>
            <Text style={[PP.caption, { color: colors.mutedForeground, fontSize: 10 }]}>
              Cannot change
            </Text>
          </View>
        </View>

        {/* Editable fields */}
        <InputField
          label="Full Name"
          placeholder="Your full name"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          leftIcon={<User size={18} color="#9CA3AF" strokeWidth={1.8} />}
        />
        <InputField
          label="Phone Number (optional)"
          placeholder="+1 (555) 000-0000"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          leftIcon={<Phone size={18} color="#9CA3AF" strokeWidth={1.8} />}
        />

        {error ? (
          <View style={styles.errorBox}>
            <Text style={[PP.caption, { color: '#DC2626' }]}>{error}</Text>
          </View>
        ) : null}

        <PremiumButton
          label="Save Changes"
          onPress={handleSave}
          variant="primary"
          fullWidth
          disabled={!isValid || !hasChanges || isLoading}
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
  content: { padding: 20, gap: 16 },
  avatarWrap: { alignItems: 'center', paddingVertical: 8 },
  readonlyField: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  readonlyText: { flex: 1, gap: 2 },
  readonlyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  errorBox: {
    backgroundColor: '#FEF2F2',
    borderRadius: 10,
    padding: 12,
  },
});
