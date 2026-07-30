// ─── Tracking Simulator (Phase 16 — Dev / Mock) ───────────────────────────────
// Simulates a delivery driver moving from the restaurant to the customer.
// No GPS, no WebSocket, no backend. All updates go through useTrackingStore.
//
// Phases and approximate timing (configurable via PHASE_DURATIONS_MS):
//   preparing   → 8 s   (driver at restaurant, food not ready)
//   picked_up   → 6 s   (driver picks up order, starts moving)
//   on_the_way  → 12 s  (driver moving toward customer)
//   nearby      → 6 s   (driver < 500 m away)
//   delivered   → 0 s   (arrived — simulation stops)
//
// Driver location is interpolated linearly between restaurant and customer
// at a configurable tick rate.

import type { Coordinates, TrackingPhase } from '@/types/tracking.types';
import { useTrackingStore } from '@/store/useTrackingStore';

// ── Configuration ─────────────────────────────────────────────────────────────

/** Duration (ms) spent in each phase before advancing to the next. */
const PHASE_DURATIONS_MS: Record<TrackingPhase, number> = {
  preparing: 8_000,
  picked_up: 6_000,
  on_the_way: 12_000,
  nearby: 6_000,
  delivered: 0,
};

/** ETA (minutes) at the start of each phase. */
const PHASE_ETA_MINUTES: Record<TrackingPhase, number> = {
  preparing: 30,
  picked_up: 22,
  on_the_way: 15,
  nearby: 5,
  delivered: 0,
};

/** Driver location update interval in ms. */
const TICK_MS = 500;

/** Ordered phase sequence. */
const PHASES: TrackingPhase[] = [
  'preparing',
  'picked_up',
  'on_the_way',
  'nearby',
  'delivered',
];

/** Progress fraction [0, 1] at which the driver starts moving. */
const DRIVER_MOVE_START_PHASE: TrackingPhase = 'picked_up';

// ── Interpolation helper ──────────────────────────────────────────────────────

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * Math.min(1, Math.max(0, t));
}

function interpolateCoords(
  origin: Coordinates,
  destination: Coordinates,
  t: number,
): Coordinates {
  return {
    latitude: lerp(origin.latitude, destination.latitude, t),
    longitude: lerp(origin.longitude, destination.longitude, t),
  };
}

// ── Simulator ─────────────────────────────────────────────────────────────────

class TrackingSimulatorService {
  private _phaseTimer: ReturnType<typeof setTimeout> | null = null;
  private _tickTimer: ReturnType<typeof setInterval> | null = null;
  private _currentPhaseIndex = 0;
  private _phaseStartTime = 0;
  private _origin: Coordinates = { latitude: 0, longitude: 0 };
  private _destination: Coordinates = { latitude: 0, longitude: 0 };
  private _running = false;

  // ── Public API ─────────────────────────────────────────────────────────────

  /**
   * Start the simulation between restaurant and customer coordinates.
   * Safe to call multiple times — stops any running simulation first.
   */
  start(restaurant: Coordinates, customer: Coordinates): void {
    this.stop();

    this._origin = restaurant;
    this._destination = customer;
    this._currentPhaseIndex = 0;
    this._running = true;

    const { setSimulating } = useTrackingStore.getState();
    setSimulating(true);

    this._enterPhase(0);
    this._startTick();
  }

  /** Stop the simulation and clear all timers. */
  stop(): void {
    this._running = false;

    if (this._phaseTimer) {
      clearTimeout(this._phaseTimer);
      this._phaseTimer = null;
    }

    if (this._tickTimer) {
      clearInterval(this._tickTimer);
      this._tickTimer = null;
    }

    useTrackingStore.getState().setSimulating(false);
  }

  get isRunning(): boolean {
    return this._running;
  }

  // ── Internal: phase management ─────────────────────────────────────────────

  private _enterPhase(index: number): void {
    if (!this._running) return;

    const phase = PHASES[index];
    if (!phase) return;

    this._currentPhaseIndex = index;
    this._phaseStartTime = Date.now();

    const { updatePhase } = useTrackingStore.getState();
    updatePhase(phase, PHASE_ETA_MINUTES[phase]);

    const duration = PHASE_DURATIONS_MS[phase];

    if (duration > 0) {
      this._phaseTimer = setTimeout(() => {
        this._enterPhase(index + 1);
      }, duration);
    } else {
      // delivered — stop
      this.stop();
    }
  }

  // ── Internal: location tick ────────────────────────────────────────────────

  private _startTick(): void {
    this._tickTimer = setInterval(() => {
      if (!this._running) return;

      const phase = PHASES[this._currentPhaseIndex];
      if (!phase) return;

      // Driver only moves from picked_up onwards
      const moveStartIndex = PHASES.indexOf(DRIVER_MOVE_START_PHASE);
      if (this._currentPhaseIndex < moveStartIndex) return;

      // Calculate overall progress fraction [0, 1] across all moving phases
      const movingPhases = PHASES.slice(moveStartIndex, PHASES.indexOf('delivered'));
      const totalMoveDuration = movingPhases.reduce(
        (sum, p) => sum + PHASE_DURATIONS_MS[p],
        0,
      );

      // Time elapsed since the driver started moving
      const elapsedBeforeCurrentPhase = movingPhases
        .slice(0, this._currentPhaseIndex - moveStartIndex)
        .reduce((sum, p) => sum + PHASE_DURATIONS_MS[p], 0);

      const elapsedInCurrentPhase = Date.now() - this._phaseStartTime;
      const totalElapsed = elapsedBeforeCurrentPhase + elapsedInCurrentPhase;

      const progress = totalMoveDuration > 0
        ? Math.min(1, totalElapsed / totalMoveDuration)
        : 1;

      // Add small jitter to simulate GPS noise
      const jitter = () => (Math.random() - 0.5) * 0.0002;
      const base = interpolateCoords(this._origin, this._destination, progress);
      const location: Coordinates = {
        latitude: base.latitude + jitter(),
        longitude: base.longitude + jitter(),
      };

      useTrackingStore.getState().updateDriverLocation(location);

      // Countdown ETA within a phase
      const phaseDuration = PHASE_DURATIONS_MS[phase];
      const phaseEtaStart = PHASE_ETA_MINUTES[phase];
      const nextPhase = PHASES[this._currentPhaseIndex + 1];
      const nextEta = nextPhase ? PHASE_ETA_MINUTES[nextPhase] : 0;
      const phaseProgress = phaseDuration > 0
        ? Math.min(1, elapsedInCurrentPhase / phaseDuration)
        : 1;
      const currentEta = Math.round(lerp(phaseEtaStart, nextEta, phaseProgress));
      useTrackingStore.getState().updateEta(currentEta);
    }, TICK_MS);
  }
}

// ── Singleton export ──────────────────────────────────────────────────────────

export const trackingSimulator = new TrackingSimulatorService();
