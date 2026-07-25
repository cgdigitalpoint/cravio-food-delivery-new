// ─── Business Hours Screen ────────────────────────────────────────────────────
import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Clock } from 'lucide-react-native';
import { TopAppBar, PremiumButton } from '@/components/ui';
import { PP } from '@/theme/poppins';
import { useRestaurantStore } from '@/store/useRestaurantStore';
import type { DayOfWeek, BusinessHour } from '@/types/restaurant.types';

interface Props {
  onBack: () => void;
}

const DAYS: { key: DayOfWeek; label: string; short: string }[] = [
  { key: 'monday',    label: 'Monday',    short: 'Mon' },
  { key: 'tuesday',   label: 'Tuesday',   short: 'Tue' },
  { key: 'wednesday', label: 'Wednesday', short: 'Wed' },
  { key: 'thursday',  label: 'Thursday',  short: 'Thu' },
  { key: 'friday',    label: 'Friday',    short: 'Fri' },
  { key: 'saturday',  label: 'Saturday',  short: 'Sat' },
  { key: 'sunday',    label: 'Sunday',    short: 'Sun' },
];

const TIME_OPTIONS: string[] = Array.from({ length: 48 }, (_, i) => {
  const h = Math.floor(i / 2).toString().padStart(2, '0');
  const m = i % 2 === 0 ? '00' : '30';
  return `${h}:${m}`;
});

type HourMap = Record<DayOfWeek, { is_open: boolean; open_time: string; close_time: string }>;

const DEFAULT_HOURS: HourMap = DAYS.reduce((acc, d) => {
  acc[d.key] = { is_open: true, open_time: '09:00', close_time: '22:00' };
  return acc;
}, {} as HourMap);

function nextTime(current: string): string {
  const idx = TIME_OPTIONS.indexOf(current);
  return TIME_OPTIONS[Math.min(idx + 1, TIME_OPTIONS.length - 1)] ?? '23:30';
}

function prevTime(current: string): string {
  const idx = TIME_OPTIONS.indexOf(current);
  return TIME_OPTIONS[Math.max(idx - 1, 0)] ?? '00:00';
}

