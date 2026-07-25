// ─── Poppins Typography Scale ─────────────────────────────────────────────────
import { StyleSheet } from 'react-native';

export const PP = StyleSheet.create({
  displayXL: { fontFamily: 'Poppins_800ExtraBold', fontSize: 52, lineHeight: 62, letterSpacing: -1 },
  display:   { fontFamily: 'Poppins_700Bold',       fontSize: 40, lineHeight: 50, letterSpacing: -0.5 },
  displaySM: { fontFamily: 'Poppins_700Bold',       fontSize: 34, lineHeight: 42 },
  h1:        { fontFamily: 'Poppins_700Bold',       fontSize: 30, lineHeight: 38, letterSpacing: -0.3 },
  h2:        { fontFamily: 'Poppins_700Bold',       fontSize: 26, lineHeight: 34 },
  h3:        { fontFamily: 'Poppins_600SemiBold',   fontSize: 22, lineHeight: 30 },
  title:     { fontFamily: 'Poppins_600SemiBold',   fontSize: 18, lineHeight: 26 },
  subtitle:  { fontFamily: 'Poppins_500Medium',     fontSize: 16, lineHeight: 24 },
  bodyLG:    { fontFamily: 'Poppins_400Regular',    fontSize: 16, lineHeight: 26 },
  body:      { fontFamily: 'Poppins_400Regular',    fontSize: 14, lineHeight: 22 },
  label:     { fontFamily: 'Poppins_600SemiBold',   fontSize: 14, lineHeight: 20 },
  caption:   { fontFamily: 'Poppins_400Regular',    fontSize: 12, lineHeight: 18 },
  captionSM: { fontFamily: 'Poppins_400Regular',    fontSize: 11, lineHeight: 16 },
});
