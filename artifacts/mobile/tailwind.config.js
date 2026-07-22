/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './screens/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF6B00',
          foreground: '#FFFFFF',
          light: '#FF8530',
          dark: '#E55A00',
        },
        secondary: {
          DEFAULT: '#16A34A',
          foreground: '#FFFFFF',
        },
        cravio: {
          orange: '#FF6B00',
          dark: '#111827',
          card: '#1F2937',
        },
      },
      fontFamily: {
        sans: ['Inter_400Regular'],
        medium: ['Inter_500Medium'],
        semibold: ['Inter_600SemiBold'],
        bold: ['Inter_700Bold'],
        'poppins-regular': ['Poppins_400Regular'],
        'poppins-medium': ['Poppins_500Medium'],
        'poppins-semibold': ['Poppins_600SemiBold'],
        'poppins-bold': ['Poppins_700Bold'],
      },
      borderRadius: {
        cravio: '12px',
        pill: '9999px',
      },
    },
  },
  plugins: [],
};
