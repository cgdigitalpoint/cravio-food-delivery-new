// ─── Forgot Password Screen ───────────────────────────────────────────────────
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
import { ArrowLeft, Mail } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { InputField, PremiumButton } from '@/components/ui';
import { PP } from '@/theme/poppins';

interface ForgotPasswordScreenProps {
  onBack?: () => void;
  onSendLink?: (email: string) => void;
  isLoading?: boolean;
  error?: string | null;
  success?: boolean;
}

export function ForgotPasswordScreen({
  onBack,
  onSendLink,
  isLoading = false,
  error = null,
  success = false,
}: ForgotPasswordScreenProps) {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');

  const paddingTop = Platform.OS === 'web' ? 67 : insets.top;
  const paddingBottom = Platform.OS === 'web' ? 34 : insets.bottom;

  const isValid = email.trim().length >= 5 && email.includes('@');

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={[styles.content, { paddingTop: paddingTop + 8, paddingBottom: paddingBottom + 24 }]}>
        {onBack != null && (
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <View style={styles.backCircle}>
              <ArrowLeft size={20} color="#111827" strokeWidth={2} />
            </View>
          </TouchableOpacity>
        )}

        <View style={styles.iconWrap}>
          <LinearGradient
            colors={['#6366F1', '#4338CA', '#3730A3']}
            style={styles.iconGrad}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.iconEmoji}>🔐</Text>
          </LinearGradient>
        </View>

        <View style={styles.heading}>
          <Text style={[PP.h1, { color: '#111827' }]}>Forgot</Text>
          <Text style={[PP.h1, { color: '#FF6B00' }]}>Password?</Text>
          <Text style={[PP.body, styles.subText]}>
            No worries! Enter your email and we'll send a secure reset link.
          </Text>
        </View>

        {success ? (
          <View style={[styles.infoBox, { backgroundColor: '#F0FDF4', borderColor: '#16A34A' }]}>
            <Text style={[PP.bodySM, { color: '#16A34A', lineHeight: 20 }]}>
              ✅ Reset link sent! Check your inbox (and spam folder).
            </Text>
          </View>
        ) : (
          <View style={styles.infoBox}>
            <Text style={[PP.bodySM, { color: '#4338CA', lineHeight: 20 }]}>
              💡 Check your spam folder if you don't receive the email within 2 minutes.
            </Text>
          </View>
        )}

        {!success && (
          <InputField
            label="Email Address"
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon={<Mail size={18} color="#9CA3AF" strokeWidth={1.8} />}
          />
        )}

        {error ? (
          <View style={[styles.infoBox, { backgroundColor: '#FEF2F2', borderColor: '#EF4444' }]}>
            <Text style={[PP.caption, { color: '#DC2626' }]}>{error}</Text>
          </View>
        ) : null}

        <View style={styles.ctaArea}>
          {!success && (
            <PremiumButton
              label="Send Reset Link"
              onPress={() => onSendLink?.(email.trim())}
              variant="primary"
              fullWidth
              disabled={!isValid || isLoading}
              isLoading={isLoading}
            />
          )}
          <TouchableOpacity onPress={onBack} style={styles.backLink}>
            <Text style={[PP.label, { color: '#6B7280' }]}>← Back to Log In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { flex: 1, paddingHorizontal: 24, gap: 20 },
  backBtn: { alignSelf: 'flex-start' },
  backCircle: {
    width: 42, height: 42, borderRadius: 13,
    backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center',
  },
  iconWrap: { alignSelf: 'flex-start' },
  iconGrad: { width: 72, height: 72, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  iconEmoji: { fontSize: 34 },
  heading: { gap: 8 },
  subText: { color: '#6B7280', lineHeight: 22 },
  infoBox: {
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  ctaArea: { gap: 16 },
  backLink: { alignItems: 'center', paddingVertical: 4 },
});
