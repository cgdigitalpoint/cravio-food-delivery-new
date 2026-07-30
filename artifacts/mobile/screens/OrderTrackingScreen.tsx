// ─── Order Tracking Screen (Phase 16) ────────────────────────────────────────
// Live order tracking: map with restaurant/driver/customer markers,
// delivery status timeline, driver info, ETA, and action buttons.
// All locations are mock — no real GPS or backend required.

import React, { useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  MessageCircle,
  Navigation,
  Phone,
  Star,
} from 'lucide-react-native';
import { useColors } from '@/hooks/useColors';
import { PP } from '@/theme/poppins';
import { borderRadius, spacing } from '@/theme';
import { useTrackingStore } from '@/store/useTrackingStore';
import { trackingService } from '@/services/trackingService';
import { useOrderStore } from '@/store/useOrderStore';
import {
  TRACKING_PHASE_DESCRIPTIONS,
  TRACKING_PHASE_LABELS,
  TRACKING_PHASES,
} from '@/types/tracking.types';
import type { TrackingPhase } from '@/types/tracking.types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const MAP_HEIGHT = SCREEN_WIDTH * 0.75;

// ── Phase colour mapping ───────────────────────────────────────────────────────

const PHASE_COLORS: Record<TrackingPhase, string> = {
  preparing: '#F59E0B',
  picked_up: '#3B82F6',
  on_the_way: '#8B5CF6',
  nearby: '#FF6B00',
  delivered: '#10B981',
};

// ── Props ─────────────────────────────────────────────────────────────────────

export interface OrderTrackingScreenProps {
  orderId: string;
  onBack?: () => void;
}

// ── Sub-components ────────────────────────────────────────────────────────────

