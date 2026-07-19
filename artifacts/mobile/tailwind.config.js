/** @type {import('tailwindcss').Config} */
// NativeWind v4 configuration for Cravio
// To activate NativeWind:
//   pnpm --filter @workspace/mobile add nativewind@^4 tailwindcss
//   Then uncomment `require('nativewind/preset')` below and update metro.config.js.

module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './screens/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  // presets: [require('nativewind/preset')],   // uncomment after install
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF5722',
          foreground: '#FFFFFF',
          light: '#FF7043',
          dark: '#E64A19',
        },
        accent: {
          DEFAULT: '#FFC107',
          foreground: '#1A1A1A',
        },
        surface: {
          DEFAULT: '#1A1A1A',
          muted: '#2A2A2A',
        },
        cravio: {
          orange: '#FF5722',
          amber: '#FFC107',
          dark: '#0F0F0F',
          card: '#1A1A1A',
        },
      },
      fontFamily: {
        sans: ['Inter_400Regular'],
        medium: ['Inter_500Medium'],
        semibold: ['Inter_600SemiBold'],
        bold: ['Inter_700Bold'],
      },
      borderRadius: {
        cravio: '12px',
        pill: '9999px',
      },
    },
  },
  plugins: [],
};
