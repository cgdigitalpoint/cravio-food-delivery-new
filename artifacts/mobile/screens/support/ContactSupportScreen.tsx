// ─── Contact Support Screen ───────────────────────────────────────────────────
// Email, Phone, WhatsApp, Website, Business Hours — Linking API.

import React from 'react';
import {
  Alert,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Clock,
  Globe,
  Mail,
  MessageCircle,
  Phone,
} from 'lucide-react-native';
import { useColors } from '@/hooks/useColors';
import { PP } from '@/theme/poppins';
import { SUPPORT_CONTACT } from './supportData';

// ─── Props ────────────────────────────────────────────────────────────────────

interface ContactSupportScreenProps {
  onBack?: () => void;
  onRaiseTicket?: () => void;
}

// ─── Contact option ───────────────────────────────────────────────────────────

interface ContactOption {
  id: string;
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  subtitle: string;
  onPress: () => void;
}

function ContactCard({ option }: { option: ContactOption }) {
  const colors = useColors();
  return (
    <TouchableOpacity
      onPress={option.onPress}
      activeOpacity={0.75}
      style={[cardStyles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
    >
      <View style={[cardStyles.iconWrap, { backgroundColor: option.iconBg }]}>
        {option.icon}
      </View>
      <View style={cardStyles.text}>
        <Text style={[PP.label, { color: colors.foreground }]}>{option.title}</Text>
        <Text style={[PP.bodySM, { color: colors.mutedForeground, marginTop: 2 }]}>
          {option.subtitle}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const cardStyles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 16,
    padding: 16,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 16,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  text: { flex: 1 },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────

export function ContactSupportScreen({ onBack, onRaiseTicket }: ContactSupportScreenProps) {
  const insets = useSafeAreaInsets();
  const colors = useColors();

  const paddingTop = Platform.OS === 'web' ? 56 : insets.top;
  const paddingBottom = Platform.OS === 'web' ? 34 : insets.bottom;

  const openURL = (url: string, fallbackMsg: string) => {
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url).catch(() => Alert.alert('Error', fallbackMsg));
      } else {
        Alert.alert('Not supported', fallbackMsg);
      }
    });
  };

  const contactOptions: ContactOption[] = [
    {
      id: 'email',
      icon: <Mail size={22} color="#FF6B00" strokeWidth={1.8} />,
      iconBg: '#FFF7ED',
      title: 'Email us',
      subtitle: SUPPORT_CONTACT.email,
      onPress: () =>
        openURL(
          `mailto:${SUPPORT_CONTACT.email}?subject=Support Request`,
          `Please email us at ${SUPPORT_CONTACT.email}`,
        ),
    },
    {
      id: 'phone',
      icon: <Phone size={22} color="#22C55E" strokeWidth={1.8} />,
      iconBg: '#F0FDF4',
      title: 'Call us',
      subtitle: SUPPORT_CONTACT.phone,
      onPress: () =>
        openURL(
          `tel:${SUPPORT_CONTACT.phone.replace(/[^+\d]/g, '')}`,
          `Please call us at ${SUPPORT_CONTACT.phone}`,
        ),
    },
    {
      id: 'whatsapp',
      icon: <MessageCircle size={22} color="#25D366" strokeWidth={1.8} />,
      iconBg: '#F0FDF4',
      title: 'WhatsApp',
      subtitle: 'Chat with us on WhatsApp',
      onPress: () =>
        openURL(
          `https://wa.me/${SUPPORT_CONTACT.whatsapp}?text=Hi%2C%20I%20need%20help%20with%20my%20Cravio%20order.`,
          'WhatsApp is not installed on this device.',
        ),
    },
    {
      id: 'website',
      icon: <Globe size={22} color="#3B82F6" strokeWidth={1.8} />,
      iconBg: '#EFF6FF',
      title: 'Support website',
      subtitle: 'cravioapp.in/support',
      onPress: () =>
        openURL(SUPPORT_CONTACT.website, `Visit ${SUPPORT_CONTACT.website}`),
    },
  ];

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      {/* ── Top bar ── */}
      <View
        style={[
          styles.topBar,
          {
            paddingTop: paddingTop + 4,
            backgroundColor: colors.card,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <TouchableOpacity onPress={onBack} activeOpacity={0.7} style={styles.iconBtn}>
          <ArrowLeft size={22} color={colors.foreground} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={[PP.title, styles.topTitle, { color: colors.foreground }]}>
          Contact Support
        </Text>
        <View style={styles.iconBtn} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: paddingBottom + 32, paddingTop: 16 }}
      >
        {/* ── Subtitle ── */}
        <Text
          style={[
            PP.body,
            { color: colors.mutedForeground, marginHorizontal: 16, marginBottom: 16, lineHeight: 22 },
          ]}
        >
          Choose how you'd like to get in touch with us.
        </Text>

        {/* ── Contact options ── */}
        {contactOptions.map((option) => (
          <ContactCard key={option.id} option={option} />
        ))}

        {/* ── Business hours ── */}
        <View
          style={[
            styles.hoursCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <View style={[styles.hoursIcon, { backgroundColor: '#FFFBEB' }]}>
            <Clock size={20} color="#F59E0B" strokeWidth={1.8} />
          </View>
          <View style={styles.hoursText}>
            <Text style={[PP.label, { color: colors.foreground }]}>Business Hours</Text>
            <Text style={[PP.body, { color: colors.primary, marginTop: 4 }]}>
              {SUPPORT_CONTACT.businessHours}
            </Text>
            <Text style={[PP.caption, { color: colors.mutedForeground, marginTop: 4 }]}>
              We typically respond within 2 hours during business hours.
            </Text>
          </View>
        </View>

        {/* ── Raise ticket CTA ── */}
        <View
          style={[
            styles.ticketCta,
            { backgroundColor: colors.accent, borderColor: colors.primary + '33' },
          ]}
        >
          <Text style={[PP.label, { color: colors.foreground, marginBottom: 4 }]}>
            Prefer a ticket?
          </Text>
          <Text
            style={[
              PP.bodySM,
              { color: colors.mutedForeground, marginBottom: 14, lineHeight: 20 },
            ]}
          >
            Raise a support ticket and track its status anytime.
          </Text>
          <TouchableOpacity
            onPress={onRaiseTicket}
            activeOpacity={0.8}
            style={[styles.ticketBtn, { backgroundColor: colors.primary }]}
          >
            <Text style={[PP.buttonSM, { color: '#FFFFFF' }]}>Raise a Ticket</Text>
          </TouchableOpacity>
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
  iconBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  topTitle: { flex: 1, textAlign: 'center' },

  hoursCard: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 16,
    padding: 16,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 14,
    alignItems: 'flex-start',
  },
  hoursIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  hoursText: { flex: 1 },

  ticketCta: {
    marginHorizontal: 16,
    marginTop: 6,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
  },
  ticketBtn: {
    paddingVertical: 11,
    borderRadius: 10,
    alignItems: 'center',
  },
});
