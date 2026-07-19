// ─── Spacer Component ─────────────────────────────────────────────────────────
import React from 'react';
import { View } from 'react-native';
import { spacing, type SpacingKey } from '@/theme';

export interface SpacerProps {
  size?: SpacingKey | number;
  horizontal?: boolean;
}

export function Spacer({ size = 'md', horizontal = false }: SpacerProps) {
  const value = typeof size === 'number' ? size : spacing[size];
  return (
    <View style={horizontal ? { width: value } : { height: value }} />
  );
}
