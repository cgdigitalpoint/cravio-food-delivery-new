// ─── Tracking Store (Zustand — Phase 16) ─────────────────────────────────────
// In-memory tracking state. Not persisted — tracking restarts fresh each session.
// The simulator or a future real-time provider updates this store.

import { create } from 'zustand';
import type {
  Coordinates,
  DriverInfo,
  ETA,
  TrackingPhase,
  TrackingRoute,
} from '@/types/tracking.types';

// ── State ─────────────────────────────────────────────────────────────────────

export interface TrackingStoreState {
  // ── Tracking session ──────────────────────────────────────────────────────
  orderId: string | null;
  isTracking: boolean;
  isSimulating: boolean;

  // ── Phase & timing ────────────────────────────────────────────────────────
  phase: TrackingPhase;
  eta: ETA;

  // ── Locations ─────────────────────────────────────────────────────────────
  restaurantLocation: Coordinates;
  customerLocation: Coordinates;
  driverLocation: Coordinates;

  // ── Route ─────────────────────────────────────────────────────────────────
  route: TrackingRoute | null;

  // ── Driver ────────────────────────────────────────────────────────────────
  driver: DriverInfo | null;

  // ── Metadata ──────────────────────────────────────────────────────────────
  restaurantName: string;
  deliveryAddress: string;

  // ── Error ─────────────────────────────────────────────────────────────────
  error: string | null;

  // ── Actions ───────────────────────────────────────────────────────────────
  startTracking: (params: {
    orderId: string;
    restaurantName: string;
    deliveryAddress: string;
    restaurantLocation: Coordinates;
    customerLocation: Coordinates;
    driver: DriverInfo;
  }) => void;

  stopTracking: () => void;

  updateDriverLocation: (location: Coordinates) => void;
  updatePhase: (phase: TrackingPhase, etaMinutes: number) => void;
  updateEta: (minutes: number) => void;
  setRoute: (route: TrackingRoute) => void;
  setSimulating: (active: boolean) => void;
  setError: (error: string | null) => void;
}

// ── Default coordinates (NYC — MAP_CONFIG defaults) ───────────────────────────

const DEFAULT_RESTAURANT: Coordinates = { latitude: 40.7128, longitude: -74.006 };
const DEFAULT_CUSTOMER: Coordinates = { latitude: 40.7200, longitude: -73.995 };

// ── Store ─────────────────────────────────────────────────────────────────────

export const useTrackingStore = create<TrackingStoreState>((set) => ({
  orderId: null,
  isTracking: false,
  isSimulating: false,

  phase: 'preparing',
  eta: { minutes: 30, updatedAt: new Date().toISOString() },

  restaurantLocation: DEFAULT_RESTAURANT,
  customerLocation: DEFAULT_CUSTOMER,
  driverLocation: DEFAULT_RESTAURANT,

  route: null,
  driver: null,

  restaurantName: '',
  deliveryAddress: '',
  error: null,

  startTracking: (params) => {
    set({
      orderId: params.orderId,
      isTracking: true,
      error: null,
      phase: 'preparing',
      eta: { minutes: 30, updatedAt: new Date().toISOString() },
      restaurantLocation: params.restaurantLocation,
      customerLocation: params.customerLocation,
      driverLocation: params.restaurantLocation,
      driver: params.driver,
      restaurantName: params.restaurantName,
      deliveryAddress: params.deliveryAddress,
      route: {
        origin: params.restaurantLocation,
        destination: params.customerLocation,
        waypoints: [],
      },
    });
  },

  stopTracking: () => {
    set({
      isTracking: false,
      isSimulating: false,
      orderId: null,
      driver: null,
      route: null,
      error: null,
    });
  },

  updateDriverLocation: (location) => {
    set({ driverLocation: location });
  },

  updatePhase: (phase, etaMinutes) => {
    set({
      phase,
      eta: { minutes: etaMinutes, updatedAt: new Date().toISOString() },
    });
  },

  updateEta: (minutes) => {
    set({ eta: { minutes, updatedAt: new Date().toISOString() } });
  },

  setRoute: (route) => {
    set({ route });
  },

  setSimulating: (active) => {
    set({ isSimulating: active });
  },

  setError: (error) => {
    set({ error });
  },
}));
