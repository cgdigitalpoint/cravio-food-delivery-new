// ─── Partner Login Screen ─────────────────────────────────────────────────────
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
import { Mail } from 'lucide-react-native';
import { InputField, PasswordInput, PremiumButton } from '@/components/ui';
import { PP } from '@/theme/poppins';

interface Props {
  onForgotPassword?: () => void;
  onSignUp?: () => void;
  onLogin?: (email: string, password: string) => void;
  isLoading?: boolean;
  error?: string | null;
}

export function PartnerLoginScreen({
  onForgotPassword,
  onSignUp,
  onLogin,
  isLoading = false,
  error = null,
}: Props) {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const paddingTop = Platform.OS === 'web' ? 67 : insets.top;
  const paddingBottom = Platform.OS === 'web' ? 34 : insets.bottom;
  const canSubmit = email.trim().length > 0 && password.length > 0;

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingTop: paddingTop + 32, paddingBottom: paddingBottom + 32 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Brand */}
        <View style={styles.brand}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>🍽</Text>
          </View>
          <Text style={[PP.captionSM, { color: '#FF6B00', letterSpacing: 2 }]}>
            CRAVIO PARTNER
          </Text>
        </View>

        {/* Heading */}
        <View style={styles.heading}>
          <Text style={[PP.h1, { color: '#111827' }]}>Welcome</Text>
          <Text style={[PP.h1, { color: '#FF6B00' }]}>Back 👋</Text>
          <Text style={[PP.body, styles.sub]}>Sign in to manage your restaurant</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <InputField
            label="Email Address"
            placeholder="restaurant@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            leftIcon={<Mail size={18} color="#9CA3AF" strokeWidth={1.8} />}
          />
          <PasswordInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
          />
          <TouchableOpacity onPress={onForgotPassword} style={styles.forgotRow}>
            <Text style={[PP.label, { color: '#FF6B00' }]}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        {error ? (
          <View style={styles.errorBox}>
            <Text style={[PP.caption, { color: '#DC2626' }]}>{error}</Text>
          </View>
        ) : null}

        <PremiumButton
          label="Sign In"
          onPress={() => canSubmit && onLogin?.(email.trim(), password)}
          variant="primary"
          fullWidth
          isLoading={isLoading}
          disabled={!canSubmit || isLoading}
        />

        <View style={styles.switchRow}>
          <Text style={[PP.body, { color: '#6B7280' }]}>New partner? </Text>
          <TouchableOpacity onPress={onSignUp}>
            <Text style={[PP.label, { color: '#FF6B00' }]}>Register your restaurant</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFFFFF' },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 24, gap: 24 },
  brand: { alignItems: 'center', gap: 10 },
  logoCircle: {
    width: 72, height: 72, borderRadius: 20,
    backgroundColor: '#FFF7ED',
    alignItems: 'center', justifyContent: 'center',
  },
  logoText: { fontSize: 32 },
  heading: { gap: 2 },
  sub: { color: '#6B7280', marginTop: 6 },
  form: { gap: 14 },
  forgotRow: { alignSelf: 'flex-end' },
  errorBox: { backgroundColor: '#FEF2F2', borderRadius: 10, padding: 12 },
  switchRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' },
});
