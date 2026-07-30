// ─── Delete Account Screen ─────────────────────────────────────────────────────
// Presents a clear explanation of account deletion consequences and
// a confirmation dialog before initiating deletion.
// Prepared for future backend integration with useAuthStore.

import React, { useState } from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  FileText,
  Lock,
  MapPin,
  Package,
  ShieldAlert,
  Star,
  Trash2,
  Wallet,
  XCircle,
} from 'lucide-react-native';
import { useColors } from '@/hooks/useColors';
import { PP } from '@/theme/poppins';

// ─── Props ────────────────────────────────────────────────────────────────────

interface DeleteAccountScreenProps {
  onBack?: () => void;
  onDeleted?: () => void;
}

// ─── Consequence Row ──────────────────────────────────────────────────────────

function ConsequenceRow({
  icon,
  iconBg,
  label,
  detail,
  isFirst,
}: {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  detail: string;
  isFirst?: boolean;
}) {
  const colors = useColors();
  return (
    <View
      style={[
        cqStyles.row,
        { borderTopColor: colors.border },
        isFirst && cqStyles.firstRow,
      ]}
    >
      <View style={[cqStyles.iconWrap, { backgroundColor: iconBg }]}>{icon}</View>
      <View style={cqStyles.text}>
        <Text style={[PP.label, { color: colors.foreground }]}>{label}</Text>
        <Text style={[PP.caption, { color: colors.mutedForeground, marginTop: 2 }]}>{detail}</Text>
      </View>
    </View>
  );
}

const cqStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: 14,
  },
  firstRow: { borderTopWidth: 0 },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 1,
  },
  text: { flex: 1 },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────

