// ─── Notification Center Screen (Phase 15A) ───────────────────────────────────
import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  AlertCircle,
  ArrowLeft,
  Bell,
  BellOff,
  CheckCheck,
  Gift,
  Heart,
  Megaphone,
  Package,
  RefreshCw,
  Settings,
  Shield,
  Trash2,
  User,
  X,
  Zap,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useColors } from '@/hooks/useColors';
import { PP } from '@/theme/poppins';
import { useNotificationStore } from '@/store/useNotificationStore';
import type { CravioNotification, NotificationCategory } from '@/store/useNotificationStore';
import { navigateDeepLink } from '@/utils/deepLinks';

// ── Dev-only simulator (tree-shaken in production by bundler) ─────────────────
// eslint-disable-next-line @typescript-eslint/no-var-requires
const IS_DEV = __DEV__;

// ── Relative time ─────────────────────────────────────────────────────────────

function relativeTime(isoString: string): string {
  const now = Date.now();
  const then = new Date(isoString).getTime();
  const diff = Math.floor((now - then) / 1000); // seconds

  if (diff < 60) return 'Just now';
  if (diff < 3600) {
    const m = Math.floor(diff / 60);
    return `${m}m ago`;
  }
  if (diff < 86400) {
    const h = Math.floor(diff / 3600);
    return `${h}h ago`;
  }
  if (diff < 604800) {
    const d = Math.floor(diff / 86400);
    return `${d}d ago`;
  }
  return new Date(isoString).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

// ── Category filter tabs ──────────────────────────────────────────────────────

type TabKey = 'all' | NotificationCategory;

const TABS: { key: TabKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'order', label: 'Orders' },
  { key: 'offer', label: 'Offers' },
  { key: 'promotion', label: 'Promos' },
  { key: 'account', label: 'Account' },
  { key: 'donation', label: 'Donations' },
  { key: 'system', label: 'System' },
];

// ── Category icons ────────────────────────────────────────────────────────────

function CategoryIcon({
  category,
  size = 16,
}: {
  category: NotificationCategory;
  size?: number;
}) {
  switch (category) {
    case 'order': return <Package size={size} color="#FF6B00" />;
    case 'offer': return <Gift size={size} color="#8B5CF6" />;
    case 'promotion': return <Megaphone size={size} color="#F59E0B" />;
    case 'account': return <User size={size} color="#3B82F6" />;
    case 'donation': return <Heart size={size} color="#EC4899" />;
    case 'system': return <Shield size={size} color="#6B7280" />;
    default: return <Bell size={size} color="#6B7280" />;
  }
}

function categoryBg(category: NotificationCategory): string {
  switch (category) {
    case 'order': return '#FFF7ED';
    case 'offer': return '#F5F3FF';
    case 'promotion': return '#FFFBEB';
    case 'account': return '#EFF6FF';
    case 'donation': return '#FDF2F8';
    case 'system': return '#F3F4F6';
    default: return '#F3F4F6';
  }
}

// ── Notification Card ─────────────────────────────────────────────────────────

interface NotificationCardProps {
  notification: CravioNotification;
  onMarkRead: (id: string) => void;
  onMarkUnread: (id: string) => void;
  onDelete: (id: string) => void;
  onPress: (notification: CravioNotification) => void;
}

