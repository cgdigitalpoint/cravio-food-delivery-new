// ─── Tracking Types (Phase 16) ────────────────────────────────────────────────
// Location models for the live order tracking feature.
// Provider-independent: works with mock data now, real GPS in a future phase.

// ── Coordinates ───────────────────────────────────────────────────────────────

/** A geographic coordinate pair. */
export interface Coordinates {
  latitude: number;
  longitude: number;
}

// ── Driver ────────────────────────────────────────────────────────────────────

export type VehicleType = 'bike' | 'scooter' | 'car';

/** Delivery driver information. Placeholder data until backend is wired. */
export interface DriverInfo {
  id: string;
  name: string;
  phone: string;
  vehicleNumber: string;
  vehicleType: VehicleType;
  /** Star rating 1–5 */
  rating: number;
  /** Two-letter initials for avatar fallback */
  photoInitials: string;
}

// ── Tracking Phase ────────────────────────────────────────────────────────────

/**
 * Ordered delivery lifecycle phases.
 * Maps to OrderStatus but isolated so tracking can evolve independently.
 */
export type TrackingPhase =
  | 'preparing'
  | 'picked_up'
  | 'on_the_way'
  | 'nearby'
  | 'delivered';

/** Human-readable labels for each phase. */
export const TRACKING_PHASE_LABELS: Record<TrackingPhase, string> = {
  preparing: 'Preparing Your Order',
  picked_up: 'Order Picked Up',
  on_the_way: 'On the Way',
  nearby: 'Almost There',
  delivered: 'Delivered',
};

export const TRACKING_PHASE_DESCRIPTIONS: Record<TrackingPhase, string> = {
  preparing: 'The restaurant is cooking your food',
  picked_up: 'Your rider has collected the order',
  on_the_way: 'Your rider is heading to you',
  nearby: 'Your rider is less than 5 minutes away',
  delivered: 'Your order has been delivered. Enjoy!',
};

/** Ordered array for timeline rendering. */
export const TRACKING_PHASES: TrackingPhase[] = [
  'preparing',
  'picked_up',
  'on_the_way',
  'nearby',
  'delivered',
];

// ── ETA ───────────────────────────────────────────────────────────────────────

/** Estimated time of arrival. */
export interface ETA {
  /** Remaining minutes. 0 = delivered. */
  minutes: number;
  /** ISO-8601 timestamp of last update. */
  updatedAt: string;
}

// ── Route ─────────────────────────────────────────────────────────────────────

/** A delivery route from restaurant to customer. */
export interface TrackingRoute {
  origin: Coordinates;
  destination: Coordinates;
  /** Intermediate waypoints for route rendering. */
  waypoints: Coordinates[];
}

// ── Full Tracking State ───────────────────────────────────────────────────────

/** Complete snapshot of live order tracking. */
export interface TrackingSnapshot {
  orderId: string;
  phase: TrackingPhase;
  driver: DriverInfo;
  restaurantLocation: Coordinates;
  customerLocation: Coordinates;
  driverLocation: Coordinates;
  eta: ETA;
  route: TrackingRoute;
  restaurantName: string;
  deliveryAddress: string;
}
