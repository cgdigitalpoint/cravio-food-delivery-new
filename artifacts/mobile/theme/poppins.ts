// ─── Poppins Typography Scale ─────────────────────────────────────────────────
// Used in Phase 3 screens (Splash, Onboarding, Welcome, Auth).
// Inter is retained for Phase 2 Design System components.

import { StyleSheet } from 'react-native';

export const PP = StyleSheet.create({
  // ── Display ─────────────────────────────────────────────────────────────────
  displayXL: {
    fontFamily: 'Poppins_800ExtraBold',
    fontSize: 52,
    lineHeight: 62,
    letterSpacing: -1,
  },
  display: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 40,
    lineHeight: 50,
    letterSpacing: -0.5,
  },
  displaySM: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 34,
    lineHeight: 42,
  },

  // ── Headings ────────────────────────────────────────────────────────────────
  h1: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 30,
    lineHeight: 38,
    letterSpacing: -0.3,
  },
  h2: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 26,
    lineHeight: 34,
  },
  h3: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 22,
    lineHeight: 30,
  },

  // ── Labels ──────────────────────────────────────────────────────────────────
  title: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 18,
    lineHeight: 26,
  },
  subtitle: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 16,
    lineHeight: 24,
  },

  // ── Body ────────────────────────────────────────────────────────────────────
  bodyLG: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 16,
    lineHeight: 26,
  },
  body: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    lineHeight: 22,
  },
  bodySM: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
    lineHeight: 20,
  },

  // ── Micro ───────────────────────────────────────────────────────────────────
  caption: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    lineHeight: 18,
    letterSpacing: 0.2,
  },
  label: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 14,
    lineHeight: 20,
  },
  overline: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 1.8,
    textTransform: 'uppercase' as const,
  },

  // ── Interactive ─────────────────────────────────────────────────────────────
  button: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.2,
  },
  buttonSM: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    lineHeight: 20,
  },
});

export type PPVariant = keyof typeof PP;
