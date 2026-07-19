// ─── Cravio Design Tokens ─────────────────────────────────────────────────────
// Brand palette: Primary #FF6B00, Secondary #16A34A
// Both light and dark themes are defined; useColors() picks the active one.

const colors = {
  light: {
    // ── Aliases ─────────────────────────────────────────────────────────────
    text: '#111827',
    tint: '#FF6B00',

    // ── Core surfaces ────────────────────────────────────────────────────────
    background: '#F8F9FB',
    foreground: '#111827',
    card: '#FFFFFF',
    cardForeground: '#111827',
    surface: '#FFFFFF',
    surfaceVariant: '#F3F4F6',

    // ── Brand ────────────────────────────────────────────────────────────────
    primary: '#FF6B00',
    primaryForeground: '#FFFFFF',
    secondary: '#16A34A',
    secondaryForeground: '#FFFFFF',

    // ── Muted ────────────────────────────────────────────────────────────────
    muted: '#F3F4F6',
    mutedForeground: '#6B7280',

    // ── Accent ───────────────────────────────────────────────────────────────
    accent: '#FFF7ED',
    accentForeground: '#FF6B00',

    // ── Semantic ─────────────────────────────────────────────────────────────
    destructive: '#EF4444',
    destructiveForeground: '#FFFFFF',
    success: '#22C55E',
    successForeground: '#FFFFFF',
    warning: '#F59E0B',
    warningForeground: '#FFFFFF',
    error: '#EF4444',
    errorForeground: '#FFFFFF',

    // ── Borders & inputs ─────────────────────────────────────────────────────
    border: '#E5E7EB',
    input: '#E5E7EB',

    // ── Text helpers ─────────────────────────────────────────────────────────
    textSecondary: '#6B7280',
  },

  dark: {
    // ── Aliases ─────────────────────────────────────────────────────────────
    text: '#F9FAFB',
    tint: '#FF6B00',

    // ── Core surfaces ────────────────────────────────────────────────────────
    background: '#111827',
    foreground: '#F9FAFB',
    card: '#1F2937',
    cardForeground: '#F9FAFB',
    surface: '#1F2937',
    surfaceVariant: '#374151',

    // ── Brand ────────────────────────────────────────────────────────────────
    primary: '#FF6B00',
    primaryForeground: '#FFFFFF',
    secondary: '#16A34A',
    secondaryForeground: '#FFFFFF',

    // ── Muted ────────────────────────────────────────────────────────────────
    muted: '#374151',
    mutedForeground: '#9CA3AF',

    // ── Accent ───────────────────────────────────────────────────────────────
    accent: '#1C1917',
    accentForeground: '#FF8C38',

    // ── Semantic ─────────────────────────────────────────────────────────────
    destructive: '#EF4444',
    destructiveForeground: '#FFFFFF',
    success: '#22C55E',
    successForeground: '#FFFFFF',
    warning: '#F59E0B',
    warningForeground: '#FFFFFF',
    error: '#EF4444',
    errorForeground: '#FFFFFF',

    // ── Borders & inputs ─────────────────────────────────────────────────────
    border: '#374151',
    input: '#374151',

    // ── Text helpers ─────────────────────────────────────────────────────────
    textSecondary: '#9CA3AF',
  },

  // Default border radius (used by legacy useColors().radius)
  radius: 12,
};

export default colors;
