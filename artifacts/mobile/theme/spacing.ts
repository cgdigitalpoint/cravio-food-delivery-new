// ─── Spacing Scale ────────────────────────────────────────────────────────────
// 4-point grid system — consistent with most mobile design tools.

export const spacing = {
  /** 2px — hairline */
  hairline: 2,
  /** 4px */
  xs: 4,
  /** 8px */
  sm: 8,
  /** 12px */
  md12: 12,
  /** 16px */
  md: 16,
  /** 20px */
  md20: 20,
  /** 24px */
  lg: 24,
  /** 32px */
  xl: 32,
  /** 40px */
  xl40: 40,
  /** 48px */
  xxl: 48,
  /** 64px */
  xxxl: 64,
} as const;

export type SpacingKey = keyof typeof spacing;
export type SpacingValue = (typeof spacing)[SpacingKey];
