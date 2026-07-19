// ─── Typography Scale ─────────────────────────────────────────────────────────
// Uses Inter font family (pre-loaded in _layout.tsx).

import { StyleSheet } from 'react-native';

export const typography = StyleSheet.create({
  // Display — hero text, splash screens
  displayLarge: {
    fontFamily: 'Inter_700Bold',
    fontSize: 48,
    lineHeight: 56,
    letterSpacing: -1.5,
  },
  displayMedium: {
    fontFamily: 'Inter_700Bold',
    fontSize: 36,
    lineHeight: 44,
    letterSpacing: -1,
  },
  displaySmall: {
    fontFamily: 'Inter_700Bold',
    fontSize: 28,
    lineHeight: 36,
    letterSpacing: -0.5,
  },

  // Headings — section titles, card headers
  headingXL: {
    fontFamily: 'Inter_700Bold',
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: -0.3,
  },
  headingLG: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 20,
    lineHeight: 28,
  },
  headingMD: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
    lineHeight: 26,
  },
  headingSM: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    lineHeight: 22,
  },

  // Body — content text
  bodyLG: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    lineHeight: 24,
  },
  bodyMD: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    lineHeight: 22,
  },
  bodySM: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    lineHeight: 20,
  },

  // UI labels, buttons
  label: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  labelSM: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    lineHeight: 18,
    letterSpacing: 0.2,
  },

  // Captions, timestamps, metadata
  caption: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 0.4,
  },

  // Overline — category labels, chip text
  overline: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 1.2,
    textTransform: 'uppercase' as const,
  },
});

export type TypographyVariant = keyof typeof typography;
