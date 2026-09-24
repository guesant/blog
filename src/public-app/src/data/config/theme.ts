import { createServerFn } from '@tanstack/react-start';
import { getRequestHeader, setResponseHeader } from '@tanstack/react-start/server';

export type ThemeMode = 'system' | 'light' | 'dark';

export type ResolvedThemeMode = Exclude<ThemeMode, 'system'>;

export type ThemeState = {
  mode: ThemeMode;
  resolvedMode: ResolvedThemeMode | null;
};

const themeStates: Record<string, ThemeState> = {
  light: { mode: 'light', resolvedMode: 'light' },
  dark: { mode: 'dark', resolvedMode: 'dark' },
  'system.light': { mode: 'system', resolvedMode: 'light' },
  'system.dark': { mode: 'system', resolvedMode: 'dark' },
  default: { mode: 'system', resolvedMode: null },
};

function parseThemeCookie(cookieHeader: string | undefined): ThemeState {
  const value = String(cookieHeader).match(/(?:^|;\s*)site-theme=([^;]*)/)?.[1];

  return themeStates[value || ''] || themeStates.default;
}

export const loadThemeMode = createServerFn({ method: 'GET' }).handler(() => {
  setResponseHeader('Vary', 'Cookie');
  return parseThemeCookie(getRequestHeader('cookie'));
});
