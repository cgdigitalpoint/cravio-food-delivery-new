// ─── Raise Support Ticket Screen ─────────────────────────────────────────────
// Form: Subject, Category, Priority, Description, Attachment placeholder.
// Validated inputs; prepared for future Supabase integration.

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
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  ChevronDown,
  Paperclip,
  Tag,
  TicketIcon,
} from 'lucide-react-native';
import { useColors } from '@/hooks/useColors';
import { PP } from '@/theme/poppins';
import {
  TICKET_CATEGORIES,
  TICKET_PRIORITIES,
  TicketCategory,
  TicketPriority,
} from './supportData';

// ─── Props ────────────────────────────────────────────────────────────────────

interface RaiseTicketScreenProps {
  onBack?: () => void;
  onSuccess?: (ticketId: string) => void;
}

// ─── Form field wrapper ───────────────────────────────────────────────────────

function FieldLabel({ label, required }: { label: string; required?: boolean }) {
  const colors = useColors();
  return (
    <Text style={[PP.label, { color: colors.foreground, marginBottom: 6 }]}>
      {label}
      {required && <Text style={{ color: colors.destructive }}> *</Text>}
    </Text>
  );
}

function FieldError({ message }: { message?: string }) {
  const colors = useColors();
  if (!message) return null;
  return (
    <View style={errStyles.row}>
      <AlertCircle size={13} color={colors.destructive} />
      <Text style={[PP.caption, { color: colors.destructive }]}>{message}</Text>
    </View>
  );
}

const errStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
});

// ─── Priority badge ───────────────────────────────────────────────────────────

const PRIORITY_META: Record<TicketPriority, { label: string; color: string; bg: string }> = {
  low: { label: 'Low', color: '#22C55E', bg: '#F0FDF4' },
  medium: { label: 'Medium', color: '#F59E0B', bg: '#FFFBEB' },
  high: { label: 'High', color: '#EF4444', bg: '#FEF2F2' },
};

// ─── Main screen ──────────────────────────────────────────────────────────────

