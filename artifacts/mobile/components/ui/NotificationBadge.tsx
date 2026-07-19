// ─── Notification Badge ───────────────────────────────────────────────────────
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useColors } from '@/hooks/useColors';
import { typography } from '@/theme';

export interface NotificationBadgeProps {
  count?: number;
  maxCount?: number;
  children: React.ReactNode;
  dot?: boolean;
}

export function NotificationBadge({
  count,
  maxCount = 99,
  children,
  dot = false,
}: NotificationBadgeProps) {
  const colors = useColors();
  const hasCount = count != null && count > 0;
  const showBadge = dot || hasCount;

  if (!showBadge) return <>{children}</>;

  const label = dot ? '' : count! > maxCount ? `${maxCount}+` : `${count}`;

  return (
    <View style={styles.wrapper}>
      {children}
      <View
        style={[
          styles.badge,
          {
            backgroundColor: colors.error ?? '#EF4444',
            minWidth: dot ? 10 : 18,
            height: dot ? 10 : 18,
            paddingHorizontal: dot ? 0 : 4,
            borderRadius: 9,
          },
        ]}
      >
        {!dot && (
          <Text style={[typography.caption, styles.label]}>
            {label}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignSelf: 'flex-start',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  label: {
    color: '#FFFFFF',
    fontSize: 9,
    fontFamily: 'Inter_700Bold',
    lineHeight: 12,
  },
});
