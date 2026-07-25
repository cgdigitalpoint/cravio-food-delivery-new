// ─── Documents Screen ─────────────────────────────────────────────────────────
import React, { useEffect } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { CheckCircle, Upload, XCircle, Clock, FileText } from 'lucide-react-native';
import { TopAppBar, StatusBadge } from '@/components/ui';
import { PP } from '@/theme/poppins';
import { useRestaurantStore } from '@/store/useRestaurantStore';
import type { DocumentType, RestaurantDocument, DocumentStatus } from '@/types/restaurant.types';

interface Props {
  onBack: () => void;
}

interface DocConfig {
  type: DocumentType;
  label: string;
  description: string;
  required: boolean;
}

const DOCUMENT_CONFIGS: DocConfig[] = [
  { type: 'fssai',           label: 'FSSAI License',          description: 'Food Safety License issued by FSSAI', required: true },
  { type: 'gst_certificate', label: 'GST Certificate',        description: 'GST Registration Certificate',        required: true },
  { type: 'pan_card',        label: 'PAN Card',               description: 'Proprietor / Company PAN Card',       required: true },
  { type: 'shop_act',        label: 'Shop Act License',       description: 'Municipal shop & establishment license', required: false },
  { type: 'other',           label: 'Other Documents',        description: 'Any additional supporting documents',  required: false },
];

function statusIcon(status: DocumentStatus) {
  if (status === 'verified') return <CheckCircle size={18} color="#10B981" strokeWidth={2} />;
  if (status === 'rejected') return <XCircle size={18} color="#EF4444" strokeWidth={2} />;
  return <Clock size={18} color="#F59E0B" strokeWidth={2} />;
}

export function DocumentsScreen({ onBack }: Props) {
  const { restaurant, documents, isLoading, loadDocuments, saveDocument } = useRestaurantStore();

  useEffect(() => {
    if (restaurant) void loadDocuments();
  }, [restaurant?.id]);

  const docFor = (type: DocumentType): RestaurantDocument | undefined =>
    documents.find((d) => d.document_type === type);

  const handleUpload = async (type: DocumentType) => {
    if (!restaurant) {
      Alert.alert('No Restaurant', 'Please complete your restaurant profile first.');
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Gallery access is needed to upload documents.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.85,
      allowsEditing: false,
    });

    if (result.canceled || !result.assets[0]) return;
    const uri = result.assets[0].uri;

    try {
      // Store URI as document_url — replace with Supabase Storage upload in Phase 11B
      await saveDocument(type, uri);
      Alert.alert('Uploaded', 'Document uploaded successfully. It will be reviewed shortly.');
    } catch {
      Alert.alert('Error', 'Failed to upload document. Please try again.');
    }
  };

  return (
    <View style={styles.screen}>
      <TopAppBar title="Documents" subtitle="Required verifications" onBack={onBack} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {!restaurant && (
          <View style={styles.warningCard}>
            <Text style={[PP.caption, { color: '#92400E' }]}>
              ⚠️ Complete your Restaurant Profile before uploading documents.
            </Text>
          </View>
        )}

        <Text style={[PP.caption, { color: '#6B7280' }]}>
          Upload clear, legible images of each document. Our team will verify them within 2–3 business days.
        </Text>

        {DOCUMENT_CONFIGS.map((cfg) => {
          const doc = docFor(cfg.type);
          const uploaded = !!doc;

          return (
            <View key={cfg.type} style={styles.docCard}>
              <View style={styles.docHeader}>
                <View style={styles.docIcon}>
                  <FileText size={20} color="#FF6B00" strokeWidth={1.8} />
                </View>
                <View style={styles.docInfo}>
                  <View style={styles.docTitleRow}>
                    <Text style={[PP.label, { color: '#111827', fontSize: 14 }]}>
                      {cfg.label}
                    </Text>
                    {cfg.required && (
                      <View style={styles.requiredChip}>
                        <Text style={[PP.captionSM, { color: '#DC2626', fontSize: 10 }]}>Required</Text>
                      </View>
                    )}
                  </View>
                  <Text style={[PP.captionSM, { color: '#6B7280' }]}>{cfg.description}</Text>
                </View>
              </View>

              {uploaded && doc ? (
                <View style={styles.statusRow}>
                  {statusIcon(doc.status)}
                  <StatusBadge status={doc.status} size="sm" />
                  {doc.rejection_reason && (
                    <Text style={[PP.captionSM, { color: '#EF4444', flex: 1 }]} numberOfLines={2}>
                      {doc.rejection_reason}
                    </Text>
                  )}
                </View>
              ) : null}

              <TouchableOpacity
                style={[styles.uploadBtn, uploaded && styles.reUploadBtn]}
                onPress={() => void handleUpload(cfg.type)}
                activeOpacity={0.75}
                disabled={isLoading}
              >
                <Upload size={16} color={uploaded ? '#6B7280' : '#FF6B00'} strokeWidth={2} />
                <Text style={[PP.label, { color: uploaded ? '#6B7280' : '#FF6B00', fontSize: 13 }]}>
                  {uploaded ? 'Re-upload' : 'Upload Document'}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}

        <View style={styles.noteCard}>
          <Text style={[PP.captionSM, { color: '#6B7280' }]}>
            📸 Tips: Ensure documents are clear, not blurry, and all text is legible. Accepted formats: JPG, PNG. Max size: 5 MB per document.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F8F9FB' },
  content: { padding: 20, gap: 14, paddingBottom: 40 },
  warningCard: { backgroundColor: '#FEF3C7', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#FDE68A' },
  docCard: {
    backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, gap: 12,
    borderWidth: 1, borderColor: '#F3F4F6',
  },
  docHeader: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  docIcon: { width: 42, height: 42, borderRadius: 12, backgroundColor: '#FFF7ED', alignItems: 'center', justifyContent: 'center' },
  docInfo: { flex: 1, gap: 3 },
  docTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  requiredChip: { backgroundColor: '#FEE2E2', borderRadius: 4, paddingHorizontal: 5, paddingVertical: 1 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  uploadBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    borderWidth: 1.5, borderColor: '#FF6B00', borderRadius: 10, paddingVertical: 10,
    borderStyle: 'dashed',
  },
  reUploadBtn: { borderColor: '#D1D5DB', borderStyle: 'solid' },
  noteCard: { backgroundColor: '#F9FAFB', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#E5E7EB' },
});
