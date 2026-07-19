// ─── Value Formatters ─────────────────────────────────────────────────────────

/**
 * Format a number as currency.
 * @example formatCurrency(12.5) → "$12.50"
 */
export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format delivery time in minutes to a human-readable string.
 * @example formatDeliveryTime(75) → "1h 15m"
 */
export function formatDeliveryTime(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

/**
 * Format a numeric rating to one decimal place.
 * @example formatRating(4.567) → "4.6"
 */
export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

/**
 * Format a distance in kilometers.
 * @example formatDistance(0.3) → "300m"
 * @example formatDistance(2.5) → "2.5 km"
 */
export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)}m`;
  return `${km.toFixed(1)} km`;
}

/**
 * Format an ISO date string to a readable date.
 * @example formatDate("2024-01-15T10:30:00Z") → "Jan 15, 2024"
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format an ISO date string to a readable time.
 * @example formatTime("2024-01-15T14:30:00Z") → "2:30 PM"
 */
export function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

/**
 * Format an ISO date string to a relative label ("Today", "Yesterday", date).
 */
export function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  return formatDate(dateString);
}

/**
 * Format loyalty points count.
 * @example formatPoints(1250) → "1,250 pts"
 */
export function formatPoints(points: number): string {
  return `${new Intl.NumberFormat('en-US').format(points)} pts`;
}

/**
 * Truncate a string to a max length and append ellipsis.
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1)}…`;
}
