// ─── Avatar ───────────────────────────────────────────────────────────────────
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { Image } from 'expo-image';
import { useColors } from '@/hooks/useColors';
import { typography, borderRadius } from '@/theme';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface AvatarProps {
  name?: string;
  imageUri?: string;
  size?: AvatarSize;
  badge?: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

function getInitials(name: string): string {
  const parts = name.trim().split(' ');
  if (parts.length >= 2) return `${parts[0]![0]}${parts[1]![0]}`.toUpperCase();
  return (parts[0]?.slice(0, 2) ?? '??').toUpperCase();
}

function getAvatarColor(name: string): string {
  const colors = ['#FF6B00', '#16A34A', '#2563EB', '#7C3AED', '#DB2777', '#0891B2'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i);
  return colors[hash % colors.length]!;
}

export function Avatar({
  name = '?',
  imageUri,
  size = 'md',
  badge,
  onPress,
  style,
}: AvatarProps) {
  const colors = useColors();

  const dimension = { xs: 28, sm: 36, md: 44, lg: 56, xl: 72 }[size];
  const fontSize = { xs: 10, sm: 13, md: 16, lg: 20, xl: 26 }[size];
  const bg = getAvatarColor(name);

  const avatar = (
    <View style={[style, { width: dimension, height: dimension }]}>
      <View
        style={[
          styles.circle,
          {
            width: dimension,
            height: dimension,
            borderRadius: dimension / 2,
            backgroundColor: imageUri ? 'transparent' : bg,
          },
        ]}
      >
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={[styles.image, { borderRadius: dimension / 2 }]}
            contentFit="cover"
          />
        ) : (
          <Text
            style={[
              typography.label,
              { color: '#FFFFFF', fontSize, fontFamily: 'Inter_700Bold' },
            ]}
          >
            {getInitials(name)}
          </Text>
        )}
      </View>

      {/* Badge overlay */}
      {badge != null && (
        <View style={styles.badgeContainer}>{badge}</View>
      )}
    </View>
  );

  if (onPress != null) {
    return (
      <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
        {avatar}
      </TouchableOpacity>
    );
  }

  return avatar;
}

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badgeContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
});
