// ─── Change Password Screen ───────────────────────────────────────────────────
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
import { ArrowLeft, Lock } from 'lucide-react-native';
import { useColors } from '@/hooks/useColors';
import { PP } from '@/theme/poppins';
import { PasswordInput, PremiumButton } from '@/components/ui';
import { authService } from '@/services/authService';

interface ChangePasswordScreenProps {
  onBack?: () => void;
  onSuccess?: () => void;
}

export function ChangePasswordScreen({ onBack, onSuccess }: ChangePasswordScreenProps) {
  const insets = useSafeAreaInsets();
  const colors = useColors();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const paddingTop = Platform.OS === 'web' ? 60 : insets.top;
  const paddingBottom = Platform.OS === 'web' ? 34 : insets.bottom;

  const validate = (): string | null => {
    if (newPassword.length < 8) return 'Password must be at least 8 characters.';
    if (!/[A-Za-z]/.test(newPassword)) return 'Password must include at least one letter.';
    if (!/[0-9]/.test(newPassword)) return 'Password must include at least one number.';
    if (newPassword !== confirmPassword) return 'Passwords do not match.';
    return null;
  };

  const isReady = newPassword.length >= 8 && confirmPassword.length >= 1;

  const handleSave = async () => {
    const validationError = validate();
    if (validationError) { setError(validationError); return; }
    setError(null);
    setIsLoading(true);
    try {
      await authService.resetPassword(newPassword);
      Alert.alert(
        'Password Updated',
        'Your password has been changed successfully.',
        [{ text: 'OK', onPress: onSuccess }],
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update password. Please try again.');
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
          { paddingTop: paddingTop + 8, backgroundColor: colors.card, borderBottomColor: colors.border },
        ]}
      >
        <TouchableOpacity onPress={onBack} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <View style={[styles.backBtn, { backgroundColor: colors.muted }]}>
            <ArrowLeft size={20} color={colors.foreground} strokeWidth={2} />
          </View>
        </TouchableOpacity>
        <Text style={[PP.h3, { color: colors.foreground }]}>Change Password</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: paddingBottom + 24 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Icon */}
        <View style={styles.iconWrap}>
          <View style={[styles.iconCircle, { backgroundColor: '#FFF7ED' }]}>
            <Lock size={32} color={colors.primary} strokeWidth={1.5} />
          </View>
          <Text style={[PP.bodySM, { color: colors.mutedForeground, marginTop: 12, textAlign: 'center' }]}>
            Choose a strong password with at least 8 characters, one letter and one number.
          </Text>
        </View>

        {/* Inputs */}
        <PasswordInput
          label="New Password"
          placeholder="Minimum 8 characters"
          value={newPassword}
          onChangeText={(t) => { setNewPassword(t); setError(null); }}
        />
        <PasswordInput
          label="Confirm New Password"
          placeholder="Repeat your new password"
          value={confirmPassword}
          onChangeText={(t) => { setConfirmPassword(t); setError(null); }}
        />

        {/* Strength hint */}
        {newPassword.length > 0 && (
          <View style={styles.strengthRow}>
            {(['8+ chars', 'A–Z/a–z', '0–9'] as const).map((hint, i) => {
              const met = i === 0 ? newPassword.length >= 8
                : i === 1 ? /[A-Za-z]/.test(newPassword)
                : /[0-9]/.test(newPassword);
              return (
                <View
                  key={hint}
                  style={[
                    styles.strengthChip,
                    { backgroundColor: met ? '#F0FDF4' : colors.muted },
                  ]}
                >
                  <Text style={[PP.caption, { color: met ? '#16A34A' : colors.mutedForeground }]}>
                    {hint}
                  </Text>
                </View>
              );
            })}
          </View>
        )}

        {error ? (
          <View style={[styles.errorBox, { backgroundColor: '#FEF2F2' }]}>
            <Text style={[PP.caption, { color: '#DC2626' }]}>{error}</Text>
          </View>
        ) : null}

        <PremiumButton
          label="Update Password"
          onPress={handleSave}
          variant="primary"
          fullWidth
          disabled={!isReady || isLoading}
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
  content: { padding: 20, gap: 16 },
  iconWrap: { alignItems: 'center', paddingVertical: 12 },
  iconCircle: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center' },
  strengthRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  strengthChip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  errorBox: { borderRadius: 10, padding: 12 },
});
