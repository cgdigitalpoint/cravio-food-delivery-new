// ─── Signup Screen ────────────────────────────────────────────────────────────
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
import { ArrowLeft, Mail, User, Phone } from 'lucide-react-native';
import { Ionicons } from '@expo/vector-icons';
import { InputField, PasswordInput, PremiumButton } from '@/components/ui';
import { PP } from '@/theme/poppins';

interface SignupScreenProps {
  onBack?: () => void;
  onLogin?: () => void;
  onSignUp?: (name: string, email: string, phone: string, password: string) => void;
  isLoading?: boolean;
  error?: string | null;
}

export function SignupScreen({ onBack, onLogin, onSignUp, isLoading = false, error = null }: SignupScreenProps) {
  const insets = useSafeAreaInsets();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(false);

  const paddingTop = Platform.OS === 'web' ? 67 : insets.top;
  const paddingBottom = Platform.OS === 'web' ? 34 : insets.bottom;

  const isValid = name.trim() && email.trim() && password.length >= 8 && agreed;

  const handleSignUp = () => {
    if (isValid) onSignUp?.(name.trim(), email.trim(), phone.trim(), password);
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
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <View style={styles.backCircle}>
              <ArrowLeft size={20} color="#111827" strokeWidth={2} />
            </View>
          </TouchableOpacity>
        )}

        <View style={styles.heading}>
          <Text style={[PP.h1, { color: '#111827' }]}>Create</Text>
          <Text style={[PP.h1, { color: '#FF6B00' }]}>Account 🚀</Text>
          <Text style={[PP.body, styles.subText]}>Join the food lovers community</Text>
        </View>

        <View style={styles.form}>
          <InputField
            label="Full Name"
            placeholder="John Doe"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            leftIcon={<User size={18} color="#9CA3AF" strokeWidth={1.8} />}
          />
          <InputField
            label="Email Address"
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon={<Mail size={18} color="#9CA3AF" strokeWidth={1.8} />}
          />
          <InputField
            label="Phone Number (optional)"
            placeholder="+1 (555) 000-0000"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            leftIcon={<Phone size={18} color="#9CA3AF" strokeWidth={1.8} />}
          />
          <PasswordInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Min. 8 characters"
            helperText="Must include a number and special character"
          />
        </View>

        <TouchableOpacity onPress={() => setAgreed((v) => !v)} style={styles.termsRow} activeOpacity={0.8}>
          <View style={[styles.checkbox, { backgroundColor: agreed ? '#FF6B00' : '#FFFFFF', borderColor: agreed ? '#FF6B00' : '#D1D5DB' }]}>
            {agreed && <Ionicons name="checkmark" size={13} color="#FFFFFF" />}
          </View>
          <Text style={[PP.caption, styles.termsText]}>
            I agree to the <Text style={{ color: '#FF6B00' }}>Terms of Service</Text> and{' '}
            <Text style={{ color: '#FF6B00' }}>Privacy Policy</Text>
          </Text>
        </TouchableOpacity>

        {error ? (
          <View style={styles.errorBox}>
            <Text style={[PP.caption, { color: '#DC2626' }]}>{error}</Text>
          </View>
        ) : null}

        <PremiumButton
          label="Create Account"
          onPress={handleSignUp}
          variant="primary"
          fullWidth
          disabled={!isValid || isLoading}
          isLoading={isLoading}
        />

        <View style={styles.switchRow}>
          <Text style={[PP.body, { color: '#6B7280' }]}>Already have an account? </Text>
          <TouchableOpacity onPress={onLogin}>
            <Text style={[PP.label, { color: '#FF6B00' }]}>Log In</Text>
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
  form: { gap: 14 },
  termsRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  checkbox: {
    width: 22, height: 22, borderRadius: 6, borderWidth: 1.5,
    alignItems: 'center', justifyContent: 'center', marginTop: 1, flexShrink: 0,
  },
  termsText: { color: '#6B7280', flex: 1, lineHeight: 18 },
  errorBox: { backgroundColor: '#FEF2F2', borderRadius: 10, padding: 12 },
  switchRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
});
