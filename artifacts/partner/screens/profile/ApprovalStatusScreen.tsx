// ─── Approval Status Screen ───────────────────────────────────────────────────
import React from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CheckCircle, Circle, Clock, XCircle, AlertCircle } from 'lucide-react-native';
import { TopAppBar, StatusBadge } from '@/components/ui';
import { PP } from '@/theme/poppins';
import { usePartnerAuthStore } from '@/store/usePartnerAuthStore';
import type { ApprovalStatus } from '@/types/restaurant.types';

interface Props {
  onBack: () => void;
}

interface Step {
  label: string;
  desc: string;
  status: 'done' | 'active' | 'pending' | 'skipped';
}

const STEP_SEQUENCE: ApprovalStatus[] = ['pending', 'under_review', 'approved'];

function stepIcon(status: Step['status']) {
  if (status === 'done')    return <CheckCircle size={22} color="#10B981" strokeWidth={2} />;
  if (status === 'active')  return <Clock size={22} color="#3B82F6" strokeWidth={2} />;
  if (status === 'skipped') return <XCircle size={22} color="#EF4444" strokeWidth={2} />;
  return <Circle size={22} color="#D1D5DB" strokeWidth={2} />;
}

function lineColor(status: Step['status']): string {
  if (status === 'done') return '#10B981';
  if (status === 'skipped') return '#EF4444';
  return '#E5E7EB';
}

function buildSteps(approvalStatus: ApprovalStatus): Step[] {
  const idx = STEP_SEQUENCE.indexOf(approvalStatus);
  const isRejected = approvalStatus === 'rejected';
  const isSuspended = approvalStatus === 'suspended';

  return [
    {
      label: 'Application Submitted',
      desc: 'Your partner registration was received.',
      status: 'done',
    },
    {
      label: 'Documents Under Review',
      desc: 'Our team is verifying your submitted documents.',
      status: isRejected
        ? 'skipped'
        : idx >= STEP_SEQUENCE.indexOf('under_review')
        ? idx === STEP_SEQUENCE.indexOf('under_review')
          ? 'active'
          : 'done'
        : 'pending',
    },
    {
      label: 'Bank & GST Verification',
      desc: 'Payment and tax details are being validated.',
      status: isRejected
        ? 'skipped'
        : approvalStatus === 'approved'
        ? 'done'
        : 'pending',
    },
    {
      label: 'Approval Granted',
      desc: 'Your restaurant is live on Cravio.',
      status: isRejected
        ? 'skipped'
        : approvalStatus === 'approved'
        ? 'done'
        : 'pending',
    },
  ];
}

