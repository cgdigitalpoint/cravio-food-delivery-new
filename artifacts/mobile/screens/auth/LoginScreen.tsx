// ─── Login Screen ─────────────────────────────────────────────────────────────
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
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Mail, Lock, ArrowLeft } from 'lucide-react-native';
import { InputField, PasswordInput, PremiumButton } from '@/components/ui';
import { PP } from '@/theme/poppins';

interface LoginScreenProps {
  onBack?: () => void;
  onForgotPassword?: () => void;
  onSignUp?: () => void;
  onLogin?: (email: string, password: string) => void;
  isLoading?: boolean;
  error?: string | null;
}

export function LoginScreen({
  onBack,
  onForgotPassword,
  onSignUp,
  onLogin,
  isLoading = false,
  error = null,
}: LoginScreenProps) {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const paddingTop = Platform.OS === 'web' ? 67 : insets.top;
  const paddingBottom = Platform.OS === 'web' ? 34 : insets.bottom;

  const handleLogin = () => {
    if (email.trim() && password) onLogin?.(email.trim(), password);
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingTop: paddingTop + 8, paddingBottom: paddingBottom + 24 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {onBack != null && (
          <TouchableOpacity onPress={onBack} style={styles.backBtn} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
            <View style={styles.backCircle}>
              <ArrowLeft size={20} color="#111827" strokeWidth={2} />
            </View>
          </TouchableOpacity>
        )}

        <View style={styles.heading}>
          <Text style={[PP.h1, { color: '#111827' }]}>Welcome</Text>
          <Text style={[PP.h1, { color: '#FF6B00' }]}>Back 👋</Text>
          <Text style={[PP.body, styles.subText]}>Sign in to continue ordering</Text>
        </View>

        <View style={styles.socialRow}>
          <TouchableOpacity style={styles.socialBtn} activeOpacity={0.8}>
            <Ionicons name="logo-google" size={20} color="#EA4335" />
            <Text style={[PP.label, { color: '#111827' }]}>Google</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialBtn} activeOpacity={0.8}>
            <Ionicons name="logo-apple" size={20} color="#111827" />
            <Text style={[PP.label, { color: '#111827' }]}>Apple</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={[PP.caption, styles.dividerText]}>or continue with email</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.form}>
          <InputField
            label="Email Address"
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon={<Mail size={18} color="#9CA3AF" strokeWidth={1.8} />}
          />
          <PasswordInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
          />
          <TouchableOpacity onPress={onForgotPassword} style={styles.forgotRow}>
            <Text style={[PP.label, styles.forgotText]}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        {error ? (
          <View style={styles.errorBox}>
            <Text style={[PP.caption, { color: '#DC2626' }]}>{error}</Text>
          </View>
        ) : null}

        <PremiumButton
          label="Log In"
          onPress={handleLogin}
          variant="primary"
          fullWidth
          isLoading={isLoading}
          disabled={!email.trim() || !password || isLoading}
        />

        <View style={styles.switchRow}>
          <Text style={[PP.body, { color: '#6B7280' }]}>Don't have an account? </Text>
          <TouchableOpacity onPress={onSignUp}>
            <Text style={[PP.label, { color: '#FF6B00' }]}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFFFFF' },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 24, gap: 20 },
  backBtn: { alignSelf: 'flex-start' },
  backCircle: {
    width: 42, height: 42, borderRadius: 13,
    backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center',
  },
  heading: { gap: 2, marginTop: 8 },
  subText: { color: '#6B7280', marginTop: 8 },
  socialRow: { flexDirection: 'row', gap: 12 },
  socialBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, height: 50, borderRadius: 14, borderWidth: 1.5, borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#E5E7EB' },
  dividerText: { color: '#9CA3AF' },
  form: { gap: 14 },
  forgotRow: { alignSelf: 'flex-end' },
  forgotText: { color: '#FF6B00' },
  errorBox: { backgroundColor: '#FEF2F2', borderRadius: 10, padding: 12 },
  switchRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
});
