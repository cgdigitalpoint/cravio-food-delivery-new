// ─── Push Token Storage Architecture (Phase 15B) ─────────────────────────────
// Stores and retrieves device push tokens locally via AsyncStorage.
// No real token is registered, no SDK is called, no server is contacted.
//
// When a real provider is integrated (Phase 16+), call:
//   pushTokenStore.save(token)   after registerDevice() succeeds.
//   pushTokenStore.get()         before making any server calls.
//   pushTokenStore.clear()       on logout or device de-registration.

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { PushToken, PushProviderName } from '@/services/pushProvider';

// ── Storage key ───────────────────────────────────────────────────────────────

const STORAGE_KEY = '@cravio/push_token_v1';

// ── Stored record ─────────────────────────────────────────────────────────────

/**
 * The full record persisted for a device push token.
 * Extend with additional metadata fields as providers require them.
 */
export interface PushTokenRecord {
  /** The raw token value issued by the OS or vendor. */
  token: string;
  /** Which provider issued this token. */
  provider: PushProviderName;
  /** ISO-8601: when the token was first obtained. */
  obtainedAt: string;
  /** ISO-8601: when the token was last refreshed. Null if never refreshed. */
  refreshedAt: string | null;
  /** ISO-8601: when the token was last successfully synced to the backend. */
  syncedAt: string | null;
  /** Device identifier for correlation (platform + OS version). */
  deviceHint: string | null;
}

// ── Push Token Store ──────────────────────────────────────────────────────────

class PushTokenStoreManager {
  private _record: PushTokenRecord | null = null;
  private _loaded = false;

  // ── Persistence ────────────────────────────────────────────────────────────

  /** Load persisted token from AsyncStorage. Call once at startup. */
  async load(): Promise<void> {
    if (this._loaded) return;
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        this._record = JSON.parse(raw) as PushTokenRecord;
      }
    } catch {
      // Corrupt storage — start fresh
    }
    this._loaded = true;
  }

  private async _persist(): Promise<void> {
    if (this._record) {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(this._record)).catch(() => {});
    } else {
      await AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
    }
  }

  // ── CRUD ───────────────────────────────────────────────────────────────────

  /**
   * Save a push token obtained from a provider.
   * If a token already exists, it is overwritten and `refreshedAt` is updated.
   *
   * @param pushToken  PushToken returned by IPushProvider.registerDevice().
   * @param deviceHint Optional platform label (e.g. 'android/34' or 'ios/17').
   */
  async save(pushToken: PushToken, deviceHint?: string): Promise<PushTokenRecord> {
    await this.load();

    const existing = this._record;
    this._record = {
      token: pushToken.value,
      provider: pushToken.provider,
      obtainedAt: existing?.obtainedAt ?? pushToken.obtainedAt,
      refreshedAt: existing ? new Date().toISOString() : null,
      syncedAt: existing?.syncedAt ?? null,
      deviceHint: deviceHint ?? existing?.deviceHint ?? null,
    };

    await this._persist();
    return this._record;
  }

  /**
   * Return the stored token record, or null if no token has been saved.
   */
  async get(): Promise<PushTokenRecord | null> {
    await this.load();
    return this._record;
  }

  /**
   * Return just the raw token string, or null if none is stored.
   */
  async getTokenValue(): Promise<string | null> {
    const record = await this.get();
    return record?.token ?? null;
  }

  /**
   * True if a token is currently stored.
   */
  async has(): Promise<boolean> {
    const record = await this.get();
    return record !== null;
  }

  /**
   * Mark the token as synced to the backend at the current time.
   * Call this after successfully uploading the token to your server.
   */
  async markSynced(): Promise<void> {
    await this.load();
    if (this._record) {
      this._record.syncedAt = new Date().toISOString();
      await this._persist();
    }
  }

  /**
   * Delete the stored token.
   * Call on user logout or when the device de-registers from push.
   */
  async clear(): Promise<void> {
    this._record = null;
    this._loaded = false;
    await AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
  }

  // ── Debug helpers ──────────────────────────────────────────────────────────

  /**
   * Return a sanitised snapshot for logging.
   * The token value is truncated to avoid logging sensitive data.
   */
  async debugSnapshot(): Promise<Record<string, string | null | boolean>> {
    const record = await this.get();
    if (!record) return { present: false };
    return {
      present: true,
      provider: record.provider,
      tokenPrefix: record.token.slice(0, 8) + '…',
      obtainedAt: record.obtainedAt,
      refreshedAt: record.refreshedAt,
      syncedAt: record.syncedAt,
      deviceHint: record.deviceHint,
    };
  }
}

// ── Singleton export ──────────────────────────────────────────────────────────

export const pushTokenStore = new PushTokenStoreManager();
