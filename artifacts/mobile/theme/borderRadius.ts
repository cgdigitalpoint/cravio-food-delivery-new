// ─── Border Radius Scale ──────────────────────────────────────────────────────
// Consistent corner radius tokens for the Cravio design system.

export const borderRadius = {
  /** 8px — small: chips, tags, input fields */
  sm: 8,
  /** 12px — medium: buttons, search bars */
  md: 12,
  /** 16px — large: cards, dialogs */
  lg: 16,
  /** 20px — extra large: bottom sheets, modals */
  xl: 20,
  /** 24px — 2XL: banners, hero cards */
  xxl: 24,
  /** 999 — pill: chips, badges, FABs */
  pill: 999,
} as const;

export type BorderRadiusKey = keyof typeof borderRadius;
export type BorderRadiusValue = (typeof borderRadius)[BorderRadiusKey];