export function BusinessHoursScreen({ onBack }: Props) {
  const { restaurant, businessHours, isLoading, loadBusinessHours, saveBusinessHours } = useRestaurantStore();
  const [hours, setHours] = useState<HourMap>(DEFAULT_HOURS);
  const [pickerDay, setPickerDay] = useState<DayOfWeek | null>(null);
  const [pickerField, setPickerField] = useState<'open_time' | 'close_time'>('open_time');

  useEffect(() => {
    if (restaurant) void loadBusinessHours();
  }, [restaurant?.id]);

  useEffect(() => {
    if (businessHours.length > 0) {
      const map = { ...DEFAULT_HOURS };
      businessHours.forEach((h: BusinessHour) => {
        map[h.day] = { is_open: h.is_open, open_time: h.open_time, close_time: h.close_time };
      });
      setHours(map);
    }
  }, [businessHours]);

  const setDay = (day: DayOfWeek, key: 'is_open' | 'open_time' | 'close_time', value: boolean | string) =>
    setHours((prev) => ({ ...prev, [day]: { ...prev[day], [key]: value } }));

  const applyToAll = () => {
    const first = hours.monday;
    const updated = { ...hours };
    DAYS.forEach((d) => { updated[d.key] = { ...first }; });
    setHours(updated);
    Alert.alert('Applied', 'Monday\'s hours applied to all days.');
  };

  const handleSave = async () => {
    if (!restaurant) {
      Alert.alert('No Restaurant', 'Please complete your restaurant profile first.');
      return;
    }
    const rows = DAYS.map((d) => ({ day: d.key, ...hours[d.key] }));
    try {
      await saveBusinessHours(rows);
      Alert.alert('Saved', 'Business hours saved successfully.', [{ text: 'OK', onPress: onBack }]);
    } catch {
      Alert.alert('Error', 'Failed to save hours. Please try again.');
    }
  };

  const openPicker = (day: DayOfWeek, field: 'open_time' | 'close_time') => {
    setPickerDay(day);
    setPickerField(field);
  };

  return (
    <View style={styles.screen}>
      <TopAppBar title="Business Hours" subtitle="Set open & close times" onBack={onBack} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        <View style={styles.applyAllRow}>
          <Text style={[PP.caption, { color: '#6B7280', flex: 1 }]}>
            Set hours for each day. Toggle to mark days as closed.
          </Text>
          <TouchableOpacity style={styles.applyAllBtn} onPress={applyToAll} activeOpacity={0.7}>
            <Text style={[PP.label, { color: '#FF6B00', fontSize: 12 }]}>Apply Mon to All</Text>
          </TouchableOpacity>
        </View>

        {DAYS.map((d) => {
          const h = hours[d.key];
          const isOpen = h.is_open;

          return (
            <View key={d.key} style={[styles.dayCard, !isOpen && styles.dayCardClosed]}>
              <View style={styles.dayHeader}>
                <Text style={[PP.label, { color: isOpen ? '#111827' : '#9CA3AF', fontSize: 14, width: 90 }]}>
                  {d.label}
                </Text>
                <Switch
                  value={isOpen}
                  onValueChange={(v) => setDay(d.key, 'is_open', v)}
                  trackColor={{ false: '#E5E7EB', true: '#34D399' }}
                  thumbColor="#FFFFFF"
                  ios_backgroundColor="#E5E7EB"
                />
                <Text style={[PP.captionSM, { color: isOpen ? '#10B981' : '#9CA3AF', width: 40 }]}>
                  {isOpen ? 'Open' : 'Closed'}
                </Text>
              </View>

              {isOpen && (
                <View style={styles.timesRow}>
                  <TouchableOpacity
                    style={styles.timeBtn}
                    onPress={() => openPicker(d.key, 'open_time')}
                    activeOpacity={0.7}
                  >
                    <Clock size={14} color="#FF6B00" strokeWidth={2} />
                    <Text style={[PP.label, { color: '#111827', fontSize: 13 }]}>{h.open_time}</Text>
                    <Text style={[PP.captionSM, { color: '#9CA3AF' }]}>Open</Text>
                  </TouchableOpacity>

                  <View style={styles.dash} />

                  <TouchableOpacity
                    style={styles.timeBtn}
                    onPress={() => openPicker(d.key, 'close_time')}
                    activeOpacity={0.7}
                  >
                    <Clock size={14} color="#6B7280" strokeWidth={2} />
                    <Text style={[PP.label, { color: '#111827', fontSize: 13 }]}>{h.close_time}</Text>
                    <Text style={[PP.captionSM, { color: '#9CA3AF' }]}>Close</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Inline time picker */}
              {pickerDay === d.key && (
                <View style={styles.picker}>
                  <Text style={[PP.label, { color: '#111827', fontSize: 13, marginBottom: 8 }]}>
                    Select {pickerField === 'open_time' ? 'Opening' : 'Closing'} Time
                  </Text>
                  <View style={styles.pickerControls}>
                    <TouchableOpacity
                      style={styles.pickerArrow}
                      onPress={() => {
                        const cur = hours[d.key][pickerField];
                        setDay(d.key, pickerField, prevTime(cur));
                      }}
                    >
                      <Text style={{ color: '#FF6B00', fontSize: 20 }}>‹</Text>
                    </TouchableOpacity>
                    <Text style={[PP.h3, { color: '#111827' }]}>{hours[d.key][pickerField]}</Text>
                    <TouchableOpacity
                      style={styles.pickerArrow}
                      onPress={() => {
                        const cur = hours[d.key][pickerField];
                        setDay(d.key, pickerField, nextTime(cur));
                      }}
                    >
                      <Text style={{ color: '#FF6B00', fontSize: 20 }}>›</Text>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity onPress={() => setPickerDay(null)} style={styles.pickerDone}>
                    <Text style={[PP.label, { color: '#FF6B00', fontSize: 13 }]}>Done</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        })}

        <PremiumButton
          label="Save Business Hours"
          onPress={handleSave}
          variant="primary"
          fullWidth
          isLoading={isLoading}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F8F9FB' },
  content: { padding: 20, gap: 10, paddingBottom: 40 },
  applyAllRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  applyAllBtn: { backgroundColor: '#FFF7ED', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1, borderColor: '#FFEDD5' },
  dayCard: {
    backgroundColor: '#FFFFFF', borderRadius: 14, padding: 14, gap: 10,
    borderWidth: 1, borderColor: '#F3F4F6',
  },
  dayCardClosed: { backgroundColor: '#FAFAFA' },
  dayHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  timesRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  timeBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#F9FAFB', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10,
    borderWidth: 1, borderColor: '#E5E7EB',
  },
  dash: { width: 16, height: 1.5, backgroundColor: '#D1D5DB' },
  picker: {
    backgroundColor: '#FFF7ED', borderRadius: 12, padding: 12,
    borderWidth: 1, borderColor: '#FFEDD5', alignItems: 'center',
  },
  pickerControls: { flexDirection: 'row', alignItems: 'center', gap: 24, marginBottom: 10 },
  pickerArrow: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  pickerDone: { paddingHorizontal: 16, paddingVertical: 6, backgroundColor: '#FF6B00', borderRadius: 8 },
});