function EtaChip({ minutes, phase }: { minutes: number; phase: TrackingPhase }) {
  const colors = useColors();
  const phaseColor = PHASE_COLORS[phase];
  const label =
    phase === 'delivered'
      ? 'Delivered!'
      : phase === 'preparing'
      ? `~${minutes} min`
      : `${minutes} min away`;

  return (
    <View style={[styles.etaChip, { backgroundColor: phaseColor + '18' }]}>
      <Clock size={13} color={phaseColor} />
      <Text
        style={[PP.caption, { color: phaseColor, fontFamily: 'Poppins_600SemiBold', marginLeft: 4 }]}
      >
        {label}
      </Text>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Screen
// ─────────────────────────────────────────────────────────────────────────────

export function OrderTrackingScreen({ orderId, onBack }: OrderTrackingScreenProps) {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const mapRef = useRef<MapView>(null);

  // Store state
  const {
    isTracking,
    phase,
    eta,
    driverLocation,
    restaurantLocation,
    customerLocation,
    driver,
    restaurantName,
    deliveryAddress,
    error,
  } = useTrackingStore();

  const { selectedOrder, fetchOrderById } = useOrderStore();

  // Load order and start tracking on mount
  useEffect(() => {
    fetchOrderById(orderId);
  }, [orderId]);

  useEffect(() => {
    if (!selectedOrder || selectedOrder.id !== orderId) return;
    if (isTracking) return; // already tracking

    const name = selectedOrder.restaurant_name ?? 'Restaurant';
    const addr = selectedOrder.address_id
      ? 'Your delivery address'
      : 'Saved address';

    trackingService.start(orderId, name, addr);

    return () => {
      trackingService.stop();
    };
  }, [selectedOrder?.id]);

  // Animate map to fit all markers whenever driver location changes
  useEffect(() => {
    if (!mapRef.current || !isTracking) return;
    mapRef.current.fitToCoordinates(
      [restaurantLocation, driverLocation, customerLocation],
      { edgePadding: { top: 60, right: 60, bottom: 60, left: 60 }, animated: true },
    );
  }, [driverLocation.latitude, driverLocation.longitude]);

  const phaseColor = PHASE_COLORS[phase];
  const phaseIndex = TRACKING_PHASES.indexOf(phase);

  // ── Error state ──────────────────────────────────────────────────────────

  if (error) {
    return (
      <View style={[styles.screen, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { paddingTop: insets.top + 8, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={onBack} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
            <View style={[styles.backBtn, { backgroundColor: colors.muted }]}>
              <ArrowLeft size={20} color={colors.foreground} strokeWidth={2} />
            </View>
          </TouchableOpacity>
          <Text style={[PP.h3, { color: colors.foreground }]}>Track Order</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.centered}>
          <Navigation size={36} color={colors.mutedForeground} />
          <Text style={[PP.label, { color: colors.mutedForeground, marginTop: 12 }]}>
            {error}
          </Text>
        </View>
      </View>
    );
  }

  // ── Loading state ─────────────────────────────────────────────────────────

  if (!isTracking) {
    return (
      <View style={[styles.screen, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { paddingTop: insets.top + 8, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={onBack} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
            <View style={[styles.backBtn, { backgroundColor: colors.muted }]}>
              <ArrowLeft size={20} color={colors.foreground} strokeWidth={2} />
            </View>
          </TouchableOpacity>
          <Text style={[PP.h3, { color: colors.foreground }]}>Track Order</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[PP.caption, { color: colors.mutedForeground, marginTop: 12 }]}>
            Connecting to tracking…
          </Text>
        </View>
      </View>
    );
  }

  // ── Main UI ───────────────────────────────────────────────────────────────

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      {/* ── Header ── */}
      <Animated.View
        entering={FadeInDown.duration(300)}
        style={[
          styles.header,
          {
            paddingTop: insets.top + 8,
            backgroundColor: colors.card,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <TouchableOpacity onPress={onBack} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <View style={[styles.backBtn, { backgroundColor: colors.muted }]}>
            <ArrowLeft size={20} color={colors.foreground} strokeWidth={2} />
          </View>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={[PP.title, { color: colors.foreground }]} numberOfLines={1}>
            {restaurantName || 'Tracking Order'}
          </Text>
          <EtaChip minutes={eta.minutes} phase={phase} />
        </View>
        <View style={{ width: 40 }} />
      </Animated.View>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
      >
        {/* ── Map ── */}
        <View style={[styles.mapContainer, { height: MAP_HEIGHT }]}>
          <MapView
            ref={mapRef}
            style={StyleSheet.absoluteFillObject}
            provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
            initialRegion={{
              latitude: driverLocation.latitude,
              longitude: driverLocation.longitude,
              latitudeDelta: 0.025,
              longitudeDelta: 0.025,
            }}
            showsCompass={false}
            showsScale={false}
            showsMyLocationButton={false}
            moveOnMarkerPress={false}
          >
            {/* Restaurant marker */}
            <Marker
              coordinate={restaurantLocation}
              title={restaurantName || 'Restaurant'}
              description="Order pickup point"
              pinColor="#FF6B00"
            />

            {/* Customer marker */}
            <Marker
              coordinate={customerLocation}
              title="Your Location"
              description={deliveryAddress || 'Delivery destination'}
              pinColor="#16A34A"
            />

            {/* Driver marker */}
            <Marker
              coordinate={driverLocation}
              title={driver?.name ?? 'Delivery Partner'}
              description={driver?.vehicleNumber ?? ''}
              pinColor="#3B82F6"
            />

            {/* Route line: restaurant → driver */}
            {phase !== 'preparing' && (
              <Polyline
                coordinates={[restaurantLocation, driverLocation]}
                strokeColor="#3B82F6"
                strokeWidth={3}
                lineDashPattern={[8, 4]}
              />
            )}

            {/* Route line: driver → customer */}
            <Polyline
              coordinates={[driverLocation, customerLocation]}
              strokeColor={colors.border}
              strokeWidth={2}
              lineDashPattern={[4, 6]}
            />
          </MapView>

          {/* Map legend */}
          <View style={[styles.mapLegend, { backgroundColor: colors.card + 'EE' }]}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#FF6B00' }]} />
              <Text style={[PP.caption, { color: colors.foreground, fontSize: 10 }]}>Restaurant</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#3B82F6' }]} />
              <Text style={[PP.caption, { color: colors.foreground, fontSize: 10 }]}>Rider</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#16A34A' }]} />
              <Text style={[PP.caption, { color: colors.foreground, fontSize: 10 }]}>You</Text>
            </View>
          </View>
        </View>

        {/* ── Current phase banner ── */}
        <Animated.View entering={FadeInDown.delay(60).duration(300)}>
          <View style={[styles.phaseBanner, { backgroundColor: phaseColor + '15', borderColor: phaseColor + '40' }]}>
            <View style={[styles.phaseDot, { backgroundColor: phaseColor }]} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={[PP.label, { color: phaseColor }]}>
                {TRACKING_PHASE_LABELS[phase]}
              </Text>
              <Text style={[PP.caption, { color: phaseColor + 'CC', marginTop: 2 }]}>
                {TRACKING_PHASE_DESCRIPTIONS[phase]}
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* ── Status timeline ── */}
        <Animated.View entering={FadeInDown.delay(120).duration(300)}>
          <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[PP.overline, { color: colors.mutedForeground, marginBottom: spacing.md12, letterSpacing: 0.8 }]}>
              DELIVERY TIMELINE
            </Text>

            {TRACKING_PHASES.filter((p) => p !== 'delivered' || phase === 'delivered').map((p, idx) => {
              const done = TRACKING_PHASES.indexOf(p) < phaseIndex;
              const active = p === phase;
              const pColor = PHASE_COLORS[p];
              const isLast = idx === TRACKING_PHASES.length - 1;

              return (
                <View key={p} style={styles.timelineStep}>
                  {/* Dot + connector */}
                  <View style={styles.timelineLeft}>
                    <View
                      style={[
                        styles.timelineDot,
                        {
                          backgroundColor: done || active ? pColor : colors.muted,
                          borderColor: done || active ? pColor : colors.border,
                        },
                      ]}
                    >
                      {done && <CheckCircle2 size={12} color="#fff" strokeWidth={2.5} />}
                      {active && <View style={styles.timelinePulse} />}
                    </View>
                    {!isLast && (
                      <View
                        style={[
                          styles.timelineLine,
                          { backgroundColor: done ? pColor : colors.border },
                        ]}
                      />
                    )}
                  </View>

                  {/* Label */}
                  <View style={[styles.timelineRight, !isLast && { paddingBottom: 18 }]}>
                    <Text
                      style={[
                        PP.bodySM,
                        {
                          color: done || active ? colors.foreground : colors.mutedForeground,
                          fontFamily: active ? 'Poppins_600SemiBold' : 'Poppins_400Regular',
                        },
                      ]}
                    >
                      {TRACKING_PHASE_LABELS[p]}
                    </Text>
                    {active && (
                      <Text style={[PP.caption, { color: pColor, marginTop: 2 }]}>
                        {TRACKING_PHASE_DESCRIPTIONS[p]}
                      </Text>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        </Animated.View>

        {/* ── Delivery address ── */}
        <Animated.View entering={FadeInDown.delay(180).duration(300)}>
          <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[PP.overline, { color: colors.mutedForeground, marginBottom: spacing.md12, letterSpacing: 0.8 }]}>
              DELIVERING TO
            </Text>
            <View style={styles.addressRow}>
              <View style={[styles.addressIcon, { backgroundColor: `${colors.secondary}18` }]}>
                <Navigation size={16} color={colors.secondary} />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={[PP.label, { color: colors.foreground }]}>
                  {deliveryAddress || 'Your delivery address'}
                </Text>
                <Text style={[PP.caption, { color: colors.mutedForeground, marginTop: 2 }]}>
                  {restaurantName ? `From ${restaurantName}` : 'Order en route'}
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* ── Driver info ── */}
        {driver && (
          <Animated.View entering={FadeInDown.delay(240).duration(300)}>
            <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[PP.overline, { color: colors.mutedForeground, marginBottom: spacing.md12, letterSpacing: 0.8 }]}>
                YOUR DELIVERY PARTNER
              </Text>

              <View style={styles.driverRow}>
                {/* Avatar */}
                <View style={[styles.driverAvatar, { backgroundColor: `${colors.primary}20` }]}>
                  <Text style={[PP.title, { color: colors.primary }]}>
                    {driver.photoInitials}
                  </Text>
                </View>

                {/* Info */}
                <View style={{ flex: 1, marginLeft: 14 }}>
                  <Text style={[PP.label, { color: colors.foreground }]}>
                    {driver.name}
                  </Text>
                  <View style={styles.driverMeta}>
                    <Star size={12} color="#F59E0B" fill="#F59E0B" />
                    <Text style={[PP.caption, { color: colors.mutedForeground, marginLeft: 3 }]}>
                      {driver.rating.toFixed(1)}
                    </Text>
                    <Text style={[PP.caption, { color: colors.mutedForeground, marginLeft: 8 }]}>
                      · {driver.vehicleNumber}
                    </Text>
                  </View>
                  <Text style={[PP.caption, { color: colors.mutedForeground, marginTop: 2, textTransform: 'capitalize' }]}>
                    {driver.vehicleType}
                  </Text>
                </View>

                {/* Action buttons */}
                <View style={styles.driverActions}>
                  <TouchableOpacity
                    disabled
                    style={[styles.driverActionBtn, { backgroundColor: colors.muted, opacity: 0.5 }]}
                    accessibilityLabel="Call driver (not available)"
                  >
                    <Phone size={16} color={colors.mutedForeground} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    disabled
                    style={[styles.driverActionBtn, { backgroundColor: colors.muted, opacity: 0.5, marginTop: 6 }]}
                    accessibilityLabel="Chat with driver (not available)"
                  >
                    <MessageCircle size={16} color={colors.mutedForeground} />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Placeholder note */}
              <Text style={[PP.caption, { color: colors.mutedForeground, marginTop: 10, fontStyle: 'italic' }]}>
                Call and chat will be enabled in a future update.
              </Text>
            </View>
          </Animated.View>
        )}

        {/* ── Restaurant info ── */}
        <Animated.View entering={FadeInDown.delay(300).duration(300)}>
          <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[PP.overline, { color: colors.mutedForeground, marginBottom: spacing.md12, letterSpacing: 0.8 }]}>
              RESTAURANT
            </Text>
            <View style={styles.addressRow}>
              <View style={[styles.addressIcon, { backgroundColor: `${colors.primary}18` }]}>
                <Text style={{ fontSize: 16 }}>🍽</Text>
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={[PP.label, { color: colors.foreground }]}>
                  {restaurantName || '—'}
                </Text>
                <Text style={[PP.caption, { color: colors.mutedForeground, marginTop: 2 }]}>
                  Pickup location
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: { flex: 1 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    zIndex: 10,
  },
  headerCenter: { flex: 1, alignItems: 'center', marginHorizontal: 8, gap: 4 },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  scroll: { flex: 1 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },

  // Map
  mapContainer: { overflow: 'hidden' },
  mapLegend: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: 'row',
    gap: 10,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },

  // Phase banner
  phaseBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    padding: spacing.md12,
  },
  phaseDot: { width: 12, height: 12, borderRadius: 6 },

  // Section
  section: {
    margin: spacing.md,
    marginBottom: 0,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    padding: spacing.md,
  },

  // Timeline
  timelineStep: { flexDirection: 'row' },
  timelineLeft: { alignItems: 'center', width: 24 },
  timelineDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelinePulse: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#fff' },
  timelineLine: { width: 2, flex: 1, minHeight: 18, marginTop: 2 },
  timelineRight: { flex: 1, paddingLeft: 14, paddingTop: 2 },

  // ETA chip
  etaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },

  // Address row
  addressRow: { flexDirection: 'row', alignItems: 'center' },
  addressIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  // Driver
  driverRow: { flexDirection: 'row', alignItems: 'center' },
  driverAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  driverMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 3 },
  driverActions: { flexShrink: 0 },
  driverActionBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
