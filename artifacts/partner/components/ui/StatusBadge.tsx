// ─── StatusBadge ──────────────────────────────────────────────────────────────
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { ApprovalStatus, DocumentStatus } from '@/types/restaurant.types';
import { PP } from '@/theme/poppins';

type Status = ApprovalStatus | DocumentStatus | 'open' | 'closed' | 'verified';

interface Props {
  status: Status;
  size?: 'sm' | 'md';
}

const CONFIG: Record<Status, { label: string; bg: string; text: string; dot: string }> = {
  pending:      { label: 'Pending',      bg: '#FEF3C7', text: '#92400E', dot: '#F59E0B' },
  under_review: { label: 'Under Review', bg: '#DBEAFE', text: '#1E40AF', dot: '#3B82F6' },
  approved:     { label: 'Approved',     bg: '#D1FAE5', text: '#065F46', dot: '#10B981' },
  rejected:     { label: 'Rejected',     bg: '#FEE2E2', text: '#991B1B', dot: '#EF4444' },
  suspended:    { label: 'Suspended',    bg: '#F3F4F6', text: '#374151', dot: '#9CA3AF' },
  verified:     { label: 'Verified',     bg: '#D1FAE5', text: '#065F46', dot: '#10B981' },
  open:         { label: 'Open',         bg: '#D1FAE5', text: '#065F46', dot: '#10B981' },
  closed:       { label: 'Closed',       bg: '#FEE2E2', text: '#991B1B', dot: '#EF4444' },
};

export function StatusBadge({ status, size = 'md' }: Props) {
  const cfg = CONFIG[status] ?? CONFIG.pending;
  return (
    <View style={[styles.badge, { backgroundColor: cfg.bg }, size === 'sm' && styles.sm]}>
      <View style={[styles.dot, { backgroundColor: cfg.dot }, size === 'sm' && styles.dotSm]} />
      <Text style={[PP.captionSM, { color: cfg.text }, size === 'md' && styles.mdText]}>
        {cfg.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  sm: { paddingHorizontal: 7, paddingVertical: 3 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  dotSm: { width: 5, height: 5, borderRadius: 2.5 },
  mdText: { fontSize: 12 },
});