export function RaiseTicketScreen({ onBack, onSuccess }: RaiseTicketScreenProps) {
  const insets = useSafeAreaInsets();
  const colors = useColors();

  const paddingTop = Platform.OS === 'web' ? 56 : insets.top;
  const paddingBottom = Platform.OS === 'web' ? 34 : insets.bottom;

  // Form state
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<TicketCategory | ''>('');
  const [priority, setPriority] = useState<TicketPriority>('medium');
  const [description, setDescription] = useState('');
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Errors
  const [errors, setErrors] = useState<{
    subject?: string;
    category?: string;
    description?: string;
  }>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!subject.trim()) e.subject = 'Subject is required.';
    else if (subject.trim().length < 5) e.subject = 'Subject must be at least 5 characters.';
    if (!category) e.category = 'Please select a category.';
    if (!description.trim()) e.description = 'Description is required.';
    else if (description.trim().length < 20)
      e.description = 'Please describe the issue in at least 20 characters.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsSubmitting(true);
    // Simulate network call — replace with Supabase insert when ready
    await new Promise((r) => setTimeout(r, 1200));
    const fakeId = `TKT-${Math.floor(1000 + Math.random() * 9000)}`;
    setIsSubmitting(false);
    Alert.alert(
      '✅ Ticket Raised',
      `Your ticket ${fakeId} has been submitted. We'll respond within 2 business hours.`,
      [{ text: 'OK', onPress: () => onSuccess?.(fakeId) }],
    );
  };

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
          Raise a Ticket
        </Text>
        <View style={styles.iconBtn} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: paddingBottom + 32, paddingTop: 16 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Form card ── */}
        <View
          style={[
            styles.formCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          {/* Subject */}
          <View style={styles.field}>
            <FieldLabel label="Subject" required />
            <TextInput
              value={subject}
              onChangeText={(t) => { setSubject(t); setErrors((e) => ({ ...e, subject: undefined })); }}
              placeholder="Brief summary of your issue"
              placeholderTextColor={colors.mutedForeground}
              maxLength={120}
              style={[
                PP.body,
                styles.input,
                {
                  color: colors.foreground,
                  backgroundColor: colors.background,
                  borderColor: errors.subject ? colors.destructive : colors.border,
                },
              ]}
            />
            <FieldError message={errors.subject} />
          </View>

          {/* Category */}
          <View style={styles.field}>
            <FieldLabel label="Category" required />
            <TouchableOpacity
              onPress={() => setShowCategoryPicker((v) => !v)}
              activeOpacity={0.7}
              style={[
                styles.select,
                {
                  backgroundColor: colors.background,
                  borderColor: errors.category ? colors.destructive : colors.border,
                },
              ]}
            >
              <Tag size={16} color={colors.mutedForeground} strokeWidth={1.8} />
              <Text
                style={[
                  PP.body,
                  { color: category ? colors.foreground : colors.mutedForeground, flex: 1 },
                ]}
              >
                {category || 'Select category…'}
              </Text>
              <ChevronDown size={16} color={colors.mutedForeground} />
            </TouchableOpacity>
            {showCategoryPicker && (
              <View
                style={[
                  styles.picker,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
              >
                {TICKET_CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    onPress={() => {
                      setCategory(cat);
                      setShowCategoryPicker(false);
                      setErrors((e) => ({ ...e, category: undefined }));
                    }}
                    activeOpacity={0.7}
                    style={[styles.pickerItem, { borderTopColor: colors.border }]}
                  >
                    <Text
                      style={[
                        PP.body,
                        {
                          color:
                            category === cat ? colors.primary : colors.foreground,
                          fontFamily:
                            category === cat
                              ? 'Poppins_600SemiBold'
                              : 'Poppins_400Regular',
                        },
                      ]}
                    >
                      {cat}
                    </Text>
                    {category === cat && (
                      <CheckCircle size={16} color={colors.primary} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}
            <FieldError message={errors.category} />
          </View>

          {/* Priority */}
          <View style={styles.field}>
            <FieldLabel label="Priority" />
            <View style={styles.priorityRow}>
              {TICKET_PRIORITIES.map((p) => {
                const meta = PRIORITY_META[p];
                const active = priority === p;
                return (
                  <TouchableOpacity
                    key={p}
                    onPress={() => setPriority(p)}
                    activeOpacity={0.7}
                    style={[
                      styles.priorityBtn,
                      {
                        backgroundColor: active ? meta.bg : colors.background,
                        borderColor: active ? meta.color : colors.border,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        PP.bodySM,
                        {
                          color: active ? meta.color : colors.mutedForeground,
                          fontFamily: active
                            ? 'Poppins_600SemiBold'
                            : 'Poppins_400Regular',
                        },
                      ]}
                    >
                      {meta.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Description */}
          <View style={styles.field}>
            <FieldLabel label="Description" required />
            <TextInput
              value={description}
              onChangeText={(t) => { setDescription(t); setErrors((e) => ({ ...e, description: undefined })); }}
              placeholder="Describe the issue in detail…"
              placeholderTextColor={colors.mutedForeground}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              maxLength={1000}
              style={[
                PP.body,
                styles.textarea,
                {
                  color: colors.foreground,
                  backgroundColor: colors.background,
                  borderColor: errors.description ? colors.destructive : colors.border,
                },
              ]}
            />
            <View style={styles.charCount}>
              <FieldError message={errors.description} />
              <Text style={[PP.caption, { color: colors.mutedForeground, marginLeft: 'auto' }]}>
                {description.length}/1000
              </Text>
            </View>
          </View>

          {/* Attachment placeholder */}
          <View style={styles.field}>
            <FieldLabel label="Attachments" />
            <TouchableOpacity
              activeOpacity={0.7}
              style={[
                styles.attachBtn,
                { backgroundColor: colors.background, borderColor: colors.border },
              ]}
            >
              <Paperclip size={18} color={colors.mutedForeground} strokeWidth={1.8} />
              <View>
                <Text style={[PP.bodySM, { color: colors.foreground }]}>Attach files</Text>
                <Text style={[PP.caption, { color: colors.mutedForeground }]}>
                  PNG, JPG, PDF — max 5 MB each (coming soon)
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Submit ── */}
        <TouchableOpacity
          onPress={handleSubmit}
          activeOpacity={0.82}
          disabled={isSubmitting}
          style={[
            styles.submitBtn,
            { backgroundColor: isSubmitting ? colors.primary + 'AA' : colors.primary },
          ]}
        >
          <TicketIcon size={18} color="#FFFFFF" strokeWidth={2} />
          <Text style={[PP.button, { color: '#FFFFFF' }]}>
            {isSubmitting ? 'Submitting…' : 'Submit Ticket'}
          </Text>
        </TouchableOpacity>

        <Text
          style={[
            PP.caption,
            { color: colors.mutedForeground, textAlign: 'center', marginHorizontal: 24, marginTop: 4 },
          ]}
        >
          We'll respond within 2 business hours during Mon–Sat, 9 AM–9 PM IST.
        </Text>
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

  formCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 4,
  },
  field: { marginBottom: 16 },

  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },

  select: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },

  picker: {
    marginTop: 6,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  pickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderTopWidth: StyleSheet.hairlineWidth,
  },

  priorityRow: { flexDirection: 'row', gap: 10 },
  priorityBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: 'center',
  },

  textarea: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    minHeight: 110,
  },
  charCount: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },

  attachBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },

  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginHorizontal: 16,
    marginBottom: 12,
    paddingVertical: 14,
    borderRadius: 14,
  },
});
