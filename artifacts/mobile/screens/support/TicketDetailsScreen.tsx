// ─── Ticket Details Screen ────────────────────────────────────────────────────
// Ticket ID, Status, Created Date, Conversation Timeline,
// Attachments placeholder, Close Ticket (placeholder).

import React from 'react';
import {
  Alert,
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
  Bot,
  Paperclip,
  User,
  XCircle,
} from 'lucide-react-native';
import { useColors } from '@/hooks/useColors';
import { PP } from '@/theme/poppins';
import {
  MOCK_TICKETS,
  SupportTicket,
  TicketMessage,
  TicketStatus,
} from './supportData';

// ─── Props ────────────────────────────────────────────────────────────────────

export interface TicketDetailsScreenProps {
  ticketId: string;
  onBack?: () => void;
}

// ─── Status meta ─────────────────────────────────────────────────────────────

const STATUS_META: Record<TicketStatus, { label: string; color: string; bg: string }> = {
  pending: { label: 'Pending', color: '#F59E0B', bg: '#FFFBEB' },
  open: { label: 'Open', color: '#3B82F6', bg: '#EFF6FF' },
  resolved: { label: 'Resolved', color: '#22C55E', bg: '#F0FDF4' },
  closed: { label: 'Closed', color: '#6B7280', bg: '#F3F4F6' },
};

const PRIORITY_LABELS: Record<string, { label: string; color: string }> = {
  low: { label: 'Low', color: '#22C55E' },
  medium: { label: 'Medium', color: '#F59E0B' },
  high: { label: 'High', color: '#EF4444' },
};

// ─── Message bubble ───────────────────────────────────────────────────────────

function MessageBubble({ message }: { message: TicketMessage }) {
  const colors = useColors();
  const isUser = message.sender === 'user';
  const time = new Date(message.createdAt).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });
  const date = new Date(message.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
  });

  return (
    <View style={[bubbleStyles.row, isUser && bubbleStyles.rowUser]}>
      {/* Avatar */}
      {!isUser && (
        <View style={[bubbleStyles.avatar, { backgroundColor: colors.accent }]}>
          <Bot size={16} color={colors.primary} strokeWidth={1.8} />
        </View>
      )}
      <View style={[bubbleStyles.wrap, isUser ? bubbleStyles.wrapUser : bubbleStyles.wrapSupport]}>
        <View
          style={[
            bubbleStyles.bubble,
            isUser
              ? [bubbleStyles.bubbleUser, { backgroundColor: colors.primary }]
              : [bubbleStyles.bubbleSupport, { backgroundColor: colors.card, borderColor: colors.border }],
          ]}
        >
          {!isUser && (
            <Text
              style={[
                PP.caption,
                bubbleStyles.sender,
                { color: colors.primary, fontFamily: 'Poppins_600SemiBold' },
              ]}
            >
              {message.senderName}
            </Text>
          )}
          <Text
            style={[
              PP.bodySM,
              { color: isUser ? '#FFFFFF' : colors.foreground, lineHeight: 20 },
            ]}
          >
            {message.body}
          </Text>
        </View>
        <Text style={[PP.caption, { color: colors.mutedForeground, marginTop: 3 }]}>
          {date} · {time}
        </Text>
      </View>
      {isUser && (
        <View style={[bubbleStyles.avatar, { backgroundColor: colors.muted }]}>
          <User size={16} color={colors.mutedForeground} strokeWidth={1.8} />
        </View>
      )}
    </View>
  );
}

const bubbleStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 14,
    gap: 8,
  },
  rowUser: { flexDirection: 'row-reverse' },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginBottom: 18,
  },
  wrap: { maxWidth: '75%' },
  wrapUser: { alignItems: 'flex-end' },
  wrapSupport: { alignItems: 'flex-start' },
  bubble: {
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 4,
  },
  bubbleUser: { borderBottomRightRadius: 4 },
  bubbleSupport: {
    borderWidth: StyleSheet.hairlineWidth,
    borderBottomLeftRadius: 4,
  },
  sender: { marginBottom: 2 },
});

// ─── Info row ─────────────────────────────────────────────────────────────────

function InfoRow({ label, value, color }: { label: string; value: string; color?: string }) {
  const colors = useColors();
  return (
    <View style={infoStyles.row}>
      <Text style={[PP.caption, { color: colors.mutedForeground, width: 90 }]}>{label}</Text>
      <Text
        style={[PP.bodySM, { color: color ?? colors.foreground, fontFamily: 'Poppins_500Medium', flex: 1 }]}
      >
        {value}
      </Text>
    </View>
  );
}

const infoStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6 },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────

