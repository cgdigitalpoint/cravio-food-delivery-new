// ─── Notification Router (Phase 15B) ─────────────────────────────────────────
// Routes incoming push payloads to the correct in-app handler.
// No actual push delivery — routing architecture only.
//
// When a real provider fires a push tap callback (future phase), call:
//   notificationRouter.route(rawData, router);
//
// The router:
//   1. Parses the raw payload via pushPayloadParser.
//   2. Dispatches the notification into the Zustand store.
//   3. Navigates to the correct screen using navigateDeepLink.

import type { Router } from 'expo-router';
import { parsePushPayload, type RawPushData, type ParsedPushPayload } from '@/utils/pushPayloadParser';
import { navigateDeepLink } from '@/utils/deepLinks';
import { useNotificationStore } from '@/store/useNotificationStore';
import type { NotificationType, NotificationCategory } from '@/store/useNotificationStore';

// ── Route result ──────────────────────────────────────────────────────────────

/** Result returned by notificationRouter.route(). */
export interface NotificationRouteResult {
  /** True if the payload was parsed and dispatched successfully. */
  handled: boolean;
  /** The parsed payload (for logging / debugging). */
  parsed: ParsedPushPayload;
  /** The deep-link string that was (or would be) navigated to. */
  deepLink: string;
  /** True if navigation was performed (requires router argument). */
  navigated: boolean;
}

// ── Route handler type ────────────────────────────────────────────────────────

/**
 * A handler receives a fully-parsed push payload.
 * Handlers may perform side-effects (analytics, custom logic) but must NOT
 * call router.push() — navigation is always performed by the router itself.
 */
export type NotificationRouteHandler = (payload: ParsedPushPayload) => void | Promise<void>;

// ── Router ────────────────────────────────────────────────────────────────────

class NotificationRouterService {
  private _handlers: NotificationRouteHandler[] = [];

  // ── Handler registration ───────────────────────────────────────────────────

  /**
   * Register a side-effect handler that runs on every routed payload.
   * Handlers are called in registration order before navigation.
   *
   * Example — analytics:
   *   notificationRouter.addHandler((payload) => {
   *     analytics.track('push_tapped', { kind: payload.kind });
   *   });
   */
  addHandler(handler: NotificationRouteHandler): void {
    this._handlers.push(handler);
  }

  /**
   * Remove a previously registered handler (useful in component cleanup).
   */
  removeHandler(handler: NotificationRouteHandler): void {
    this._handlers = this._handlers.filter((h) => h !== handler);
  }

  // ── Routing ────────────────────────────────────────────────────────────────

  /**
   * Route a raw push notification payload.
   *
   * Steps:
   *  1. Parse raw data → typed ParsedPushPayload.
   *  2. Dispatch into the Zustand notification store (shows in Notification Center).
   *  3. Run registered side-effect handlers.
   *  4. Navigate via Expo Router (if router is provided).
   *
   * @param rawData  Raw data map from the push provider tap callback.
   * @param router   Expo Router instance from useRouter(). Omit to skip navigation.
   * @returns        NotificationRouteResult for logging / testing.
   */
  async route(rawData: RawPushData, router?: Router): Promise<NotificationRouteResult> {
    const parsed = parsePushPayload(rawData);

    // 1. Dispatch into store
    this._dispatchToStore(parsed);

    // 2. Run side-effect handlers
    for (const handler of this._handlers) {
      try {
        await handler(parsed);
      } catch {
        // Handler errors must not block navigation
      }
    }

    // 3. Navigate
    let navigated = false;
    if (router) {
      navigated = navigateDeepLink(router, parsed.deepLink);
    }

    return {
      handled: true,
      parsed,
      deepLink: parsed.deepLink,
      navigated,
    };
  }

  /**
   * Route a foreground push payload (app is open).
   * Foreground payloads are added to the store but do NOT navigate automatically —
   * they appear in the Notification Center bell badge instead.
   *
   * @param rawData  Raw data map from the push provider foreground listener.
   */
  async routeForeground(rawData: RawPushData): Promise<NotificationRouteResult> {
    const parsed = parsePushPayload(rawData);

    this._dispatchToStore(parsed);

    for (const handler of this._handlers) {
      try {
        await handler(parsed);
      } catch {}
    }

    return {
      handled: true,
      parsed,
      deepLink: parsed.deepLink,
      navigated: false, // foreground: no auto-navigation
    };
  }

  // ── Store dispatch ─────────────────────────────────────────────────────────

  private _dispatchToStore(parsed: ParsedPushPayload): void {
    const { addNotification } = useNotificationStore.getState();

    const type = parsed.notificationType as NotificationType;
    const category = parsed.category as NotificationCategory;

    addNotification({
      type,
      category,
      title: parsed.title,
      message: parsed.body,
      deepLink: parsed.deepLink,
    });
  }
}

// ── Singleton export ──────────────────────────────────────────────────────────

export const notificationRouter = new NotificationRouterService();
