// ─── Typography Scale ─────────────────────────────────────────────────────────
// Inter font family (pre-loaded in _layout.tsx).
// Named variants match the Cravio Design System spec.

import { StyleSheet } from 'react-native';

export const typography = StyleSheet.create({
  // ── Design System names ─────────────────────────────────────────────────────

  /** Display — hero text, splash screens */
  display: {
    fontFamily: 'Inter_700Bold',
    fontSize: 36,
    lineHeight: 44,
    letterSpacing: -0.5,
  },
  /** Heading 1 — primary screen titles */
  heading1: {
    fontFamily: 'Inter_700Bold',
    fontSize: 28,
    lineHeight: 36,
    letterSpacing: -0.3,
  },
  /** Heading 2 — section headings */
  heading2: {
    fontFamily: 'Inter_700Bold',
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: -0.2,
  },
  /** Heading 3 — card titles, dialog headings */
  heading3: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 20,
    lineHeight: 28,
  },
  /** Title — list items, sheet headers */
  title: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
    lineHeight: 26,
  },
  /** Subtitle — supporting titles, section labels */
  subtitle: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    lineHeight: 24,
  },
  /** Body — content text, descriptions */
  body: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    lineHeight: 22,
  },
  /** Caption — timestamps, metadata, helper text */
  caption: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    lineHeight: 18,
    letterSpacing: 0.2,
  },
  /** Button Text — interactive labels */
  buttonText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
    lineHeight: 22,
    letterSpacing: 0.1,
  },

  // ── Legacy / extended variants (kept for compatibility) ─────────────────────

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
  overline: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 1.2,
    textTransform: 'uppercase' as const,
  },
});

export type TypographyVariant = keyof typeof typography;
