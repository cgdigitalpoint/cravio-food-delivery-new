import { useColorScheme } from 'react-native';
import colors from '@/constants/colors';
import { usePreferencesStore } from '@/store/usePreferencesStore';

/**
 * Returns the design tokens for the current color scheme.
 *
 * Respects the user's in-app theme preference (light / dark / auto).
 * When set to 'auto', falls back to the device system setting.
 */
export function useColors() {
  const systemScheme = useColorScheme();
  const { theme } = usePreferencesStore();
  const effectiveScheme = theme === 'auto' ? systemScheme : theme;
  const palette =
    effectiveScheme === 'dark' && 'dark' in colors
      ? (colors as unknown as Record<string, typeof colors.light>).dark
      : colors.light;
  return { ...palette, radius: colors.radius };
}
