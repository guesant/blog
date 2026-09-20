import { createTheme } from '@mui/material/styles';
import { siteSpacing } from './site-spacing';
import { darkPalette, lightPalette, type ResolvedThemeMode } from './theme-palette';
import { themeComponents } from './theme-components';
import { themeTypography } from './theme-typography';

export type { ResolvedThemeMode } from './theme-palette';

export function createSiteTheme(mode: ResolvedThemeMode) {
  return createTheme({
    cssVariables: true,
    palette: { mode, ...(mode === 'dark' ? darkPalette : lightPalette) },
    spacing: siteSpacing,
    shape: { borderRadius: 0 },
    typography: themeTypography,
    components: themeComponents,
  });
}