function NotificationCard({
  notification,
  onMarkRead,
  onMarkUnread,
  onDelete,
  onPress,
}: NotificationCardProps) {
  const colors = useColors();
  const { id, category, title, message, createdAt, read } = notification;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onPress(notification)}
      style={[
        styles.card,
        {
          backgroundColor: read ? colors.card : colors.accent,
          borderColor: read ? colors.border : colors.primary + '30',
        },
      ]}
    >
      {/* Unread dot */}
      {!read && (
        <View style={[styles.unreadDot, { backgroundColor: colors.primary }]} />
      )}

      {/* Icon */}
      <View style={[styles.iconWrap, { backgroundColor: categoryBg(category) }]}>
        <CategoryIcon category={category} size={18} />
      </View>

      {/* Content */}
      <View style={styles.cardContent}>
        <View style={styles.cardTitleRow}>
          <Text
            style={[PP.label, { color: colors.foreground, flex: 1 }]}
            numberOfLines={1}
          >
            {title}
          </Text>
          <Text style={[PP.caption, { color: colors.mutedForeground, marginLeft: 8 }]}>
            {relativeTime(createdAt)}
          </Text>
        </View>
        <Text
          style={[PP.bodySM, { color: colors.mutedForeground, marginTop: 2 }]}
          numberOfLines={2}
        >
          {message}
        </Text>

        {/* Action row */}
        <View style={styles.cardActions}>
          {read ? (
            <TouchableOpacity
              onPress={() => onMarkUnread(id)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={[PP.caption, { color: colors.primary }]}>Mark unread</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => onMarkRead(id)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={[PP.caption, { color: colors.primary }]}>Mark read</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() => onDelete(id)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Trash2 size={13} color={colors.error} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ── Empty State ───────────────────────────────────────────────────────────────

function EmptyNotifications({ tab, colors }: { tab: TabKey; colors: ReturnType<typeof useColors> }) {
  const label = tab === 'all'
    ? 'No notifications yet'
    : `No ${tab} notifications`;
  const sub = tab === 'all'
    ? 'Notifications about your orders, offers, and account will appear here.'
    : `You have no ${tab} notifications at the moment.`;

  return (
    <View style={styles.emptyWrap}>
      <View style={[styles.emptyIconBg, { backgroundColor: colors.muted }]}>
        <BellOff size={32} color={colors.mutedForeground} />
      </View>
      <Text style={[PP.title, { color: colors.foreground, marginTop: 16, textAlign: 'center' }]}>
        {label}
      </Text>
      <Text style={[PP.bodySM, { color: colors.mutedForeground, marginTop: 8, textAlign: 'center', lineHeight: 20 }]}>
        {sub}
      </Text>
    </View>
  );
}

// ── Error State ───────────────────────────────────────────────────────────────

function ErrorState({
  onRetry,
  colors,
}: {
  onRetry: () => void;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <View style={styles.emptyWrap}>
      <View style={[styles.emptyIconBg, { backgroundColor: '#FEE2E2' }]}>
        <AlertCircle size={32} color="#EF4444" />
      </View>
      <Text style={[PP.title, { color: colors.foreground, marginTop: 16, textAlign: 'center' }]}>
        Something went wrong
      </Text>
      <Text style={[PP.bodySM, { color: colors.mutedForeground, marginTop: 8, textAlign: 'center' }]}>
        Could not load notifications. Please try again.
      </Text>
      <TouchableOpacity
        style={[styles.retryBtn, { backgroundColor: colors.primary }]}
        onPress={onRetry}
        activeOpacity={0.85}
      >
        <RefreshCw size={16} color="#FFFFFF" />
        <Text style={[PP.buttonSM, { color: '#FFFFFF', marginLeft: 8 }]}>Retry</Text>
      </TouchableOpacity>
    </View>
  );
}

// ── Dev Simulator Panel ───────────────────────────────────────────────────────

function SimulatorPanel({ colors }: { colors: ReturnType<typeof useColors> }) {
  const [open, setOpen] = useState(false);

  // Lazy import to ensure tree-shaking keeps this dev-only
  const runSimulator = useCallback((id: string) => {
    const { SIMULATORS } = require('@/utils/notificationSimulator');
    const entry = SIMULATORS.find((s: { id: string }) => s.id === id);
    if (entry) entry.run();
  }, []);

  const ENTRIES = useMemo(() => {
    const { SIMULATORS } = require('@/utils/notificationSimulator');
    return SIMULATORS as Array<{ id: string; label: string }>;
  }, []);

  return (
    <View style={[styles.simPanel, { backgroundColor: '#1C1917', borderColor: '#FF6B00' }]}>
      <TouchableOpacity
        style={styles.simHeader}
        onPress={() => setOpen((v) => !v)}
        activeOpacity={0.8}
      >
        <Zap size={14} color="#FF6B00" />
        <Text style={[PP.caption, { color: '#FF6B00', marginLeft: 6, flex: 1 }]}>
          DEV — Notification Simulator
        </Text>
        <Text style={[PP.caption, { color: '#FF6B00' }]}>{open ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      {open && (
        <View style={styles.simGrid}>
          {ENTRIES.map((entry) => (
            <TouchableOpacity
              key={entry.id}
              style={[styles.simChip, { backgroundColor: '#292524', borderColor: '#44403C' }]}
              onPress={() => runSimulator(entry.id)}
              activeOpacity={0.7}
            >
              <Text style={[PP.caption, { color: '#D6D3D1', fontSize: 11 }]}>{entry.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────

export interface NotificationCenterScreenProps {
  onBack?: () => void;
}

export function NotificationCenterScreen({ onBack }: NotificationCenterScreenProps) {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const router = useRouter();

  const paddingTop = Platform.OS === 'web' ? 60 : insets.top;
  const paddingBottom = Platform.OS === 'web' ? 34 : insets.bottom;

  // Store
  const { notifications, unreadCount, markRead, markUnread, markAllRead, deleteNotification, clearAll } =
    useNotificationStore();

  // UI state
  const [activeTab, setActiveTab] = useState<TabKey>('all');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  // Filtered list
  const filtered = useMemo(
    () =>
      activeTab === 'all'
        ? notifications
        : notifications.filter((n) => n.category === activeTab),
    [notifications, activeTab],
  );

  // Pull to refresh
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    // Local-only — just a visual delay. Phase 15B will fetch from backend.
    await new Promise((r) => setTimeout(r, 600));
    setRefreshing(false);
  }, []);

  // Retry (error state)
  const handleRetry = useCallback(async () => {
    setLoading(true);
    setError(false);
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
  }, []);

  // Card tap → deep link
  const handleCardPress = useCallback(
    (notification: CravioNotification) => {
      // Mark as read
      if (!notification.read) markRead(notification.id);
      // Navigate
      navigateDeepLink(router, notification.deepLink);
    },
    [markRead, router],
  );

  // Clear all confirmation
  const handleClearAll = useCallback(() => {
    if (notifications.length === 0) return;
    Alert.alert(
      'Clear All Notifications',
      'This will permanently remove all notifications. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: clearAll,
        },
      ],
    );
  }, [notifications.length, clearAll]);

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      {/* ── Header ── */}
      <View
        style={[
          styles.header,
          {
            paddingTop: paddingTop + 8,
            backgroundColor: colors.card,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <TouchableOpacity onPress={onBack} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <View style={[styles.iconBtn, { backgroundColor: colors.muted }]}>
            <ArrowLeft size={20} color={colors.foreground} strokeWidth={2} />
          </View>
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={[PP.h3, { color: colors.foreground }]}>Notifications</Text>
          {unreadCount > 0 && (
            <View style={[styles.headerBadge, { backgroundColor: colors.primary }]}>
              <Text style={[PP.caption, { color: '#FFF', fontSize: 10 }]}>
                {unreadCount > 99 ? '99+' : unreadCount}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.headerRight}>
          {unreadCount > 0 && (
            <TouchableOpacity
              onPress={markAllRead}
              hitSlop={{ top: 12, bottom: 12, left: 8, right: 8 }}
              style={{ marginRight: 6 }}
            >
              <CheckCheck size={20} color={colors.primary} />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={handleClearAll}
            hitSlop={{ top: 12, bottom: 12, left: 8, right: 8 }}
            style={{ marginRight: 6 }}
          >
            <X size={20} color={colors.mutedForeground} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push('/notification-preferences')}
            hitSlop={{ top: 12, bottom: 12, left: 8, right: 8 }}
          >
            <Settings size={20} color={colors.mutedForeground} />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Category Tabs ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={[styles.tabsRow, { backgroundColor: colors.card, borderBottomColor: colors.border }]}
        contentContainerStyle={styles.tabsContent}
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              style={[
                styles.tab,
                isActive && { backgroundColor: colors.primary + '15', borderColor: colors.primary },
                !isActive && { borderColor: 'transparent' },
              ]}
              activeOpacity={0.75}
            >
              <Text
                style={[
                  PP.caption,
                  {
                    color: isActive ? colors.primary : colors.mutedForeground,
                    fontFamily: isActive ? 'Poppins_600SemiBold' : 'Poppins_400Regular',
                  },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* ── Body ── */}
      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[PP.bodySM, { color: colors.mutedForeground, marginTop: 12 }]}>
            Loading notifications…
          </Text>
        </View>
      ) : error ? (
        <ErrorState onRetry={handleRetry} colors={colors} />
      ) : (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: paddingBottom + 32 },
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
        >
          {/* Dev Simulator */}
          {IS_DEV && <SimulatorPanel colors={colors} />}

          {/* Unread summary row */}
          {unreadCount > 0 && (
            <View
              style={[
                styles.summaryRow,
                { backgroundColor: colors.primary + '12', borderColor: colors.primary + '30' },
              ]}
            >
              <Bell size={14} color={colors.primary} />
              <Text style={[PP.caption, { color: colors.primary, flex: 1, marginLeft: 8 }]}>
                {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
              </Text>
              <TouchableOpacity onPress={markAllRead}>
                <Text style={[PP.caption, { color: colors.primary, fontFamily: 'Poppins_600SemiBold' }]}>
                  Mark all read
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Notification list */}
          {filtered.length === 0 ? (
            <EmptyNotifications tab={activeTab} colors={colors} />
          ) : (
            filtered.map((n) => (
              <NotificationCard
                key={n.id}
                notification={n}
                onMarkRead={markRead}
                onMarkUnread={markUnread}
                onDelete={deleteNotification}
                onPress={handleCardPress}
              />
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: { flex: 1 },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 10,
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerBadge: {
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Tabs
  tabsRow: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexShrink: 0,
    maxHeight: 52,
  },
  tabsContent: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    alignItems: 'center',
  },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1.5,
  },

  // List
  listContent: {
    paddingTop: 12,
    paddingHorizontal: 16,
    gap: 10,
  },

  // Summary
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 2,
  },

  // Card
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    gap: 12,
  },
  unreadDot: {
    position: 'absolute',
    top: 14,
    left: 6,
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  cardContent: { flex: 1 },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center' },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },

  // States
  loadingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 60,
  },
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingTop: 60,
  },
  emptyIconBg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },

  // Dev simulator
  simPanel: {
    borderRadius: 12,
    borderWidth: 1.5,
    overflow: 'hidden',
    marginBottom: 4,
  },
  simHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  simGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    padding: 12,
    paddingTop: 0,
  },
  simChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
});
