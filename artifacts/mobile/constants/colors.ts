// ─── Cravio Design Tokens ─────────────────────────────────────────────────────
// Brand palette for the Cravio food delivery platform.
// Both light and dark themes are defined; useColors() picks the active one.

const colors = {
  light: {
    // Legacy aliases
    text: '#1A1A1A',
    tint: '#FF5722',

    // Core surfaces
    background: '#FAFAF8',
    foreground: '#1A1A1A',

    // Cards / elevated surfaces
    card: '#FFFFFF',
    cardForeground: '#1A1A1A',

    // Primary — Cravio orange
    primary: '#FF5722',
    primaryForeground: '#FFFFFF',

    // Secondary
    secondary: '#FFF3E0',
    secondaryForeground: '#E64A19',

    // Muted / subdued elements
    muted: '#F5F5F0',
    mutedForeground: '#9E9E9E',

    // Accent — amber gold
    accent: '#FFC107',
    accentForeground: '#1A1A1A',

    // Destructive
    destructive: '#EF4444',
    destructiveForeground: '#FFFFFF',

    // Borders and inputs
    border: '#EBEBEB',
    input: '#EBEBEB',
  },

  dark: {
    // Legacy aliases
    text: '#FAFAFA',
    tint: '#FF7043',

    // Core surfaces
    background: '#0F0F0F',
    foreground: '#FAFAFA',

    // Cards / elevated surfaces
    card: '#1A1A1A',
    cardForeground: '#FAFAFA',

    // Primary — lighter orange for dark bg
    primary: '#FF7043',
    primaryForeground: '#FFFFFF',

    // Secondary
    secondary: '#2A1810',
    secondaryForeground: '#FFAB91',

    // Muted / subdued elements
    muted: '#2A2A2A',
    mutedForeground: '#737373',

    // Accent — amber gold
    accent: '#FFC107',
    accentForeground: '#1A1A1A',

    // Destructive
    destructive: '#EF4444',
    destructiveForeground: '#FFFFFF',

    // Borders and inputs
    border: '#2A2A2A',
    input: '#2A2A2A',
  },

  // Border radius in px — applied to cards, buttons, inputs, modals
  radius: 12,
};

export default colors;
