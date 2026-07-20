// ─── OTP Verification Screen ──────────────────────────────────────────────────
import React, { useEffect, useState } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { OTPInput, PremiumButton } from '@/components/ui';
import { PP } from '@/theme/poppins';

interface OTPScreenProps {
  onBack?: () => void;
  onVerify?: () => void;
  contact?: string;
  mode?: 'signup' | 'forgot';
}

export function OTPScreen({
  onBack,
  onVerify,
  contact = 'your email',
  mode = 'signup',
}: OTPScreenProps) {
  const insets = useSafeAreaInsets();
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(45);
  const [canResend, setCanResend] = useState(false);

  const paddingTop = Platform.OS === 'web' ? 67 : insets.top;
  const paddingBottom = Platform.OS === 'web' ? 34 : insets.bottom;

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleResend = () => {
    if (!canResend) return;
    setCountdown(45);
    setCanResend(false);
    setOtp('');
  };

  const mm = String(Math.floor(countdown / 60)).padStart(2, '0');
  const ss = String(countdown % 60).padStart(2, '0');

  return (
    <View style={[styles.screen, { paddingTop: paddingTop + 8, paddingBottom: paddingBottom + 24 }]}>
      {/* Back */}
      {onBack != null && (
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <View style={styles.backCircle}>
            <ArrowLeft size={20} color="#111827" strokeWidth={2} />
          </View>
        </TouchableOpacity>
      )}

      <View style={styles.content}>
        {/* Illustration */}
        <View style={styles.iconWrap}>
          <LinearGradient
            colors={['#FF8530', '#FF6B00', '#E85E00']}
            style={styles.iconGrad}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.iconEmoji}>📱</Text>
          </LinearGradient>
        </View>

        {/* Heading */}
        <View style={styles.heading}>
          <Text style={[PP.h1, { color: '#111827' }]}>Verify Code</Text>
          <Text style={[PP.body, styles.subText]}>
            Enter the 6-digit code sent to{'\n'}
            <Text style={{ color: '#FF6B00', fontFamily: 'Poppins_600SemiBold' }}>
              {contact}
            </Text>
          </Text>
        </View>

        {/* OTP Input */}
        <View style={styles.otpWrap}>
          <OTPInput length={6} value={otp} onChangeText={setOtp} />
        </View>

        {/* Resend */}
        <View style={styles.resendRow}>
          {canResend ? (
            <TouchableOpacity onPress={handleResend}>
              <Text style={[PP.label, { color: '#FF6B00' }]}>Resend Code</Text>
            </TouchableOpacity>
          ) : (
            <Text style={[PP.body, { color: '#6B7280' }]}>
              Resend code in{' '}
              <Text style={{ color: '#111827', fontFamily: 'Poppins_600SemiBold' }}>
                {mm}:{ss}
              </Text>
            </Text>
          )}
        </View>

        {/* Verify button */}
        <PremiumButton
          label="Verify & Continue"
          onPress={onVerify}
          variant="primary"
          fullWidth
          disabled={otp.length < 6}
        />

        {/* Wrong number/email */}
        <View style={styles.switchRow}>
          <Text style={[PP.body, { color: '#6B7280' }]}>Wrong contact? </Text>
          <TouchableOpacity onPress={onBack}>
            <Text style={[PP.label, { color: '#FF6B00' }]}>Change it</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
  },
  backBtn: { alignSelf: 'flex-start', marginBottom: 16 },
  backCircle: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    gap: 24,
    justifyContent: 'flex-start',
  },
  iconWrap: {
    alignSelf: 'flex-start',
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
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
  otpWrap: { alignItems: 'center' },
  resendRow: { alignItems: 'center' },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
