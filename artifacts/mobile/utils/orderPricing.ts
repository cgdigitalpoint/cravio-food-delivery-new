// ─── Order Pricing Rules — Phase 11C-3 ─────────────────────────────────────────

export type OrderMode = 'food' | 'grocery';

export const MINIMUM_ORDER_AMOUNT = 250;
export const MINIMUM_ORDER_MESSAGE =
  'Minimum order value is ₹250. Please add more items to continue.';

/**
 * Food and Grocery use the same delivery tiers for now. Keeping the mode in
 * this helper makes the rule explicit and leaves room for Grocery-specific
 * pricing when that service launches.
 */
export function getDeliveryFee(
  subtotal: number,
  _mode: OrderMode = 'food',
): number {
  if (subtotal < MINIMUM_ORDER_AMOUNT) return 0;
  if (subtotal < 500) return 40;
  if (subtotal < 1000) return 20;
  return 0;
}

export function meetsMinimumOrder(subtotal: number): boolean {
  return subtotal >= MINIMUM_ORDER_AMOUNT;
}