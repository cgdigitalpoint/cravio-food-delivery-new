// ─── Notification Permission Manager (Phase 15B) ─────────────────────────────
// Tracks notification permission state and exposes a clean API for requesting
// permission and handling denied / granted states.
//
// No push provider is coupled here — the manager is provider-independent.
// A real provider (Expo, FCM, OneSignal) will call permissionManager.request()
// and read permissionManager.getStatus() before registering a device token.
//
// Usage:
//   const granted = await permissionManager.request();
//   if (!granted) permissionManager.openSettings();

import { Linking, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ── Permission Status ──────────────────────────────────────────────────────────

/**
 * Mirrors the native permission states across iOS and Android.
 * Map provider-specific enums to this type at the provider boundary.
 */
export type NotificationPermissionStatus =
  | 'undetermined'  // User has not yet been asked
  | 'granted'       // User allowed notifications
  | 'denied'        // User denied (soft — can be re-requested on Android)
  | 'blocked';      // User permanently denied (iOS: must go to Settings)

// ── Persistence key ───────────────────────────────────────────────────────────

const STORAGE_KEY = '@cravio/notification_permission_v1';

interface PersistedPermissionState {
  status: NotificationPermissionStatus;
  requestedAt: string | null;   // ISO-8601, null if never requested
  deniedAt: string | null;      // ISO-8601, null if never denied
  grantedAt: string | null;     // ISO-8601, null if never granted
}

// ── Permission Manager ────────────────────────────────────────────────────────

class NotificationPermissionManager {
  private _status: NotificationPermissionStatus = 'undetermined';
  private _requestedAt: string | null = null;
  private _deniedAt: string | null = null;
  private _grantedAt: string | null = null;
  private _loaded = false;

  // ── State accessors ────────────────────────────────────────────────────────

  /** Current permission status (cached in memory). */
  getStatus(): NotificationPermissionStatus {
    return this._status;
  }

  /** True when the user has explicitly granted permission. */
  isGranted(): boolean {
    return this._status === 'granted';
  }

  /**
   * True when the user has denied permission.
   * On iOS this is permanent (blocked); on Android they can be re-prompted.
   */
  isDenied(): boolean {
    return this._status === 'denied' || this._status === 'blocked';
  }

  /**
   * True when the user permanently blocked notifications.
   * The only resolution is to open OS Settings.
   */
  isBlocked(): boolean {
    return this._status === 'blocked';
  }

  /** True when the user has not yet been prompted. */
  isUndetermined(): boolean {
    return this._status === 'undetermined';
  }

  // ── Persistence ────────────────────────────────────────────────────────────

  /** Load permission state from AsyncStorage. Call once at startup. */
  async load(): Promise<void> {
    if (this._loaded) return;
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const state = JSON.parse(raw) as PersistedPermissionState;
        this._status = state.status ?? 'undetermined';
        this._requestedAt = state.requestedAt ?? null;
        this._deniedAt = state.deniedAt ?? null;
        this._grantedAt = state.grantedAt ?? null;
      }
    } catch {
      // Corrupt storage — start fresh
    }
    this._loaded = true;
  }

  private async _persist(): Promise<void> {
    const state: PersistedPermissionState = {
      status: this._status,
      requestedAt: this._requestedAt,
      deniedAt: this._deniedAt,
      grantedAt: this._grantedAt,
    };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {});
  }

  // ── Request permission ─────────────────────────────────────────────────────

  /**
   * Request OS notification permission.
   *
   * In Phase 15B this is a placeholder — it records intent but does NOT
   * call any OS dialog. When a real provider is integrated, call its
   * permission API here and pass the result to `applyProviderStatus()`.
   *
   * @returns true if permission is (or was already) granted, false otherwise.
   */
  async request(): Promise<boolean> {
    await this.load();

    this._requestedAt = new Date().toISOString();

    // ── Placeholder: simulate "granted" for development ───────────────────
    // Replace this block with the real OS permission call in Phase 16:
    //   const { status } = await Notifications.requestPermissionsAsync();
    //   this.applyProviderStatus(status === 'granted' ? 'granted' : 'denied');
    if (this._status === 'undetermined') {
      this._status = 'granted';
      this._grantedAt = new Date().toISOString();
    }
    // ─────────────────────────────────────────────────────────────────────

    await this._persist();
    return this._status === 'granted';
  }

  /**
   * Apply a status string coming from a real push provider SDK.
   * Call this after receiving the result of the OS permission dialog.
   *
   * @param providerStatus  Status string from the provider (mapped to our enum).
   */
  applyProviderStatus(providerStatus: NotificationPermissionStatus): void {
    this._status = providerStatus;
    const now = new Date().toISOString();
    if (providerStatus === 'granted') this._grantedAt = now;
    if (providerStatus === 'denied' || providerStatus === 'blocked') this._deniedAt = now;
    this._persist().catch(() => {});
  }

  // ── Open Settings ──────────────────────────────────────────────────────────

  /**
   * Open the OS notification settings for this app.
   * Call when permission is denied/blocked so the user can re-enable.
   *
   * On iOS: opens Settings → Notifications → Cravio.
   * On Android: opens App Info → Notifications.
   */
  async openSettings(): Promise<void> {
    if (Platform.OS === 'ios') {
      await Linking.openURL('app-settings:').catch(() => {});
    } else {
      await Linking.openSettings().catch(() => {});
    }
  }

  // ── Debug helpers ──────────────────────────────────────────────────────────

  /** Return a snapshot of the full permission state (for logging / debug UI). */
  snapshot(): PersistedPermissionState {
    return {
      status: this._status,
      requestedAt: this._requestedAt,
      deniedAt: this._deniedAt,
      grantedAt: this._grantedAt,
    };
  }

  /** Reset state (dev / test use only). */
  async reset(): Promise<void> {
    this._status = 'undetermined';
    this._requestedAt = null;
    this._deniedAt = null;
    this._grantedAt = null;
    this._loaded = false;
    await AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
  }
}

// ── Singleton export ──────────────────────────────────────────────────────────

export const permissionManager = new NotificationPermissionManager();