export function TicketDetailsScreen({ ticketId, onBack }: TicketDetailsScreenProps) {
  const insets = useSafeAreaInsets();
  const colors = useColors();

  const paddingTop = Platform.OS === 'web' ? 56 : insets.top;
  const paddingBottom = Platform.OS === 'web' ? 34 : insets.bottom;

  const ticket: SupportTicket | undefined = MOCK_TICKETS.find((t) => t.id === ticketId);

  if (!ticket) {
    return (
      <View style={[styles.screen, { backgroundColor: colors.background }]}>
        <View
          style={[
            styles.topBar,
            { paddingTop: paddingTop + 4, backgroundColor: colors.card, borderBottomColor: colors.border },
          ]}
        >
          <TouchableOpacity onPress={onBack} activeOpacity={0.7} style={styles.iconBtn}>
            <ArrowLeft size={22} color={colors.foreground} strokeWidth={2} />
          </TouchableOpacity>
          <Text style={[PP.title, styles.topTitle, { color: colors.foreground }]}>Ticket</Text>
          <View style={styles.iconBtn} />
        </View>
        <View style={styles.center}>
          <Text style={[PP.subtitle, { color: colors.foreground }]}>Ticket not found</Text>
          <Text style={[PP.body, { color: colors.mutedForeground, marginTop: 8 }]}>
            This ticket may have been removed.
          </Text>
        </View>
      </View>
    );
  }

  const statusMeta = STATUS_META[ticket.status];
  const priorityMeta = PRIORITY_LABELS[ticket.priority] ?? { label: ticket.priority, color: colors.foreground };

  const createdDate = new Date(ticket.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const updatedDate = new Date(ticket.updatedAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const handleCloseTicket = () => {
    Alert.alert(
      'Close Ticket',
      'Are you sure you want to close this ticket?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Close Ticket',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Ticket Closed', 'Your ticket has been marked as closed.');
          },
        },
      ],
    );
  };

  const canClose = ticket.status === 'open' || ticket.status === 'pending';

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
        <Text style={[PP.title, styles.topTitle, { color: colors.foreground }]} numberOfLines={1}>
          {ticket.id}
        </Text>
        <View style={styles.iconBtn} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: paddingBottom + 32, paddingTop: 16 }}
      >
        {/* ── Ticket info card ── */}
        <View
          style={[
            styles.infoCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          {/* Subject + status badge */}
          <View style={styles.subjectRow}>
            <Text style={[PP.subtitle, { color: colors.foreground, flex: 1, lineHeight: 24 }]}>
              {ticket.subject}
            </Text>
            <View style={[styles.badge, { backgroundColor: statusMeta.bg }]}>
              <Text
                style={[
                  PP.caption,
                  { color: statusMeta.color, fontFamily: 'Poppins_600SemiBold' },
                ]}
              >
                {statusMeta.label}
              </Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <InfoRow label="Ticket ID" value={ticket.id} />
          <InfoRow label="Category" value={ticket.category} />
          <InfoRow label="Priority" value={priorityMeta.label} color={priorityMeta.color} />
          <InfoRow label="Created" value={createdDate} />
          <InfoRow label="Updated" value={updatedDate} />
        </View>

        {/* ── Description ── */}
        <View
          style={[
            styles.sectionCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[PP.label, { color: colors.foreground, marginBottom: 8 }]}>
            Description
          </Text>
          <Text style={[PP.body, { color: colors.mutedForeground, lineHeight: 22 }]}>
            {ticket.description}
          </Text>
        </View>

        {/* ── Conversation timeline ── */}
        <View style={styles.timelineHeader}>
          <Text style={[PP.label, { color: colors.foreground }]}>Conversation</Text>
          <Text style={[PP.caption, { color: colors.mutedForeground }]}>
            {ticket.messages.length} message{ticket.messages.length !== 1 ? 's' : ''}
          </Text>
        </View>
        <View
          style={[
            styles.timeline,
            { backgroundColor: colors.background },
          ]}
        >
          {ticket.messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
        </View>

        {/* ── Attachments placeholder ── */}
        <View
          style={[
            styles.sectionCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[PP.label, { color: colors.foreground, marginBottom: 8 }]}>
            Attachments
          </Text>
          <View
            style={[
              styles.attachPlaceholder,
              { backgroundColor: colors.muted, borderColor: colors.border },
            ]}
          >
            <Paperclip size={20} color={colors.mutedForeground} strokeWidth={1.8} />
            <Text style={[PP.bodySM, { color: colors.mutedForeground }]}>
              No attachments (coming soon)
            </Text>
          </View>
        </View>

        {/* ── Close ticket ── */}
        {canClose && (
          <TouchableOpacity
            onPress={handleCloseTicket}
            activeOpacity={0.8}
            style={[
              styles.closeBtn,
              { borderColor: colors.destructive + '55', backgroundColor: '#FEF2F2' },
            ]}
          >
            <XCircle size={18} color={colors.destructive} strokeWidth={2} />
            <Text
              style={[PP.buttonSM, { color: colors.destructive }]}
            >
              Close Ticket
            </Text>
          </TouchableOpacity>
        )}
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

  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },

  infoCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 16,
    padding: 16,
    borderWidth: StyleSheet.hairlineWidth,
  },
  subjectRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 12,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    flexShrink: 0,
  },
  divider: { height: StyleSheet.hairlineWidth, marginBottom: 10 },

  sectionCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 16,
    padding: 16,
    borderWidth: StyleSheet.hairlineWidth,
  },

  timelineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 10,
  },
  timeline: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 16,
    padding: 16,
  },

  attachPlaceholder: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderStyle: 'dashed',
  },

  closeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginBottom: 8,
    paddingVertical: 13,
    borderRadius: 14,
    borderWidth: 1.5,
  },
});