export function DeleteAccountScreen({ onBack, onDeleted }: DeleteAccountScreenProps) {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const [confirmText, setConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const paddingTop = Platform.OS === 'web' ? 56 : insets.top;
  const paddingBottom = Platform.OS === 'web' ? 34 : insets.bottom;

  const isConfirmed = confirmText.trim().toUpperCase() === 'DELETE';

  const handleDeletePress = () => {
    if (!isConfirmed) return;

    Alert.alert(
      'Delete Account Permanently?',
      'This action cannot be undone. Your account, order history, saved addresses, and wallet balance will be permanently removed in accordance with our Privacy Policy and Data Deletion Policy.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete My Account',
          style: 'destructive',
          onPress: async () => {
            setIsDeleting(true);
            try {
              // TODO: Integrate with Supabase auth deletion + backend cleanup
              // await deleteAccountService.deleteAccount();
              // await supabase.auth.signOut();
              Alert.alert(
                'Account Deletion Requested',
                'Your account deletion request has been received. Your data will be permanently removed within 30 days. You will receive a confirmation email.',
                [{ text: 'OK', onPress: onDeleted }],
              );
            } catch (_err) {
              Alert.alert(
                'Error',
                'Unable to process your request. Please try again or contact support@cravioapp.in.',
              );
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ],
    );
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      {/* ── Top bar ── */}
      <View
        style={[
          styles.topBar,
          { paddingTop: paddingTop + 4, backgroundColor: colors.card, borderBottomColor: colors.border },
        ]}
      >
        <TouchableOpacity onPress={onBack} activeOpacity={0.7} style={styles.backBtn}>
          <ArrowLeft size={22} color={colors.foreground} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={[PP.title, styles.topTitle, { color: colors.foreground }]}>
          Delete Account
        </Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: paddingBottom + 32, paddingTop: 16 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Warning hero ── */}
        <View style={[styles.warningHero, { backgroundColor: '#FEF2F2', borderColor: '#FECACA' }]}>
          <View style={[styles.warningIcon, { backgroundColor: '#FEE2E2' }]}>
            <ShieldAlert size={28} color="#EF4444" strokeWidth={2} />
          </View>
          <Text style={[PP.subtitle, { color: '#991B1B', fontFamily: 'Poppins_600SemiBold', textAlign: 'center' }]}>
            This action is permanent and irreversible
          </Text>
          <Text style={[PP.bodySM, { color: '#B91C1C', textAlign: 'center', lineHeight: 20, marginTop: 4 }]}>
            Deleting your account will permanently remove all your personal information as described in our Privacy Policy and Data Deletion Policy.
          </Text>
        </View>

        {/* ── What will be deleted ── */}
        <Text style={[PP.overline, styles.sectionTitle, { color: colors.mutedForeground }]}>
          What will be permanently deleted
        </Text>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <ConsequenceRow
            icon={<Package size={17} color="#FF6B00" />}
            iconBg="#FFF7ED"
            label="Order History"
            detail="All past orders and invoices will be deleted"
            isFirst
          />
          <ConsequenceRow
            icon={<MapPin size={17} color="#6366F1" />}
            iconBg="#EEF2FF"
            label="Saved Addresses"
            detail="All delivery addresses will be removed"
          />
          <ConsequenceRow
            icon={<Star size={17} color="#F59E0B" />}
            iconBg="#FFFBEB"
            label="Favourites & Preferences"
            detail="Saved restaurants, dishes, and settings"
          />
          <ConsequenceRow
            icon={<Wallet size={17} color="#3B82F6" />}
            iconBg="#EFF6FF"
            label="Cravio Wallet & Credits"
            detail="Any balance or credits will be forfeited"
          />
          <ConsequenceRow
            icon={<Lock size={17} color="#6B7280" />}
            iconBg={colors.muted}
            label="Account Access"
            detail="You will be permanently signed out"
          />
        </View>

        {/* ── What is retained ── */}
        <Text style={[PP.overline, styles.sectionTitle, { color: colors.mutedForeground }]}>
          What is retained (legal compliance)
        </Text>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <ConsequenceRow
            icon={<FileText size={17} color="#14B8A6" />}
            iconBg="#F0FDFA"
            label="Transaction Records"
            detail="Retained for 7 years as required by Indian tax law"
            isFirst
          />
          <ConsequenceRow
            icon={<ShieldAlert size={17} color="#8B5CF6" />}
            iconBg="#F5F3FF"
            label="Fraud Prevention Data"
            detail="Retained for up to 5 years if applicable"
          />
        </View>

        {/* ── Confirmation input ── */}
        <Text style={[PP.overline, styles.sectionTitle, { color: colors.mutedForeground }]}>
          Confirm deletion
        </Text>
        <View style={[styles.confirmCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[PP.bodySM, { color: colors.mutedForeground, marginBottom: 12, lineHeight: 20 }]}>
            Type <Text style={{ color: colors.destructive, fontFamily: 'Poppins_600SemiBold' }}>DELETE</Text> in the box below to confirm you understand this action is permanent.
          </Text>
          <TextInput
            value={confirmText}
            onChangeText={setConfirmText}
            placeholder="Type DELETE to confirm"
            placeholderTextColor={colors.mutedForeground}
            autoCapitalize="characters"
            autoCorrect={false}
            style={[
              styles.input,
              {
                backgroundColor: colors.surfaceVariant,
                color: colors.foreground,
                borderColor: isConfirmed ? colors.destructive : colors.border,
                fontFamily: 'Poppins_600SemiBold',
              },
            ]}
          />
          {isConfirmed && (
            <View style={styles.confirmedRow}>
              <CheckCircle2 size={16} color={colors.destructive} />
              <Text style={[PP.bodySM, { color: colors.destructive }]}>
                Confirmed — you may now delete your account
              </Text>
            </View>
          )}
        </View>

        {/* ── Delete button ── */}
        <TouchableOpacity
          onPress={handleDeletePress}
          activeOpacity={isConfirmed ? 0.8 : 1}
          disabled={!isConfirmed || isDeleting}
          style={[
            styles.deleteBtn,
            {
              backgroundColor: isConfirmed ? colors.destructive : colors.muted,
              opacity: isDeleting ? 0.6 : 1,
            },
          ]}
        >
          <Trash2 size={18} color={isConfirmed ? '#FFFFFF' : colors.mutedForeground} strokeWidth={2} />
          <Text
            style={[
              PP.button,
              { color: isConfirmed ? '#FFFFFF' : colors.mutedForeground },
            ]}
          >
            {isDeleting ? 'Deleting…' : 'Delete My Account'}
          </Text>
        </TouchableOpacity>

        {/* ── Cancel button ── */}
        <TouchableOpacity
          onPress={onBack}
          activeOpacity={0.7}
          style={[styles.cancelBtn, { borderColor: colors.border }]}
        >
          <XCircle size={18} color={colors.mutedForeground} strokeWidth={2} />
          <Text style={[PP.button, { color: colors.mutedForeground }]}>Keep My Account</Text>
        </TouchableOpacity>

        {/* ── Footer note ── */}
        <View style={styles.footerNote}>
          <Text style={[PP.caption, { color: colors.mutedForeground, textAlign: 'center', lineHeight: 18 }]}>
            Have questions? Read our{' '}
            <Text style={{ color: colors.primary }}>Data Deletion Policy</Text>
            {' '}or contact{' '}
            <Text style={{ color: colors.primary }}>support@cravioapp.in</Text>
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 8,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topTitle: {
    flex: 1,
    textAlign: 'center',
  },

  warningHero: {
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    gap: 8,
  },
  warningIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },

  sectionTitle: {
    marginHorizontal: 20,
    marginTop: 4,
    marginBottom: 8,
  },

  card: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
  },

  confirmCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 18,
    borderWidth: StyleSheet.hairlineWidth,
  },
  input: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    paddingHorizontal: 16,
    fontSize: 15,
    letterSpacing: 1,
  },
  confirmedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
  },

  deleteBtn: {
    marginHorizontal: 16,
    marginBottom: 10,
    height: 52,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },

  cancelBtn: {
    marginHorizontal: 16,
    marginBottom: 16,
    height: 52,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 1.5,
  },

  footerNote: {
    marginHorizontal: 24,
    marginTop: 4,
  },
});
