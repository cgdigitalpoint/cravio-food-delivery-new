// ─── Partner Signup Screen ────────────────────────────────────────────────────
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
import { Mail, Phone, User } from 'lucide-react-native';
import { InputField, PasswordInput, PremiumButton } from '@/components/ui';
import { PP } from '@/theme/poppins';

interface Props {
  onBack?: () => void;
  onLogin?: () => void;
  onRegister?: (email: string, password: string, name: string, phone: string) => void;
  isLoading?: boolean;
  error?: string | null;
}

export function PartnerSignupScreen({ onBack, onLogin, onRegister, isLoading = false, error = null }: Props) {
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwError, setPwError] = useState<string | null>(null);
  const [agreed, setAgreed] = useState(false);

  const paddingTop = Platform.OS === 'web' ? 67 : insets.top;
  const paddingBottom = Platform.OS === 'web' ? 34 : insets.bottom;

  const canSubmit =
    name.trim().length > 0 &&
    email.trim().length > 0 &&
    phone.trim().length > 0 &&
    password.length >= 6 &&
    agreed;

  const handleRegister = () => {
    if (password !== confirmPassword) {
      setPwError('Passwords do not match.');
      return;
    }
    setPwError(null);
    onRegister?.(email.trim(), password, name.trim(), phone.trim());
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingTop: paddingTop + 24, paddingBottom: paddingBottom + 32 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Brand */}
        <View style={styles.brand}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>🍽</Text>
          </View>
          <Text style={[PP.captionSM, { color: '#FF6B00', letterSpacing: 2 }]}>CRAVIO PARTNER</Text>
        </View>

        <View style={styles.heading}>
          <Text style={[PP.h2, { color: '#111827' }]}>Register Your</Text>
          <Text style={[PP.h2, { color: '#FF6B00' }]}>Restaurant 🏪</Text>
          <Text style={[PP.body, { color: '#6B7280', marginTop: 6 }]}>
            Join thousands of partner restaurants on Cravio
          </Text>
        </View>

        <View style={styles.form}>
          <InputField
            label="Full Name"
            placeholder="Your name"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            leftIcon={<User size={18} color="#9CA3AF" strokeWidth={1.8} />}
          />
          <InputField
            label="Email Address"
            placeholder="restaurant@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon={<Mail size={18} color="#9CA3AF" strokeWidth={1.8} />}
          />
          <InputField
            label="Phone Number"
            placeholder="+91 98765 43210"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            leftIcon={<Phone size={18} color="#9CA3AF" strokeWidth={1.8} />}
          />
          <PasswordInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Min. 6 characters"
          />
          <PasswordInput
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Re-enter password"
            error={pwError ?? undefined}
          />
        </View>

        {/* Terms */}
        <TouchableOpacity style={styles.termsRow} onPress={() => setAgreed((v) => !v)} activeOpacity={0.7}>
          <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
            {agreed ? <Text style={styles.checkmark}>✓</Text> : null}
          </View>
          <Text style={[PP.caption, { color: '#374151', flex: 1 }]}>
            I agree to Cravio's{' '}
            <Text style={{ color: '#FF6B00' }}>Partner Terms</Text> and{' '}
            <Text style={{ color: '#FF6B00' }}>Privacy Policy</Text>
          </Text>
        </TouchableOpacity>

        {error ? (
          <View style={styles.errorBox}>
            <Text style={[PP.caption, { color: '#DC2626' }]}>{error}</Text>
          </View>
        ) : null}

        <PremiumButton
          label="Create Partner Account"
          onPress={handleRegister}
          variant="primary"
          fullWidth
          isLoading={isLoading}
          disabled={!canSubmit || isLoading}
        />

        <View style={styles.switchRow}>
          <Text style={[PP.body, { color: '#6B7280' }]}>Already registered? </Text>
          <TouchableOpacity onPress={onLogin}>
            <Text style={[PP.label, { color: '#FF6B00' }]}>Sign In</Text>
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
  brand: { alignItems: 'center', gap: 10 },
  logoCircle: { width: 64, height: 64, borderRadius: 18, backgroundColor: '#FFF7ED', alignItems: 'center', justifyContent: 'center' },
  logoText: { fontSize: 28 },
  heading: { gap: 2 },
  form: { gap: 12 },
  termsRow: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  checkbox: {
    width: 20, height: 20, borderRadius: 6, borderWidth: 1.5, borderColor: '#D1D5DB',
    alignItems: 'center', justifyContent: 'center', marginTop: 1,
  },
  checkboxChecked: { backgroundColor: '#FF6B00', borderColor: '#FF6B00' },
  checkmark: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  errorBox: { backgroundColor: '#FEF2F2', borderRadius: 10, padding: 12 },
  switchRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
});