export function ApprovalStatusScreen({ onBack }: Props) {
  const partner = usePartnerAuthStore((s) => s.partner);
  const approvalStatus = partner?.approval_status ?? 'pending';
  const steps = buildSteps(approvalStatus);

  return (
    <View style={styles.screen}>
      <TopAppBar title="Approval Status" subtitle="Application progress" onBack={onBack} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Status Card */}
        <View style={styles.statusCard}>
          <StatusBadge status={approvalStatus} />
          <Text style={[PP.h3, { color: '#111827', marginTop: 10 }]}>
            {approvalStatus === 'pending'      && 'Application Received'}
            {approvalStatus === 'under_review' && 'Under Review'}
            {approvalStatus === 'approved'     && 'Approved & Live! 🎉'}
            {approvalStatus === 'rejected'     && 'Application Rejected'}
            {approvalStatus === 'suspended'    && 'Account Suspended'}
          </Text>
          <Text style={[PP.body, { color: '#6B7280', marginTop: 4 }]}>
            {approvalStatus === 'pending'      && 'Your application is queued. We typically respond within 2-3 business days.'}
            {approvalStatus === 'under_review' && 'Our team is reviewing your documents. We\'ll notify you shortly.'}
            {approvalStatus === 'approved'     && 'Congratulations! Your restaurant is now live on the Cravio platform.'}
            {approvalStatus === 'rejected'     && 'Your application did not meet our requirements. See reason below.'}
            {approvalStatus === 'suspended'    && 'Your account has been temporarily suspended. Please contact support.'}
          </Text>

          {/* Rejection reason */}
          {approvalStatus === 'rejected' && partner?.rejection_reason && (
            <View style={styles.rejectionBox}>
              <View style={styles.rejectionHeader}>
                <AlertCircle size={16} color="#DC2626" strokeWidth={2} />
                <Text style={[PP.label, { color: '#DC2626', fontSize: 13 }]}>Rejection Reason</Text>
              </View>
              <Text style={[PP.caption, { color: '#991B1B', marginTop: 4 }]}>
                {partner.rejection_reason}
              </Text>
            </View>
          )}
        </View>

        {/* Timeline */}
        <View style={styles.timelineCard}>
          <Text style={[PP.label, { color: '#111827', marginBottom: 16 }]}>Application Timeline</Text>
          {steps.map((step, i) => (
            <View key={step.label} style={styles.stepRow}>
              {/* Left: icon + connector */}
              <View style={styles.stepLeft}>
                {stepIcon(step.status)}
                {i < steps.length - 1 && (
                  <View style={[styles.connector, { backgroundColor: lineColor(steps[i + 1]?.status ?? 'pending') }]} />
                )}
              </View>
              {/* Right: content */}
              <View style={[styles.stepContent, i < steps.length - 1 && { paddingBottom: 24 }]}>
                <Text style={[PP.label, {
                  color: step.status === 'done' ? '#111827' : step.status === 'active' ? '#1E40AF' : step.status === 'skipped' ? '#EF4444' : '#9CA3AF',
                  fontSize: 14,
                }]}>
                  {step.label}
                </Text>
                <Text style={[PP.caption, { color: step.status === 'pending' || step.status === 'skipped' ? '#D1D5DB' : '#6B7280', marginTop: 2 }]}>
                  {step.desc}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Next steps hint */}
        {(approvalStatus === 'pending' || approvalStatus === 'under_review') && (
          <View style={styles.hintCard}>
            <Text style={[PP.label, { color: '#1E40AF', fontSize: 13 }]}>💡 Speed up your approval</Text>
            <Text style={[PP.caption, { color: '#3730A3', marginTop: 4 }]}>
              Ensure all required documents are uploaded, bank details and GST information are complete, and your restaurant profile is fully filled out.
            </Text>
          </View>
        )}

        {/* Contact support */}
        <View style={styles.supportCard}>
          <Text style={[PP.label, { color: '#374151', fontSize: 13 }]}>Need help?</Text>
          <Text style={[PP.caption, { color: '#6B7280', marginTop: 4 }]}>
            Contact partner support at{' '}
            <Text style={{ color: '#FF6B00' }}>partner-support@cravio.in</Text>
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F8F9FB' },
  content: { padding: 20, gap: 16, paddingBottom: 40 },
  statusCard: {
    backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20,
    borderWidth: 1, borderColor: '#F3F4F6',
  },
  rejectionBox: {
    marginTop: 14, backgroundColor: '#FEF2F2', borderRadius: 10, padding: 12, gap: 0,
  },
  rejectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  timelineCard: {
    backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20,
    borderWidth: 1, borderColor: '#F3F4F6',
  },
  stepRow: { flexDirection: 'row', gap: 14 },
  stepLeft: { alignItems: 'center', width: 22 },
  connector: { width: 2, flex: 1, marginTop: 4, borderRadius: 1 },
  stepContent: { flex: 1, paddingBottom: 0 },
  hintCard: {
    backgroundColor: '#EFF6FF', borderRadius: 14, padding: 16,
    borderWidth: 1, borderColor: '#BFDBFE',
  },
  supportCard: {
    backgroundColor: '#FFFFFF', borderRadius: 14, padding: 16,
    borderWidth: 1, borderColor: '#F3F4F6',
  },
});
