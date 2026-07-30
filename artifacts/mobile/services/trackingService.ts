// ─── Tracking Service (Phase 16) ──────────────────────────────────────────────
// Provider-independent tracking lifecycle manager.
// Wires the tracking simulator to the Zustand store.
// Swap the simulator for a real WebSocket / Supabase Realtime feed
// in a future phase without touching any screen or store.

import type { Coordinates, DriverInfo } from '@/types/tracking.types';
import { useTrackingStore } from '@/store/useTrackingStore';
import { trackingSimulator } from '@/utils/trackingSimulator';

// ── Mock driver pool ──────────────────────────────────────────────────────────

const MOCK_DRIVERS: DriverInfo[] = [
  {
    id: 'driver_001',
    name: 'Raj Kumar',
    phone: '+91 98765 43210',
    vehicleNumber: 'MH 02 AB 1234',
    vehicleType: 'bike',
    rating: 4.8,
    photoInitials: 'RK',
  },
  {
    id: 'driver_002',
    name: 'Priya Singh',
    phone: '+91 87654 32109',
    vehicleNumber: 'MH 03 CD 5678',
    vehicleType: 'scooter',
    rating: 4.9,
    photoInitials: 'PS',
  },
  {
    id: 'driver_003',
    name: 'Amit Sharma',
    phone: '+91 76543 21098',
    vehicleNumber: 'MH 04 EF 9012',
    vehicleType: 'bike',
    rating: 4.7,
    photoInitials: 'AS',
  },
];

function pickDriver(orderId: string): DriverInfo {
  const index = orderId.charCodeAt(0) % MOCK_DRIVERS.length;
  return MOCK_DRIVERS[index] ?? MOCK_DRIVERS[0]!;
}

// ── Coordinate helpers ────────────────────────────────────────────────────────

/**
 * Generate mock restaurant and customer coordinates.
 * Uses a small deterministic offset derived from the orderId
 * so different orders show slightly different map positions.
 */
function mockLocations(orderId: string): {
  restaurant: Coordinates;
  customer: Coordinates;
} {
  const seed = (orderId.charCodeAt(0) + orderId.charCodeAt(1 % orderId.length)) / 1000;

  const restaurant: Coordinates = {
    latitude: 40.7128 + seed * 0.01,
    longitude: -74.006 + seed * 0.005,
  };

  const customer: Coordinates = {
    latitude: restaurant.latitude + 0.007 + seed * 0.003,
    longitude: restaurant.longitude + 0.009 + seed * 0.002,
  };

  return { restaurant, customer };
}

// ── Tracking Service ──────────────────────────────────────────────────────────

class TrackingService {
  /**
   * Start tracking for an order.
   * Initialises the store, assigns a mock driver, and kicks off the simulator.
   *
   * @param orderId       The order to track.
   * @param restaurantName Display name shown in the tracking header.
   * @param deliveryAddress Formatted delivery address string.
   */
  start(orderId: string, restaurantName: string, deliveryAddress: string): void {
    const { startTracking } = useTrackingStore.getState();

    const { restaurant, customer } = mockLocations(orderId);
    const driver = pickDriver(orderId);

    // Initialise store
    startTracking({
      orderId,
      restaurantName,
      deliveryAddress,
      restaurantLocation: restaurant,
      customerLocation: customer,
      driver,
    });

    // Start mock simulator
    trackingSimulator.start(restaurant, customer);
  }

  /**
   * Stop tracking and clean up the simulator.
   */
  stop(): void {
    trackingSimulator.stop();
    useTrackingStore.getState().stopTracking();
  }

  /**
   * True when a tracking session is active.
   */
  get isActive(): boolean {
    return useTrackingStore.getState().isTracking;
  }
}

// ── Singleton export ──────────────────────────────────────────────────────────

export const trackingService = new TrackingService();
