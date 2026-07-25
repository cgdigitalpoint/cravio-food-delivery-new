// ─── Forgot Password Screen ───────────────────────────────────────────────────
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Mail } from 'lucide-react-native';
import { InputField, PremiumButton } from '@/components/ui';
import { PP } from '@/theme/poppins';

interface Props {
  onBack?: () => void;
  onSend?: (email: string) => void;
  isLoading?: boolean;
  error?: string | null;
  success?: boolean;
}

export function PartnerForgotPasswordScreen({
  onBack,
  onSend,
  isLoading = false,
  error = null,
  success = false,
}: Props) {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');

  const paddingTop = Platform.OS === 'web' ? 67 : insets.top;
  const paddingBottom = Platform.OS === 'web' ? 34 : insets.bottom;

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingTop: paddingTop + 16, paddingBottom: paddingBottom + 32 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity onPress={onBack} style={styles.backBtn} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <View style={styles.backCircle}>
            <ArrowLeft size={20} color="#111827" strokeWidth={2} />
          </View>
        </TouchableOpacity>

        <View style={styles.icon}>
          <Text style={{ fontSize: 48 }}>🔐</Text>
        </View>

        <View style={styles.heading}>
          <Text style={[PP.h2, { color: '#111827' }]}>Forgot Password?</Text>
          <Text style={[PP.body, { color: '#6B7280', marginTop: 8 }]}>
            Enter your registered email address and we'll send you a link to reset your password.
          </Text>
        </View>

        {success ? (
          <View style={styles.successBox}>
            <Text style={[PP.label, { color: '#065F46' }]}>✓ Reset link sent!</Text>
            <Text style={[PP.caption, { color: '#065F46', marginTop: 4 }]}>
              Check your inbox and follow the instructions to reset your password.
            </Text>
          </View>
        ) : (
          <>
            <InputField
              label="Email Address"
              placeholder="restaurant@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon={<Mail size={18} color="#9CA3AF" strokeWidth={1.8} />}
            />

            {error ? (
              <View style={styles.errorBox}>
                <Text style={[PP.caption, { color: '#DC2626' }]}>{error}</Text>
              </View>
            ) : null}

            <PremiumButton
              label="Send Reset Link"
              onPress={() => email.trim() && onSend?.(email.trim())}
              variant="primary"
              fullWidth
              isLoading={isLoading}
              disabled={!email.trim() || isLoading}
            />
          </>
        )}

        <TouchableOpacity onPress={onBack} style={styles.backLink}>
          <Text style={[PP.label, { color: '#FF6B00' }]}>← Back to Sign In</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFFFFF' },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 24, gap: 20 },
  backBtn: { alignSelf: 'flex-start' },
  backCircle: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' },
  icon: { alignItems: 'center', marginVertical: 8 },
  heading: { gap: 0 },
  successBox: { backgroundColor: '#D1FAE5', borderRadius: 12, padding: 16, gap: 4 },
  errorBox: { backgroundColor: '#FEF2F2', borderRadius: 10, padding: 12 },
  backLink: { alignItems: 'center' },
});
