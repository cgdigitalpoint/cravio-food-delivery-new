// ─── Reset Password Screen ────────────────────────────────────────────────────
// Reached via the cravio://auth/callback deep link when type=recovery.
// The session is already established by the time this renders; the user just
// needs to supply a new password.
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { PasswordInput, PremiumButton } from '@/components/ui';
import { PP } from '@/theme/poppins';

interface ResetPasswordScreenProps {
  onReset?: (newPassword: string) => void;
  onBack?: () => void;
  isLoading?: boolean;
  error?: string | null;
}

export function ResetPasswordScreen({
  onReset,
  onBack,
  isLoading = false,
  error = null,
}: ResetPasswordScreenProps) {
  const insets = useSafeAreaInsets();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const paddingTop = Platform.OS === 'web' ? 67 : insets.top;
  const paddingBottom = Platform.OS === 'web' ? 34 : insets.bottom;

  const mismatch = confirm.length > 0 && password !== confirm;
  const isValid = password.length >= 8 && password === confirm;

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View
        style={[
          styles.content,
          { paddingTop: paddingTop + 8, paddingBottom: paddingBottom + 24 },
        ]}
      >
        <View style={styles.iconWrap}>
          <LinearGradient
            colors={['#10B981', '#059669', '#047857']}
            style={styles.iconGrad}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.iconEmoji}>🔑</Text>
          </LinearGradient>
        </View>

        <View style={styles.heading}>
          <Text style={[PP.h1, { color: '#111827' }]}>New</Text>
          <Text style={[PP.h1, { color: '#FF6B00' }]}>Password</Text>
          <Text style={[PP.body, styles.subText]}>
            Choose a strong password — at least 8 characters.
          </Text>
        </View>

        <View style={styles.form}>
          <PasswordInput
            label="New Password"
            value={password}
            onChangeText={setPassword}
            placeholder="At least 8 characters"
          />
          <PasswordInput
            label="Confirm Password"
            value={confirm}
            onChangeText={setConfirm}
            placeholder="Repeat your new password"
          />
        </View>

        {mismatch && (
          <View style={[styles.infoBox, { backgroundColor: '#FEF2F2', borderColor: '#EF4444' }]}>
            <Text style={[PP.caption, { color: '#DC2626' }]}>Passwords do not match.</Text>
          </View>
        )}

        {error != null && error.length > 0 && (
          <View style={[styles.infoBox, { backgroundColor: '#FEF2F2', borderColor: '#EF4444' }]}>
            <Text style={[PP.caption, { color: '#DC2626' }]}>{error}</Text>
          </View>
        )}

        <View style={styles.cta}>
          <PremiumButton
            label="Set New Password"
            onPress={() => isValid && onReset?.(password)}
            variant="primary"
            fullWidth
            disabled={!isValid || isLoading}
            isLoading={isLoading}
          />
          {onBack != null && (
            <TouchableOpacity onPress={onBack} style={styles.backLink}>
              <Text style={[PP.label, { color: '#6B7280' }]}>← Back to Log In</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { flex: 1, paddingHorizontal: 24, gap: 20 },
  iconWrap: { alignSelf: 'flex-start' },
  iconGrad: {
    width: 72,
    height: 72,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconEmoji: { fontSize: 34 },
  heading: { gap: 8 },
  subText: { color: '#6B7280', lineHeight: 22 },
  form: { gap: 12 },
  infoBox: {
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  cta: { gap: 16 },
  backLink: { alignItems: 'center', paddingVertical: 4 },
});
